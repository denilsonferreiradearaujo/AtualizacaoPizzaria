import { Request, Response } from "express";
import { DeleteTaxaEntregaService } from "../../services/taxaEntrega/DeleteTaxaEntregaService"; // Importação corrigida

class DeleteTaxaEntregaController {
  async handle(req: Request, res: Response) {
    // Obtém o `id` dos parâmetros da URL
    const { id } = req.params;

    const deleteTaxaEntregaService = new DeleteTaxaEntregaService();

    try {
      // Executa o serviço de exclusão
      await deleteTaxaEntregaService.execute({ id });

      return res.status(204).send(); // Retorna status 204 (No Content) para indicar sucesso na exclusão
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteTaxaEntregaController };
