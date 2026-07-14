import React, { useState, useEffect } from 'react';
import API_BASE_URL from './config';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './pages/DashboardOverview';
import { CreateStaff } from './pages/CreateStaff';
import { ViewStaff } from './pages/ViewStaff';
import { StaffProfile } from './pages/StaffProfile';
import { StaffAttendance } from './pages/StaffAttendance';
import { Login } from './pages/Login';
import { StaffDashboard } from './pages/StaffDashboard';

const defaultStaff = [
  { id: 101, name: 'Elena Rostova', email: 'elena.r@sbm.academy', phone: '+91 99887 76655', role: 'Teacher', department: 'Science', joinDate: '2026-01-15', status: 'Present' },
  { id: 102, name: 'Marcus Vance', email: 'marcus.v@sbm.academy', phone: '+91 98765 43210', role: 'Coordinator', department: 'Mathematics', joinDate: '2026-03-10', status: 'Present' },
  { id: 103, name: 'Sarah Jenkins', email: 'sarah.j@sbm.academy', phone: '+91 91234 56789', role: 'Administrator', department: 'Administration', joinDate: '2026-05-20', status: 'Present' },
];

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [staff, setStaff] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('sbm_token'));
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem('sbm_admin') || 'null'));
  const [staffUser, setStaffUser] = useState(JSON.parse(localStorage.getItem('sbm_staff') || 'null'));

  useEffect(() => {
    if (isAuthenticated) {
      fetchStaff();
    }
  }, [isAuthenticated]);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('sbm_token');
      const res = await fetch(`${API_BASE_URL}/api/v1/staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStaff(data.data.staff);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleLoginSuccess = (role, user) => {
    if (role === 'admin') {
      localStorage.setItem('sbm_admin', JSON.stringify(user));
      setAdminUser(user);
    } else if (role === 'staff') {
      localStorage.setItem('sbm_staff', JSON.stringify(user));
      setStaffUser(user);
      setActivePage('staff-dashboard');
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('sbm_token');
    localStorage.removeItem('sbm_admin');
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  // Handle adding new staff member
  const handleAddStaff = (newMember) => {
    setStaff(prev => [...prev, newMember]);
  };

  // Handle deleting a staff member
  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        const token = localStorage.getItem('sbm_token');
        const res = await fetch(`${API_BASE_URL}/api/v1/staff/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok || res.status === 204) {
          setStaff(prev => prev.filter(item => item.id !== id));
          if (activePage === 'staff-profile' && selectedStaffId === id) {
            setActivePage('view-staff');
          }
        } else {
          alert('Failed to delete staff member');
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('An error occurred while deleting staff.');
      }
    }
  };

  const handleEditStaff = (member) => {
    setSelectedStaffId(member.id);
    setActivePage('create-staff');
  };

  const handleViewStaff = (id) => {
    setSelectedStaffId(id);
    setActivePage('staff-profile');
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
        return { title: 'Create Staff Profile', subtitle: 'Add a new member to SBM.' };
      case 'view-staff':
        return { title: 'Staff Directory', subtitle: 'Manage active profiles and access controls.' };
      case 'staff-profile':
        return { title: 'Staff Directory', subtitle: 'Manage active profiles and access controls.' };
      case 'staff-attendance':
        return { title: 'Staff Attendance Report', subtitle: 'Daily log and status controls.' };
      default:
        return { title: 'Admin Console', subtitle: 'SBM Admin Portal' };
    }
  };

  const { title, subtitle } = getHeaderDetails();

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render Staff Portal if staff is logged in
  if (staffUser) {
    return (
      <StaffDashboard 
        user={staffUser} 
        onLogout={() => {
          localStorage.clear();
          setStaffUser(null);
          setIsAuthenticated(false);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans antialiased">
      {/* Navigation Sidebar */}
      <div className="print:hidden">
        <Sidebar 
          activePage={activePage} 
          setActivePage={(page) => {
            setActivePage(page);
            setSelectedStaffId(null); // Clear any selected staff when navigating
            setSearchQuery(''); // clear search on page switch
          }} 
          staffCount={staff.length}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onLogout={handleLogout}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div 
        className={`flex flex-col min-h-screen transition-all duration-300 print:pl-0 ${
          isCollapsed ? "md:pl-20" : "md:pl-56"
        }`}
      >
        {/* Dynamic Top Header */}
        <div className="print:hidden">
          <Header 
            title={title} 
            subtitle={subtitle}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            adminUser={adminUser}
            onMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          />
        </div>

        {/* Dynamic Page Rendering */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto print:p-0">
          {activePage === 'dashboard' && (
            <DashboardOverview 
              staff={staff} 
              onCreateStaffClick={() => {
                setSelectedStaffId(null);
                setActivePage('create-staff');
              }}
            />
          )}

          {activePage === 'create-staff' && (
            <CreateStaff 
              staffList={staff}
              initialData={selectedStaffId ? staff.find(s => s.id === selectedStaffId) : null}
              onAddStaff={handleAddStaff} 
              onUpdateStaff={(updatedMember) => {
                setStaff(prev => prev.map(s => s.id === updatedMember.id ? updatedMember : s));
              }}
              onCancel={() => {
                setSelectedStaffId(null);
                setActivePage('view-staff');
              }}
            />
          )}

          {activePage === 'view-staff' && (
            <ViewStaff 
              staff={staff} 
              onDeleteStaff={handleDeleteStaff} 
              onEditStaff={handleEditStaff}
              onViewStaff={handleViewStaff}
              onCreateStaffClick={() => {
                setSelectedStaffId(null);
                setActivePage('create-staff');
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {activePage === 'staff-profile' && selectedStaffId && (
            <StaffProfile 
              member={staff.find(s => s.id === selectedStaffId)}
              onBack={() => setActivePage('view-staff')}
              onEdit={handleEditStaff}
              onDelete={handleDeleteStaff}
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
