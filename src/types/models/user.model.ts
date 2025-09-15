import { Role } from "@prisma/client";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "candidate" | "employer";
  company_id?: number | null;
  created_at: Date;
  updated_at: Date;
}

export type NewUserInput = {
  name: string;
  email: string;
  role: "candidate" | "employer";
  company_id?: number | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: Role; company_id?: number | null };
    }
  }
}
