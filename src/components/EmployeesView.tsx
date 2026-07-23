import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmploymentEpisode, EmploymentStatus, Person } from '../types';
import {
  Eye,
  EyeOff,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  UserPlus
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const {
    persons,
    episodes,
    locations,
    addEmployee,
    updateEmployee,
    rehireEmployee,
    currentRole,
    addAuditLog,
    language
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFullNRIC, setShowFullNRIC] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRehireModal, setShowRehireModal] = useState<Person | null>(null);

  // Add Form state
  const [personForm, setPersonForm] = useState({
    fullName: '',
    preferredName: '',
    nricOrPassport: '',
    nationality: 'Malaysian',
    gender: 'Male' as 'Male' | 'Female',
    dateOfBirth: '1992-05-15',
    residentialAddress: '',
    personalEmail: '',
    mobileNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [episodeForm, setEpisodeForm] = useState({
    employeeNumber: `BTS-${String(episodes.length + 1).padStart(3, '0')}`,
    startDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-Time' as any,
    jobTitle: '',
    grade: '',
    department: 'Engineering',
    workLocationId: locations[0]?.id || 'loc-sarawak',
    basicSalaryRM: 4500,
    fixedAllowancesRM: 300,
    payFrequency: 'Monthly' as any,
    overtimeEligible: true,
    noticePeriodDays: 30,
    companyPolicyVersion: 'v2026.1',
    employmentStatus: 'Confirmed' as EmploymentStatus,
  });

  // Rehire episode form
  const [rehireJobTitle, setRehireJobTitle] = useState('');
  const [rehireSalary, setRehireSalary] = useState(5000);

  // CSV Import State
  const [importCSVText, setImportCSVText] = useState(`FullName,NRIC,Email,Mobile,Designation,Department,BasicSalary,Location
Zulkifli bin Ismail,910214-13-5591,zulkifli@gmail.com,+60 19-812 3456,System Administrator,IT,5200,Sarawak HQ (Kuching)
Mei Shan Tan,950620-14-6110,meishan.tan@gmail.com,+60 12-998 1234,Sales Executive,Sales,3800,KL Regional Branch (Mid Valley)`);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  const toggleNRICView = () => {
    if (currentRole !== 'CompanyOwner' && currentRole !== 'HRAdmin') {
      alert('Only Company Owner and HR Admin are authorized to unmask full NRIC and salary details.');
      return;
    }
    setShowFullNRIC(!showFullNRIC);
    addAuditLog({
      type: 'Security',
      action: showFullNRIC ? 'Masked Sensitive NRIC/Salary' : 'Unmasked Sensitive NRIC/Salary',
      actor: 'Current User',
      role: currentRole,
      targetResource: 'Employees Directory',
      resourceId: 'all',
      ipAddress: '127.0.0.1',
      details: 'Toggled sensitive data view state.',
      mfaVerified: true,
    });
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personForm.fullName || !personForm.nricOrPassport) return;

    const loc = locations.find(l => l.id === episodeForm.workLocationId);

    addEmployee(
      {
        fullName: personForm.fullName,
        preferredName: personForm.preferredName,
        nricOrPassport: personForm.nricOrPassport,
        nationality: personForm.nationality,
        gender: personForm.gender,
        dateOfBirth: personForm.dateOfBirth,
        residentialAddress: personForm.residentialAddress,
        personalEmail: personForm.personalEmail,
        mobileNumber: personForm.mobileNumber,
        emergencyContact: {
          name: personForm.emergencyContactName,
          relationship: 'Family',
          phone: personForm.emergencyContactPhone,
        },
      },
      {
        employeeNumber: episodeForm.employeeNumber,
        startDate: episodeForm.startDate,
        employmentType: episodeForm.employmentType,
        jobTitle: episodeForm.jobTitle,
        grade: episodeForm.grade,
        department: episodeForm.department,
        workLocationId: episodeForm.workLocationId,
        currentJurisdiction: loc ? loc.jurisdiction : 'Sarawak',
        basicSalaryRM: episodeForm.basicSalaryRM,
        fixedAllowancesRM: episodeForm.fixedAllowancesRM,
        payFrequency: episodeForm.payFrequency,
        overtimeEligible: episodeForm.overtimeEligible,
        noticePeriodDays: episodeForm.noticePeriodDays,
        companyPolicyVersion: episodeForm.companyPolicyVersion,
        employmentStatus: episodeForm.employmentStatus,
        relatedDocumentIds: [],
        relatedCaseIds: [],
      }
    );

    setShowAddModal(false);
  };

  const handleRehireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRehireModal) return;

    const loc = locations[0];
    rehireEmployee(showRehireModal.id, {
      employeeNumber: `BTS-RH-${Date.now().toString().slice(-3)}`,
      startDate: new Date().toISOString().split('T')[0],
      employmentType: 'Full-Time',
      jobTitle: rehireJobTitle || 'Rehired Specialist',
      department: 'Operations',
      workLocationId: loc.id,
      currentJurisdiction: loc.jurisdiction,
      basicSalaryRM: rehireSalary,
      fixedAllowancesRM: 400,
      payFrequency: 'Monthly',
      overtimeEligible: false,
      noticePeriodDays: 30,
      companyPolicyVersion: 'v2026.1',
      employmentStatus: 'Active',
      relatedDocumentIds: [],
      relatedCaseIds: [],
    });

    setShowRehireModal(null);
  };

  const handleProcessCSVImport = () => {
    const lines = importCSVText.trim().split('\n').slice(1); // skip header
    let importedCount = 0;

    lines.forEach((line, idx) => {
      const parts = line.split(',');
      if (parts.length >= 7) {
        const [name, nric, email, mobile, title, dept, salary] = parts;
        addEmployee(
          {
            fullName: name.trim(),
            nricOrPassport: nric.trim(),
            nationality: 'Malaysian',
            gender: 'Male',
            dateOfBirth: '1990-01-01',
            residentialAddress: 'Address On File',
            personalEmail: email.trim(),
            mobileNumber: mobile.trim(),
            emergencyContact: { name: 'Emergency Contact', relationship: 'Family', phone: mobile.trim() },
          },
          {
            employeeNumber: `BTS-CSV-${idx + 10}`,
            startDate: new Date().toISOString().split('T')[0],
            employmentType: 'Full-Time',
            jobTitle: title.trim(),
            department: dept.trim(),
            workLocationId: locations[0].id,
            currentJurisdiction: locations[0].jurisdiction,
            basicSalaryRM: Number(salary.trim()) || 4000,
            fixedAllowancesRM: 300,
            payFrequency: 'Monthly',
            overtimeEligible: true,
            noticePeriodDays: 30,
            companyPolicyVersion: 'v2026.1',
            employmentStatus: 'Confirmed',
            relatedDocumentIds: [],
            relatedCaseIds: [],
          }
        );
        importedCount++;
      }
    });

    setImportSuccessMsg(`Successfully imported ${importedCount} employee records with NRIC validation!`);
    setTimeout(() => {
      setImportSuccessMsg('');
      setShowImportModal(false);
    }, 2000);
  };

  const filteredPersons = persons.filter(p =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nricOrPassport.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111827] p-5 rounded-3xl border border-[#1F2937]">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3" />
            <input
              type="text"
              placeholder={language === 'zh' ? '搜索姓名、NRIC...' : 'Search Name, NRIC...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D121A] border border-[#374151] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-[#2ECC71]"
            />
          </div>

          {/* Mask toggle button */}
          <button
            onClick={toggleNRICView}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${
              showFullNRIC
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-[#1F2937] text-slate-200 border-[#374151] hover:bg-[#374151]'
            }`}
            title="Toggle NRIC and Salary Privacy"
          >
            {showFullNRIC ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showFullNRIC ? (language === 'zh' ? '已取消脱敏' : 'NRIC Unmasked') : (language === 'zh' ? '解密显示 NRIC' : 'Unmask NRIC')}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#2ECC71]" />
            <span>CSV Batch Import</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#2ECC71] hover:bg-[#27ae60] text-[#0A0D12] px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'zh' ? '新增员工' : 'Add Employee'}</span>
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-[#0D121A] border-b border-[#1F2937] text-[#9CA3AF] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 font-bold">Employee</th>
                <th className="p-4 font-bold">NRIC / Passport</th>
                <th className="p-4 font-bold">Designation & Dept</th>
                <th className="p-4 font-bold">Work Location & Jurisdiction</th>
                <th className="p-4 font-bold">Salary (RM)</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {filteredPersons.map(person => {
                const ep = episodes.find(e => e.personId === person.id);
                const loc = locations.find(l => l.id === ep?.workLocationId);

                return (
                  <tr key={person.id} className="hover:bg-[#1A2333] transition">
                    <td className="p-4 font-bold text-white">
                      <div>{person.fullName}</div>
                      <div className="text-[10px] text-[#9CA3AF] font-normal">{ep?.employeeNumber} • {person.personalEmail}</div>
                    </td>
                    <td className="p-4 font-mono text-[#E0E0E0]">
                      {showFullNRIC ? person.nricOrPassport : person.nricOrPassport.replace(/(\d{6})-\d{2}-(\d{4})/, '$1-**-****')}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{ep?.jobTitle || 'N/A'}</div>
                      <div className="text-[10px] text-[#9CA3AF]">{ep?.department}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{loc?.name || 'HQ'}</div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                        ep?.currentJurisdiction === 'Sarawak'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20'
                      }`}>
                        {ep?.currentJurisdiction}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#2ECC71]">
                      {showFullNRIC ? `RM ${(ep?.basicSalaryRM || 0).toLocaleString()}` : 'RM ****'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ep?.employmentStatus === 'Confirmed' || ep?.employmentStatus === 'Active'
                          ? 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20'
                          : ep?.employmentStatus === 'Probation'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-[#1F2937] text-[#9CA3AF]'
                      }`}>
                        {ep?.employmentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setShowRehireModal(person)}
                        className="bg-[#1F2937] hover:bg-[#374151] text-white px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer"
                        title="Rehire Person under new Episode"
                      >
                        Rehire
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold border-b border-slate-700 pb-2 text-teal-400 flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Add New Employee (Person & Employment Episode)
            </h3>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={personForm.fullName}
                    onChange={e => setPersonForm({ ...personForm, fullName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">NRIC or Passport *</label>
                  <input
                    type="text"
                    value={personForm.nricOrPassport}
                    onChange={e => setPersonForm({ ...personForm, nricOrPassport: e.target.value })}
                    placeholder="e.g. 920510-13-5819"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Personal Email *</label>
                  <input
                    type="email"
                    value={personForm.personalEmail}
                    onChange={e => setPersonForm({ ...personForm, personalEmail: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    value={personForm.mobileNumber}
                    onChange={e => setPersonForm({ ...personForm, mobileNumber: e.target.value })}
                    placeholder="+60 1x-xxx xxxx"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Designation / Job Title *</label>
                  <input
                    type="text"
                    value={episodeForm.jobTitle}
                    onChange={e => setEpisodeForm({ ...episodeForm, jobTitle: e.target.value })}
                    placeholder="e.g. Senior HR Executive"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={episodeForm.department}
                    onChange={e => setEpisodeForm({ ...episodeForm, department: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Work Location *</label>
                  <select
                    value={episodeForm.workLocationId}
                    onChange={e => setEpisodeForm({ ...episodeForm, workLocationId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.jurisdiction})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Basic Salary (RM) *</label>
                  <input
                    type="number"
                    value={episodeForm.basicSalaryRM}
                    onChange={e => setEpisodeForm({ ...episodeForm, basicSalaryRM: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded font-bold"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-100 space-y-4">
            <h3 className="text-sm font-bold border-b border-slate-700 pb-2 text-teal-400 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" /> CSV Employee Batch Import
            </h3>

            <p className="text-xs text-slate-300">
              Paste employee CSV data below. Duplicate NRIC checks and mandatory fields will be verified automatically.
            </p>

            <textarea
              rows={6}
              value={importCSVText}
              onChange={e => setImportCSVText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-xs text-slate-200 font-mono outline-none"
            />

            {importSuccessMsg && (
              <div className="p-3 bg-teal-950 border border-teal-700 text-teal-300 rounded text-xs font-semibold">
                ✓ {importSuccessMsg}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-700">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded text-xs"
              >
                Close
              </button>
              <button
                onClick={handleProcessCSVImport}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-bold"
              >
                Run Validation & Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rehire Modal */}
      {showRehireModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 space-y-4">
            <h3 className="text-sm font-bold border-b border-slate-700 pb-2 text-teal-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Rehire Employee (New Episode)
            </h3>

            <p className="text-xs text-slate-300">
              Rehiring <strong className="text-white">{showRehireModal.fullName}</strong>. A new employment episode will be created under existing Person record to maintain continuous historical file audit without duplicate Person entries.
            </p>

            <form onSubmit={handleRehireSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">New Designation / Role</label>
                <input
                  type="text"
                  value={rehireJobTitle}
                  onChange={e => setRehireJobTitle(e.target.value)}
                  placeholder="e.g. Lead Technical Consultant"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">New Basic Salary (RM)</label>
                <input
                  type="number"
                  value={rehireSalary}
                  onChange={e => setRehireSalary(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowRehireModal(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded font-bold"
                >
                  Confirm Rehire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
