import React from 'react';
import Header from './Header';
import SubjectUpload from './SubjectUpload.jsx';
import DashboardTable from './DashboardTable.jsx';

function AdminDashboard() {
  return (
    <div>
      <Header />
      <h2>Admin Dashboard</h2>
      <SubjectUpload />
      <DashboardTable />
    </div>
  );
}

export default AdminDashboard;
