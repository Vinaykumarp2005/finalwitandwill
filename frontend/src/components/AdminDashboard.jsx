import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./AdminDashboard.css";
import logo from "../api/logo.jpeg";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [facultyData, setFacultyData] = useState([]);
  const [submitted, setSubmitted] = useState(0);
   const [modalOpen, setModalOpen] = useState(false);
   
     const [selectedYear, setSelectedYear] = useState("");
     const [selectedSemester, setSelectedSemester] = useState("");
  const [notSubmitted, setNotSubmitted] = useState(0);
  const [hasSubjects, setHasSubjects] = useState(false);
  const [file, setFile] = useState(null);
  const fetchReport = () => {
    if (!selectedYear || !selectedSemester) {
      alert("Please select year and semester.");
      return;
    }
    const reportUrl = `https://drive.google.com/file/d/1dRmr10xdXgaB93ScyAj0cf7-Y0ZSa1Wh/view?usp=sharing`;
    window.open(reportUrl, "_blank");
  };

  const navigate=useNavigate()
  // Fetch faculty data
  useEffect(() => {
    axios
      .get("http://localhost:4000/faculty") // Replace with actual API
      .then((response) => {
        setFacultyData(response.data);

        // Count submitted & not submitted reports
        let submittedCount = 0;
        let notSubmittedCount = 0;
        let subjectsExist = false;

        response.data.forEach((faculty) => {
          if (faculty.witReport || faculty.willReport) {
            submittedCount++;
          } else {
            notSubmittedCount++;
          }

          if (faculty.mappedSubjects.length > 0) {
            subjectsExist = true;
          }
        });

        setSubmitted(submittedCount);
        setNotSubmitted(notSubmittedCount);
        setHasSubjects(subjectsExist);
      })
      .catch((error) => console.error("Error fetching faculty data:", error));
  }, []);

  // Dark mode toggle
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Chart data
  const chartData = {
    labels: ["Submitted", "Not Submitted"],
    datasets: [
      {
        data: [submitted, notSubmitted],
        backgroundColor: ["#4CAF50", "#FF5252"],
        hoverBackgroundColor: ["#45A049", "#D32F2F"],
      },
    ],
  };

  // Subject Upload Handlers
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:4000/upload", formData);
      alert("Subjects extracted successfully!");
      console.log(response.data);
      setHasSubjects(true); // Update state after successful upload
    } catch (error) {
      alert("Upload failed. Check console for details.");
      console.error(error);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <h2 className="navbar-title">Admin Dashboard</h2>
        <ul className="navbar-links">
          <li><a href="#" onClick={() => navigate("/")}>Home</a></li>
          {/* <li><a href="#">Reports</a></li> */}
          <li><button className="nav-btn" onClick={() => setModalOpen(true)}>Reports</button></li>
          
          {/* <li><a href="#">Users</a></li> */}
          {/* <li><a href="#">Settings</a></li> */}
          {/* <li><button className="nav-btn">Generate Report</button></li> */}
          <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>


        </ul>
      </nav>

      <div className="container mt-4">
        {/* Show Upload Section only if no subjects exist */}
        {!hasSubjects && (
          <div className="upload-container mb-5">
            <h3>Upload Timetable</h3>
            <input type="file" onChange={handleFileChange} />
            <button className="upload-btn" onClick={handleUpload}>Upload</button>
          </div>
        )}

        {/* Pie Chart Section */}
        <div className="chart-container">
          <div className="chart-box">
            <h3 className="text-center">Report Submission Status</h3>
            <Pie data={chartData} />
          </div>
        </div>

        {/* Faculty Table Section */}
        <div className="table-container">
          <h3 className="text-center mb-3">Faculty Report Status</h3>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Faculty Name</th>
                <th>Subjects Mapped</th>
                <th>WIT Report</th>
                <th>WILL Report</th>
              </tr>
            </thead>
            <tbody>
              {facultyData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No data available</td>
                </tr>
              ) : (
                facultyData.map((faculty, index) => (
                  <tr key={faculty.empId}>
                    <td>{index + 1}</td>
                    <td>{faculty.name}</td>
                    <td>{faculty.mappedSubjects.join(", ")}</td>
                    <td>
                      {faculty.witReport ? (
                        <a href={`http://localhost:4000/uploads/${faculty.witReport}`} target="_blank" rel="noopener noreferrer">View Report</a>
                      ) : (
                        <span className="text-danger">Not Submitted</span>
                      )}
                    </td>
                    <td>
                      {faculty.willReport ? (
                        <a href={`http://localhost:4000/uploads/${faculty.willReport}`} target="_blank" rel="noopener noreferrer">View Report</a>
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
      </div>
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="mb-4">Select Report Details</h3>
            <div className="modal-dropdowns">
              <label>Regulation:</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="">Select Regulation</option>
                <option value="R19">R19</option>
                <option value="A19">A19</option>
                <option value="R22">R22</option>
              </select>
              <label>Semester:</label>
              <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
            <button className="fetch-btn mb-4 mt-2" onClick={fetchReport}>Get Report</button>
            <button className="close-btn" onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
