import { useState, useEffect, FormEvent } from 'react';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import styles from './styles.module.scss';
import { setupAPICliente } from '@/src/services/api';
import { toast } from 'react-toastify';
import { canSSRAuth } from '@/src/utils/canSSRAuth';

interface Categoria {
  id: number;
  nome: string;
}

export default function Category() {
  const [nome, setNome] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);

  async function fetchCategorias() {
    const apiCliente = setupAPICliente();
    const response = await apiCliente.get('/listCategory');
    setCategorias(response.data);
    setFilteredCategorias(response.data);
  }

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    const filtered = categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(nome.toLowerCase())
    );
    setFilteredCategorias(filtered);
  }, [nome, categorias]);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (nome === '') {
      toast.error('Insira o nome da categoria');
      return;
    }

    const apiCliente = setupAPICliente();
    await apiCliente.post('/category', { nome });
    toast.success('Categoria cadastrada com sucesso');
    setNome('');
    await fetchCategorias();
  }

  const salvarEdicao = async (id: number, novoNome: string) => {
    const apiCliente = setupAPICliente();
    try {
      await apiCliente.post(`/updateCategory/${id}`, { nome: novoNome });
      toast.success('Categoria atualizada com sucesso');
      await fetchCategorias();
    } catch (error) {
      toast.error('Erro ao atualizar a categoria');
    }
  };

  const handleDelete = async (id: number) => {
    const apiCliente = setupAPICliente();
    try {
      await apiCliente.delete(`/category/${id}`); // Certifique-se de que a rota DELETE esteja correta
      toast.success('Categoria excluída com sucesso');
      await fetchCategorias(); // Atualiza a lista após exclusão
    } catch (error) {
      toast.error('Erro ao excluir a categoria');
    }
  };

  return (
    <>
      <Head>
        <title>Nova Categoria - Pizzaria</title>
      </Head>

      <div>
        <Header />
        <div className={styles.container}>
          <h1>Cadastrar ou filtrar uma categoria</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Digite o nome da categoria"
              className={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>

          <h2>Editar categoria</h2>
          <ul className={styles.list}>
            {filteredCategorias.length > 0 ? (
              filteredCategorias.map((categoria) => (
                <li key={categoria.id}>
                  <div className={styles.form}>
                    <input
                      type="text"
                      value={categoria.nome}
                      onChange={(e) => {
                        const updatedCategorias = categorias.map((cat) => {
                          if (cat.id === categoria.id) {
                            return { ...cat, nome: e.target.value };
                          }
                          return cat;
                        });
                        setCategorias(updatedCategorias);
                      }}
                      className={styles.input}
                    />
                    <button
                      className={styles.buttonEdit}
                      onClick={() => salvarEdicao(categoria.id, categoria.nome)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.buttonDelete} // Adicione uma classe de estilo se necessário
                      onClick={() => handleDelete(categoria.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>Nenhuma categoria encontrada</p>
            )}
          </ul>
        </div>

      </div>
      <Footer/>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
