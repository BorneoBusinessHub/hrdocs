export type Language = 'en' | 'zh';

export type Jurisdiction = 'Peninsular Malaysia' | 'Sarawak';

export type UserRole = 'CompanyOwner' | 'HRAdmin' | 'Manager' | 'Approver';

export type VerificationStatus = 
  | 'Unverified'
  | 'CompanyEmailVerified'
  | 'CompanyRegistrationDocumentSubmitted'
  | 'CompanyDetailsMatched'
  | 'OwnerDeclarationCompleted'
  | 'Company Details Verified'
  | 'RequestResubmission'
  | 'OwnershipDisputed'
  | 'VerificationSuspended';

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Probation';

export type EmploymentStatus =
  | 'Draft'
  | 'Active'
  | 'Probation'
  | 'Confirmed'
  | 'Suspended'
  | 'On Long Leave'
  | 'Notice Period'
  | 'Pending Separation'
  | 'Former Employee'
  | 'Contract Ended'
  | 'Retired'
  | 'Archived'
  | 'Legal Hold';

export interface Person {
  id: string;
  fullName: string;
  preferredName?: string;
  nricOrPassport: string;
  nationality: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  residentialAddress: string;
  personalEmail: string;
  mobileNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface EmploymentEpisode {
  id: string;
  personId: string;
  employeeNumber: string;
  startDate: string;
  endDate?: string;
  employmentType: EmploymentType;
  jobTitle: string;
  grade?: string;
  department: string;
  reportingManagerId?: string;
  workLocationId: string;
  currentJurisdiction: Jurisdiction;
  probationStartDate?: string;
  probationEndDate?: string;
  confirmationDate?: string;
  basicSalaryRM: number;
  fixedAllowancesRM: number;
  payFrequency: 'Monthly' | 'Bi-weekly' | 'Hourly';
  overtimeEligible: boolean;
  noticePeriodDays: number;
  companyPolicyVersion: string;
  employmentStatus: EmploymentStatus;
  separationType?: 'Resignation' | 'Contract Expiry' | 'Retirement' | 'Termination' | 'Dismissal';
  relatedDocumentIds: string[];
  relatedCaseIds: string[];
}

export interface WorkLocation {
  id: string;
  name: string;
  address: string;
  state: string;
  jurisdiction: Jurisdiction;
  holidayCalendarState: string;
  active: boolean;
}

export interface Signatory {
  id: string;
  name: string;
  title: string;
  email: string;
  signatureImage?: string;
  isDefault: boolean;
}

export interface CompanyProfile {
  id: string;
  legalName: string;
  tradingName: string;
  ssmRegistrationNumber: string;
  previousRegistrationNumber?: string;
  companyType: 'Sdn Bhd' | 'Bhd' | 'Sole Proprietorship' | 'Partnership' | 'LLP';
  registeredAddress: string;
  businessAddress: string;
  mainPhone: string;
  officialEmail: string;
  website?: string;
  logoUrl?: string;
  verificationStatus: VerificationStatus;
  verificationDate?: string;
  referenceScheme: {
    prefix: string;
    separator: string;
    resetFrequency: 'Yearly' | 'Never';
    nextRunningNumber: number;
  };
  letterheadConfig: {
    showLogo: boolean;
    headerText: string;
    footerText: string;
    primaryColor: string;
  };
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type TemplateFamily =
  | 'Letter of Appointment'
  | 'Contract of Service'
  | 'Part-Time Employment Agreement'
  | 'Confirmation & Probation Documents'
  | 'Employment Change Documents'
  | 'Performance Improvement Plan'
  | 'HR Memo / Employee Notice'
  | 'Show Cause Letter'
  | 'Case Closure Letter'
  | 'Warning Letter Family'
  | 'Notice of Domestic Inquiry'
  | 'Employee Acknowledgement Documents';

export interface ClauseBlock {
  id: string;
  title: string;
  content: string;
  status: 'BBH Standard' | 'Company Option Selected' | 'User Modified' | 'Risk Detected';
  category: string;
  isMandatory: boolean;
  riskImpact?: string;
  originalContent?: string;
}

export interface DocumentTemplate {
  id: string;
  code: string;
  family: TemplateFamily;
  title: string;
  description: string;
  jurisdiction: Jurisdiction | 'All';
  riskLevel: RiskLevel;
  version: string;
  legalBasis: string;
  lastReviewed: string;
  clauses: ClauseBlock[];
}

export type DocumentStatus =
  | 'Draft'
  | 'Compliance Check Required'
  | 'Compliance Check Completed'
  | 'Pending Approval'
  | 'Changes Requested'
  | 'Approved'
  | 'Approved with Risk'
  | 'Issued'
  | 'Delivered'
  | 'Viewed'
  | 'Acknowledged'
  | 'Accepted'
  | 'Clarification Requested'
  | 'Disputed'
  | 'Revoked'
  | 'Superseded'
  | 'Archived';

export interface ComplianceFinding {
  id: string;
  category: 'System Integrity Error' | 'Statutory Conflict' | 'Jurisdiction Override' | 'Process Risk' | 'AI Language Suggestion';
  severity: 'Red' | 'Amber' | 'Blue';
  ruleId: string;
  messageEn: string;
  messageZh: string;
  legalReference?: string;
  canOverride: boolean;
  suggestedAction: string;
}

export interface ComplianceReport {
  timestamp: string;
  passed: boolean;
  findings: ComplianceFinding[];
  jurisdictionUsed: Jurisdiction;
  recommendedJurisdiction: Jurisdiction;
  overridden: boolean;
  overrideReason?: string;
  overriddenBy?: string;
}

export interface HRDocument {
  id: string;
  systemDocumentId: string; // e.g. DOC-2026-X892F
  companyRefNumber: string;  // e.g. BTS/HR/APPT/2026/001
  templateId: string;
  templateFamily: TemplateFamily;
  templateTitle: string;
  employeeEpisodeId: string;
  employeeName: string;
  employeeNRICMasked: string;
  jurisdiction: Jurisdiction;
  jurisdictionOverridden: boolean;
  overrideReason?: string;
  status: DocumentStatus;
  version: string;
  createdDate: string;
  updatedDate: string;
  effectiveDate: string;
  signatoryId: string;
  signatoryName: string;
  fieldValues: Record<string, any>;
  clauses: ClauseBlock[];
  complianceReport?: ComplianceReport;
  approvalHistory: {
    step: string;
    actor: string;
    role: UserRole;
    action: 'Prepared' | 'Approved' | 'Changes Requested' | 'Overridden & Approved';
    timestamp: string;
    comments?: string;
  }[];
  deliveryInfo?: {
    channel: 'Email' | 'System Link' | 'WhatsApp Text' | 'In-Person Paper';
    sentDate: string;
    secureUrl: string;
    deliveredDate?: string;
    viewedDate?: string;
    responseStatus?: 'Accepted' | 'Acknowledged' | 'Clarification Requested' | 'Disputed' | 'No Response';
    responseDate?: string;
    employeeNotes?: string;
  };
  verificationCode: string;
  hash: string;
}

export type CaseStage =
  | 'Case Draft'
  | 'Facts Collection'
  | 'Show Cause Prepared'
  | 'Show Cause Issued'
  | 'Delivered'
  | 'Awaiting Employee Reply'
  | 'Employee Responded'
  | 'Under Management Review'
  | 'Warning Issued'
  | 'Notice of Domestic Inquiry Issued'
  | 'Case Closed';

export interface DisciplinaryCase {
  id: string;
  caseNumber: string; // e.g. DISC-2026-003
  employeeEpisodeId: string;
  employeeName: string;
  department: string;
  incidentDate: string;
  incidentTime?: string;
  location: string;
  allegationsSummary: string;
  detailedFacts: string;
  policyReferenced: string;
  witnesses?: string;
  previousWarningsCount: number;
  stage: CaseStage;
  replyDeadline: string;
  assignedManager: string;
  showCauseDocumentId?: string;
  closureDocumentId?: string;
  warningDocumentId?: string;
  diNoticeDocumentId?: string;
  employeeReply?: {
    submittedAt: string;
    submittedVia: 'Online Portal' | 'Recorded by HR (Offline Paper)' | 'Recorded by HR (Email/WhatsApp)';
    explanationText: string;
    evidenceFiles?: string[];
  };
  messagesThread: {
    id: string;
    sender: 'HR' | 'Employee' | 'Manager';
    senderName: string;
    timestamp: string;
    text: string;
  }[];
  caseOutcome?: string;
  closedDate?: string;
}

export interface AuditEvent {
  id: string;
  type: 'Business' | 'Security';
  action: string;
  actor: string;
  role: UserRole;
  targetResource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  details: string;
  mfaVerified: boolean;
}

export interface SubscriptionInfo {
  plan: 'Starter' | 'Business' | 'Business Plus';
  status: 'Active' | 'Expired' | 'Pending Deletion';
  courseClaimCode?: string;
  activatedDate: string;
  expiryDate: string;
  maxActiveEmployees: number;
  currentActiveEmployees: number;
  companyCount: number;
}

export interface SettlementWorksheet {
  employeeEpisodeId: string;
  employeeName: string;
  lastWorkingDay: string;
  salaryCutoffDate: string;
  basicSalaryRM: number;
  unusedLeaveDays: number;
  leaveEncashmentRM: number;
  noticePayRM: number;
  overtimeRM: number;
  allowancesRM: number;
  approvedDeductionsRM: number;
  estimatedNetSettlementRM: number;
  paymentStatus: 'Settlement Not Started' | 'Information Required' | 'Pending Payroll Confirmation' | 'Paid';
  notes: string;
}
