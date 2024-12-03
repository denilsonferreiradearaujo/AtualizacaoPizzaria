// import React, { useEffect, useState } from 'react';
// import { Footer } from '../../components/Footer';
// import Image from 'next/image';
// import Link from 'next/link';
// import { FaRegTrashAlt } from "react-icons/fa";
// import axios from 'axios';
// import { useCart } from '../../contexts/CartContext';
// import logoImg from '../../../public/logo.png';
// import styles from './style.module.scss';
// import Head from "next/head";
// import { setupAPICliente } from '@/src/services/api';
// import { toast } from 'react-toastify';

// const Checkout: React.FC = () => {
//     const { cart, setCart, clearCart } = useCart(); // Incluindo setCart para manipular o estado do carrinho
//     const [total, setTotal] = useState(0);
//     const [cep, setCep] = useState('');
//     const [address, setAddress] = useState({
//         logradouro: '',
//         bairro: '',
//         cidade: '',
//     });

//     // Carregar itens do localStorage e calcular o total ao abrir a página
//     useEffect(() => {
//         const storedCart = localStorage.getItem('cart');
//         if (storedCart) {
//             const parsedCart = JSON.parse(storedCart);
//             setCart(parsedCart);

//             // Atualiza o total imediatamente
//             const totalAmount = parsedCart.reduce((acc: number, item: any) => acc + item.preco * item.quantidade, 0);
//             setTotal(totalAmount);
//         }
//     }, []);

//     // Atualiza o total sempre que o carrinho mudar
//     useEffect(() => {
//         const totalAmount = cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
//         setTotal(totalAmount);
//     }, [cart]);

//     // Função para remover um item do carrinho
//     const handleRemoveItem = (index: number) => {
//         const updatedCart = [...cart];
//         updatedCart.splice(index, 1); // Remove o item pelo índice
//         setCart(updatedCart); // Atualiza o estado do carrinho
//         localStorage.setItem('cart', JSON.stringify(updatedCart)); // Sincroniza com o localStorage
//     };

//     // Função para buscar o CEP
//     const handleCepBlur = async () => {
//         if (cep.length === 8) {
//             try {
//                 const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
//                 const data = response.data;
//                 setAddress({
//                     logradouro: data.logradouro,
//                     bairro: data.bairro,
//                     cidade: data.localidade,
//                 });
//             } catch (error) {
//                 console.error("Erro ao buscar CEP:", error);
//                 toast.error("CEP não encontrado. Verifique e tente novamente.");
//             }
//         }
//     };

//     // Função para confirmar o pedido
//     const handleConfirmOrder = async () => {
//         try {
//             const order = {
//                 pessoaId: 1, // Substituir pelo ID real da pessoa
//                 taxaEntregaId: 1, // Substituir pelo ID real da taxa de entrega
//                 status: 'Aberto',
//                 numMesa: 5,
//                 valTotal: total,
//                 items: cart.map((item) => ({
//                     produtoId: item.produtoId,
//                     quantidade: item.quantidade,
//                     idValor: item.idValor,
//                 })),
//             };

//             const apiCliente = setupAPICliente();
//             await apiCliente.post('/createPedido', order); // Usando `POST` para criação
//             toast.success('Pedido confirmado!');
//             clearCart(); // Limpa o carrinho após confirmar o pedido
//         } catch (error) {
//             console.error(error);
//             toast.error('Erro ao confirmar o pedido. Tente novamente.');
//         }
//     };

//     return (
//         <>
//             <Head>
//                 <title>Carrinho</title>
//             </Head>
//             <header className={styles.header}>
//                 <div className={styles.logo}>
//                     <Image src={logoImg} alt="Logo Pizzaria" width={200} height={100} />
//                 </div>
//                 <div className={styles.nav}>
//                     <Link href="/" legacyBehavior>
//                         <a className={styles.button}>Home</a>
//                     </Link>
//                 </div>
//             </header>

//             <div className={styles.checkoutContainer}>
//                 <h1>Finalizar Pedido</h1>

