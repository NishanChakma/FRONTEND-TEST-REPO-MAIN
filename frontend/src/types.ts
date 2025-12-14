export enum UserRole {
    ADMIN = 'ADMIN',
    AUDITOR = 'AUDITOR',
    COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
    FUND_MANAGER = 'FUND_MANAGER',
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
    QUARTERLY_REPORT = 'QUARTERLY_REPORT',
    ANNUAL_REPORT = 'ANNUAL_REPORT',
    KIID = 'KIID',
    FACTSHEET = 'FACTSHEET',
    LEGAL_CONTRACT = 'LEGAL_CONTRACT',
}

export enum DocStatus {
    PENDING = 'PENDING',
    IN_REVIEW = 'IN_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    ARCHIVED = 'ARCHIVED',
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
