import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/db';

const JWT_SECRET = "thisismyproject";

interface AuthenticatedRequest extends Request {
  email?: string;
  name?: string;
  filename?: string;
}

const userAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: "Missing authorization header" });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };

    req.email = decoded.email;

    const user = await UserModel.findOne({ email: req.email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.name = user.name;
    req.filename = user._id.toString();
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default userAuth;