//                 {/* Resumo do Pedido */}
//                 <section className={styles.orderSummary}>
//                     <h2>Resumo do Pedido</h2>
//                     {cart.map((item, index) => (
//                         <div key={index} className={styles.orderItem}>
//                             <span>{item.nome}</span>
//                             <span>{item.tamanho}</span>
//                             <span>{item.quantidade}</span>
//                             <span>R$ {typeof item.preco === "number" ? item.preco.toFixed(2) : parseFloat(item.preco).toFixed(2)}</span>
//                             {/* Ícone de lixeira para excluir item */}
//                             <button onClick={() => handleRemoveItem(index)} className={styles.trashButton}>
//                                 <FaRegTrashAlt size={20} color='red' />
//                             </button>
//                         </div>
//                     ))}
//                 </section>

//                 {/* Total do Pedido */}
//                 <section className={styles.orderTotal}>
//                     <p>Total do Pedido: R$ {total.toFixed(2)}</p>
//                 </section>

//                 {/* Informações do Cliente */}
//                 <section className={styles.customerInfo}>
//                     <h2>Informações do Cliente</h2>
//                     <input type="text" placeholder="Nome" />
//                     <input type="text" placeholder="Celular" />

//                     <div>
//                         <input
//                             type="text"
//                             placeholder="Cep"
//                             value={cep}
//                             onChange={(e) => setCep(e.target.value)}
//                             onBlur={handleCepBlur}
//                         />
//                         <input type="text" placeholder="Logradouro" value={address.logradouro} readOnly />
//                         <input type="text" placeholder="Número" />
//                         <input type="text" placeholder="Bairro" value={address.bairro} readOnly />
//                         <input type="text" placeholder="Cidade" value={address.cidade} readOnly />
//                         <input type="text" placeholder="Complemento" />
//                     </div>
//                 </section>

//                 {/* Método de Pagamento */}
//                 <section className={styles.paymentMethod}>
//                     <h2>Método de Pagamento</h2>
//                     <select>
//                         <option>Cartão de Crédito</option>
//                         <option>Dinheiro</option>
//                         <option>Pix</option>
//                     </select>
//                 </section>

//                 {/* Botão para Confirmar o Pedido */}
//                 <button className={styles.confirmButton} onClick={handleConfirmOrder}>
//                     Confirmar Pedido
//                 </button>
//             </div>

//             <Footer />
//         </>
//     );
// };

// export default Checkout;






import React, { useEffect, useState } from 'react';
import { Footer } from '../../components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { FaRegTrashAlt } from "react-icons/fa";
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import logoImg from '../../../public/logo.png';
import styles from './style.module.scss';
import Head from "next/head";
import { setupAPICliente } from '@/src/services/api';
import { toast } from 'react-toastify';

