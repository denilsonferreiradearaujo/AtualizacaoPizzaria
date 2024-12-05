import { useContext, useState, useEffect } from "react";
import { Footer } from '../components/Footer';
import { useRouter } from 'next/router';
import Head from "next/head";
import Image from "next/image";
import { toast } from 'react-toastify';

import logoImg from '../../public/logo.png';
import baner from '../../public/baner.jpg';
import banner02 from '../../public/banner02.jpg';
import banner03 from '../../public/banner03.jpg';
import calabresaImg from '../../public/calabresa.png'; // Pizzas Salgadas
import alohoPoroImg from '../../public/alhoPorocomSalada.png';
import portuguesaImg from '../../public/Portuguesa.png';
import baconImg from '../../public/bacon.png';
import brasileiraImg from '../../public/brasileira.png';
import brocolisImg from '../../public/brocolis.png';
import camaraoImg from '../../public/camarao.png';
import espanholaImg from '../../public/espanhola.png';
import lomboImg from '../../public/lombocomCatupiry.png';
import margueridtaImg from '../../public/marguerita.png';
import morangChoc from '../../public/chocolateMorango.png'; // Pizzas Doces
import confete from '../../public/pizzaConfete.png';
import pacoca from '../../public/PizzaPacoca.jpeg';
import brigadeirao from '../../public/brigadeiro.png';
import amendoin from '../../public/pizzaAmendoin.png';
import cocaCola2L from '../../public/coca2L.jpeg'; // Bebidas
import cocaColaLata from '../../public/cocaLata.png';
import fantaGuarana from '../../public/fantaGuarana2L.png';
import FantaLaranja from '../../public/fantaLaranja2L.png';
import fantaUvaLata from '../../public/fantaUva.png';
import guaranaJesus from '../../public/guaranaJesusLata.png';
import laranja1L from '../../public/laranja1L.png';
import maguary2L from '../../public/maguary.png';
import pepsiNaLata from '../../public/pepsiLata.png';
import sodaLata from '../../public/soda.png';
import sprite from '../../public/spriteLata.png';
import tampico2L from '../../public/tampico.png';
import twistNaLata from '../../public/twistLata.png';
import erroImg from '../../public/naoFoi.png';

import { setupAPICliente } from '../../../frontend/src/services/api';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import styles from '../../styles/home.module.scss';
import { AuthContext } from "../contexts/AuthContext";
import Link from "next/link";

interface Categoria {
  id: number;
  nome: string;
}

interface Valor {
  preco: number;
  tamanho: string;
  id: number;
}

interface Produto {
  id: number;
  nome: string;
  valores: Valor[];
}

interface CartItem {
  id: number;
  nome: string;
  tamanho: string;
  preco: number;
  quantidade: number;
  produtoId: number;
  idValor: number;
}

function getImageForProduct(nome: string) {
  switch (nome) {
    case 'Pizza de Marguerita':
      return margueridtaImg;
    case 'Pizza de Calabresa':
      return calabresaImg;
    case 'Pizza de Alho Poró':
      return alohoPoroImg;
    case 'Pizza de Bacon':
      return baconImg;
    case 'Pizza Brasileira':
      return brasileiraImg;
    case 'Pizza de Brócolis':
      return brocolisImg;
    case 'Pizza de Camarão':
      return camaraoImg;
    case 'Pizza Espanhola':
      return espanholaImg;
    case 'Pizza de Confete':
      return confete;
    case 'Pizza de Morango com Chocolate':
      return morangChoc;
    case 'Pizza de Paçoca':
      return pacoca;
    case 'Pizza de Brigadeiro':
      return brigadeirao;
    case 'Pizza de Amendoin':
      return amendoin;
    case 'Coca Cola 2L':
      return cocaCola2L;
    case 'Coca Cola Lata':
      return cocaColaLata;
    case 'Fanta Guarana 2L':
      return fantaGuarana;
    case 'Fanta Laranja 2L':
      return FantaLaranja;
    case 'Fanta Uva Lata':
      return fantaUvaLata;
    case 'Guarana Jesus Lata':
      return guaranaJesus;
    case 'Suco de Laranja Natural 1L':
      return laranja1L;
    case 'Suco Maguary de Laranja 2L':
      return maguary2L;
    case 'Pepsi Lata':
      return pepsiNaLata;
    case 'Soda Lata':
      return sodaLata;
    case 'Sprite Lata':
      return sprite;
    case 'Tampico 2L':
      return tampico2L;
    case 'Pepsi Twist Lata':
      return twistNaLata;
    default:
      return erroImg;
  }
}

