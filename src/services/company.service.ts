import type { Company, Prisma } from "@prisma/client";
import { companyRepo } from "../repo/company.repo.js";

async function getAllCompanies(
  query: Prisma.CompanyWhereInput = {},
  orderBy?: Prisma.CompanyOrderByWithRelationInput
): Promise<Company[]> {
  return companyRepo.getAll(query, orderBy);
}

async function getCompanyById(id: number): Promise<Company | null> {
  return companyRepo.getById(id);
}

async function createCompany(
  data: Prisma.CompanyCreateInput
): Promise<Company> {
  return companyRepo.create(data);
}

async function updateCompany(
  id: number,
  data: Prisma.CompanyUpdateInput
): Promise<Company> {
  return companyRepo.update(id, data);
}

async function deleteCompany(id: number): Promise<Company> {
  return companyRepo.remove(id);
}

export const companyService = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
