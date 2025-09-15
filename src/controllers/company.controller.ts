import type { Request, Response } from "express";
import { catchAsync, sendResponse } from "../helpers/api.helper.js";
import { AppError } from "../middlewares/error.middleware.js";
import { companyService } from "../services/company.service.js";
import { Prisma } from "@prisma/client";

export const getCompanies = catchAsync(async (req: Request, res: Response) => {
  const { name, location } = req.query;

  const query: any = {};
  if (name) query.name = { contains: String(name), mode: "insensitive" };
  if (location)
    query.location = { contains: String(location), mode: "insensitive" };

  const companies = await companyService.getAllCompanies(query);
  return sendResponse(res, 200, "Companies fetched successfully", companies);
});

export const getCompanyById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new AppError("Company ID is required", 400);

    const company = await companyService.getCompanyById(Number(id));
    if (!company) throw new AppError("Company not found", 404);

    return sendResponse(res, 200, "Company fetched successfully", company);
  }
);

export const addCompany = catchAsync(async (req: Request, res: Response) => {
  const { name, description, location } = req.body;

  if (!name) {
    throw new AppError("Company name is required", 400);
  }

  const newCompany = await companyService.createCompany({
    name,
    description,
    location,
  } as Prisma.CompanyCreateInput);

  return sendResponse(res, 201, "Company created successfully", newCompany);
});

export const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("Company ID is required", 400);

  const { name, description, location } = req.body;

  if (!name && !description && !location) {
    throw new AppError("At least one field is required to update", 400);
  }

  const updated = await companyService.updateCompany(Number(id), {
    name,
    description,
    location,
  });

  if (!updated) throw new AppError("Company not found", 404);

  return sendResponse(res, 200, "Company updated successfully", updated);
});

export const deleteCompany = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("Company ID is required", 400);

  const deleted = await companyService.deleteCompany(Number(id));
  if (!deleted) throw new AppError("Company not found or already deleted", 404);

  return sendResponse(res, 200, "Company deleted successfully", deleted);
});
