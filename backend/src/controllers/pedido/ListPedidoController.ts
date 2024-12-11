import { Request, Response } from "express";
import { ListPedidoService } from "../../services/pedido/ListPedidoService";

class ListPedidoController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const service = new ListPedidoService();

    try {
      const pedido = await service.execute(Number(id));
      return res.json(pedido);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export { ListPedidoController };
