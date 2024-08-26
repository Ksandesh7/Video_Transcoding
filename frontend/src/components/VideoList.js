import React, { useEffect, useState } from 'react';

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data.videos);
    };

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Transcoded Videos</h2>
      <ul className="list-disc list-inside">
        {videos.map((video, index) => (
          <li key={index}>
            <a href={video.url} className="text-blue-500 underline" download>
              {video.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
