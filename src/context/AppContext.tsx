import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AuditEvent,
  CompanyProfile,
  DisciplinaryCase,
  EmploymentEpisode,
  HRDocument,
  Jurisdiction,
  Language,
  Person,
  Signatory,
  SubscriptionInfo,
  UserRole,
  WorkLocation
} from '../types';
import {
  getStoredData,
  INITIAL_AUDIT,
  INITIAL_CASES,
  INITIAL_COMPANY,
  INITIAL_DOCUMENTS,
  INITIAL_EPISODES,
  INITIAL_LOCATIONS,
  INITIAL_PERSONS,
  INITIAL_SIGNATORIES,
  INITIAL_SUBSCRIPTION,
  setStoredData
} from '../services/storage';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  company: CompanyProfile;
  updateCompany: (profile: Partial<CompanyProfile>) => void;
  
  locations: WorkLocation[];
  addLocation: (loc: Omit<WorkLocation, 'id'>) => void;
  
  signatories: Signatory[];
  addSignatory: (sig: Omit<Signatory, 'id'>) => void;
  
  persons: Person[];
  episodes: EmploymentEpisode[];
  addEmployee: (person: Omit<Person, 'id'>, episode: Omit<EmploymentEpisode, 'id' | 'personId'>) => void;
  updateEmployee: (personId: string, personData: Partial<Person>, episodeId: string, episodeData: Partial<EmploymentEpisode>) => void;
  rehireEmployee: (personId: string, episode: Omit<EmploymentEpisode, 'id' | 'personId'>) => void;
  
  documents: HRDocument[];
  saveDocument: (doc: HRDocument) => void;
  issueDocument: (docId: string) => void;
  
  cases: DisciplinaryCase[];
  saveCase: (c: DisciplinaryCase) => void;
  addCaseMessage: (caseId: string, text: string, sender: 'HR' | 'Employee' | 'Manager', senderName: string) => void;
  
  auditLogs: AuditEvent[];
  addAuditLog: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  
  subscription: SubscriptionInfo;
  claimCourseEntitlement: (code: string) => boolean;
  
  legalHoldActive: boolean;
  setLegalHoldActive: (active: boolean) => void;
  
  notifications: { id: string; title: string; message: string; date: string; unread: boolean }[];
  markNotificationRead: (id: string) => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('CompanyOwner');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [company, setCompany] = useState<CompanyProfile>(() => getStoredData('bbh_company', INITIAL_COMPANY));
  const [locations, setLocations] = useState<WorkLocation[]>(() => getStoredData('bbh_locations', INITIAL_LOCATIONS));
  const [signatories, setSignatories] = useState<Signatory[]>(() => getStoredData('bbh_signatories', INITIAL_SIGNATORIES));
  const [persons, setPersons] = useState<Person[]>(() => getStoredData('bbh_persons', INITIAL_PERSONS));
  const [episodes, setEpisodes] = useState<EmploymentEpisode[]>(() => getStoredData('bbh_episodes', INITIAL_EPISODES));
  const [documents, setDocuments] = useState<HRDocument[]>(() => getStoredData('bbh_documents', INITIAL_DOCUMENTS));
  const [cases, setCases] = useState<DisciplinaryCase[]>(() => getStoredData('bbh_cases', INITIAL_CASES));
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => getStoredData('bbh_audit', INITIAL_AUDIT));
  const [subscription, setSubscription] = useState<SubscriptionInfo>(() => getStoredData('bbh_subscription', INITIAL_SUBSCRIPTION));
  const [legalHoldActive, setLegalHoldActive] = useState<boolean>(false);

  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Show Cause Reply Pending',
      message: 'Sylvia Wong Mei Ling reply deadline is 25 July 2026.',
      date: '2026-07-22',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'Company Verification Status',
      message: 'Company Details Verified successfully by BBH Admin.',
      date: '2026-01-15',
      unread: false,
    },
  ]);

  useEffect(() => setStoredData('bbh_company', company), [company]);
  useEffect(() => setStoredData('bbh_locations', locations), [locations]);
  useEffect(() => setStoredData('bbh_signatories', signatories), [signatories]);
  useEffect(() => setStoredData('bbh_persons', persons), [persons]);
  useEffect(() => setStoredData('bbh_episodes', episodes), [episodes]);
  useEffect(() => setStoredData('bbh_documents', documents), [documents]);
  useEffect(() => setStoredData('bbh_cases', cases), [cases]);
  useEffect(() => setStoredData('bbh_audit', auditLogs), [auditLogs]);
  useEffect(() => setStoredData('bbh_subscription', subscription), [subscription]);

  // Actions
  const addAuditLog = (event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    const newLog: AuditEvent = {
      ...event,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateCompany = (profile: Partial<CompanyProfile>) => {
    setCompany(prev => ({ ...prev, ...profile }));
    addAuditLog({
      type: 'Business',
      action: 'Updated Company Profile',
      actor: 'Current User',
      role: currentRole,
      targetResource: company.legalName,
      resourceId: company.id,
      ipAddress: '127.0.0.1',
      details: 'Updated company address or profile details.',
      mfaVerified: true,
    });
  };

  const addLocation = (loc: Omit<WorkLocation, 'id'>) => {
    const newLoc: WorkLocation = { ...loc, id: `loc-${Date.now()}` };
    setLocations(prev => [...prev, newLoc]);
    addAuditLog({
      type: 'Business',
      action: 'Added Work Location',
      actor: 'Current User',
      role: currentRole,
      targetResource: loc.name,
      resourceId: newLoc.id,
      ipAddress: '127.0.0.1',
      details: `Added new work location in state ${loc.state} (${loc.jurisdiction}).`,
      mfaVerified: true,
    });
  };

  const addSignatory = (sig: Omit<Signatory, 'id'>) => {
    const newSig: Signatory = { ...sig, id: `sig-${Date.now()}` };
    setSignatories(prev => [...prev, newSig]);
  };

  const addEmployee = (personData: Omit<Person, 'id'>, episodeData: Omit<EmploymentEpisode, 'id' | 'personId'>) => {
    const personId = `p-${Date.now()}`;
    const episodeId = `ep-${Date.now()}`;
    
    const newPerson: Person = { ...personData, id: personId };
    const newEpisode: EmploymentEpisode = {
      ...episodeData,
      id: episodeId,
      personId,
      relatedDocumentIds: [],
      relatedCaseIds: [],
    };

    setPersons(prev => [...prev, newPerson]);
    setEpisodes(prev => [...prev, newEpisode]);

    // update active subscription headcount
    setSubscription(prev => ({
      ...prev,
      currentActiveEmployees: prev.currentActiveEmployees + 1,
    }));

    addAuditLog({
      type: 'Business',
      action: 'Created Employee Record',
      actor: 'Current User',
      role: currentRole,
      targetResource: personData.fullName,
      resourceId: personId,
      ipAddress: '127.0.0.1',
      details: `Added employee ${personData.fullName} (${episodeData.jobTitle}).`,
      mfaVerified: true,
    });
  };

  const updateEmployee = (personId: string, personData: Partial<Person>, episodeId: string, episodeData: Partial<EmploymentEpisode>) => {
    setPersons(prev => prev.map(p => p.id === personId ? { ...p, ...personData } : p));
    setEpisodes(prev => prev.map(e => e.id === episodeId ? { ...e, ...episodeData } : e));
    addAuditLog({
      type: 'Business',
      action: 'Updated Employee Record',
      actor: 'Current User',
      role: currentRole,
      targetResource: personData.fullName || 'Employee',
      resourceId: personId,
      ipAddress: '127.0.0.1',
      details: `Updated details for person ${personId}.`,
      mfaVerified: true,
    });
  };

  const rehireEmployee = (personId: string, episodeData: Omit<EmploymentEpisode, 'id' | 'personId'>) => {
    const episodeId = `ep-${Date.now()}`;
    const newEpisode: EmploymentEpisode = {
      ...episodeData,
      id: episodeId,
      personId,
      relatedDocumentIds: [],
      relatedCaseIds: [],
    };
    setEpisodes(prev => [...prev, newEpisode]);
    addAuditLog({
      type: 'Business',
      action: 'Rehired Employee (New Episode)',
      actor: 'Current User',
      role: currentRole,
      targetResource: personId,
      resourceId: episodeId,
      ipAddress: '127.0.0.1',
      details: `Created new employment episode for rehired employee ${personId}.`,
      mfaVerified: true,
    });
  };

  const saveDocument = (doc: HRDocument) => {
    setDocuments(prev => {
      const idx = prev.findIndex(d => d.id === doc.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = doc;
        return copy;
      }
      return [doc, ...prev];
    });

    addAuditLog({
      type: 'Business',
      action: `Saved Document (${doc.status})`,
      actor: 'Current User',
      role: currentRole,
      targetResource: `${doc.templateTitle} - ${doc.employeeName}`,
      resourceId: doc.id,
      ipAddress: '127.0.0.1',
      details: `Document ${doc.companyRefNumber} saved with status ${doc.status}.`,
      mfaVerified: true,
    });
  };

  const issueDocument = (docId: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'Issued',
          updatedDate: new Date().toISOString().split('T')[0],
          deliveryInfo: d.deliveryInfo || {
            channel: 'System Link',
            sentDate: new Date().toISOString(),
            secureUrl: `https://borneotech.com.my/verify?doc=${d.systemDocumentId}`,
            responseStatus: 'No Response',
          },
        };
      }
      return d;
    }));

    addAuditLog({
      type: 'Business',
      action: 'Issued Formal Document (Locked PDF)',
      actor: 'Current User',
      role: currentRole,
      targetResource: docId,
      resourceId: docId,
      ipAddress: '127.0.0.1',
      details: `Document ${docId} permanently locked and issued with secure QR code.`,
      mfaVerified: true,
    });
  };

  const saveCase = (c: DisciplinaryCase) => {
    setCases(prev => {
      const idx = prev.findIndex(item => item.id === c.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = c;
        return copy;
      }
      return [c, ...prev];
    });

    addAuditLog({
      type: 'Business',
      action: `Disciplinary Case Updated (${c.stage})`,
      actor: 'Current User',
      role: currentRole,
      targetResource: `${c.caseNumber} - ${c.employeeName}`,
      resourceId: c.id,
      ipAddress: '127.0.0.1',
      details: `Case ${c.caseNumber} moved to stage ${c.stage}.`,
      mfaVerified: true,
    });
  };

  const addCaseMessage = (caseId: string, text: string, sender: 'HR' | 'Employee' | 'Manager', senderName: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          messagesThread: [
            ...c.messagesThread,
            {
              id: `msg-${Date.now()}`,
              sender,
              senderName,
              timestamp: new Date().toISOString(),
              text,
            },
          ],
        };
      }
      return c;
    }));
  };

  const claimCourseEntitlement = (code: string): boolean => {
    if (code.trim().toUpperCase().startsWith('BBH-LAW')) {
      setSubscription(prev => ({
        ...prev,
        plan: 'Business',
        status: 'Active',
        courseClaimCode: code,
        activatedDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        maxActiveEmployees: 100,
      }));

      addAuditLog({
        type: 'Business',
        action: 'Claimed BBH Course Entitlement',
        actor: 'Current User',
        role: currentRole,
        targetResource: code,
        resourceId: 'sub-001',
        ipAddress: '127.0.0.1',
        details: `Successfully claimed 12-month Business SaaS access with course code ${code}.`,
        mfaVerified: true,
      });
      return true;
    }
    return false;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentRole,
        setCurrentRole,
        company,
        updateCompany,
        locations,
        addLocation,
        signatories,
        addSignatory,
        persons,
        episodes,
        addEmployee,
        updateEmployee,
        rehireEmployee,
        documents,
        saveDocument,
        issueDocument,
        cases,
        saveCase,
        addCaseMessage,
        auditLogs,
        addAuditLog,
        subscription,
        claimCourseEntitlement,
        legalHoldActive,
        setLegalHoldActive,
        notifications,
        markNotificationRead,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
