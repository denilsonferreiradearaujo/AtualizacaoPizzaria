import { Request, Response } from 'express';
import { DetailUserService } from '../../services/user/DetailUserService';

class DetailUserController {
  async handle(req: Request, res: Response) {
    try {
      const { pessoa_id } = req.params; // Captura o ID dos parâmetros da rota
      const detailUserService = new DetailUserService();
      
      // Converte `pessoa_id` para número e chama o serviço
      const user = await detailUserService.execute(Number(pessoa_id)); 

      return res.json(user);
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário:", error);
      return res.status(500).json({ message: "Erro ao buscar detalhes do usuário" });
    }
  }
}

export { DetailUserController };