export default function Home() {
  const [clickedButton, setClickedButton] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSize, setSelectedSize] = useState<{ [produtoId: number]: string }>({});
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // banber começa aqui
  const images = [baner, banner02, banner03];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, []);

  // termina aqui


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const apiCliente = setupAPICliente();
        const response = await apiCliente.get("/listCategory");
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const uniqueCart = parsedCart.filter(
        (item: CartItem, index: number, self: CartItem[]) =>
          index === self.findIndex((i) => i.id === item.id && i.tamanho === item.tamanho)
      );
      setCart(uniqueCart);
    }
  }, []);
  
  

  const handleClick = async (categoriaId: number) => {
    setClickedButton(categoriaId);
    setLoading(true);

    try {
      const apiCliente = setupAPICliente();
      const response = await apiCliente.get(`/produtos?categoriaId=${categoriaId}`);
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (produtoId: number, tamanho: string) => {
    setSelectedSize((prevSelected) => ({ ...prevSelected, [produtoId]: tamanho }));
  };

  const addToCart = (produto: Produto) => {
    const tamanhoSelecionado = selectedSize[produto.id];
    const valorSelecionado = produto.valores.find((valor) => valor.tamanho === tamanhoSelecionado);
  
    if (!valorSelecionado) { //!tamanhoSelecionado || 
      toast.error("Por favor, selecione um tamanho.");
      return;
    }
  
    setCart((prevCart) => {
      // Verifica se o produto e tamanho já existem no carrinho
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === produto.id && item.tamanho === tamanhoSelecionado
      );
  
      if (existingItemIndex >= 0) {
        // Atualiza a quantidade do item existente
        const updatedCart = prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantidade: item.quantidade} // + 1
            : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success("Quantidade adicionada ao carrinho!");
        return updatedCart;
      } else {
        // Adiciona novo item
        const newItem: CartItem = {
          id: produto.id,
          produtoId: produto.id,
          nome: produto.nome,
          tamanho: tamanhoSelecionado,
          quantidade: 1,
          preco: valorSelecionado.preco,
          idValor: valorSelecionado.id,
        };
        const updatedCart = [...prevCart, newItem];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success("Item adicionado ao carrinho!");
        return updatedCart;
      }
    });
  };
  
  const incrementQuantity = (itemId: number, tamanho: string) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === itemId // && item.tamanho === tamanho
      );
  
      if (existingItemIndex >= 0) {
        const updatedCart = prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
        return updatedCart;
      } else {
        // Adiciona o item caso ele não exista
        const produto = produtos.find((p) => p.id === itemId);
        const tamanhoSelecionado = selectedSize[itemId];
        const valorSelecionado = produto?.valores.find((v) => v.tamanho === tamanhoSelecionado);
  
        if (produto && valorSelecionado) { //&& tamanhoSelecionado
          const newItem: CartItem = {
            id: produto.id,
            produtoId: produto.id,
            nome: produto.nome,
            tamanho: tamanhoSelecionado,
            quantidade: 1,
            preco: valorSelecionado.preco,
            idValor: valorSelecionado.id,
          };
          const updatedCart = [...prevCart, newItem];
          return updatedCart;
        }
        return prevCart;
      }
    });
  };

  // Funcão para direcionar para a página do carrinho.
  
  const decrementQuantity = (itemId: number, tamanho: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === itemId && item.quantidade > 1 //item.tamanho === tamanho && 
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0); // Remove itens com quantidade 0
      return updatedCart;
    });
  };
  
  
  const goToCart = () => {
    router.push("/checkout");
  };

  console.log("Tamanho selecionado:", selectedSize);
  console.log("Carrinho:", cart);
  
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src={logoImg} alt="Logo Pizzaria" width={200} height={500} />
        </div>
        <div className={styles.nav}>
          <Link href="/login" legacyBehavior>
            <a className={styles.button}>Acessar</a>
          </Link>
          <Link href="/signup" legacyBehavior>
            <a className={styles.button}>Cadastrar</a>
          </Link>
        </div>
      </header>

      <div className={styles.subHeader}>
        <Link href="#" legacyBehavior>
          <a className={styles.localizacao} onClick={handleOpen}>
            Loja: Sumaré 📍
          </a>
        </Link>

        <div className={styles.carrinho} onClick={goToCart}>
          Ver pedidos 🛒
        </div>
      </div>

      <Modal open={open} onClose={handleClose} aria-labelledby="map-modal" aria-describedby="map-modal-description">
        <Box className={styles.modalBox}>
          <iframe
            width="100%"
            height="450"
            style={{ border: "0" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.322653421742!2d-47.26300282545686!3d-22.834092479134377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8bd1ab1fc77f3%3A0xf2ff0cd47cdcb7d8!2sEscola%20SENAI%20%22Dr.%20Celso%20Charuri%22!5e0!3m2!1sen!2sbr!4v1697399239926!5m2!1sen!2sbr"
          />
        </Box>
      </Modal>

      {/* começa aqui */}
      <div className={styles.carouselContainer}>
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`, // Muda a posição
          }}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Imagem ${index + 1}`}
              className={styles.carouselImage}
              width={1100}
              height={400}
            />
          ))}
        </div>
        <div className={styles.indicators}>
          {images.map((_, index) => (
            <div
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.active : ""
                }`}
              onClick={() => setCurrentIndex(index)} // Clique para mudar a imagem
            />
          ))}
        </div>
      </div>
      {/* termina aqui */}
{/* 
      <div className={styles.baner}>
        <Image src={baner} alt="Logo Pizzaria" width={1100} height={400} />
      </div> */}

      <div className={styles.paginacao}>
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            className={clickedButton === categoria.id ? styles.clickedButton : styles.customButton}
            onClick={() => handleClick(categoria.id)}
          >
            {categoria.nome}
          </button>
        ))}
      </div>

      <div className={styles.produtoContainer}>
        {loading ? (
          <p>Carregando produtos, por favor aguarde...</p>
        ) : produtos.length > 0 ? (
          produtos.map((produto) => (
            <div key={produto.id} className={styles.card}>
              <Image src={getImageForProduct(produto.nome)} alt={`Imagem de ${produto.nome}`} width={210} height={160} />
              <h2 className={styles.cardTitle}>{produto.nome}</h2>
              <div className={styles.cardDetails}>
                {produto.valores.map((valor, index) => (
                  <label key={index}>
                    <input
                      type="radio"
                      name={`tamanho-${produto.id}`}
                      value={valor.tamanho}
                      checked={selectedSize[produto.id] === valor.tamanho}
                      onChange={() => handleSizeChange(produto.id, valor.tamanho)}
                    />
                    {valor.tamanho} R${valor.preco}
                  </label>
                ))}
              </div>
              <div className={styles.quantityControl}>
                <button
                  onClick={() => decrementQuantity(produto.id, selectedSize[produto.id])}
                  // disabled={!selectedSize[produto.id]}
                >
                  -
                </button>
                <span>
                  {cart.find(
                    (item) =>
                      item.id === produto.id && item.tamanho === selectedSize[produto.id]
                  )?.quantidade || 0}
                </span>
                <button
                  onClick={() => incrementQuantity(produto.id, selectedSize[produto.id])}
                  // disabled={!selectedSize[produto.id]}
                >
                  +
                </button>
              </div>
              <button className={styles.addButton} onClick={() => addToCart(produto)}>
                Adicionar ao Carrinho
              </button>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado para esta categoria.</p>
        )}
      </div>
      <Footer />
    </>
  );
}