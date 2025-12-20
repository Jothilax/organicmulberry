import Company from "./company.model.js";
import fs from "fs";

export const createCompany = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      website,
      certificationType,
      created_by,
    } = req.body;

    const certificationFile = req.file ? req.file.path : null;

    const company = await Company.create({
      name,
      email,
      phone,
      address,
      website,
      certificationType,
      certificationFile,
      created_by,
    });

    res.status(201).json({ message: "Company created successfully", company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create company", error });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Company.findByPk(id);
    if (!existing) return res.status(404).json({ message: "Company not found" });

    // Remove old certification file if a new one is uploaded
    if (req.file && existing.certificationFile && fs.existsSync(existing.certificationFile)) {
      fs.unlinkSync(existing.certificationFile);
    }

    const updated = await existing.update({
      ...req.body,
      certificationFile: req.file ? req.file.path : existing.certificationFile,
    });

    res.status(200).json({ message: "Company updated successfully", company: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed", error });
  }
};

// Fetch single company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching company", error });
  }
};

// Delete a company by ID
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Remove certification file if exists
    if (company.certificationFile && fs.existsSync(company.certificationFile)) {
      fs.unlinkSync(company.certificationFile);
    }

    await company.destroy();
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete company", error });
  }
};
