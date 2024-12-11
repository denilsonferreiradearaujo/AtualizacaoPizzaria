import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ListPedidoService {
  async execute(id: number) {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            Produto: {
              include: {
                valores: true,  // Inclui os valores (preços) do produto
              },
            },
          },
        },
      },
    });

    if (!pedido) {
      throw new Error("Pedido não encontrado");
    }

    // Agora ajustamos a lógica para pegar o preço correto
    return {
      ...pedido,
      produtos: pedido.items.map((item) => {
        const valorProduto = item.Produto.valores.find(valor => valor.status); // Pega o valor ativo

        return {
          id: item.Produto.id,
          nome: item.Produto.nome,
          quantidade: item.quantidade,
          valorUnitario: valorProduto ? valorProduto.preco : 0, // Usa o preço se encontrado, caso contrário, 0
        };
      }),
    };
  }
}

export { ListPedidoService };
