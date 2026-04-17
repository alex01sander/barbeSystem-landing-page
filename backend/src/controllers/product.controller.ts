import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

export class ProductController {
  async list(req: Request, res: Response) {
    try {
      const products = await productService.listProducts();
      return res.json(products);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao listar produtos";
      return res.status(500).json({ error: message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const product = await productService.createProduct(req.body);
      return res.status(201).json(product);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao criar produto";
      return res.status(400).json({ error: message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      return res.json(product);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar produto";
      return res.status(400).json({ error: message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      return res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao deletar produto";
      return res.status(400).json({ error: message });
    }
  }
}
