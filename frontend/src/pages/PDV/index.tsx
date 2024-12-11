import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { setupAPICliente } from "../../services/api";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";

type ProductProps = {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
};

type OrderDetails = {
  id: number;
  numMesa: number;
  produtos: ProductProps[];
  valorTotal: number;
};

export default function PDV() {
  const router = useRouter();
  const { id } = router.query;

  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    id: 0,
    numMesa: 0,
    produtos: [],
    valorTotal: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!id || Array.isArray(id)) return;

      try {
        const apiCliente = setupAPICliente();
        const response = await apiCliente.get(`/pedido/${id}`);
        const fetchedOrder = response.data;

        // Calcular o valor total
        const total = fetchedOrder.produtos.reduce(
          (sum: number, produto: ProductProps) => {
            return sum + produto.quantidade * produto.valorUnitario;
          },
          0
        );

        setOrderDetails({
          ...fetchedOrder,
          valorTotal: total, // Atualiza o valor total
        });

        setError(null);
      } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
        setError("Não foi possível carregar os detalhes do pedido.");
      }
    }

    fetchOrderDetails();
  }, [id]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  // Função para formatar valores com vírgula
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função para mudar o status do pedido para "Pago"
  const handlePayment = async () => {
    if (!id || Array.isArray(id)) return;

    try {
      const apiCliente = setupAPICliente();
      await apiCliente.put(`/pedido/status/${id}`, { status: "Pago" });

      // Redireciona para o dashboard após a atualização do status
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar o status do pedido:", error);
      setError("Não foi possível atualizar o status do pedido.");
    }
  };

  return (
    <>
      <Head>
        <title>
          PDV - Pedido{" "}
          {orderDetails.numMesa ? `Mesa ${orderDetails.numMesa}` : "Delivery"}
        </title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <h1>
            {orderDetails.numMesa
              ? `Mesa ${orderDetails.numMesa}`
              : "Pedido Delivery"}
          </h1>

          <div className={styles.orderDetails}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Valor Unitário</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.nome}</td>
                    <td>{produto.quantidade}</td>
                    <td>{formatCurrency(Number(produto.valorUnitario) || 0)}</td>
                    <td>
                      {formatCurrency(
                        (produto.quantidade || 0) * (Number(produto.valorUnitario) || 0)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.totalContainer}>
              <h2>Total: {formatCurrency(orderDetails.valorTotal || 0)}</h2>
            </div>

            <button
              className={styles.finishButton}
              onClick={handlePayment} // Chama a função para mudar o status para "Pago"
            >
              Finalizar Pagamento
            </button>
          </div>
        </main>
      </div>
    </>
  );
}