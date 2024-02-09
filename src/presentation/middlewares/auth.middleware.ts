import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthMiddleware {
  static async validateJwt(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ message: "No token provided" });
    if (!authorization.startsWith("Bearer")) return res.status(401).json({ message: "Invalid Bearer Token" });

    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ message: "Invalid Token" });

      const user = await UserModel.findById(payload.id);
      if (!user) return res.status(400).json({ message: "Invalid Token - User Not Found" });

      req.body.user = user;

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }

  }
}