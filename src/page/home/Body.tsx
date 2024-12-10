import React, { useState } from 'react';
import './Body.css';
import { useAuthStore } from '../../store/authStore';  // Assuming this is where your login state is stored
import axios from 'axios';

const Body = () => {
  const user = useAuthStore.getState().getUser();
  const [url, setUrl] = useState('');
  const [isShortened, setIsShortened] = useState(false);
  const [shortenedLink, setShortenedLink] = useState<string | null>("");

  // Function to handle URL input
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleShortenUrl = async () => {
    const { user } = useAuthStore.getState();
  
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }
  
    const headers = { Authorization: `Bearer ${user.id}` };
  
    try {
      const response = await axios.post(
        'http://localhost:8080/links',
        { long_url: user.id },
        { headers }
      );
  
      if (response && response.data) {
        const { short_code } = response.data;
        if (short_code) {
          setShortenedLink(short_code);
          setIsShortened(true);
        } else {
          console.error("Short code is missing in the response data.");
        }
      } else {
        console.error("Invalid response received from the server.");
      }
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  return (
    <main className="body">
      {user ? (
        <>
          <input
            className="url-input"
            type="text"
            placeholder="Enter your long URL here"
            value={url}
            onChange={handleUrlChange}
          />
          <button className="shorten-button" onClick={handleShortenUrl}>
            Shorten URL
          </button>

          {isShortened && shortenedLink && (
            <div className="shortened-link">
              <p>Your shortened link:</p>
              <a href={shortenedLink} target="_blank" rel="noopener noreferrer">
                {shortenedLink}
              </a>
            </div>
          )}
        </>
      ) : (
        <p>Please log in to shorten URLs.</p>
      )}
    </main>
  );
};

export default Body;