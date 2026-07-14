import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Download, Printer, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import domToImage from 'dom-to-image-more';
import jsPDF from 'jspdf';

export function StaffAttendance({ staff = [] }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Get today's date formatted as YYYY-MM-DD for the default date
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const [filterDate, setFilterDate] = useState(today);
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterMode, setFilterMode] = useState('daily'); // 'daily' or 'monthly'

  useEffect(() => {
    fetchAttendance();
  }, [filterDate, filterMonth, filterMode]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('sbm_token');
      let query = '';
      if (filterMode === 'daily') {
        query = `?date=${filterDate}`;
      } else if (filterMode === 'monthly') {
        query = `?month=${filterMonth}`;
      }

      const res = await fetch(`http://localhost:5000/api/v1/attendance/all${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setRecords(data.data.attendance);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    // Give React state a small tick to update the DOM
    setTimeout(async () => {
      const element = document.getElementById('attendance-report-content');
      if (!element) {
        setIsGeneratingPDF(false);
        return;
      }
      try {
        const dataUrl = await domToImage.toPng(element, {
          quality: 1,
          bgcolor: '#f8fafc',
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left'
          }
        });
        
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [element.offsetWidth, element.offsetHeight]
        });
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
        pdf.save(`Staff_Attendance_Report_${filterMode === 'daily' ? filterDate : filterMonth}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        setIsGeneratingPDF(false);
      }
    }, 150);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const totalRecords = records.length;
  const completedRecords = records.filter(r => r.checkOut).length;

  const uniqueDates = [...new Set(records.map(r => r.date))];
  const totalPresent = records.length;
  let totalAbsent = 0;

  if (filterMode === 'daily') {
    totalAbsent = Math.max(0, staff.length - totalPresent);
  } else {
    const workingDaysCount = uniqueDates.length;
    const totalExpected = workingDaysCount * staff.length;
    totalAbsent = Math.max(0, totalExpected - totalPresent);
  }

  return (
    <div className={`space-y-6 ${isGeneratingPDF ? 'p-6 bg-[#f8fafc]' : ''}`} id="attendance-report-content">
      {/* Report Panel Wrapper */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        
        {/* Header and Views */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#f1f5f9] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f172a] text-white shadow-sm">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1e293b] tracking-tight">Staff Attendance Log</h2>
              <p className="text-[10px] text-[#64748b]">View real-time check-in and check-out logs of staff.</p>
            </div>
          </div>

          {/* View By Buttons */}
          <div className={`flex items-center gap-1 rounded-xl bg-[#f1f5f9] p-1 text-xs ${isGeneratingPDF ? 'hidden' : 'print:hidden'}`}>
            <button
              onClick={() => setFilterMode('daily')}
              className={`rounded-lg px-4 py-1.5 font-bold transition-all ${
                filterMode === 'daily'
                  ? 'bg-white text-[#1e293b] shadow-sm'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setFilterMode('monthly')}
              className={`rounded-lg px-4 py-1.5 font-bold transition-all ${
                filterMode === 'monthly'
                  ? 'bg-white text-[#1e293b] shadow-sm'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Filters and Stats Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
          {/* Left Column: Selectors */}
          <div className={`w-full md:w-auto ${isGeneratingPDF ? 'hidden' : 'print:hidden'}`}>
            {filterMode === 'daily' ? (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Select Date</span>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-48 rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-xs text-[#334155] focus:border-[#3b82f6] focus:outline-none font-semibold"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Select Month</span>
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-48 rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-xs text-[#334155] focus:border-[#3b82f6] focus:outline-none font-semibold"
                />
              </div>
            )}
          </div>

          {/* Right Column: Statistics Box (Looks exactly like the reference card) */}
          <div className={`w-full md:w-80 shrink-0 ${isGeneratingPDF ? 'hidden' : 'print:hidden'}`}>
            <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-[#f8fafc]/50 p-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  {filterMode === 'daily' ? 'Today Attendance' : 'Monthly Attendance'}
                </span>
                <div className="flex items-center gap-4 mt-1.5">
                  <div>
                    <span className="text-2xl font-black text-[#059669] leading-none">{totalPresent}</span>
                    <p className="text-[9px] text-[#64748b] font-bold mt-0.5">Present</p>
                  </div>
                  <div className="border-l border-[#e2e8f0] h-7"></div>
                  <div>
                    <span className="text-2xl font-black text-[#e11d48] leading-none">{totalAbsent}</span>
                    <p className="text-[9px] text-[#64748b] font-bold mt-0.5">Absent</p>
                  </div>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f172a]/5 text-[#0f172a]">
                <ClipboardCheck className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Report Range display for Print & PDF */}
        <div className={`${isGeneratingPDF ? 'block mt-4' : 'hidden print:block mt-4'} text-sm font-semibold text-[#1e293b]`}>
          <span className="text-[#64748b] uppercase tracking-wider text-[10px] font-bold block mb-1">Selected Report Range</span>
          <span className="text-[13px] font-bold bg-[#f8fafc] px-3 py-1.5 rounded-lg inline-block border border-[#e2e8f0]">
            {filterMode === 'daily' ? `Daily Report: ${filterDate}` : `Monthly Report: ${filterMonth}`}
          </span>
        </div>
      </div>

      {/* Action and Download buttons */}
      <div className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all ${
        isGeneratingPDF 
          ? 'border-transparent bg-transparent shadow-none p-0' 
          : 'border-[#e2e8f0] print:border-transparent print:bg-transparent print:shadow-none print:p-0'
      }`}>
        <span className="text-xs font-semibold text-[#64748b]">Showing {records.length} records</span>
        <div className={`flex items-center gap-2 ${isGeneratingPDF ? 'hidden' : 'print:hidden'}`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-1.5 text-xs text-[#0f172a] border-[#e2e8f0] hover:bg-[#f8fafc]"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            <Download className="h-4 w-4" /> {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-1.5 text-xs text-[#0f172a] border-[#e2e8f0] hover:bg-[#f8fafc]" 
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" /> Print Report
          </Button>
        </div>
      </div>

      {/* Attendance List */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155]">
            <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#e2e8f0]">
              <tr>
                <th className="p-4 pl-6">Staff Member</th>
                <th className="p-4">Date</th>
                <th className="p-4">Check In</th>
                <th className="p-4">Check Out</th>
                <th className="p-4">Total Hours</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-semibold text-[#64748b]">
                    Loading records...
                  </td>
                </tr>
              ) : records.map((record) => (
                <tr key={record.id} className="transition-colors hover:bg-[#f8fafc]/50">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      {record.staff?.photoUrl ? (
                        <img src={record.staff.photoUrl} alt="" className="h-8 w-8 rounded-full object-cover border border-[#e2e8f0]" />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8]/10 text-[#1d4ed8] font-extrabold text-[10px]">
                          {record.staff?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1e293b] text-[13px]">{record.staff?.name}</span>
                        <span className="text-[10px] text-[#64748b] font-medium">{record.staff?.staffId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-[#1e293b]">{record.date}</td>
                  <td className="p-4 font-semibold text-[#059669]">{formatTime(record.checkIn)}</td>
                  <td className="p-4 font-semibold text-[#e11d48]">{formatTime(record.checkOut)}</td>
                  <td className="p-4 font-bold text-[#1d4ed8]">{record.totalHours || '--'}</td>
                  <td className="p-4 pr-6">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold w-fit ${
                        record.status?.includes('Late') || record.status?.includes('Early')
                          ? 'bg-amber-50 text-amber-700'
                          : record.checkOut 
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-blue-50 text-blue-700'
                      }`}>
                        {record.checkOut ? (record.status || 'Completed') : (record.status ? `Working - ${record.status}` : 'Working')}
                      </span>
                      {record.pendingHours && (
                         <span className="text-[9px] font-bold text-amber-600">Pending: {record.pendingHours}</span>
                      )}
                      {record.overtimeHours && (
                         <span className="text-[9px] font-bold text-emerald-600">Overtime: {record.overtimeHours}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && records.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-semibold">
                    {filterMode === 'daily' && new Date(filterDate).getDay() === 0 ? (
                      <div className="flex flex-col items-center justify-center text-emerald-600">
                         <span className="text-xl mb-1">🌴</span>
                         <span className="font-black tracking-wide">SUNDAY - WEEKLY OFF</span>
                         <span className="text-[10px] text-emerald-600/70 mt-1">No attendance records expected for today.</span>
                      </div>
                    ) : (
                      <span className="text-[#64748b]">No attendance records found for the selected filter.</span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Total Check-ins</span>
          <h3 className="mt-3 text-3xl font-extrabold text-blue-950">{totalRecords}</h3>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Completed Shifts</span>
          <h3 className="mt-3 text-3xl font-extrabold text-emerald-950">{completedRecords}</h3>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Currently Working</span>
          <h3 className="mt-3 text-3xl font-extrabold text-amber-950">{totalRecords - completedRecords}</h3>
        </div>
      </div>

    </div>
  );
}
