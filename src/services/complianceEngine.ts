import { ComplianceFinding, ComplianceReport, HRDocument, Jurisdiction } from '../types';

export function runComplianceCheck(doc: HRDocument, selectedJurisdiction: Jurisdiction, recommendedJurisdiction: Jurisdiction): ComplianceReport {
  const findings: ComplianceFinding[] = [];
  const fields = doc.fieldValues || {};

  // 1. Check System Integrity Errors (Hard blocks)
  if (!fields.employeeName || fields.employeeName.trim() === '') {
    findings.push({
      id: 'f-integ-1',
      category: 'System Integrity Error',
      severity: 'Red',
      ruleId: 'RULE-INT-001',
      messageEn: 'Employee name is required before issuing document.',
      messageZh: '正式签发文件前，员工姓名不能为空。',
      canOverride: false,
      suggestedAction: 'Fill in employee full name in form.'
    });
  }

  if (!fields.signatoryName || fields.signatoryName.trim() === '') {
    findings.push({
      id: 'f-integ-2',
      category: 'System Integrity Error',
      severity: 'Red',
      ruleId: 'RULE-INT-002',
      messageEn: 'Authorized Company Signatory must be selected.',
      messageZh: '必须选择经授权的公司签署人。',
      canOverride: false,
      suggestedAction: 'Select a company signatory.'
    });
  }

  // 2. Check Jurisdiction Mismatch
  const isOverridden = selectedJurisdiction !== recommendedJurisdiction;
  if (isOverridden) {
    findings.push({
      id: 'f-juris-1',
      category: 'Jurisdiction Override',
      severity: 'Amber',
      ruleId: 'RULE-JUR-001',
      messageEn: `Document jurisdiction (${selectedJurisdiction}) differs from employee primary work location (${recommendedJurisdiction}). Written justification from Approver is required.`,
      messageZh: `文件法律辖区 (${selectedJurisdiction}) 与员工主要工作地点辖区 (${recommendedJurisdiction}) 不一致。必须由 Approver/Owner 填写书面覆盖理由。`,
      canOverride: true,
      suggestedAction: 'Provide written jurisdiction override reason or align with employee work location.'
    });
  }

  // 3. Statutory Checks: Salary & Notice Periods
  if (doc.templateFamily === 'Contract of Service' || doc.templateFamily === 'Letter of Appointment') {
    const basicSalary = Number(fields.basicSalaryRM || 0);
    const noticeWeeks = Number(fields.noticePeriodWeeks || 0);
    const yearsOfService = Number(fields.yearsOfService || 0);

    // Notice period statutory baseline check
    // Peninsular EA 1955 Section 12 / Sarawak Labour Ordinance
    let minNoticeWeeks = 4;
    if (yearsOfService >= 5) {
      minNoticeWeeks = 8;
    } else if (yearsOfService >= 2) {
      minNoticeWeeks = 6;
    }

    if (noticeWeeks < minNoticeWeeks) {
      findings.push({
        id: 'f-stat-notice',
        category: 'Statutory Conflict',
        severity: 'Red',
        ruleId: 'RULE-STAT-001',
        messageEn: `Proposed notice period of ${noticeWeeks} weeks is below the statutory legal baseline of ${minNoticeWeeks} weeks for ${yearsOfService} years of service under ${selectedJurisdiction}.`,
        messageZh: `拟议通知期 (${noticeWeeks} 周) 低于 ${selectedJurisdiction} 法定最低标准 (${minNoticeWeeks} 周，服务年限 ${yearsOfService} 年)。`,
        legalReference: selectedJurisdiction === 'Sarawak' ? 'Sarawak Labour Ordinance Cap. 76 Sec 13' : 'Employment Act 1955 Sec 12(2)',
        canOverride: true,
        suggestedAction: `Adjust notice period to at least ${minNoticeWeeks} weeks.`
      });
    }

    // Working hours per week check
    const weeklyHours = Number(fields.weeklyHours || 45);
    const maxWeeklyHours = selectedJurisdiction === 'Sarawak' ? 48 : 45; // 2022 amendment capped Peninsular EA at 45 hrs
    if (weeklyHours > maxWeeklyHours) {
      findings.push({
        id: 'f-stat-hours',
        category: 'Statutory Conflict',
        severity: 'Red',
        ruleId: 'RULE-STAT-002',
        messageEn: `Weekly working hours (${weeklyHours} hrs) exceed the statutory maximum of ${maxWeeklyHours} hours/week under ${selectedJurisdiction} labor law.`,
        messageZh: `每周工时 (${weeklyHours} 小时) 超过 ${selectedJurisdiction} 法定最高限制 (${maxWeeklyHours} 小时/周)。`,
        legalReference: selectedJurisdiction === 'Sarawak' ? 'Sarawak Labour Ordinance Sec 105' : 'Employment Act 1955 Sec 60A(1)(d)',
        canOverride: true,
        suggestedAction: `Reduce standard weekly hours to ${maxWeeklyHours} hours or configure overtime compensation.`
      });
    }
  }

  // 4. Process Risk for Show Cause & Warnings
  if (doc.templateFamily === 'Show Cause Letter') {
    const replyDays = Number(fields.replyDays || 0);
    if (replyDays < 3) {
      findings.push({
        id: 'f-proc-sc',
        category: 'Process Risk',
        severity: 'Amber',
        ruleId: 'RULE-PROC-001',
        messageEn: `Reply deadline given is only ${replyDays} days. Giving less than 3-5 working days may breach principles of natural justice at Industrial Court.`,
        messageZh: `要求回复期限仅 ${replyDays} 天。根据工业法庭自然公正原则，给予少于 3-5 个工作日答辩可能存在程序风险。`,
        legalReference: 'Industrial Court Natural Justice Principles',
        canOverride: true,
        suggestedAction: 'Set reply deadline to at least 3-5 working days.'
      });
    }

    if (!fields.detailedFacts || fields.detailedFacts.trim().length < 30) {
      findings.push({
        id: 'f-proc-vague',
        category: 'Process Risk',
        severity: 'Amber',
        ruleId: 'RULE-PROC-002',
        messageEn: 'Allegation description is short or vague. Specific dates, times, places, and facts should be detailed.',
        messageZh: '指控陈述过于简短或模糊。应详细载明具体日期、时间、地点及具体事实。',
        canOverride: true,
        suggestedAction: 'Elaborate on specific facts, incident dates, and violated company policies.'
      });
    }
  }

  const hasRed = findings.some(f => f.severity === 'Red');
  
  return {
    timestamp: new Date().toISOString(),
    passed: !hasRed,
    findings,
    jurisdictionUsed: selectedJurisdiction,
    recommendedJurisdiction,
    overridden: isOverridden,
    overrideReason: doc.overrideReason,
  };
}
