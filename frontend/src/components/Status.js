import React, { useEffect, useState } from 'react';

const Status = () => {
  const [status, setStatus] = useState("Waiting for transcoding to complete...");

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch('/api/status');
      const data = await response.json();
      if (data.status === 'completed') {
        setStatus("Transcoding completed!");
        clearInterval(interval);
      } else if (data.status === 'in-progress') {
        setStatus("Transcoding in progress...");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Transcoding Status</h2>
      <div>{status}</div>
    </div>
  );
};

export default Status;
