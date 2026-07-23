import {
  AuditEvent,
  CompanyProfile,
  DisciplinaryCase,
  EmploymentEpisode,
  HRDocument,
  Person,
  Signatory,
  SubscriptionInfo,
  WorkLocation
} from '../types';
import { INITIAL_TEMPLATES } from './templatesData';

const STORAGE_KEYS = {
  COMPANY: 'bbh_company_profile',
  WORK_LOCATIONS: 'bbh_work_locations',
  SIGNATORIES: 'bbh_signatories',
  PERSONS: 'bbh_persons',
  EPISODES: 'bbh_episodes',
  DOCUMENTS: 'bbh_documents',
  CASES: 'bbh_cases',
  AUDIT: 'bbh_audit_logs',
  SUBSCRIPTION: 'bbh_subscription',
};

// Seed initial data
export const INITIAL_COMPANY: CompanyProfile = {
  id: 'c-001',
  legalName: 'Borneo Tech Solutions Sdn. Bhd.',
  tradingName: 'Borneo Tech Solutions',
  ssmRegistrationNumber: '202101004821 (1405121-W)',
  previousRegistrationNumber: '1405121-W',
  companyType: 'Sdn Bhd',
  registeredAddress: 'Level 12, Menara Pelita, Jalan Tun Abdul Rahman Yaakub, Petra Jaya, 93050 Kuching, Sarawak',
  businessAddress: 'Unit 8-3, Block A, Commercial Centre, Jalan Tun Jugah, 93350 Kuching, Sarawak',
  mainPhone: '+60 82-458 921',
  officialEmail: 'hr@borneotech.com.my',
  website: 'www.borneotech.com.my',
  verificationStatus: 'Company Details Verified',
  verificationDate: '2026-01-15',
  referenceScheme: {
    prefix: 'BTS/HR',
    separator: '/',
    resetFrequency: 'Yearly',
    nextRunningNumber: 15,
  },
  letterheadConfig: {
    showLogo: true,
    headerText: 'BORNEO TECH SOLUTIONS SDN. BHD. | Kuching • Kuala Lumpur',
    footerText: 'Confidential & Proprietary — Generated via BBH HR-DocGen MY',
    primaryColor: '#0f766e',
  },
};

export const INITIAL_LOCATIONS: WorkLocation[] = [
  {
    id: 'loc-sarawak',
    name: 'Sarawak HQ (Kuching)',
    address: 'Unit 8-3, Block A, Commercial Centre, Jalan Tun Jugah, 93350 Kuching',
    state: 'Sarawak',
    jurisdiction: 'Sarawak',
    holidayCalendarState: 'Sarawak',
    active: true,
  },
  {
    id: 'loc-kl',
    name: 'KL Regional Branch (Mid Valley)',
    address: 'Level 18, Northpoint Offices, Mid Valley City, 59200 Kuala Lumpur',
    state: 'Kuala Lumpur',
    jurisdiction: 'Peninsular Malaysia',
    holidayCalendarState: 'Kuala Lumpur',
    active: true,
  },
];

export const INITIAL_SIGNATORIES: Signatory[] = [
  {
    id: 'sig-001',
    name: 'Datuk Abang Zulkarnain bin Haji Wan',
    title: 'Managing Director & CEO',
    email: 'zulkarnain@borneotech.com.my',
    isDefault: true,
  },
  {
    id: 'sig-002',
    name: 'Jessica Lim Swee Chen',
    title: 'Head of Human Resources',
    email: 'jessica.lim@borneotech.com.my',
    isDefault: false,
  },
];

