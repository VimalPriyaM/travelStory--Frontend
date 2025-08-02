import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Navbar({ setStories }) {
  const [userInfo, setUserInfo] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const id=localStorage.getItem("userId")
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      axios.post(`http://localhost:8000/api/user/getuser/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setUserInfo(res.data.user);

      })
      .catch(err => {
        console.error("Failed to fetch user info", err);
      });
    }
  }, []);

  const onlogout = () => {
    navigate('/');
  };

  const searchresults = async () => {
    if (!query.trim()) {
      try {
        const allResponse = await axios.get(`http://localhost:8000/api/story/getstory/${id}`);
        setStories(allResponse.data.data);
        setError('');
      } catch (err) {
        setError("Failed to load stories.");
      }
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/story/searchstory',
        { query },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setStories(response.data.stories);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch stories');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') searchresults();
  };

  return (
    <div className="w-full bg-white shadow-md px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Logo */}
        <div className="text-primary font-bold text-xl text-center sm:text-left">
          Travel Story
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 mx-auto sm:mx-0">
          <input
            type="text"
            placeholder="Search Notes..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 pl-4 pr-10 bg-white/30 backdrop-blur-lg rounded-md shadow-inner text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 text-lg cursor-pointer" onClick={searchresults}>
            <IoSearch />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className='text-red-600 text-sm text-center sm:text-left'>
            {error}
          </div>
        )}

        {/* User Info and Logout */}
        <div className="flex flex-col sm:items-end text-center sm:text-right">
          <h3 className="text-base sm:text-lg font-semibold text-black">
            {userInfo ? userInfo.name : 'Loading...'}
          </h3>
          <button
            onClick={onlogout}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-xl text-sm sm:text-base hover:bg-cyan-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