const Checkout: React.FC = () => {
    const { cart, setCart, clearCart } = useCart();
    const [total, setTotal] = useState(0);
    const [cep, setCep] = useState('');
    const [customer, setCustomer] = useState({
        nome: '',
        celular: '',
    });
    const [address, setAddress] = useState({
        logradouro: '',
        bairro: '',
        cidade: '',
        numero: '',
        complemento: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('Cartão de Crédito');

    // Carregar itens do localStorage e calcular o total ao abrir a página
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            console.log("Carrinho carregado:", parsedCart); // Inspecione o conteúdo
            setCart(parsedCart);

            const totalAmount = parsedCart.reduce((acc: number, item: any) => acc + item.preco * item.quantidade, 0);
            setTotal(totalAmount);
        }
    }, []);

    useEffect(() => {
        const totalAmount = cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
        setTotal(totalAmount);
    }, [cart]);

    const handleRemoveItem = (index: number) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleCepBlur = async () => {
        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                setAddress({
                    ...address,
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                });
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                toast.error("CEP não encontrado. Verifique e tente novamente.");
            }
        }
    };

    const handleConfirmOrder = async () => {
        if (cart.length === 0) {
            toast.error("Nenhum item no carrinho.");
            return;
        }

        try {
            // Monta o payload para envio
            const payload = {
                pessoaId: 1, // Ajuste conforme sua lógica
                // taxaEntregaId: 1, // Ajuste conforme sua lógica
                status: "Aberto",
                // numMesa: "", // Ajuste conforme sua lógica
                valTotal: cart.reduce((total, item) => total + item.preco * item.quantidade, 0),
                items: cart.map((item) => ({
                    produtoId: item.produtoId,
                    idValor: item.idValor,
                    quantidade: item.quantidade,
                })),
            };

            console.log("Payload enviado:", payload); // Para debug
            const apiCliente = setupAPICliente();
            await apiCliente.post('/createPedido', payload);

            toast.success("Pedido confirmado com sucesso!");
            setCart([]); // Limpa o carrinho após o envio
            localStorage.removeItem("cart"); // Limpa o localStorage
        } catch (error) {
            console.error("Erro ao confirmar pedido:", error);
            toast.error("Erro ao confirmar pedido. Tente novamente.");
        }
    };



    return (
        <>

            <Head>
                <title>Checkout</title>
            </Head>

            <header className={styles.header}>
                <div className={styles.logo}>
                    <Link legacyBehavior href='/'>
                        <img src='/logo.png' width={210} height={80} />
                    </Link>
                </div>
                <div className={styles.nav}>
                    <Link href="/" legacyBehavior>
                        <a className={styles.button}>Voltar</a>
                    </Link>
                </div>
            </header>
            <div className={styles.titulo}>

                <h1>Finalizar Pedido</h1>

            </div>

            <div className={styles.checkoutContainerPrimaria}>
                <div className={styles.checkoutContainer}>


                    {/* <section className={styles.orderSummary}>
                        <h2>Resumo do Pedido</h2>
                        {cart.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                                <span>{item.nome}</span>
                                <span>{item.tamanho}</span>
                                <span>{item.quantidade}</span>
                                <span>R$ {typeof item.preco === "number" ? item.preco.toFixed(2) : parseFloat(item.preco).toFixed(2)}</span>
                                <button onClick={() => handleRemoveItem(index)} className={styles.trashButton}>
                                    <FaRegTrashAlt size={20} color='red' />
                                </button>
                            </div>
                        ))}
                    </section> */}

                    <section className={styles.orderSummary}>
                        <h2>Resumo do Pedido</h2>
                        <table className={styles.orderTable}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Tamanho</th>
                                    <th>Quantidade</th>
                                    <th>Preço</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.nome}</td>
                                        <td>{item.tamanho}</td>
                                        <td>{item.quantidade}</td>
                                        <td>R$ {typeof item.preco === "number" ? item.preco.toFixed(2) : parseFloat(item.preco).toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => handleRemoveItem(index)} className={styles.trashButton}>
                                                <FaRegTrashAlt size={20} color='red' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>


                    <section className={styles.orderTotal}>
                        <p>Total do Pedido: R$ {total.toFixed(2)}</p>
                    </section>
                </div>

                <div className={styles.checkoutContainer2}>
                    <section className={styles.customerInfo}>
                        <h2>Informações do Cliente</h2>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={customer.nome}
                            onChange={(e) => setCustomer({ ...customer, nome: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Celular"
                            value={customer.celular}
                            onChange={(e) => setCustomer({ ...customer, celular: e.target.value })}
                        />

                        <div>
                            <input
                                type="text"
                                placeholder="Cep"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                onBlur={handleCepBlur}
                            />
                            <input type="text" placeholder="Logradouro" value={address.logradouro} readOnly />
                            <input
                                type="text"
                                placeholder="Número"
                                value={address.numero}
                                onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                            />
                            <input type="text" placeholder="Bairro" value={address.bairro} readOnly />
                            <input type="text" placeholder="Cidade" value={address.cidade} readOnly />
                            <input
                                type="text"
                                placeholder="Complemento"
                                value={address.complemento}
                                onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                            />
                        </div>
                    </section>
                </div>
                <div className={styles.checkoutContainer3}>
                    <section className={styles.paymentMethod}>
                        <h2>Método de Pagamento</h2>
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option>Cartão de Crédito</option>
                            <option>Dinheiro</option>
                            <option>Pix</option>
                        </select>
                    </section>

                    <button className={styles.confirmButton} onClick={handleConfirmOrder}>
                        Confirmar Pedido
                    </button>
                </div >

            </div>

            <Footer />
        </>
    );
};

export default Checkout;
