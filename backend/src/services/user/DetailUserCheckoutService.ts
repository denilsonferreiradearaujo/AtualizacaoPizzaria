
import prismaCliente from '../../prisma';

class DetailUserCheckoutService {
  async executeByCpf(cpf: string) {
    const user = await prismaCliente.pessoa.findUnique({
      where: {
        cpf: cpf, // Busca pelo CPF
      },
      select: {
        id: true,
        nome: true,
        email: true,
        genero: true,
        cpf: true,
        dataNasc: true,
        status: true,
        enderecos: true,
        telefones: {
          select: {
            Telefone: {
              select: {
                telefoneResidencial: true,
                telefoneCelular: true,
              }
            }
          }
        },
      },
    });

    return user;
  }
}

export { DetailUserCheckoutService }