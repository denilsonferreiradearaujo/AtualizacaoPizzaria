import prisma from "../../prisma/index";

interface DeleteTaxaEntregaRequest {
  id: string;
}

class DeleteTaxaEntregaService {
  async execute({ id }: DeleteTaxaEntregaRequest) {
    // Verifica se a Taxa de Entrega existe
    const taxaEntrega = await prisma.taxaEntrega.findUnique({
      where: { id: Number(id) }, // Converte para número, se necessário
    });

    if (!taxaEntrega) {
      throw new Error("Taxa de Entrega não encontrada");
    }

    // Exclui a Taxa de Entrega
    await prisma.taxaEntrega.delete({
      where: { id: Number(id) },
    });
  }
}

export { DeleteTaxaEntregaService };
