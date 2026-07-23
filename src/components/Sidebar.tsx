import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Building,
  CheckSquare,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Gavel,
  History,
  Home,
  LogOut,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();

  const navItems = [
    { id: 'dashboard', labelEn: 'Dashboard', labelZh: '控制台概览', icon: Home },
    { id: 'company', labelEn: 'Company & SSM', labelZh: '公司资料与验证', icon: Building },
    { id: 'employees', labelEn: 'Employees Directory', labelZh: '员工主档与档案', icon: Users },
    { id: 'generator', labelEn: 'HR Doc Generator', labelZh: '文档生成与智能编辑', icon: Sparkles },
    { id: 'templates', labelEn: '12 Template Families', labelZh: '12 顶层模板库', icon: FileText },
    { id: 'cases', labelEn: 'Disciplinary Cases', labelZh: '纪律案件流程', icon: Gavel },
    { id: 'changes', labelEn: 'Employment Changes', labelZh: '条款变更 Addendum', icon: FileSpreadsheet },
    { id: 'separation', labelEn: 'Offboarding & Settlement', labelZh: '离职与结算工作表', icon: LogOut },
    { id: 'approvals', labelEn: 'Approvals Queue', labelZh: '审批与风险签署', icon: CheckSquare },
    { id: 'policies', labelEn: 'Policies & Holidays', labelZh: '公司政策与假期', icon: MapPin },
    { id: 'audit', labelEn: 'Audit Logs', labelZh: '审计日志与数据导出', icon: History },
    { id: 'subscription', labelEn: 'Course Membership', labelZh: '课程权益与订阅', icon: Award },
    { id: 'verify', labelEn: 'QR Verification Portal', labelZh: 'QR 真实性验证门户', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-[#0D121A] border-r border-[#1F2937] text-[#9CA3AF] flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      {/* Navigation list */}
      <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-[#1F2937] text-white font-semibold shadow-sm border border-[#374151]/50'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#111827]'
              }`}
            >
              {isActive ? (
                <div className="w-2 h-2 bg-[#2ECC71] rounded-full shrink-0 shadow-[0_0_8px_#2ECC71]" />
              ) : (
                <Icon className="w-4 h-4 shrink-0 text-[#9CA3AF]" />
              )}
              <span className="truncate">
                {language === 'zh' ? item.labelZh : item.labelEn}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Regional / Pilot Status Footer Card */}
      <div className="p-4">
        <div className="p-4 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest font-bold">Regional Status</p>
            <div className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></div>
          </div>
          <p className="text-xs font-semibold text-white flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-[#2ECC71]" />
            Kalimantan & Peninsular: Active
          </p>
          <div className="mt-2.5 h-1.5 w-full bg-[#111827] rounded-full overflow-hidden">
            <div className="h-full w-[88%] bg-[#2ECC71] shadow-[0_0_8px_rgba(46,204,113,0.5)]"></div>
          </div>
          <p className="text-[10px] text-[#9CA3AF] mt-2 leading-tight">
            BBH Controlled Pilot v2.0 • 88% Compliance Sync
          </p>
        </div>
      </div>
    </aside>
  );
};

