import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import {
  Building2, MapPin, Navigation, Radar, Plus, Pencil, Trash2,
  RefreshCw, X, Check, AlertTriangle, Loader2, ChevronRight, Globe
} from 'lucide-react';

// ── Small reusable UI pieces ────────────────────────────────────────────────

function InputField({ label, id, type = 'text', value, onChange, placeholder, required, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label} {required && <span className="text-teal-400">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={type === 'number' ? 'any' : undefined}
        className="w-full bg-[#0d1526] border border-[#1e3a5f] text-slate-200 text-sm rounded-xl px-4 py-3
          placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30
          transition-all duration-200"
      />
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

function Badge({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[variant]}`}>
      {children}
    </span>
  );
}

function ConfirmDialog({ isOpen, onConfirm, onCancel, branchName }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[#0b1120] border border-red-500/30 rounded-2xl p-6 shadow-2xl shadow-red-500/10 animate-fadeIn">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">Delete Branch</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete <span className="text-white font-semibold">"{branchName}"</span>?
            </p>
            <p className="text-xs text-amber-400/80 mt-2 flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Assigned staff will be unassigned from this branch.
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-[#1e293b] text-slate-300 text-sm font-semibold
                hover:bg-[#1e293b] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-sm font-bold
                transition-colors shadow-lg shadow-red-500/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Branch Form (Create / Edit) ──────────────────────────────────────────────

const emptyForm = { name: '', address: '', latitude: '', longitude: '', geofenceRadius: '300' };

function BranchForm({ initialData, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(
    initialData
      ? {
          name: initialData.name,
          address: initialData.address,
          latitude: String(initialData.latitude),
          longitude: String(initialData.longitude),
          geofenceRadius: String(initialData.geofenceRadius),
        }
      : { ...emptyForm }
  );

  const isEdit = !!initialData;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Branch Name */}
        <div className="md:col-span-2">
          <InputField
            label="Branch Name"
            id="branch-name"
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Main HQ, South Campus"
            required
          />
        </div>

        {/* Office Address */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Office Address <span className="text-teal-400">*</span>
          </label>
          <textarea
            value={form.address}
            onChange={set('address')}
            placeholder="Type full address..."
            required
            rows={2}
            className="w-full bg-[#0d1526] border border-[#1e3a5f] text-slate-200 text-sm rounded-xl px-4 py-3
              placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30
              transition-all duration-200 resize-none"
          />
        </div>

        {/* Latitude */}
        <InputField
          label="Latitude"
          id="branch-lat"
          type="number"
          value={form.latitude}
          onChange={set('latitude')}
          placeholder="e.g. 10.3680"
          required
          hint="GPS latitude coordinate"
        />

        {/* Longitude */}
        <InputField
          label="Longitude"
          id="branch-lng"
          type="number"
          value={form.longitude}
          onChange={set('longitude')}
          placeholder="e.g. 77.9803"
          required
          hint="GPS longitude coordinate"
        />

        {/* Geofence Radius */}
        <div className="md:col-span-2">
          <InputField
            label="Geofence Radius (Meters)"
            id="branch-radius"
            type="number"
            value={form.geofenceRadius}
            onChange={set('geofenceRadius')}
            placeholder="300"
            required
            hint="Staff must be within this range to clock-in"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[#1e293b]">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1e293b] text-slate-300
            text-sm font-semibold hover:bg-[#1e293b] transition-colors"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400
            text-slate-950 text-sm font-bold transition-all shadow-lg shadow-teal-500/20
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <><Check className="h-4 w-4" /> {isEdit ? 'Save Changes' : 'Create Branch'}</>
          )}
        </button>
      </div>
    </form>
  );
}

// ── Branch Card ──────────────────────────────────────────────────────────────

function BranchCard({ branch, onEdit, onDelete }) {
  return (
    <div className="group relative bg-[#0b1120] border border-[#1e293b] hover:border-teal-500/30
      rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/5">
      {/* Top glow accent */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-4">
        {/* Icon + Name */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center
            justify-center shrink-0 group-hover:bg-teal-500/20 transition-colors">
            <Building2 className="h-5 w-5 text-teal-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{branch.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{branch.address}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(branch)}
            title="Edit branch"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20
              text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(branch)}
            title="Delete branch"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20
              text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* GPS + Radius Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#1e293b]">
        <Badge variant="blue">
          <Navigation className="h-2.5 w-2.5" />
          {Number(branch.latitude).toFixed(4)}, {Number(branch.longitude).toFixed(4)}
        </Badge>
        <Badge variant="purple">
          <Radar className="h-2.5 w-2.5" />
          {branch.geofenceRadius}m radius
        </Badge>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export function ManageBranches() {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null); // null = create mode
  const [deleteTarget, setDeleteTarget] = useState(null);   // branch to delete

  const token = localStorage.getItem('sbm_token');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // ── Flash message helpers ──
  const flashSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };
  const flashError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  // ── Fetch ──
  const fetchBranches = async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/branches`, { headers });
      const data = await res.json();
      if (data.status === 'success') {
        setBranches(data.data.branches);
      } else {
        flashError('Failed to load branches.');
      }
    } catch {
      flashError('Connection error. Could not load branches.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchBranches(); }, []);

  // ── Create / Edit save ──
  const handleSave = async (form) => {
    setIsSaving(true);
    setError('');
    const isEdit = !!editingBranch;
    const url = isEdit
      ? `${API_BASE_URL}/api/v1/branches/${editingBranch.id}`
      : `${API_BASE_URL}/api/v1/branches`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          name: form.name.trim(),
          address: form.address.trim(),
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
          geofenceRadius: parseInt(form.geofenceRadius),
        }),
      });
      const data = await res.json();

      if (data.status === 'success') {
        if (isEdit) {
          setBranches((prev) =>
            prev.map((b) => (b.id === editingBranch.id ? data.data.branch : b))
          );
          flashSuccess(`Branch "${data.data.branch.name}" updated successfully.`);
        } else {
          setBranches((prev) => [data.data.branch, ...prev]);
          flashSuccess(`Branch "${data.data.branch.name}" created successfully.`);
        }
        setShowForm(false);
        setEditingBranch(null);
      } else {
        flashError(data.message || 'Failed to save branch.');
      }
    } catch {
      flashError('Connection error. Could not save branch.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete ──
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/branches/${deleteTarget.id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.status === 204 || res.ok) {
        setBranches((prev) => prev.filter((b) => b.id !== deleteTarget.id));
        flashSuccess(`Branch "${deleteTarget.name}" deleted.`);
      } else {
        const data = await res.json();
        flashError(data.message || 'Failed to delete branch.');
      }
    } catch {
      flashError('Connection error. Could not delete branch.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openCreate = () => {
    setEditingBranch(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (branch) => {
    setEditingBranch(branch);
    setShowForm(true);
    setError('');
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingBranch(null);
    setError('');
  };

  // ── Render ──
  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Globe className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
              <span>Admin</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-teal-400">Manage Branches</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {branches.length} branch{branches.length !== 1 ? 'es' : ''} configured
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchBranches(true)}
            disabled={isRefreshing}
            title="Refresh branches"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1e293b] text-slate-400
              text-sm font-medium hover:bg-[#111827] hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          {!showForm && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400
                text-slate-950 text-sm font-bold transition-all shadow-lg shadow-teal-500/20"
            >
              <Plus className="h-4 w-4" />
              New Branch
            </button>
          )}
        </div>
      </div>

      {/* ── Flash Messages ── */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-teal-500/10 border border-teal-500/30 text-teal-400
          text-sm rounded-xl px-4 py-3 animate-fadeIn">
          <Check className="h-4 w-4 shrink-0" />
          {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400
          text-sm rounded-xl px-4 py-3 animate-fadeIn">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Create / Edit Form ── */}
      {showForm && (
        <div className="bg-[#0b1120] border border-teal-500/20 rounded-2xl overflow-hidden shadow-xl shadow-teal-500/5 animate-fadeIn">
          {/* Form Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1e293b] bg-teal-500/5">
            <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
              {editingBranch ? (
                <Pencil className="h-4 w-4 text-teal-400" />
              ) : (
                <Plus className="h-4 w-4 text-teal-400" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {editingBranch ? `Edit Branch — ${editingBranch.name}` : 'Create New Office Branch'}
              </h2>
              <p className="text-xs text-slate-400">
                {editingBranch
                  ? 'Modify existing branch details below.'
                  : 'Set up a new location with GPS coordinates and geofence range.'}
              </p>
            </div>
          </div>
          <div className="p-6">
            <BranchForm
              initialData={editingBranch}
              onSave={handleSave}
              onCancel={cancelForm}
              isSaving={isSaving}
            />
          </div>
        </div>
      )}

      {/* ── Branch Directory ── */}
      <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl overflow-hidden">
        {/* Directory Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Branch Directory</h2>
              <p className="text-xs text-slate-500">All registered office locations</p>
            </div>
          </div>
          <Badge>{branches.length} Total</Badge>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
              <p className="text-sm text-slate-500">Loading branches...</p>
            </div>
          ) : branches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                <Building2 className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-400">No branches yet</p>
                <p className="text-xs text-slate-600 mt-1">
                  Create your first office branch to enable location-based attendance.
                </p>
              </div>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20
                  text-teal-400 text-sm font-semibold hover:bg-teal-500/20 transition-colors mt-1"
              >
                <Plus className="h-4 w-4" /> Create First Branch
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((branch) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Confirmation Dialog ── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        branchName={deleteTarget?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
