import React, { useState } from 'react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [transcodedVideos, setTranscodedVideos] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('No File Selected')
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading...");
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentage);
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setStatus("Upload successful...");
        setTimeout(fetchTranscodedVideos, 120000);
      } else {
        setStatus("Upload failed.");
      }
    } catch (error) {
      setStatus("Error during upload.");
      console.log(error)
    }
  };

  const fetchTranscodedVideos = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/videos?filename=${file.name}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("data: ",data);
      setTranscodedVideos(data.videos);
      setStatus("Transcoding completed.");
    } catch (error) {
        setStatus("Error fetching transcoded videos.");
    }
};

  return (
    <div className="container mx-auto p-4 w-[80%] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
        <input type="file" onChange={handleFileChange} className="mb-4 p-2 border border-gray-300 rounded" />
        <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded">Upload</button>
        {status && <div className="mt-2 text-green-600">{status}</div>}
        {transcodedVideos.length > 0 && (
            <div className="mt-4">
                <h3 className="text-xl font-bold mb-2 mt-5">Transcoded Videos:</h3>
                <ul className="list-disc list-inside">
                    {transcodedVideos.map((video, index) => (
                        <li key={index}>
                            <a href={video.url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                                {video.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};

export default Upload;