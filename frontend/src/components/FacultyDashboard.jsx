import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Faculty.css";
import logo from "../api/logo.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Faculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const witFileInputRef = useRef(null);
const willFileInputRef = useRef(null);

  const [uploadDropdownOpen, setUploadDropdownOpen] = useState(false);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState("");
  const navigate = useNavigate();

  const [witLink, setWitLink] = useState("");
  const [willLink, setWillLink] = useState("");
  
  const handleLinkSubmit = async (type) => {
    const link = type === "wit" ? witLink : willLink;
    const empId = localStorage.getItem("empId"); // Ensure empId is saved at login
  
    if (!empId || !link) return alert("Missing data");
  
    try {
      await axios.post(`http://localhost:4000/api/faculty/submit-link/${empId}`, { type, link });
      alert(`${type.toUpperCase()} link submitted!`);
      setWitLink(""); setWillLink("");
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };
  

  useEffect(() => {
    // fetch("http://localhost:4000/faculty")
    axios.get("http://localhost:4000/faculty")
      .then((response) => response.json())
      .then((data) => setFacultyList(data))
      .catch((error) => console.error("Error fetching faculty:", error));
  }, []);

  const slides = [
    { type: "video", src: "https://www.youtube.com/embed/RVEBZuTxdWM" },
    { type: "video", src: "https://www.youtube.com/embed/35v51EjORGI" },
    { type: "video", src: "https://www.youtube.com/embed/6UeGUXRV3EI" },
    { type: "image", src: "https://vnrvjiet.ac.in/assets/images/CSE_Department_Inner.png.png" },
    { type: "image", src: "https://vnrvjiet.ac.in/assets/images/Frame%20137.png" },
    { type: "image", src: "https://vnrvjiet.ac.in/assets/images/Frame%20142.png" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const iframeRef = useRef(null);

  const stopVideo = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const nextSlide = () => {
    stopVideo();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    stopVideo();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides[currentIndex].type === "video") return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        let nextIndex = (prevIndex + 1) % slides.length;
        return slides[nextIndex].type === "video" ? prevIndex : nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const fetchReport = () => {
    if (!selectedYear || !selectedSemester) {
      alert("Please select year and semester.");
      return;
    }
    const reportUrl = `https://drive.google.com/file/d/1dRmr10xdXgaB93ScyAj0cf7-Y0ZSa1Wh/view?usp=sharing`;
    window.open(reportUrl, "_blank");
  };

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const handleFileUpload = (event, reportType) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`Uploading ${reportType}:`, file.name);
      // You can add actual upload logic here
    }
  };



  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="navbar-links">
          <li><a href="" onClick={() => navigate("/")}>Home</a></li>
          {/* <li><a href="#">About us</a></li> */}
          {/* <li><a href="#">Contact</a></li> */}
          <li><button className="nav-btn" onClick={() => setModalOpen(true)}>Reports</button></li>
          {/* <li className="dropdown">
            <button className="nav-btn dropdown-toggle" onClick={() => setUploadDropdownOpen(!uploadDropdownOpen)}>
              Upload Report
            </button>
            {uploadDropdownOpen && (
              <ul className="dropdown-menu show">
                <li>
                  <button className="dropdown-item" onClick={() => witFileInputRef.current.click()}>
                    Upload WIT Report
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => willFileInputRef.current.click()}>
                    Upload WILL Report
                  </button>
                </li>
              </ul>
            )}
          </li> */}
          <div className="form-group mt-4">
  <label>WIT Report Drive Link</label>
  <input className="form-control mb-2" type="url" value={witLink} onChange={(e) => setWitLink(e.target.value)} />
  <button className="btn btn-success mb-3" onClick={() => handleLinkSubmit("wit")}>Submit WIT Link</button>

  <label>WILL Report Drive Link</label>
  <input className="form-control mb-2" type="url" value={willLink} onChange={(e) => setWillLink(e.target.value)} />
  <button className="btn btn-success" onClick={() => handleLinkSubmit("will")}>Submit WILL Link</button>
</div>


          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={witFileInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e, "WIT Report")}
          />
          <input
            type="file"
            ref={willFileInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e, "WILL Report")}
          />
          {/* Sample Report Dropdown */}
          <li className="dropdown">
            <button className="nav-btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Sample Report
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="https://docs.google.com/document/d/1mRlyeZ2HiHjOk9SCXXUf4CDLCZkjl4Qa/edit?usp=drive_link&ouid=113209715859984812054&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer">
                  Sample WIT Report
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="https://docs.google.com/document/d/1iBXPVMf9KLwae28mWWgK7OBCN75QvSDK/edit?usp=drive_link&ouid=113209715859984812054&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer">
                  Sample WILL Report
                </a>
              </li>
            </ul>
          </li>

          <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </ul>
      </nav>

      <div className="faculty-container">
        <div className="carousel-container">
          <div className="carousel-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={index} className="carousel-slide">
                {slide.type === "video" ? (
                  <iframe ref={iframeRef} className="carousel-video" src={slide.src} title={`Slide ${index + 1}`} allowFullScreen></iframe>
                ) : (
                  <img src={slide.src} alt={`Slide ${index + 1}`} className="carousel-image" />
                )}
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" onClick={prevSlide}>❮</button>
          <button className="carousel-control-next" onClick={nextSlide}>❯</button>
        </div>

        <div className="carousel-dots">
          {slides.map((_, index) => (
            <span key={index} className={`dot ${index === currentIndex ? "active" : ""}`} onClick={() => setCurrentIndex(index)}></span>
          ))}
        </div>
      </div>
      <div className="about-section">
  <div className="about-container">
    <h2 className="about-title">About WIT & WIL</h2>
    <p className="about-description p-5 justify-content-center">
    Outcome Based Education (OBE) has become one of main criterion for accreditation by the National Board of Accreditation (NBA) in light of the Washington Accord. Whereas the traditional education process emphasizes the inputs in  terms of  teaching staff,  curriculum, labs,  library and other resources, OBE shifts from  measuring  the  inputs  and processes  to  include  the  measurement  of  outcomes.  The mission and vision of the Institution guide the Program Education Objectives. The Program Educational  Objectives  are  evaluated  through  Program  Outcomes.  Program  outcomes describe what set of skills students are expected to learn and be able to do upon graduation. The Program Outcomes at department level are based on Learning Outcomes at subject level. The definition of “WIT & WIL” method explained as an active methodology of teaching and learning  activity  with  “Why  am  I  Teaching  &  What  I  am  Teaching”  from  Teacher‟s perspective. And from student‟s perspective “Why am I Learning & What I am Learning”
    </p>

    <div className="info-card-container">
      <div className="info-card">
        <div className="info-icon">🎓</div>
        <h3 className="info-title">Practical Learning</h3>
        <p className="info-text">
          Gain hands-on experience with industry projects and live case studies.
        </p>
      </div>

      <div className="info-card">
        <div className="info-icon">💼</div>
        <h3 className="info-title">Industry Exposure</h3>
        <p className="info-text">
          Work with top companies through internships and on-site training.
        </p>
      </div>

      <div className="info-card">
        <div className="info-icon">🚀</div>
        <h3 className="info-title">Career Growth</h3>
        <p className="info-text">
          Enhance your employability with real-world skills and professional networking.
        </p>
      </div>
    </div>
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

export default Faculty;
