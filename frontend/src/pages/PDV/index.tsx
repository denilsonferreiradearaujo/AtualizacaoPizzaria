import { useState } from 'react';
import styles from './styles.module.scss';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';

interface Product {
    id: number;
    name: string;
    price: number;
}

const PDV: React.FC = () => {
    const [products] = useState<Product[]>([
        { id: 1, name: 'Produto A', price: 10.0 },
        { id: 2, name: 'Produto B', price: 15.0 },
        { id: 3, name: 'Produto C', price: 20.0 },
    ]);

    const [cart, setCart] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
        setCart([...cart, product]);
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter((product) => product.id !== id));
    };

    const calculateTotal = () => {
        return cart.reduce((total, product) => total + product.price, 0).toFixed(2);
    };

    const finalizeSale = () => {
        alert('Venda finalizada com sucesso!');
        setCart([]);
    };

    return (
        <>
            <Header />
            <Head>
                <title>Lista de Usuários</title>
            </Head>
            <div className={styles.container}>
                <header className={styles.header}>PDV - Sistema de Vendas</header>
                <div className={styles.content}>
                    <div className={styles.productList}>
                        <h2>Produtos</h2>
                        {products.map((product) => (
                            <div key={product.id} className={styles.productItem}>
                                <span>{product.name}</span>
                                <span>R$ {product.price.toFixed(2)}</span>
                                <button
                                    className={styles.button}
                                    onClick={() => addToCart(product)}
                                >
                                    Adicionar
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.cart}>
                        <h2>Carrinho</h2>
                        {cart.map((product, index) => (
                            <div key={index} className={styles.cartItem}>
                                <span>{product.name}</span>
                                <span>R$ {product.price.toFixed(2)}</span>
                                <button
                                    className={styles.button}
                                    onClick={() => removeFromCart(product.id)}
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                        <div className={styles.total}>
                            Total: R$ {calculateTotal()}
                        </div>
                        <button
                            className={styles.finalizeButton}
                            onClick={finalizeSale}
                            disabled={cart.length === 0}
                        >
                            Finalizar Venda
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PDV;
