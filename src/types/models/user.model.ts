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
