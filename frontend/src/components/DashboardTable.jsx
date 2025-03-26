import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardTable() {
  const [facultyData, setFacultyData] = useState([]);

  useEffect(() => {
    // Fetch faculty data from the backend
    axios.get('http://localhost:5000/faculty')
      .then(response => {
        setFacultyData(response.data);
      })
      .catch(error => {
        console.error('Error fetching faculty data:', error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h3>Faculty Report Status</h3>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>S.No</th>
            <th>Faculty Name</th>
            <th>WIT Report</th>
            <th>WILL Report</th>
          </tr>
        </thead>
        <tbody>
          {facultyData.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No data available</td>
            </tr>
          ) : (
            facultyData.map((faculty, index) => (
              <tr key={faculty.empId}>
                <td>{index + 1}</td>
                <td>{faculty.name}</td>
                <td>
                  {faculty.witReport ? (
                    <a href={`http://localhost:5000/uploads/${faculty.witReport}`} target="_blank" rel="noopener noreferrer">View Report</a>
                  ) : (
                    <span className="text-danger">Not Submitted</span>
                  )}
                </td>
                <td>
                  {faculty.willReport ? (
                    <a href={`http://localhost:5000/uploads/${faculty.willReport}`} target="_blank" rel="noopener noreferrer">View Report</a>
                  ) : (
                    <span className="text-danger">Not Submitted</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardTable;
