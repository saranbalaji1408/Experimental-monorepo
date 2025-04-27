import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
