import React, { useEffect, useState } from "react";
import "./Modal.css";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

type ModalRegisterProps = {
  onClose: () => void;
};

type ModalProfileProps = {
  onClose: () => void;
  userId: string;
};

type User = {
  username: string;
  email: string;
  password: string;
  role: 'Admin' | 'User';
}

type Link = {
  id: string;
  short_code: string;
  long_url: string;
};

export const registerUser = async (userData: User) => {
  try {
    const response = await axios.post('http://localhost:8080/register', userData);
    return response.data;  // Return the response (e.g., inserted id)
  } catch (error: any) {
    throw new Error(error.response?.data || 'Registration failed');
  }
};

const ModalRegister: React.FC<ModalRegisterProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('User');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    const userData = {
      username,
      email,
      password,
      role: role as 'Admin' | 'User',
    };

    try {
      const result = await registerUser(userData);
      setSuccessMessage('Registration successful!');
      console.log('User registered successfully:', result);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="modal-input"
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="modal-input"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="modal-input"
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          <button type="submit" className="modal-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

const ModalProfile: React.FC<ModalProfileProps> = ({ onClose, userId }) => {
  const [userLinks, setUserLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const fetchUserLinks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/links", {
          params: { page, page_size: pageSize },
          headers: {
            x_token_subject: userId,
          },
        });
        setUserLinks(response.data);
      } catch (err) {
        setError("Failed to fetch links. Using mock data.");
        // Mock data
        const mockLinks = [
          { id: "1", short_code: "abc123", long_url: "https://example.com" },
          { id: "2", short_code: "xyz456", long_url: "https://example.org" },
          { id: "3", short_code: "pqr789", long_url: "https://example.net" },
        ];
        setUserLinks(mockLinks);
      } finally {
        setLoading(false);
        setError("") // DELETE IF READ DATA
      }
    };

    fetchUserLinks();
  }, [page, pageSize, userId]);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/users/${userId}`);
        alert("Your account has been deleted.");
        onClose(); // Close the modal after account deletion
      } catch (error) {
        setError("Failed to delete account.");
      }
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      aria-labelledby="profile-modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 id="profile-modal-title">Profile</h2>
        <div>
          <h3>Your Links</h3>
          {/* Extracted logic for displaying links */}
          {(() => {
            if (loading) {
              return <p>Loading your links...</p>;
            }
            if (error) {
              return <p style={{ color: "red" }}>{error}</p>;
            }
            if (userLinks.length > 0) {
              return (
                <div className="links-container">
                  {userLinks.map((link) => (
                    <div className="link-card" key={link.id}>
                      <p className="link-long-url">{link.long_url}</p>
                      <a
                        href={`http://localhost:8080/${link.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-short-url"
                      >
                        {link.short_code}
                      </a>
                    </div>
                  ))}
                </div>
              );
            }
            return <p>You don't have any links yet.</p>;
          })()}
        </div>

        <div>
          <button
            onClick={handleDeleteAccount}
            className="modal-button"
            style={{ backgroundColor: "#f44336" }}
            tabIndex={0}
            aria-label="Delete Account"
          >
            Delete Account
          </button>
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          tabIndex={0}
          aria-label="Close Modal"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export { ModalRegister, ModalProfile };
