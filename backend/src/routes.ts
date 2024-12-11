import { Router } from "express";

import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { UpdateUserController } from "./controllers/user/UpdateUserController";
import { DetailAllUserController } from "./controllers/user/DetailAllUserController";
import { ForgotPasswordController } from "./controllers/user/ForgotPasswordController";
import { ResetPasswordUserController } from "./controllers/user/ResetPasswordUserController";

import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
import { UpdateCategoryController } from "./controllers/category/UpdateCategoryController";
import { DeleteCategoryController } from "./controllers/category/DeleteCategoryController"; // Importação do controlador de exclusão
import { CreateProductController } from "./controllers/product/CreateProductController";
import { ListProductController } from "./controllers/product/ListProductController";
import { UpdateProductController } from "./controllers/product/UpdateProductController";
import { ListProductByCategoryController } from "./controllers/product/ListProductByCategoryController";

import { CreateTaxaEntregaController } from "./controllers/taxaEntrega/CreateTaxaEntregaController";
import { ListAllTaxaEntregaController } from "./controllers/taxaEntrega/ListAllTaxaEntregaController";
import { UpdateTaxaEntregaController } from "./controllers/taxaEntrega/UpdateTaxaEntregaController";
import { DeleteTaxaEntregaController } from "./controllers/taxaEntrega/DeleteTaxaEntregaController";

import { CreatePedidoController } from "./controllers/pedido/CreatePedidoController";
import { ListAllPedidosController } from "./controllers/pedido/ListAllPedidosController";
import { UpdatePedidoStatusController } from "./controllers/pedido/UpdatePedidoStatusController";
import { DetailUserCheckoutController } from "./controllers/user/DetailUserCheckoutController";
import { ListPedidoController } from "./controllers/pedido/ListPedidoController";

// MiddleWares
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { isAuthorized } from "./middlewares/isAuthorized"; // isAuthorized(['funcionario', 'cliente' ])

const router = Router();

// Rotas User
router.post("/users", new CreateUserController().handle); // Cadastra um usuário na plataforma
router.post("/login", new AuthUserController().handle); // loga o usuário na plataforma
router.get("/users/:pessoa_id", new DetailUserController().handle); // Exibe os dados do usuário
router.get("/users/cpf/:cpf", new DetailUserCheckoutController().handle);
router.put("/users/:pessoa_id", new UpdateUserController().handle); // Atualiza os dados do usuário
router.get("/listUsers", new DetailAllUserController().handle); // Todos os usuarios
router.post("/forgotPassword", new ForgotPasswordController().handle);
router.post("/resetPassword/:token", new ResetPasswordUserController().handle);

// Rotas categoria
router.post("/category", new CreateCategoryController().handle);
router.get("/listCategory", new ListCategoryController().handle);
router.post("/updateCategory/:id", new UpdateCategoryController().handle);
router.delete("/category/:id", new DeleteCategoryController().handle);

// Rotas produto
router.post("/createProduct", new CreateProductController().handle);
router.get("/listProduct", new ListProductController().handle);
router.post("/updateProduct/:id", new UpdateProductController().handle);
router.put("/updateProduct/:id", new UpdateProductController().handle);
router.get("/produtos", new ListProductByCategoryController().handle);

// Rotas taxa de entrega
router.post("/addTaxaEntrega", new CreateTaxaEntregaController().handle);
router.get("/listTaxasEntrega", new ListAllTaxaEntregaController().handle);
router.put("/updateTaxaEntrega/:id", new UpdateTaxaEntregaController().handle);
router.delete("/taxaEntrega/:id", new DeleteTaxaEntregaController().handle);

// Rotas dos pedidos
router.post("/createPedido", new CreatePedidoController().handle); // [RF007] - Solicitação de pedido via delivery
router.get("/listPedidos", new ListAllPedidosController().handle); // [RF004] - Visualização de histórico de pedidos ( tela da produção )
router.put("/pedido/status/:id", new UpdatePedidoStatusController().handle); // [RF023] - Atualização de pedido delivery
router.get(`/pedido/:id`, new ListPedidoController().handle);
// PDV

export { router };
