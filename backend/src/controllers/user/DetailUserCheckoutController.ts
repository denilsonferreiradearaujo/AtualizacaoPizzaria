import { Request, Response } from 'express';
import { DetailUserCheckoutService } from '../../services/user/DetailUserCheckoutService';

class DetailUserCheckoutController {
  async handle(req: Request, res: Response) {
    try {
      const { cpf } = req.params; // Captura o CPF dos parâmetros da rota
      const detailUserCheckoutService = new DetailUserCheckoutService();

      // Busca pelo CPF
      const user = await detailUserCheckoutService.executeByCpf(cpf);

      return res.json(user);
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário:", error);
      return res.status(500).json({ message: "Erro ao buscar detalhes do usuário" });
    }
  }
}

export { DetailUserCheckoutController }