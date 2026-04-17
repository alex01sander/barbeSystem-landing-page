import { ProductRepository } from "../repositories/product.repository";
import { Prisma } from "../../generated/prisma";

const productRepository = new ProductRepository();

export class ProductService {
  async listProducts() {
    return productRepository.findAll();
  }

  async getProduct(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error("Produto não encontrado");
    return product;
  }

  async createProduct(data: Prisma.ProductCreateInput) {
    return productRepository.create(data);
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    return productRepository.softDelete(id);
  }
}
