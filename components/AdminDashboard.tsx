
import React, { useState, useEffect } from 'react';
import { fetchAdminData, deleteLead, updateLead } from '../services/submissionService.ts';
import { CRMUser, getAllUsers, saveUser, removeUser } from '../services/userService.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  user: CRMUser | null;
  onClose: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, user, onClose, onLogout }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hospital' | 'camp' | 'users'>('hospital');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<any | null>(null);
  
  // User Management State
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'VIEWER' as any, fullName: '' });

  const isAdmin = user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (isAdmin) setUsers(getAllUsers());
      document.body.style.overflow = 'hidden';

      const handleNewLead = (event: any) => {
        const lead = event.detail;
        setNotification(lead);
        loadData();
        setTimeout(() => setNotification(null), 6000);
      };

      window.addEventListener('scopex-new-lead', handleNewLead);
      return () => {
        window.removeEventListener('scopex-new-lead', handleNewLead);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminData();
      setData(result);
    } catch (e) {
      console.error("Registry Refresh Failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedLead) return;
    setIsUpdating(true);
    const success = await updateLead(selectedLead.id, selectedLead.type, { status });
    if (success) {
      const updatedLead = { ...selectedLead, status };
      setSelectedLead(updatedLead);
      setData(prev => prev.map(item => item.id === selectedLead.id ? updatedLead : item));
    }
    setIsUpdating(false);
  };

  const handleUpdateNotes = async (notes: string) => {
    if (!selectedLead) return;
    const success = await updateLead(selectedLead.id, selectedLead.type, { adminNotes: notes });
    if (success) {
      const updatedLead = { ...selectedLead, adminNotes: notes };
      setSelectedLead(updatedLead);
      setData(prev => prev.map(item => item.id === selectedLead.id ? updatedLead : item));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CLOSED':
        return <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-200">Closed / Archived</span>;
      case 'FOLLOWING_UP':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-200">Following Up</span>;
      default:
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-200">New Entry</span>;
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (saveUser(newUser)) {
      setUsers(getAllUsers());
      setNewUser({ email: '', password: '', role: 'VIEWER', fullName: '' });
      alert("New user authorized successfully.");
    } else {
      alert("User email already exists in registry.");
    }
  };

  const handleRemoveUser = (id: string) => {
    if (!isAdmin) return;
    if (confirm("Revoke access for this user permanently?")) {
      removeUser(id);
      setUsers(getAllUsers());
    }
  };

  const handleExportCSV = () => {
    if (!isAdmin) return;
    const headers = ["Timestamp", "Entity Name", "Contact Person", "Phone/Mobile", "Email", "Interest/Headcount", "Date", "Status", "Notes"];
    const rows = data.map(item => [
      item.timestamp,
      item.hospitalName || item.organization,
      item.contactName || item.fullName,
      item.mobile || item.phone,
      item.email || "N/A",
      item.interest || item.headcount || "N/A",
      item.date || "N/A",
      item.status || "NEW",
      item.adminNotes || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.map(h => `"${h}"`).join(",") + "\n"
      + rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ScopeX_CRM_Full_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (lead: any) => {
    if (!isAdmin) return;
    if (!window.confirm("Permanently remove this entry from the CRM registry?")) return;
    
    setIsDeleting(true);
    const success = await deleteLead(lead.id, lead.type);
    if (success) {
      setData(prev => prev.filter(item => item.id !== lead.id));
      setSelectedLead(null);
    }
    setIsDeleting(false);
  };

  const filteredData = data.filter(item => {
    const isCorrectTab = activeTab === item.type;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (item.hospitalName || item.organization || '').toLowerCase().includes(searchLower) ||
      (item.contactName || item.fullName || '').toLowerCase().includes(searchLower) ||
      (item.mobile || item.phone || '').includes(searchQuery);

    return isCorrectTab && matchesSearch;
  });

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      
      {/* Real-time Notification Pop */}
      {notification && (
        <div 
          onClick={() => { setSelectedLead(notification); setNotification(null); }}
          className="fixed top-8 right-8 z-[500] w-full max-w-sm bg-white border border-scopex-blue/10 rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(5,74,122,0.3)] p-5 flex items-center space-x-5 cursor-pointer animate-in slide-in-from-right-full slide-in-from-top-4 duration-500 group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-scopex-green"></div>
          <div className="w-12 h-12 bg-scopex-blue rounded-2xl flex items-center justify-center shrink-0 relative">
             <div className="absolute inset-0 bg-scopex-blue rounded-2xl animate-ping opacity-20"></div>
             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
             </svg>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-black text-scopex-green uppercase tracking-widest mb-0.5">New Lead Detected</p>
            <h4 className="text-sm font-black text-slate-800 truncate tracking-tight">{notification.hospitalName || notification.organization}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Click to expand details</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setNotification(null); }} className="text-gray-300 hover:text-red-500 p-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="bg-white w-full h-full md:max-w-7xl md:h-[90vh] md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">
        
        {/* CRM Header */}
        <div className="px-8 py-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-scopex-blue rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-scopex-blue tracking-tighter uppercase leading-none mb-1">CRM Administrative Hub</h2>
              <div className="flex items-center space-x-3">
                 <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                  Logged in as: <span className="text-scopex-blue">{user.fullName} ({user.role})</span>
                 </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && (
              <button 
                onClick={handleExportCSV}
                className="px-6 py-4 bg-scopex-green text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-green-900/10 active:scale-95"
              >
                Export CSV
              </button>
            )}
            <button 
              onClick={loadData}
              className={`p-4 bg-gray-50 text-scopex-blue hover:bg-scopex-blue hover:text-white rounded-2xl transition-all shadow-sm ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <svg className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button onClick={onLogout} className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm" title="Log Out">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button onClick={onClose} className="p-4 bg-gray-100 text-gray-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-6 shrink-0">
          <div className="bg-white p-1 rounded-2xl flex border border-gray-100 shadow-sm w-fit">
            <button onClick={() => setActiveTab('hospital')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'hospital' ? 'bg-scopex-blue text-white shadow-lg' : 'text-gray-400 hover:text-scopex-blue'}`}>Inquiries</button>
            <button onClick={() => setActiveTab('camp')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'camp' ? 'bg-scopex-blue text-white shadow-lg' : 'text-gray-400 hover:text-scopex-blue'}`}>Bookings</button>
            {isAdmin && (
              <button onClick={() => setActiveTab('users')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-scopex-blue text-white shadow-lg' : 'text-gray-400 hover:text-scopex-blue'}`}>Manage Users</button>
            )}
          </div>
          
          {activeTab !== 'users' && (
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search CRM records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-sm shadow-sm"
              />
              <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto custom-scrollbar bg-white">
          {activeTab === 'users' && isAdmin ? (
            <div className="p-12 space-y-12">
               <div className="max-w-4xl bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                  <h3 className="text-xl font-black text-scopex-blue uppercase tracking-tight mb-8">Authorize New CRM User</h3>
                  <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <input required value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} className="px-5 py-4 bg-white rounded-xl border border-gray-200 outline-none text-xs font-bold" placeholder="Full Name" />
                     <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="px-5 py-4 bg-white rounded-xl border border-gray-200 outline-none text-xs font-bold" placeholder="Email Address" />
                     <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="px-5 py-4 bg-white rounded-xl border border-gray-200 outline-none text-xs font-bold" placeholder="Password" />
                     <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})} className="px-5 py-4 bg-white rounded-xl border border-gray-200 outline-none text-xs font-bold">
                        <option value="VIEWER">VIEWER (Read Only)</option>
                        <option value="MANAGER">MANAGER (Read Only - Standard)</option>
                        <option value="SUPER_ADMIN">ADMIN (Full Control)</option>
                     </select>
                     <button className="md:col-span-4 bg-scopex-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-4 hover:bg-slate-900 transition-all">Provision User Account</button>
                  </form>
               </div>

               <div className="max-w-4xl">
                  <h3 className="text-xl font-black text-scopex-blue uppercase tracking-tight mb-6">Existing User Registry</h3>
                  <div className="grid gap-4">
                    {users.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center space-x-6">
                           <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-scopex-blue font-black">{u.fullName.charAt(0)}</div>
                           <div>
                              <p className="font-black text-sm text-slate-800">{u.fullName}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{u.email} • <span className="text-scopex-green">{u.role}</span></p>
                           </div>
                        </div>
                        {u.id !== 'root-admin' && (
                          <button onClick={() => handleRemoveUser(u.id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Submitted</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Institution / Entity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Authority</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.length > 0 ? filteredData.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedLead(item)} className="hover:bg-gray-50 transition-all cursor-pointer group active:scale-[0.998]">
                    <td className="px-8 py-6 text-xs font-bold text-gray-400">{item.timestamp}</td>
                    <td className="px-8 py-6 font-black text-scopex-blue">{item.hospitalName || item.organization}</td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-800">{item.contactName || item.fullName}</td>
                    <td className="px-8 py-6 text-sm font-black text-slate-700">{item.mobile || item.phone}</td>
                    <td className="px-8 py-6">
                       {getStatusBadge(item.status)}
                    </td>
                    <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                      {isAdmin && (
                        <button onClick={() => handleDelete(item)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="py-32 text-center text-xs font-black text-gray-300 uppercase tracking-widest">No matching records</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {selectedLead && (
          <div className="fixed inset-0 z-[400] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl md:rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in duration-300">
              
              {/* Branding Header */}
              <div className="bg-scopex-blue p-8 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-scopex-blue font-black text-xl shadow-lg">X</div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Scope X CRM</h3>
                    <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-widest">Lead Identifier: {selectedLead.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Lead Information Dashboard */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
                  <div className="flex-1">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{selectedLead.hospitalName || selectedLead.organization}</h2>
                    <p className="text-xl font-black text-scopex-blue">{selectedLead.mobile || selectedLead.phone}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 px-1">Current Registry Status</span>
                    {getStatusBadge(selectedLead.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Inquiry Details Column */}
                  <div className="space-y-8">
                    <section>
                      <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Primary Solution of Interest</label>
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 font-black text-scopex-blue">
                        {selectedLead.type === 'hospital' ? selectedLead.interest : 'Corporate Health Camp Logistics'}
                      </div>
                    </section>

                    <section>
                      <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Detailed Requirements / Administrative Notes</label>
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-medium text-slate-500 italic leading-relaxed">
                        {selectedLead.requirements || 'No additional specific instructions provided for this entry.'}
                      </div>
                    </section>

                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-50">
                      <div className="w-2 h-2 rounded-full bg-scopex-green"></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registry Entry Created: {selectedLead.timestamp}</p>
                    </div>
                  </div>

                  {/* Workflow & Communication Column */}
                  <div className="space-y-8">
                    <section>
                      <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Workflow Lifecycle Management</label>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => handleUpdateStatus('NEW')}
                          className={`w-full px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left border ${selectedLead.status === 'NEW' || !selectedLead.status ? 'bg-blue-50 border-scopex-blue text-scopex-blue shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-scopex-blue'}`}
                        >
                          Mark as New / Unprocessed
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus('FOLLOWING_UP')}
                          className={`w-full px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left border ${selectedLead.status === 'FOLLOWING_UP' ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-amber-500'}`}
                        >
                          Mark as Following Up / In Progress
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus('CLOSED')}
                          className={`w-full px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left border ${selectedLead.status === 'CLOSED' ? 'bg-green-50 border-scopex-green text-scopex-green shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-scopex-green'}`}
                        >
                          Close & Archive Entry
                        </button>
                      </div>
                    </section>

                    <section>
                      <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Internal Administrator Journal</label>
                      <textarea 
                        defaultValue={selectedLead.adminNotes || ''}
                        onBlur={(e) => handleUpdateNotes(e.target.value)}
                        placeholder="Log meeting notes, call outcomes, or specific closing details here..."
                        className="w-full p-6 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-scopex-blue/10 rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all resize-none h-[180px] shadow-inner"
                      ></textarea>
                      <p className="mt-2 text-[9px] font-black text-gray-300 uppercase italic text-right tracking-tighter">Drafts are committed on focal exit (Blur).</p>
                    </section>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-8 bg-gray-50 border-t flex flex-col md:flex-row gap-4 shrink-0">
                <button 
                  onClick={() => window.open(`tel:${selectedLead.mobile || selectedLead.phone}`)}
                  className="flex-1 bg-scopex-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>Connect With Lead</span>
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(selectedLead)}
                    className="px-8 bg-white border border-red-100 text-red-500 py-5 rounded-2xl font-black text-xs uppercase hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    Delete Permanently
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="px-8 py-5 border-t bg-white flex items-center justify-between text-[9px] font-black text-gray-300 uppercase tracking-widest italic">
           <p>Scope X CRM Console v3.2 • {isAdmin ? 'Global Orchestration Access' : 'Standard View Mode'}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
