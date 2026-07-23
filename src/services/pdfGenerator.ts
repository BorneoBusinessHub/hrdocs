import { CompanyProfile, HRDocument, Signatory, WorkLocation } from '../types';

export function renderDocumentHTML(
  doc: HRDocument,
  company: CompanyProfile,
  location?: WorkLocation,
  signatory?: Signatory,
  isWorkingCopy: boolean = false
): string {
  const isDraft = doc.status === 'Draft' || doc.status === 'Compliance Check Required' || doc.status === 'Pending Approval';
  
  const formattedClauses = (doc.clauses || []).map((c, i) => `
    <div style="margin-bottom: 16px; page-break-inside: avoid;">
      <h4 style="font-size: 14px; font-weight: bold; color: #111827; margin-bottom: 6px;">${c.title}</h4>
      <div style="font-size: 13px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${c.content}</div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${doc.templateTitle} - ${doc.companyRefNumber}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: 'Times New Roman', Times, serif, sans-serif;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            box-sizing: border-box;
          }
          .header-box {
            border-bottom: 2px solid ${company.letterheadConfig.primaryColor || '#0f766e'};
            padding-bottom: 12px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .company-name {
            font-size: 20px;
            font-weight: bold;
            color: ${company.letterheadConfig.primaryColor || '#0f766e'};
            margin: 0;
          }
          .company-sub {
            font-size: 11px;
            color: #4b5563;
            margin-top: 4px;
          }
          .doc-title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 20px 0 16px 0;
            letter-spacing: 0.5px;
            text-decoration: underline;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 12px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 24px;
          }
          .watermark {
            position: fixed;
            top: 40%;
            left: 15%;
            transform: rotate(-35deg);
            font-size: 42px;
            font-weight: bold;
            color: rgba(220, 38, 38, 0.12);
            border: 5px dashed rgba(220, 38, 38, 0.2);
            padding: 16px 32px;
            text-align: center;
            pointer-events: none;
            z-index: 1000;
          }
          .signature-box {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .sig-col {
            width: 45%;
            font-size: 12px;
          }
          .sig-line {
            border-bottom: 1px solid #111827;
            height: 60px;
            margin-bottom: 8px;
          }
          .footer-bar {
            margin-top: 40px;
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
            font-size: 10px;
            color: #6b7280;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        </style>
      </head>
      <body>
        ${isWorkingCopy ? '<div class="watermark">EDITABLE WORKING COPY<br/><span style="font-size:20px;">NOT OFFICIAL ISSUED PDF</span></div>' : ''}
        ${isDraft ? '<div class="watermark">DRAFT — NOT ISSUED</div>' : ''}

        <div class="header-box">
          <div>
            <h1 class="company-name">${company.legalName}</h1>
            <div class="company-sub">SSM: ${company.ssmRegistrationNumber} | ${location?.address || company.registeredAddress}</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #4b5563;">
            <div><strong>Ref:</strong> ${doc.companyRefNumber}</div>
            <div><strong>Sys ID:</strong> ${doc.systemDocumentId}</div>
            <div><strong>Date:</strong> ${doc.effectiveDate || doc.createdDate}</div>
          </div>
        </div>

        <div class="doc-title">${doc.templateTitle}</div>

        <div class="meta-grid">
          <div><strong>Employee Name:</strong> ${doc.fieldValues.employeeName || doc.employeeName}</div>
          <div><strong>NRIC / Passport:</strong> ${doc.fieldValues.nric || doc.employeeNRICMasked}</div>
          <div><strong>Job Title:</strong> ${doc.fieldValues.jobTitle || 'N/A'}</div>
          <div><strong>Jurisdiction:</strong> ${doc.jurisdiction} ${doc.jurisdictionOverridden ? '(Manually Overridden)' : ''}</div>
          <div><strong>Work Location:</strong> ${location?.name || 'HQ'}</div>
          <div><strong>Status:</strong> ${doc.status}</div>
        </div>

        <div class="clauses-container">
          ${formattedClauses}
        </div>

        <div class="signature-box">
          <div class="sig-col">
            <p><strong>For and on behalf of</strong><br/>${company.legalName}</p>
            <div class="sig-line"></div>
            <p><strong>${signatory?.name || doc.signatoryName}</strong><br/>${signatory?.title || 'Authorized Signatory'}</p>
            <p>Date: ________________________</p>
          </div>

          <div class="sig-col">
            <p><strong>Employee Acceptance</strong><br/>I confirm I have read, understood & accepted these terms.</p>
            <div class="sig-line"></div>
            <p><strong>${doc.fieldValues.employeeName || doc.employeeName}</strong><br/>Employee Signature</p>
            <p>Date: ________________________</p>
          </div>
        </div>

        <div class="footer-bar">
          <div>
            Verification Code: <strong>${doc.verificationCode}</strong> | Hash: ${doc.hash ? doc.hash.substring(0, 16) + '...' : 'SECURE-PDF'}
          </div>
          <div>
            Page 1 of 1 | ${company.letterheadConfig.footerText}
          </div>
        </div>
      </body>
    </html>
  `;
}
