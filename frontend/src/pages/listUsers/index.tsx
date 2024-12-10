import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import { Footer } from '../../components/Footer';
import styles from './style.module.scss';
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { setupAPICliente } from '../../services/api';
import { toast } from 'react-toastify';
import UserDetailModal from '../../components/UserDetailModal';
import React from 'react';


type UserProps = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tipo: string;
};

interface UserDetailModal {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function UserList() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const apiClient = setupAPICliente();
        const response = await apiClient.get('/listUsers');
        setUsers(response.data);
      } catch (error) {
        toast.error('Erro ao carregar os usuários');
      }
    }
    loadUsers();
  }, []);

  async function handleUserDetail(userId: string) {
    console.log("acionou o botao", userId)

    setSelectedUserId(userId);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };



  return (
    <>
      <Header />
      <Head>
        <title>Lista de Usuários</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.titulo}>Usuários Cadastrados</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={styles.row}>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.tipo}</td>
                <td>
                  <button className={styles.buttonDetail} onClick={() => handleUserDetail(user.id)}>
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      <Footer />
    </>
  );
};


export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiCliente = setupAPICliente(ctx);
  const response = await apiCliente.get('/listUsers');

  return {
    props: {
      listUsers: response.data,
    },
  };
});
