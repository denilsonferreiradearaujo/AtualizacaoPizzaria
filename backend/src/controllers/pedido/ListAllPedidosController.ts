import { Request, Response } from 'express';
import { ListAllPedidosService} from '../../services/pedido/ListAllPedidosService';

class ListAllPedidosController {
  async handle(req: Request, res: Response) {
    const service = new ListAllPedidosService();

    try {
      const pedidos = await service.execute();
      return res.json(pedidos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export { ListAllPedidosController };