export const INITIAL_PERSONS: Person[] = [
  {
    id: 'p-001',
    fullName: 'Ahmad Razak bin Mohamad',
    preferredName: 'Ahmad',
    nricOrPassport: '880412-13-5819',
    nationality: 'Malaysian',
    gender: 'Male',
    dateOfBirth: '1988-04-12',
    residentialAddress: 'No. 42, Lorong Tabuan Laru 5, 93350 Kuching, Sarawak',
    personalEmail: 'ahmad.razak88@gmail.com',
    mobileNumber: '+60 19-823 4109',
    emergencyContact: {
      name: 'Noraini binti Hassan',
      relationship: 'Spouse',
      phone: '+60 19-823 4110',
    },
  },
  {
    id: 'p-002',
    fullName: 'Sylvia Wong Mei Ling',
    preferredName: 'Sylvia',
    nricOrPassport: '930825-14-6122',
    nationality: 'Malaysian',
    gender: 'Female',
    dateOfBirth: '1993-08-25',
    residentialAddress: 'B-12-3, Prima Damansara, Petaling Jaya, 47830 Selangor',
    personalEmail: 'sylvia.wongml@gmail.com',
    mobileNumber: '+60 12-389 9012',
    emergencyContact: {
      name: 'Wong Kah Hing',
      relationship: 'Father',
      phone: '+60 12-389 0000',
    },
  },
  {
    id: 'p-003',
    fullName: 'Jason Tan Kah Keong',
    preferredName: 'Jason',
    nricOrPassport: '961105-13-7281',
    nationality: 'Malaysian',
    gender: 'Male',
    dateOfBirth: '1996-11-05',
    residentialAddress: 'Lot 104, Stutong Residences, 93350 Kuching, Sarawak',
    personalEmail: 'jasontan.kk96@yahoo.com',
    mobileNumber: '+60 16-892 3341',
    emergencyContact: {
      name: 'Grace Tan',
      relationship: 'Sister',
      phone: '+60 16-892 3342',
    },
  },
];

export const INITIAL_EPISODES: EmploymentEpisode[] = [
  {
    id: 'ep-001',
    personId: 'p-001',
    employeeNumber: 'BTS-001',
    startDate: '2022-03-01',
    employmentType: 'Full-Time',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    reportingManagerId: 'sig-001',
    workLocationId: 'loc-sarawak',
    currentJurisdiction: 'Sarawak',
    confirmationDate: '2022-09-01',
    basicSalaryRM: 6800,
    fixedAllowancesRM: 500,
    payFrequency: 'Monthly',
    overtimeEligible: false,
    noticePeriodDays: 60,
    companyPolicyVersion: 'v2025.1',
    employmentStatus: 'Confirmed',
    relatedDocumentIds: ['doc-001'],
    relatedCaseIds: [],
  },
  {
    id: 'ep-002',
    personId: 'p-002',
    employeeNumber: 'BTS-002',
    startDate: '2024-01-15',
    employmentType: 'Full-Time',
    jobTitle: 'Marketing Executive',
    department: 'Marketing',
    reportingManagerId: 'sig-002',
    workLocationId: 'loc-kl',
    currentJurisdiction: 'Peninsular Malaysia',
    confirmationDate: '2024-07-15',
    basicSalaryRM: 4200,
    fixedAllowancesRM: 300,
    payFrequency: 'Monthly',
    overtimeEligible: true,
    noticePeriodDays: 30,
    companyPolicyVersion: 'v2025.1',
    employmentStatus: 'Confirmed',
    relatedDocumentIds: ['doc-002'],
    relatedCaseIds: ['case-001'],
  },
  {
    id: 'ep-003',
    personId: 'p-003',
    employeeNumber: 'BTS-003',
    startDate: '2026-05-01',
    employmentType: 'Probation',
    jobTitle: 'UI/UX Designer',
    department: 'Design',
    reportingManagerId: 'sig-002',
    workLocationId: 'loc-sarawak',
    currentJurisdiction: 'Sarawak',
    probationStartDate: '2026-05-01',
    probationEndDate: '2026-11-01',
    basicSalaryRM: 3500,
    fixedAllowancesRM: 200,
    payFrequency: 'Monthly',
    overtimeEligible: true,
    noticePeriodDays: 14,
    companyPolicyVersion: 'v2026.1',
    employmentStatus: 'Probation',
    relatedDocumentIds: ['doc-003'],
    relatedCaseIds: [],
  },
];

