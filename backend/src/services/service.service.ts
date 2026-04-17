import { ServiceRepository } from "../repositories/service.repository";
import { CreateServiceDTO, UpdateServiceDTO } from "../utils/types";

const serviceRepository = new ServiceRepository();

export class ServiceService {
  async listAll(includeInactive: boolean = false) {
    return serviceRepository.findAll(!includeInactive);
  }

  async getById(id: string) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new Error("Serviço não encontrado");
    }
    return service;
  }

  async create(data: CreateServiceDTO) {
    // Verificar se já existe serviço com o mesmo nome
    const existing = await serviceRepository.findByName(data.name);
    if (existing) {
      throw new Error("Já existe um serviço cadastrado com este nome");
    }

    return serviceRepository.create(data);
  }

  async update(id: string, data: UpdateServiceDTO) {
    await this.getById(id); // Verificar se existe

    if (data.name) {
      const existing = await serviceRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new Error("Já existe outro serviço com este nome");
      }
    }

    return serviceRepository.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id); // Verificar se existe
    return serviceRepository.delete(id);
  }
}
