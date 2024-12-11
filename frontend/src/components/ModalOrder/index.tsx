import React from 'react';
import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

interface OrderProps {
    id: string;
    numMesa: number;
    status: string;
    items: { id: string; quantidade: number; Produto: { nome: string; descricao: string; preco: string | number; }; }[]; // Certificando que o preco pode ser string ou number
    valorTotal: number | string;
    dataCreate: Date;
    dataUpdate: Date;
}

interface ModalOrderProps {
    isOpen: boolean;
    order: OrderProps;
    onRequestClose: () => void;
}

export function ModalOrder({ isOpen, onRequestClose, order }: ModalOrderProps) {
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: '0',
            backgroundColor: 'transparent',
        },
    };

    function formatCurrency(value: number | string): string {
        const numberValue = typeof value === 'string' ? parseFloat(value) : value;
        return numberValue.toFixed(2).replace('.', ',');
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            <button
                type="button"
                onClick={onRequestClose}
                className="react-modal-close"
                style={{ background: 'transparent', border: 0, position: 'absolute', top: '15px', right: '15px' }}
            >
                <FiX size={30} color='#f34748' />
            </button>

            <div className={styles.container}>
                <h2>Detalhes do Pedido - Mesa {order.numMesa}</h2>

                <div className={styles.details}>
                    <span className={styles.table}>Mesa: <strong>{order.numMesa}</strong></span>
                    <span>Status: <strong>{order.status}</strong></span>
                    <span>Total: <strong>R$ {formatCurrency(order.valorTotal)}</strong></span>
                    <span>Data do Pedido: <strong>{new Date(order.dataCreate).toLocaleString()}</strong></span>
                </div>

                <h3>Itens do Pedido:</h3>
                <div className={styles.itemsList}>
                    {order.items.map(item => {
                        const preco = typeof item.Produto.preco === 'string'
                            ? parseFloat(item.Produto.preco)
                            : item.Produto.preco;

                        console.log('Preço do produto:', preco);  // Adicione isso para depuração

                        const precoValido = isNaN(preco) ? 0 : preco;
                        const totalItem = precoValido * item.quantidade;

                        return (
                            <section key={item.id} className={styles.containerItem}>
                                <div className={styles.quantity}>
                                    <span>Quantidade</span>
                                    <strong>{item.quantidade}</strong>
                                </div>
                                <div className={styles.itemName}>
                                    <strong>{item.Produto.nome}</strong>
                                    <p className={styles.description}>{item.Produto.descricao}</p>
                                </div>
                                <div className={styles.itemPrice}>
                                    <strong>R$ {formatCurrency(totalItem)}</strong>
                                </div>
                            </section>
                        );
                    })}

                </div>
            </div>
        </Modal>
    );
}