export const INITIAL_DOCUMENTS: HRDocument[] = [
  {
    id: 'doc-001',
    systemDocumentId: 'DOC-2026-A198X',
    companyRefNumber: 'BTS/HR/APPT/2022/001',
    templateId: 'tpl-appointment',
    templateFamily: 'Letter of Appointment',
    templateTitle: 'Standard Letter of Appointment',
    employeeEpisodeId: 'ep-001',
    employeeName: 'Ahmad Razak bin Mohamad',
    employeeNRICMasked: '880412-13-****',
    jurisdiction: 'Sarawak',
    jurisdictionOverridden: false,
    status: 'Issued',
    version: '1.0',
    createdDate: '2022-02-20',
    updatedDate: '2022-02-25',
    effectiveDate: '2022-03-01',
    signatoryId: 'sig-001',
    signatoryName: 'Datuk Abang Zulkarnain bin Haji Wan',
    fieldValues: {
      employeeName: 'Ahmad Razak bin Mohamad',
      jobTitle: 'Senior Software Engineer',
      department: 'Engineering',
      basicSalaryRM: 6800,
      fixedAllowancesRM: 500,
      startDate: '2022-03-01',
      noticePeriodWeeks: 8,
      yearsOfService: 4,
    },
    clauses: INITIAL_TEMPLATES[0].clauses,
    verificationCode: 'BTS-VER-880412',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    approvalHistory: [
      {
        step: 'Preparation',
        actor: 'Jessica Lim (HR Admin)',
        role: 'HRAdmin',
        action: 'Prepared',
        timestamp: '2022-02-20T10:00:00Z',
      },
      {
        step: 'Approval & Issuance',
        actor: 'Datuk Abang Zulkarnain (Company Owner)',
        role: 'CompanyOwner',
        action: 'Approved',
        timestamp: '2022-02-22T14:30:00Z',
      },
    ],
    deliveryInfo: {
      channel: 'Email',
      sentDate: '2022-02-22T15:00:00Z',
      secureUrl: 'https://borneotech.com.my/verify?doc=DOC-2026-A198X',
      deliveredDate: '2022-02-22T15:02:00Z',
      viewedDate: '2022-02-22T16:10:00Z',
      responseStatus: 'Accepted',
      responseDate: '2022-02-23T09:15:00Z',
    },
  },
  {
    id: 'doc-002',
    systemDocumentId: 'DOC-2026-B442Z',
    companyRefNumber: 'BTS/HR/SC/2026/001',
    templateId: 'tpl-showcause',
    templateFamily: 'Show Cause Letter',
    templateTitle: 'Show Cause Letter (Disciplinary Misconduct)',
    employeeEpisodeId: 'ep-002',
    employeeName: 'Sylvia Wong Mei Ling',
    employeeNRICMasked: '930825-14-****',
    jurisdiction: 'Peninsular Malaysia',
    jurisdictionOverridden: false,
    status: 'Delivered',
    version: '1.0',
    createdDate: '2026-07-18',
    updatedDate: '2026-07-19',
    effectiveDate: '2026-07-19',
    signatoryId: 'sig-002',
    signatoryName: 'Jessica Lim Swee Chen',
    fieldValues: {
      employeeName: 'Sylvia Wong Mei Ling',
      incidentDate: '2026-07-15',
      incidentTime: '09:30 AM',
      incidentLocation: 'KL Regional Office / Digital Assets Drive',
      detailedFacts: 'Unauthorized copying and distribution of internal marketing launch assets to an unverified external third party prior to official embargo date.',
      replyDays: 5,
      replyDeadlineDate: '2026-07-25',
    },
    clauses: INITIAL_TEMPLATES[7].clauses,
    verificationCode: 'BTS-VER-930825',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    approvalHistory: [
      {
        step: 'Preparation',
        actor: 'Jessica Lim (HR Admin)',
        role: 'HRAdmin',
        action: 'Prepared',
        timestamp: '2026-07-18T11:00:00Z',
      },
      {
        step: 'Approval & Issuance',
        actor: 'Datuk Abang Zulkarnain (Company Owner)',
        role: 'CompanyOwner',
        action: 'Approved',
        timestamp: '2026-07-19T09:00:00Z',
      },
    ],
    deliveryInfo: {
      channel: 'System Link',
      sentDate: '2026-07-19T09:30:00Z',
      secureUrl: 'https://borneotech.com.my/verify?doc=DOC-2026-B442Z',
      deliveredDate: '2026-07-19T09:31:00Z',
      viewedDate: '2026-07-19T10:00:00Z',
      responseStatus: 'No Response',
    },
  },
];

