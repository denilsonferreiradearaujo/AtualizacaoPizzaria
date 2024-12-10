import prismaClient from "../../prisma";

class ListAllPedidosService {
  async execute() {
    const pedidos = await prismaClient.pedido.findMany({
      include: {
        Pessoa: {
          select: {
            nome: true, // Trazer o nome da pessoa
          }
        },
        TaxaEntrega: {
          select: {
            valor: true, // Trazer o valor da taxa de entrega
          }
        },
        items: {
          include: {
            Produto: {
              select: {
                nome: true, // Nome do produto
                valores: {  // Ajuste aqui: o nome da relação é 'valores'
                  select: {
                    preco: true // Inclui o preço do produto da tabela Valor
                  }
                }
              }
            },
          }
        }
      },
    });

    // Calcular o valor total de cada pedido
    const pedidosComTotal = pedidos.map(pedido => {
      const valorTotal = pedido.items.reduce((acc, item) => {
        // Converte o Decimal para número usando o método .toNumber()
        const preco = item.Produto.valores?.[0]?.preco?.toNumber() || 0;
        return acc + preco * item.quantidade;
      }, 0);

      return {
        ...pedido,
        valorTotal: valorTotal.toFixed(2) // Adicionar o total calculado
      };
    });

    return pedidosComTotal;
  }
}

export { ListAllPedidosService };
