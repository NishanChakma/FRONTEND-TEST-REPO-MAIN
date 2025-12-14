export enum UserRole {
  ADMIN = "ADMIN",
  AUDITOR = "AUDITOR",
  COMPLIANCE_OFFICER = "COMPLIANCE_OFFICER",
  FUND_MANAGER = "FUND_MANAGER",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status?: string;
}

export interface Fund {
  id: string;
  code: string;
  name: string;
  region: string;
  currency: string;
}

export enum DocType {
  QUARTERLY_REPORT = "QUARTERLY_REPORT",
  ANNUAL_REPORT = "ANNUAL_REPORT",
  KIID = "KIID",
  FACTSHEET = "FACTSHEET",
  LEGAL_CONTRACT = "LEGAL_CONTRACT",
}

export enum DocStatus {
  PENDING = "PENDING",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ARCHIVED = "ARCHIVED",
}

export interface Document {
  id: string;
  title: string;
  fundId: string;
  fund: Fund;
  type: DocType;
  status: DocStatus;
  periodStart: string;
  periodEnd: string;
  fileKey: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

export enum AIModelType {
  "OpenAI_gpt_OSS-120b" = "openai/gpt-oss-120b:free",
  "OpenAI_gpt_Oss_20b" = "openai/gpt-oss-20b:free",
  "Google_Gemma_3_27b_it" = "google/gemma-3-27b-it:free",
  "DeepSeek_Chimera" = "tngtech/deepseek-r1t2-chimera:free",
  Llama_3_2_11B_Vision = "meta-llama/llama-3.2-11b-vision-instruct:free",
  Gemma_3_4B = "google/gemma-3-4b-it:free",
  Gemma_3_12B = "google/gemma-3-12b-it:free",
}
