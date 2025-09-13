import type { Company, Prisma } from "@prisma/client";
import { companyRepo } from "../repo/company.repo.js";

export function getAllCompanies(
  query: Prisma.CompanyWhereInput = {},
  orderBy?: Prisma.CompanyOrderByWithRelationInput
): Promise<Company[]> {
  return companyRepo.getAll(query, orderBy);
}

export function getCompanyById(id: number): Promise<Company | null> {
  return companyRepo.getById(id);
}

export function createCompany(
  data: Prisma.CompanyCreateInput
): Promise<Company> {
  return companyRepo.create(data);
}

export function updateCompany(
  id: number,
  data: Prisma.CompanyUpdateInput
): Promise<Company> {
  return companyRepo.update(id, data);
}

export function deleteCompany(id: number): Promise<Company> {
  return companyRepo.remove(id);
}
