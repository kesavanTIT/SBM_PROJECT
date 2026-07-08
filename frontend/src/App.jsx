import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './pages/DashboardOverview';
import { CreateStaff } from './pages/CreateStaff';
import { ViewStaff } from './pages/ViewStaff';
import { StaffAttendance } from './pages/StaffAttendance';

const defaultStaff = [
  { id: 101, name: 'Elena Rostova', email: 'elena.r@sbm.academy', phone: '+91 99887 76655', role: 'Teacher', department: 'Science', joinDate: '2026-01-15', status: 'Present' },
  { id: 102, name: 'Marcus Vance', email: 'marcus.v@sbm.academy', phone: '+91 98765 43210', role: 'Coordinator', department: 'Mathematics', joinDate: '2026-03-10', status: 'Present' },
  { id: 103, name: 'Sarah Jenkins', email: 'sarah.j@sbm.academy', phone: '+91 91234 56789', role: 'Administrator', department: 'Administration', joinDate: '2026-05-20', status: 'Present' },
];

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [staff, setStaff] = useState(defaultStaff);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle adding new staff member
  const handleAddStaff = (newMember) => {
    setStaff(prev => [...prev, newMember]);
  };

  // Handle deleting a staff member
  const handleDeleteStaff = (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaff(prev => prev.filter(item => item.id !== id));
    }
  };

  // Handle toggling attendance status
  const handleToggleAttendance = (id, newStatus) => {
    setStaff(prev => prev.map(member => 
      member.id === id ? { ...member, status: newStatus } : member
    ));
  };

  // Determine active page title & subtitle
  const getHeaderDetails = () => {
    switch (activePage) {
      case 'dashboard':
        return { title: 'Dashboard Overview', subtitle: 'Real-time SBM statistics and quick controls.' };
      case 'create-staff':
        return { title: 'Create Staff Profile', subtitle: 'Add a new member to SBM Academy.' };
      case 'view-staff':
        return { title: 'Staff Directory', subtitle: 'Manage active profiles and access controls.' };
      case 'staff-attendance':
        return { title: 'Staff Attendance Report', subtitle: 'Daily log and status controls.' };
      default:
        return { title: 'Admin Console', subtitle: 'SBM Academy Admin Portal' };
    }
  };

  const { title, subtitle } = getHeaderDetails();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans antialiased">
      {/* Navigation Sidebar */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={(page) => {
          setActivePage(page);
          setSearchQuery(''); // clear search on page switch
        }} 
        staffCount={staff.length}
      />

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Dynamic Top Header */}
        <Header 
          title={title} 
          subtitle={subtitle}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Page Rendering */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activePage === 'dashboard' && (
            <DashboardOverview 
              staff={staff} 
              onCreateStaffClick={() => setActivePage('create-staff')}
            />
          )}

          {activePage === 'create-staff' && (
            <CreateStaff 
              onAddStaff={handleAddStaff} 
              onCancel={() => setActivePage('view-staff')}
            />
          )}

          {activePage === 'view-staff' && (
            <ViewStaff 
              staff={staff} 
              onDeleteStaff={handleDeleteStaff} 
              onCreateStaffClick={() => setActivePage('create-staff')}
              searchQuery={searchQuery}
            />
          )}

          {activePage === 'staff-attendance' && (
            <StaffAttendance 
              staff={staff} 
              onToggleAttendance={handleToggleAttendance}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
