import { useState, useEffect, FormEvent } from 'react';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import styles from './styles.module.scss';
import { setupAPICliente } from '@/src/services/api';
import { toast } from 'react-toastify';
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { TaxaEntregaEditModal } from '../../components/taxaEntregaEditModal';

interface TaxaEntrega {
  id: number;
  distanciaMin: number;
  distanciaMax: number;
  valor: string;
}

export default function TaxaEntrega() {
  const [distanciaMin, setDistanciaMin] = useState('');
  const [distanciaMax, setDistanciaMax] = useState('');
  const [valor, setValor] = useState('');
  const [viewTaxaEntrega, setViewTaxaEntrega] = useState<TaxaEntrega[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaxa, setSelectedTaxa] = useState<TaxaEntrega | null>(null);

  async function fetchTaxaEntrega() {
    const apiCliente = setupAPICliente();
    const response = await apiCliente.get('/listTaxasEntrega');
    setViewTaxaEntrega(response.data);
  }

  useEffect(() => {
    fetchTaxaEntrega();
  }, []);

  // Função para formatar o valor do preço
  const formatPrice = (value: string): string => {
    if (!value.trim()) return 'R$ 0,00'; // Retorna vazio caso o valor esteja vazio ou apenas espaços
  
    const cleanValue = value.replace(/\D/g, ''); // Remove qualquer coisa que não seja número
    const numericValue = (parseInt(cleanValue, 10) / 100).toFixed(2); // Converte para número e ajusta a vírgula
    return `R$ ${numericValue.replace('.', ',')}`;
  };

  // Função para preparar o preço para envio
  const parsePriceForSubmission = (price: string): string => {
    return price.replace(/[^\d,]/g, '').replace(',', '.').replace('R$', '').trim();
  };

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (!distanciaMin || !distanciaMax || !valor) {
      toast.error('Preencha todos os campos para cadastrar a taxa de entrega');
      return;
    }

    try {
      const apiCliente = setupAPICliente();
      const formattedPrice = parsePriceForSubmission(valor); // Formata o valor antes de enviar
      await apiCliente.post('/addTaxaEntrega', {
        distanciaMin: parseFloat(distanciaMin),
        distanciaMax: parseFloat(distanciaMax),
        valor: formattedPrice,
      });
      toast.success('Taxa de entrega cadastrada com sucesso');
      setDistanciaMin('');
      setDistanciaMax('');
      setValor('');
      fetchTaxaEntrega();
    } catch (error) {
      toast.error('Erro ao cadastrar a taxa de entrega');
    }
  }

  const handleDelete = async (id: number) => {
    const apiCliente = setupAPICliente();
    try {
      await apiCliente.delete(`/TaxaEntrega/${id}`);
      toast.success('Taxa de entrega excluída com sucesso');
      fetchTaxaEntrega();
    } catch (error) {
      toast.error('Erro ao excluir a taxa de entrega');
    }
  };

  const handleOpenModal = (taxa: TaxaEntrega) => {
    setSelectedTaxa(taxa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTaxa(null);
    setIsModalOpen(false);
  };

  const handleSaveTaxa = (updatedTaxa: TaxaEntrega) => {
    const apiCliente = setupAPICliente();
    apiCliente
      .put(`/updateTaxaEntrega/${updatedTaxa.id}`, updatedTaxa)
      .then(() => {
        toast.success('Taxa de entrega atualizada com sucesso');
        fetchTaxaEntrega(); // Atualiza a lista de taxas
      })
      .catch(() => {
        toast.error('Erro ao atualizar a taxa de entrega');
      });
  };

  return (
    <>
      <Head>
        <title>Taxas de Entrega</title>
      </Head>

      <div>
        <Header />
        <div className={styles.container}>
          <div className={styles.titles}>
            <h1>Gestão de Taxas de Entrega</h1>
            <h2>Adicione e gerencie suas taxas de forma prática</h2>
          </div>

          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.inputWrapper}>
              <span className={styles.prefix}>Km</span>
              <input
                type="number"
                placeholder="Distância Mínima"
                value={distanciaMin}
                onChange={(e) => setDistanciaMin(e.target.value)}
              />
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.prefix}>Km</span>
              <input
                type="number"
                placeholder="Distância Máxima"
                value={distanciaMax}
                onChange={(e) => setDistanciaMax(e.target.value)}
              />
            </div>
            <input
              className={styles.inputPrice}
              type="text"
              placeholder="Valor (R$)"
              value={valor}
              onChange={(e) => setValor(formatPrice(e.target.value))} // Aplica a formatação enquanto o usuário digita
            />
            <button type="submit" className={styles.buttonAdd}>
              Adicionar Taxa
            </button>
          </form>
          <ul className={styles.list}>
            {viewTaxaEntrega.map((taxa) => (
              <li key={taxa.id} className={styles.listItem}>
                <div className={styles.listItemContent}>
                  <p>Distância: {taxa.distanciaMin} - {taxa.distanciaMax} km</p>
                  <p>Valor: {formatPrice(taxa.valor)}</p> {/* Exibe o valor formatado */}
                </div>
                <div className={styles.buttons}>
                  <button
                    className={styles.buttonEdit}
                    onClick={() => handleOpenModal(taxa)}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.buttonDelete}
                    onClick={() => handleDelete(taxa.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && selectedTaxa && (
        <TaxaEntregaEditModal
          taxa={selectedTaxa}
          onClose={handleCloseModal}
          onSave={handleSaveTaxa} // Passando a função para salvar a taxa
        />
      )}
      <Footer/>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
