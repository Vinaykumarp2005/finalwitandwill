import React, { useState } from 'react';
import axios from 'axios';

function FacultyDashboard() {
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState('wit');
  const empId = '21CSE012'; // Example faculty ID

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportType', reportType);

    try {
      await axios.post(`http://localhost:5000/upload-report/${empId}`, formData);
      alert('Report uploaded successfully!');
    } catch (error) {
      alert('Upload failed. Check console for details.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Faculty Dashboard</h2>
      <label>
        Select Report Type:
        <select onChange={(e) => setReportType(e.target.value)}>
          <option value="wit">WIT Report</option>
          <option value="will">WILL Report</option>
        </select>
      </label>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Report</button>
    </div>
  );
}

export default FacultyDashboard;
