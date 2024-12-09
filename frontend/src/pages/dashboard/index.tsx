import { useState, useEffect } from "react";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "@/src/components/Header";
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPICliente } from '../../services/api';
import { ModalOrder } from '../../components/ModalOrder';

type OrderProps = {
    id: string,
    numMesa: number,
    status: string,
};

interface HomeProps {
    orders: OrderProps[];
}

export default function DashBoard({ orders }: HomeProps) {
    const [orderList, setOrderList] = useState(orders || []);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);

    async function handleRefresh() {
        const apiCliente = setupAPICliente();
        const response = await apiCliente.get('/listPedidos');
        setOrderList(response.data);
    }

    async function handleFinishItem(id: string) {
        const apiCliente = setupAPICliente();
        await apiCliente.put(`/pedido/status/${id}`, { status: "Finalizado" });
        handleRefresh();
    }

    function handleOpenModal(order: OrderProps) {
        setSelectedOrder(order);
        setModalVisible(true);
    }

    function handleCloseModal() {
        setModalVisible(false);
        setSelectedOrder(null);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            handleRefresh();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const pedidosEmAberto = orderList.filter(item => item.status === 'Aberto');
    const pedidosFinalizados = orderList.filter(item => item.status === 'Finalizado');

    return (
        <>
            <Head>
                <title>Painel - Pizzaria</title>
            </Head>

            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Acompanhamento dos pedidos</h1>
                        <button onClick={handleRefresh}>
                            <FiRefreshCcw size={25} color="#3fffa3" />
                        </button>
                    </div>

                    <div className={styles.headColumns}>
                        <div className={styles.column}>
                            <h2>Pedidos em Aberto:</h2>
                            {pedidosEmAberto.length === 0 ? (
                                <span className={styles.emptyList}>Nenhum pedido em aberto...</span>
                            ) : (
                                pedidosEmAberto.map(item => (
                                    <section
                                        key={item.id}
                                        className={`${styles.card} ${styles.pending}`} // Classe para pedidos em aberto
                                        onClick={() => handleOpenModal(item)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h3 className={styles.cardTitle}>
                                            {item.numMesa === 0 ? "Pedido Delivery" : `Mesa número ${item.numMesa}`}
                                        </h3>
                                        <button
                                            className={styles.finishButton}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Impede que o clique no botão finalize o pedido e abra o modal ao mesmo tempo
                                                handleFinishItem(item.id);
                                            }}
                                        >
                                            Finalizar
                                        </button>
                                    </section>
                                ))
                            )}
                        </div>

                        <div className={styles.column}>
                            <h2>Pedidos Finalizados:</h2>
                            {pedidosFinalizados.length === 0 ? (
                                <span className={styles.emptyList}>Nenhum pedido finalizado...</span>
                            ) : (
                                pedidosFinalizados.map(item => (
                                    <section
                                        key={item.id}
                                        className={`${styles.card} ${styles.completed}`} // Classe para pedidos finalizados
                                        onClick={() => handleOpenModal(item)} // Adiciona a ação de clicar para abrir o modal
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h3 className={styles.cardTitle}>
                                            {item.numMesa === 0 ? "Pedido Delivery" : `Mesa número ${item.numMesa}`}
                                        </h3>
                                    </section>
                                ))
                            )}
                        </div>
                    </div>

                    {modalVisible && selectedOrder && (
                        <ModalOrder
                            isOpen={modalVisible}
                            onRequestClose={handleCloseModal}
                            order={selectedOrder}
                        />
                    )}
                </main>
            </div>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiCliente = setupAPICliente(ctx);
    const response = await apiCliente.get('/listPedidos');

    return {
        props: {
            orders: response.data
        }
    };
});
