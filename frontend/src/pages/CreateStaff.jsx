import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Camera, Upload, Trash2, X, Image as ImageIcon } from 'lucide-react';

export function CreateStaff({ staffList = [], initialData, onAddStaff, onUpdateStaff, onCancel }) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState(initialData || {
    staffId: '',
    name: '',
    joinDate: new Date().toISOString().split('T')[0],
    phone: '',
    whatsappNumber: '',
    email: '',
    address: '',
    city: '',
    state: 'Tamilnadu',
    zipCode: '',
    photoUrl: null,
  });

  const [success, setSuccess] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Auto-generate Staff ID based on existing staff count
  useEffect(() => {
    if (!isEditing && staffList.length > 0) {
      // Find the highest existing SBM id
      let maxNum = 60;
      staffList.forEach(member => {
        if (member.staffId && member.staffId.startsWith('SBM')) {
          const num = parseInt(member.staffId.replace('SBM', ''), 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
      const generatedId = `SBM${String(maxNum + 1).padStart(3, '0')}`;
      setFormData(prev => ({ ...prev, staffId: generatedId }));
    } else if (!isEditing && staffList.length === 0) {
      setFormData(prev => ({ ...prev, staffId: 'SBM061' }));
    }
  }, [staffList, isEditing]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.staffId) {
      alert('Please fill in the required fields (Staff ID, Name, Email).');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('sbm_token');
      
      const url = isEditing 
        ? `http://localhost:5000/api/v1/staff/${initialData.id}` 
        : 'http://localhost:5000/api/v1/staff';
        
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.status === 'success') {
        if (isEditing) {
          onUpdateStaff(data.data.staff);
        } else {
          onAddStaff(data.data.staff);
        }
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onCancel();
        }, 1500);
      } else {
        alert(data.message || `Failed to ${isEditing ? 'update' : 'create'} staff`);
      }
    } catch (err) {
      console.error(err);
      alert('Server error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Photo Upload Logic ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result });
        setPhotoModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      alert('Error accessing camera: ' + err.message);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      // Mirror the canvas context before drawing so the saved image matches the preview
      context.save();
      context.translate(canvasRef.current.width, 0);
      context.scale(-1, 1);
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      context.restore();
      
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setFormData({ ...formData, photoUrl: dataUrl });
      stopCamera();
      setPhotoModalOpen(false);
    }
  };

  const closePhotoModal = () => {
    stopCamera();
    setPhotoModalOpen(false);
  };

  return (
    <div className="max-w-5xl space-y-6 pb-12">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1e293b] tracking-tight">{isEditing ? 'Edit Staff Details' : 'Create Staff Details'}</h2>
            <p className="text-xs text-[#64748b] mt-0.5">{isEditing ? 'Update existing personnel records' : 'Configure institution personnel files and roles'}</p>
          </div>
        </div>
        <div className="text-xs font-medium text-[#94a3b8]">
          Home / <span className="text-[#1e293b] font-bold">{isEditing ? 'Edit Staff' : 'Create Staff'}</span>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-teal-50 border border-teal-200 p-4 text-teal-800 text-sm font-semibold">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">
            <Check className="h-4 w-4" />
          </div>
          <span>{isEditing ? 'Staff profile updated successfully!' : 'Staff profile registered successfully! Redirecting...'}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section: Staff Profile ID */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-teal-600 text-xs font-bold">#</span>
            <h3 className="text-sm font-bold text-[#1e293b]">Staff Profile ID</h3>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#64748b]">Staff ID *</label>
            <input
              type="text"
              required
              readOnly
              value={formData.staffId}
              className="w-full rounded-lg border border-[#cbd5e1] bg-gray-50 px-4 py-2.5 text-sm font-bold text-gray-500 cursor-not-allowed transition-all"
            />
          </div>
        </div>

        {/* Section 1: Personnel Demographics */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-teal-600 text-xs font-bold">1</span>
            <h3 className="text-sm font-bold text-[#1e293b]">Personnel Demographics</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2.5 text-sm text-[#334155] focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]">Joining Date *</label>
              <input
                type="date"
                required
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2.5 text-sm text-[#334155] focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address & Contacts */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-teal-600 text-xs font-bold">2</span>
            <h3 className="text-sm font-bold text-[#1e293b]">Address & Contacts</h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]">Mobile Number *</label>
              <input
                type="text"
                required
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2.5 text-sm text-[#334155] focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]">WhatsApp Number</label>
              <input
                type="text"
                placeholder="WhatsApp Number"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2.5 text-sm text-[#334155] focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]">Email Address *</label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2.5 text-sm text-[#334155] focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-xs font-bold text-[#64748b]">Address *</label>
            <textarea
              required
              rows={2}
              placeholder="Door No., Street name, Area details..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2.5 text-sm text-[#334155] focus:border-teal-500 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]">City *</label>
              <input
                type="text"
                required
                placeholder="City Name"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2.5 text-sm text-[#334155] focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]">State *</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2.5 text-sm text-[#334155] focus:border-teal-500 focus:outline-none transition-all bg-white"
              >
                <option value="Tamilnadu">Tamilnadu</option>
                <option value="Kerala">Kerala</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748b]">Zip Code *</label>
              <input
                type="text"
                required
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2.5 text-sm text-[#334155] focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Profile Photo Upload */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-teal-600 text-xs font-bold">3</span>
            <h3 className="text-sm font-bold text-[#1e293b]">Profile Photo Upload</h3>
          </div>
          
          <div 
            onClick={() => setPhotoModalOpen(true)}
            className="flex items-center gap-4 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-4 cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 transition-all"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-200 border border-[#e2e8f0] flex items-center justify-center relative group">
              {formData.photoUrl ? (
                <>
                  <img src={formData.photoUrl} alt="Profile" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white h-5 w-5" />
                  </div>
                </>
              ) : (
                <ImageIcon className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1e293b]">Staff Image Attachment</span>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600">CLICK IMAGE TO EDIT</span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">Upload an original profile image file</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold px-8 py-2.5 h-auto rounded-lg shadow-md disabled:opacity-70 transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Submit form'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-[#cbd5e1] text-[#475569] hover:bg-[#f1f5f9] font-semibold px-8 py-2.5 h-auto rounded-lg transition-colors"
          >
            Cancel
          </Button>
        </div>

      </form>

      {/* Profile Photo Options Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={closePhotoModal}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-center text-xs font-extrabold tracking-widest text-[#64748b] uppercase mb-6">Profile Photo Options</h3>
            
            {!cameraActive ? (
              <div className="space-y-3">
                <button 
                  onClick={startCamera}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-teal-100 bg-teal-50 py-3.5 text-sm font-bold text-teal-700 hover:bg-teal-100 transition-colors"
                >
                  <Camera className="h-5 w-5" /> Take New Photo
                </button>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 py-3.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  <Upload className="h-5 w-5" /> Upload from Files
                </button>
                
                {formData.photoUrl && (
                  <button 
                    onClick={() => {
                      setFormData({ ...formData, photoUrl: null });
                      setPhotoModalOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50 py-3.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors mt-6"
                  >
                    <Trash2 className="h-5 w-5" /> Remove Photo
                  </button>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4 flex flex-col items-center">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  />
                  <canvas ref={canvasRef} width="640" height="640" className="hidden" />
                </div>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={capturePhoto}
                    className="flex-1 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 shadow-sm"
                  >
                    Capture
                  </button>
                  <button 
                    onClick={stopCamera}
                    className="flex-1 rounded-xl border border-[#cbd5e1] py-3 text-sm font-bold text-[#475569] hover:bg-[#f1f5f9]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
