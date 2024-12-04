import { useState, useEffect, FormEvent } from 'react';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import styles from './styles.module.scss';
import { setupAPICliente } from '@/src/services/api';
import { toast } from 'react-toastify';
import { canSSRAuth } from '@/src/utils/canSSRAuth';

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

  async function fetchTaxaEntrega() {
    const apiCliente = setupAPICliente();
    const response = await apiCliente.get('/listTaxasEntrega');
    setViewTaxaEntrega(response.data);
  }

  useEffect(() => {
    fetchTaxaEntrega();
  }, []);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (!distanciaMin || !distanciaMax || !valor) {
      toast.error('Preencha todos os campos para cadastrar a taxa de entrega');
      return;
    }

    try {
      const apiCliente = setupAPICliente();
      await apiCliente.post('/addTaxaEntrega', {
        distanciaMin: parseFloat(distanciaMin),
        distanciaMax: parseFloat(distanciaMax),
        valor,
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
            <input
              className={styles.input}
              type="number"
              placeholder="Distância Mínima (km)"
              value={distanciaMin}
              onChange={(e) => setDistanciaMin(e.target.value)}
            />
            <input
              className={styles.input}
              type="number"
              placeholder="Distância Máxima (km)"
              value={distanciaMax}
              onChange={(e) => setDistanciaMax(e.target.value)}
            />
            <input
              className={styles.input}
              type="number"
              placeholder="Valor (R$)"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
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
                  <p>Valor: R$ {parseFloat(taxa.valor).toFixed(2)}</p>
                </div>
                <div className={styles.buttons}>
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
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
