
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-[1000px] mx-auto pt-8 pb-12 px-6 flex flex-col gap-8">
      <div className="pb-4 border-b border-border-dark lg:hidden">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-[#92a9c9] text-sm">Manage your account preferences</p>
      </div>

      <section className="bg-surface-dark border border-border-dark rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer">
              <div className="size-24 rounded-full bg-cover bg-center ring-4 ring-[#101822]" style={{ backgroundImage: `url('https://picsum.photos/seed/jane/100/100')` }}></div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white">edit</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Jane Doe</h2>
              <p className="text-[#92a9c9]">jane.doe@example.com</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">Active</span>
                <span className="text-[#92a9c9] text-xs">•</span>
                <span className="text-[#92a9c9] text-xs">Product Manager</span>
              </div>
            </div>
          </div>
          <button className="h-10 px-4 rounded-lg bg-[#233348] hover:bg-[#2c3f56] text-white text-sm font-medium transition-colors border border-transparent">
            View Public Profile
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold text-white">Personal Information</h3>
          <p className="text-[#92a9c9] text-sm">Update your personal details here.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-dark border border-border-dark rounded-xl">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">First Name</label>
            <input className="h-11 rounded-lg bg-[#101822] border border-border-dark text-white px-4 focus:ring-2 focus:ring-primary outline-none" defaultValue="Jane" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Last Name</label>
            <input className="h-11 rounded-lg bg-[#101822] border border-border-dark text-white px-4 focus:ring-2 focus:ring-primary outline-none" defaultValue="Doe" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-white">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#92a9c9] material-symbols-outlined text-[20px]">mail</span>
              <input className="w-full h-11 rounded-lg bg-[#101822] border border-border-dark text-white pl-11 pr-4 focus:ring-2 focus:ring-primary outline-none" defaultValue="jane.doe@example.com" />
            </div>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-white">Bio</label>
            <textarea className="w-full rounded-lg bg-[#101822] border border-border-dark text-white p-4 focus:ring-2 focus:ring-primary outline-none min-h-[100px]" defaultValue="Product enthusiast focusing on time management and efficiency tools." />
            <p className="text-xs text-[#92a9c9] text-right">250 characters left</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h3 className="text-lg font-bold text-white">Preferences</h3>
        <div className="bg-surface-dark border border-border-dark rounded-xl divide-y divide-border-dark">
          <PreferenceToggle icon="dark_mode" title="Dark Mode" desc="Use dark theme for low-light environments" checked={true} />
          <PreferenceToggle icon="mark_email_unread" title="Email Digest" desc="Receive a weekly summary of your productivity" checked={false} />
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-4 items-center">
              <div className="size-10 rounded-full bg-[#233348] flex items-center justify-center text-white"><span className="material-symbols-outlined">schedule</span></div>
              <div><p className="text-white font-medium">Time Zone</p><p className="text-sm text-[#92a9c9]">Your current local time is 14:30 PM</p></div>
            </div>
            <select className="w-full md:w-64 h-10 rounded-lg bg-[#101822] border border-border-dark text-white px-3 focus:ring-2 focus:ring-primary outline-none text-sm cursor-pointer">
              <option>(GMT-05:00) Eastern Time</option>
              <option>(GMT-08:00) Pacific Time</option>
              <option>(GMT+00:00) London</option>
            </select>
          </div>
        </div>
      </section>

      <div className="sticky bottom-6 z-10 mt-4">
        <div className="p-4 rounded-xl bg-surface-dark/90 backdrop-blur border border-border-dark shadow-2xl flex items-center justify-between">
          <p className="text-sm text-[#92a9c9] hidden sm:block">Last saved: 2 minutes ago</p>
          <div className="flex gap-3 w-full sm:w-auto justify-end">
            <button className="px-5 h-10 rounded-lg text-sm font-bold text-white hover:bg-[#233348] transition-colors">Cancel</button>
            <button className="px-6 h-10 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
              <span>Save Changes</span>
              <span className="material-symbols-outlined text-[18px]">check</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreferenceToggle: React.FC<{icon: string, title: string, desc: string, checked: boolean}> = ({icon, title, desc, checked}) => (
  <div className="p-6 flex items-center justify-between">
    <div className="flex gap-4 items-center">
      <div className="size-10 rounded-full bg-[#233348] flex items-center justify-center text-white"><span className="material-symbols-outlined">{icon}</span></div>
      <div><p className="text-white font-medium">{title}</p><p className="text-sm text-[#92a9c9]">{desc}</p></div>
    </div>
    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${checked ? 'bg-primary' : 'bg-[#233348]'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </div>
  </div>
);

export default Settings;
