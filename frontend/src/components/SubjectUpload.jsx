import React, { useState } from 'react';
import axios from 'axios';

function SubjectUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      alert('Subjects extracted successfully!');
      console.log(response.data);
    } catch (error) {
      alert('Upload failed. Check console for details.');
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Upload Timetable</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default SubjectUpload;
