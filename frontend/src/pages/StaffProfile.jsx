import React from 'react';
import { 
  ArrowLeft, Edit, Trash2, Download, Printer, 
  Building2, Briefcase, Phone, Mail, MapPin, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import domToImage from 'dom-to-image-more';
import jsPDF from 'jspdf';

export function StaffProfile({ member, onBack, onEdit, onDelete }) {
  if (!member) return null;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('staff-profile-card');
    if (!element) return;
    
    try {
      const dataUrl = await domToImage.toPng(element, { 
        quality: 1, 
        bgcolor: '#ffffff',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save(`${member.name}_Profile.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a] tracking-tight">Personnel Profile Summary</h1>
            <p className="text-xs font-medium text-[#64748b]">View detailed personnel records</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => onEdit(member)}
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold shadow-sm h-8 px-4 text-xs rounded-full flex items-center gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" /> Edit Details
          </Button>
          <Button 
            onClick={() => onDelete(member.id)}
            className="bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold shadow-sm h-8 px-4 text-xs rounded-full flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Staff
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold shadow-sm h-8 px-4 text-xs rounded-full flex items-center gap-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
          <Button 
            onClick={() => window.print()}
            className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold shadow-sm h-8 px-4 text-xs rounded-full flex items-center gap-1.5 transition-colors print:hidden"
          >
            <Printer className="h-3.5 w-3.5" /> Print Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div id="staff-profile-card" className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-[#f1f5f9]">
        
        {/* Top Info Section */}
        <div className="flex items-center gap-5 mb-8">
          <div className="h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-[#f1f5f9] border-4 border-white shadow-md flex items-center justify-center">
            {member.photoUrl ? (
              <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-[#94a3b8]">
                {member.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-bold text-[#1e293b] tracking-tight">{member.name}</h2>
            <div>
              <span className="inline-block bg-[#dbeafe] border border-[#bfdbfe] text-[#1d4ed8] text-[10px] font-bold px-2 py-0.5 rounded">
                {member.staffId || member.id}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#64748b]">
              Joining Date: {member.joinDate}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* Card 1 */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
            <Building2 className="h-4 w-4 text-[#8b5cf6] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-0.5">Location</span>
              <span className="text-[13px] font-bold text-[#1e293b]">{member.city}, {member.state}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
            <Briefcase className="h-4 w-4 text-[#f59e0b] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-0.5">Status</span>
              <span className="text-[13px] font-bold text-[#1e293b]">
                {member.status === 'Present' ? 'Active Employee' : member.status}
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
            <Phone className="h-4 w-4 text-[#3b82f6] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-0.5">Mobile Number</span>
              <span className="text-[13px] font-bold text-[#1e293b]">{member.phone}</span>
            </div>
          </div>

          {/* Card 4 (WhatsApp) */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-0.5">WhatsApp Number</span>
              <span className="text-[13px] font-bold text-[#1e293b]">{member.whatsappNumber || 'N/A'}</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#f1f5f9] md:col-span-2">
            <Mail className="h-4 w-4 text-[#ea4335] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-0.5">Email Address</span>
              <span className="text-[13px] font-bold text-[#1e293b]">{member.email}</span>
            </div>
          </div>

          {/* Card 6 (Full Width) */}
          <div className="col-span-1 md:col-span-2 flex items-start gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
            <MapPin className="h-4 w-4 text-[#e11d48] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-0.5">Full Address Details</span>
              <span className="text-[13px] font-bold text-[#1e293b] mb-0.5">{member.address}</span>
              <span className="text-[11px] font-medium text-[#64748b]">City: {member.city} | State: {member.state} | Zip: {member.zipCode}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