export const INITIAL_CASES: DisciplinaryCase[] = [
  {
    id: 'case-001',
    caseNumber: 'DISC-2026-001',
    employeeEpisodeId: 'ep-002',
    employeeName: 'Sylvia Wong Mei Ling',
    department: 'Marketing',
    incidentDate: '2026-07-15',
    incidentTime: '09:30 AM',
    location: 'KL Regional Office / Digital Drive',
    allegationsSummary: 'Unauthorized release of embargoed campaign materials to external party.',
    detailedFacts: 'On 15 July 2026 at 9:30 AM, digital access logs recorded an unauthorized export of 12 confidential campaign graphic assets from the company Google Drive to a personal email address. The assets were later published on an external blog.',
    policyReferenced: 'Company Information Security & Confidentiality Policy Sec 4.2',
    previousWarningsCount: 0,
    stage: 'Awaiting Employee Reply',
    replyDeadline: '2026-07-25',
    assignedManager: 'Jessica Lim Swee Chen',
    showCauseDocumentId: 'doc-002',
    messagesThread: [
      {
        id: 'msg-01',
        sender: 'HR',
        senderName: 'Jessica Lim (HR)',
        timestamp: '2026-07-19T09:30:00Z',
        text: 'Show Cause Letter issued regarding unauthorized folder access on 15 July 2026. Please submit written explanation before 25 July 2026, 5:00 PM.',
      },
    ],
  },
];

export const INITIAL_AUDIT: AuditEvent[] = [
  {
    id: 'aud-001',
    type: 'Business',
    action: 'Document Issued',
    actor: 'Datuk Abang Zulkarnain',
    role: 'CompanyOwner',
    targetResource: 'Show Cause Letter (Sylvia Wong)',
    resourceId: 'doc-002',
    timestamp: '2026-07-19T09:00:00Z',
    ipAddress: '202.186.42.10',
    details: 'Approved and issued Show Cause Letter BTS/HR/SC/2026/001. Compliance check completed.',
    mfaVerified: true,
  },
  {
    id: 'aud-002',
    type: 'Security',
    action: 'Company Profile Verified',
    actor: 'BBH Verification Admin',
    role: 'CompanyOwner',
    targetResource: 'Borneo Tech Solutions Sdn. Bhd.',
    resourceId: 'c-001',
    timestamp: '2026-01-15T11:20:00Z',
    ipAddress: '175.139.112.5',
    details: 'SSM Form 9 matched. Verified status set to "Company Details Verified".',
    mfaVerified: true,
  },
];

export const INITIAL_SUBSCRIPTION: SubscriptionInfo = {
  plan: 'Business',
  status: 'Active',
  courseClaimCode: 'BBH-LAW-2026-8921',
  activatedDate: '2026-01-01',
  expiryDate: '2027-01-01',
  maxActiveEmployees: 100,
  currentActiveEmployees: 3,
  companyCount: 1,
};

// Helper function to read/write from localStorage
export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed saving to localStorage', e);
  }
}
