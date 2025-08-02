import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function navigation() {
    navigate('/signup');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/user/login', {
        email,
        password
      });
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id);

      Swal.fire({
        title: "Login Successful",
        text: "Navigating to dashboard",
        icon: "success"
      });

      navigate('/home');
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-cyan-50 flex items-center justify-center px-4">
      <div className="login-ui-box absolute top-[-100px] right-24 z-0"></div>
      <div className="login-ui-box absolute top-10 left-10 z-0"></div>

      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden z-10">
        
        {/* Image Section - Hidden on small screens */}
        <div className="hidden md:flex md:w-1/2 relative">
          <img src="/bg-1.jpg" alt="bg" className="w-full h-full object-cover" />
          <div className="absolute bottom-10 m-2 text-white bg-black bg-opacity-50 p-4 rounded-lg">
            <h4 className="text-2xl md:text-3xl font-bold mb-2">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-sm">
              Record your travel experiences and memories in your personal travel journal
            </p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h4 className="text-2xl font-bold text-gray-800">Login</h4>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition"
            >
              LOGIN
            </button>

            <div className="text-center text-gray-500">Or</div>

            <button
              type="button"
              onClick={navigation}
              className="w-full border border-cyan-600 bg-cyan-100 text-cyan-700 py-3 rounded-lg hover:bg-white transition"
            >
              CREATE ACCOUNT
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
