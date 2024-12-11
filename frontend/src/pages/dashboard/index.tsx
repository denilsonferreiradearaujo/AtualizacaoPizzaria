import { useState, useEffect } from "react";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "@/src/components/Header";
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPICliente } from '../../services/api';
import { ModalOrder } from '../../components/ModalOrder';

type OrderProps = {
    id: string;
    numMesa: number;
    status: string;
    dataCreate: string; // Alterado para string, caso a data venha como string
};

interface HomeProps {
    orders: OrderProps[];
}

export default function DashBoard({ orders }: HomeProps) {
    const [orderList, setOrderList] = useState(orders || []);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);

    // Função para atualizar os pedidos da lista
    async function handleRefresh() {
        const apiCliente = setupAPICliente();
        const response = await apiCliente.get('/listPedidos');
        setOrderList(response.data);
    }

    // Alteração para definir o status como "Pronto"
    async function handleFinishItem(id: string) {
        const apiCliente = setupAPICliente();
        await apiCliente.put(`/pedido/status/${id}`, { status: "Pronto" });
        handleRefresh(); // Atualiza a lista de pedidos após a alteração
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
    const pedidosProntos = orderList.filter(item => item.status === 'Pronto');
    const pedidosPagos = orderList.filter(item => item.status === 'Pago'); // Filtro para pedidos pagos

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
                                        className={`${styles.card} ${styles.pending}`}
                                        onClick={() => handleOpenModal(item)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h3 className={styles.cardTitle}>
                                            {item.numMesa === 0 ? "Pedido Delivery" : `Mesa ${item.numMesa}`}
                                        </h3>

                                        {/* Exibindo apenas o horário */}
                                        <span className={styles.time}>
                                            {new Date(item.dataCreate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>

                                        <button
                                            className={styles.finishButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFinishItem(item.id);
                                            }}
                                        >
                                            Pedido Pronto
                                        </button>
                                    </section>
                                ))
                            )}
                        </div>

                        <div className={styles.column}>
                            <h2>Pedidos Prontos:</h2>
                            {pedidosProntos.length === 0 ? (
                                <span className={styles.emptyList}>Nenhum pedido pronto...</span>
                            ) : (
                                pedidosProntos.map(item => (
                                    <section
                                        key={item.id}
                                        className={`${styles.card} ${styles.completed}`}
                                        onClick={() => handleOpenModal(item)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h3 className={styles.cardTitle}>
                                            {item.numMesa === 0 ? "Pedido Delivery" : `Mesa ${item.numMesa}`}
                                        </h3>
                                        <span className={styles.time}>
                                            {new Date(item.dataCreate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <button
                                            className={styles.finishButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/PDV?id=${item.id}`;
                                            }}
                                        >
                                            Pagamento
                                        </button>
                                    </section>
                                ))
                            )}
                        </div>

                        <div className={styles.column}>
                            <h2>Pedidos Pagos:</h2>
                            {pedidosPagos.length === 0 ? (
                                <span className={styles.emptyList}>Nenhum pedido pago...</span>
                            ) : (
                                pedidosPagos.map(item => (
                                    <section
                                        key={item.id}
                                        className={`${styles.card} ${styles.paid}`}
                                        onClick={() => handleOpenModal(item)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h3 className={styles.cardTitle}>
                                            {item.numMesa === 0 ? "Pedido Delivery" : `Mesa ${item.numMesa}`}
                                        </h3>
                                        <span className={styles.time}>
                                            {new Date(item.dataCreate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
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
