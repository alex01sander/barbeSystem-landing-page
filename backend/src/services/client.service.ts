import { ClientRepository } from "../repositories/client.repository";
import { CreateClientDTO, UpdateClientDTO } from "../utils/types";

const clientRepository = new ClientRepository();

export class ClientService {
  async listAll(search?: string) {
    return clientRepository.findAll(search);
  }

  async getById(id: string) {
    const client = await clientRepository.findById(id);
    if (!client) {
      throw new Error("Cliente não encontrado");
    }
    return client;
  }

  async create(data: CreateClientDTO) {
    // 1. Verificar se telefone já existe
    const phoneExists = await clientRepository.findByPhone(data.phone);
    if (phoneExists) {
      throw new Error("Já existe um cliente cadastrado com este telefone");
    }

    // 2. Verificar se email já existe (se fornecido)
    if (data.email) {
      const emailExists = await clientRepository.findByEmail(data.email);
      if (emailExists) {
        throw new Error("Já existe um cliente cadastrado com este e-mail");
      }
    }

    return clientRepository.create(data);
  }

  async update(id: string, data: UpdateClientDTO) {
    await this.getById(id); // Verificar se existe

    if (data.phone) {
      const phoneExists = await clientRepository.findByPhone(data.phone);
      if (phoneExists && phoneExists.id !== id) {
        throw new Error("Este telefone já está em uso por outro cliente");
      }
    }

    if (data.email) {
      const emailExists = await clientRepository.findByEmail(data.email);
      if (emailExists && emailExists.id !== id) {
        throw new Error("Este e-mail já está em uso por outro cliente");
      }
    }

    return clientRepository.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id);
    return clientRepository.delete(id);
  }

  async getHistory(id: string) {
    await this.getById(id);
    return clientRepository.getHistory(id);
  }
}
