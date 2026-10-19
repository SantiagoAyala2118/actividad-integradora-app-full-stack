import { Request, Response, NextFunction } from "express";
import { ProductStatus } from "../types/index.ts";

// estados validos del producto
const VALID_STATUSES: ProductStatus[] = [
  ProductStatus.DISPONIBLE,
  ProductStatus.SIN_STOCK,
  ProductStatus.DISCONTINUADO,
];

// controlador de productos
export class ProductController {
  // listar todos los productos
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: llamar al ProductService.list cuando este implementado
      return res.status(200).json({ message: "Lista de productos" });
    } catch (error) {
      next(error);
    }
  }

  // obtener un producto por id
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Falta el id del producto" });
      }

      // TODO: llamar al ProductService.getById cuando este implementado
      return res.status(200).json({ message: "Detalle del producto" });
    } catch (error) {
      next(error);
    }
  }

  // crear un producto nuevo
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, price } = req.body;

      // validaciones de entrada
      if (!name) {
        return res.status(400).json({ message: "El nombre del producto es obligatorio" });
      }
      if (!description) {
        return res.status(400).json({ message: "La descripcion del producto es obligatoria" });
      }
      if (price === undefined || price === null || typeof price !== "number" || price < 0) {
        return res.status(400).json({ message: "El precio debe ser un numero mayor o igual a 0" });
      }

      // TODO: llamar al ProductService.create cuando este implementado
      return res.status(201).json({ message: "Producto creado exitosamente" });
    } catch (error) {
      next(error);
    }
  }

  // actualizar un producto
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Falta el id del producto" });
      }

      // validar precio si viene en el body
      if (price !== undefined && (typeof price !== "number" || price < 0)) {
        return res.status(400).json({ message: "El precio debe ser un numero mayor o igual a 0" });
      }

      // TODO: llamar al ProductService.update cuando este implementado
      return res.status(200).json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
      next(error);
    }
  }

  // cambiar el estado de un producto
  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Falta el id del producto" });
      }
      if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          message: `El estado debe ser uno de: ${VALID_STATUSES.join(", ")}`,
        });
      }

      // TODO: llamar al ProductService.changeStatus cuando este implementado
      return res.status(200).json({ message: "Estado del producto actualizado" });
    } catch (error) {
      next(error);
    }
  }

  // eliminar un producto
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Falta el id del producto" });
      }

      // TODO: llamar al ProductService.delete cuando este implementado
      return res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      next(error);
    }
  }
}
