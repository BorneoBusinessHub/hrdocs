import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_TEMPLATES } from '../services/templatesData';
import { DocumentTemplate, RiskLevel } from '../types';
import { FileText, Info, ShieldCheck } from 'lucide-react';

export const TemplatesView: React.FC = () => {
  const { setActiveTab, language } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(INITIAL_TEMPLATES[0]);

  return (
    <div className="space-y-6">
      <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6">
        <div className="flex justify-between items-center pb-3 border-b border-[#1F2937]">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2ECC71]" />
              {language === 'zh' ? '12 大顶层 HR 模板家族与法律护照 (Template Legal Passport)' : '12 Master Template Families & Legal Passport'}
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              All master templates are drafted under Peninsular EA 1955 and Sarawak Labour Ordinance guidelines with risk classification passports.
            </p>
          </div>
        </div>

        {/* Templates Grid & Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          {/* List column */}
          <div className="lg:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {INITIAL_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-4 rounded-2xl border cursor-pointer transition text-xs space-y-1 ${
                  selectedTemplate.id === tpl.id
                    ? 'bg-[#0D121A] border-[#2ECC71] shadow-[0_0_15px_rgba(46,204,113,0.15)]'
                    : 'bg-[#0D121A]/60 border-[#1F2937] hover:bg-[#0D121A] hover:border-[#374151]'
                }`}
              >
                <div className="flex justify-between items-center font-bold text-white">
                  <span className="truncate">{tpl.title}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold shrink-0 ${
                    tpl.riskLevel === 'High'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : tpl.riskLevel === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20'
                  }`}>
                    {tpl.riskLevel} Risk
                  </span>
                </div>
                <div className="text-[11px] text-[#9CA3AF]">{tpl.family} • Code: {tpl.code}</div>
              </div>
            ))}
          </div>

          {/* Legal Passport & Clauses Column */}
          <div className="lg:col-span-7 bg-[#0D121A] border border-[#1F2937] rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-[#1F2937] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#2ECC71] uppercase tracking-wider block">{selectedTemplate.family}</span>
                <h3 className="text-base font-bold text-white">{selectedTemplate.title}</h3>
                <p className="text-[#9CA3AF] mt-1">{selectedTemplate.description}</p>
              </div>

              <button
                onClick={() => setActiveTab('generator')}
                className="bg-[#2ECC71] hover:bg-[#27ae60] text-[#0A0D12] font-black px-4 py-2.5 rounded-xl text-xs shrink-0 cursor-pointer transition"
              >
                Use Template →
              </button>
            </div>

            {/* Template Legal Passport Meta */}
            <div className="bg-[#111827] border border-[#374151] rounded-2xl p-4 space-y-2">
              <div className="font-bold text-[#2ECC71] flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4" /> Template Legal Passport
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="text-[#9CA3AF]">Approved Version:</span> <strong className="text-white">{selectedTemplate.version}</strong></div>
                <div><span className="text-[#9CA3AF]">Last Legal Review:</span> <strong className="text-white">{selectedTemplate.lastReviewed}</strong></div>
                <div><span className="text-[#9CA3AF]">Jurisdiction Support:</span> <strong className="text-white">{selectedTemplate.jurisdiction}</strong></div>
                <div><span className="text-[#9CA3AF]">Statutory Basis:</span> <strong className="text-white">{selectedTemplate.legalBasis}</strong></div>
              </div>
            </div>

            {/* Clauses List */}
            <div className="space-y-3">
              <h4 className="font-bold text-white border-b border-[#1F2937] pb-2">BBH Master Standard Clauses</h4>

              {selectedTemplate.clauses.map((c) => (
                <div key={c.id} className="p-3.5 bg-[#111827] border border-[#1F2937] rounded-xl space-y-1">
                  <div className="font-bold text-white text-xs">{c.title}</div>
                  <p className="text-[#9CA3AF] text-[11px] leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
