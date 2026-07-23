import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Bell,
  Building2,
  CheckCircle2,
  Globe,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    currentRole,
    setCurrentRole,
    company,
    notifications,
    markNotificationRead,
    subscription,
    legalHoldActive
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-[#0D121A] border-b border-[#1F2937] text-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Left branding */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2ECC71] rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(46,204,113,0.3)]">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
            BORNEO<span className="text-[#2ECC71]">HUB</span>
            <span className="text-[10px] text-[#9CA3AF] font-normal uppercase tracking-widest ml-1 hidden sm:inline">HR DocGen</span>
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-2 border-l border-[#1F2937] pl-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              {company.legalName}
              {company.verificationStatus === 'Company Details Verified' && (
                <span className="inline-flex items-center text-[10px] bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/30 px-2 py-0.5 rounded-full font-bold">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                </span>
              )}
            </span>
            <span className="text-[11px] text-[#9CA3AF]">
              {company.ssmRegistrationNumber} • {subscription.plan} Plan ({subscription.currentActiveEmployees}/{subscription.maxActiveEmployees} Staff)
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Legal Hold Indicator */}
        {legalHoldActive && (
          <div className="hidden md:flex items-center bg-amber-950/80 border border-amber-600/60 text-amber-300 text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Legal Hold Active
          </div>
        )}

        {/* Role Switcher */}
        <div className="flex items-center space-x-1.5 bg-[#111827] border border-[#374151] rounded-full px-3 py-1 text-xs">
          <UserCheck className="w-3.5 h-3.5 text-[#2ECC71]" />
          <span className="text-[#9CA3AF] font-medium hidden sm:inline">{language === 'zh' ? '角色:' : 'Role:'}</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="bg-transparent text-white font-semibold outline-none cursor-pointer text-xs"
          >
            <option value="CompanyOwner" className="bg-[#111827] text-white">Company Owner</option>
            <option value="HRAdmin" className="bg-[#111827] text-white">HR Admin</option>
            <option value="Manager" className="bg-[#111827] text-white">Manager / Initiator</option>
            <option value="Approver" className="bg-[#111827] text-white">Approver</option>
          </select>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          className="flex items-center space-x-1.5 text-xs bg-[#111827] hover:bg-[#1F2937] border border-[#374151] px-3 py-1.5 rounded-full text-white font-medium transition"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 text-[#2ECC71]" />
          <span>{language === 'en' ? '中文' : 'EN'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#9CA3AF] hover:text-white bg-[#111827] hover:bg-[#1F2937] border border-[#374151] rounded-full relative transition flex items-center justify-center w-9 h-9"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#2ECC71] text-[#0A0D12] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl z-50 text-[#E0E0E0] p-4 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-[#1F2937] mb-3 font-semibold">
                <span className="text-white font-bold">{language === 'zh' ? '系统提醒与通知' : 'System Notifications'}</span>
                <span className="text-[10px] bg-[#2ECC71]/10 text-[#2ECC71] px-2 py-0.5 rounded-full font-bold">{unreadCount} unread</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition ${
                      n.unread ? 'bg-[#1F2937] border-[#2ECC71]/40' : 'bg-[#0D121A] border-[#1F2937] opacity-75'
                    }`}
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      {n.title}
                      <span className="text-[10px] text-[#9CA3AF]">{n.date}</span>
                    </div>
                    <div className="text-[#9CA3AF] mt-1 text-[11px] leading-snug">{n.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

