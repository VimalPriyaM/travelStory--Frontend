import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Signup() {
  const [usersignup, setUsersignup] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();
  const [result, setResult] = useState("");

  async function handlesubmit(e) {
    e.preventDefault();
    const { name, email, mobile, password, confirmPassword } = usersignup;

    if (!name || !email || !mobile || !password || !confirmPassword) {
      setResult("All fields are mandatory");
      return;
    }

    if (password !== confirmPassword) {
      setResult("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/user/signup", usersignup);
      console.log("Signup successful:", response.data);
      alert("Signup successful!");
      localStorage.setItem("signuptoken", response.data.token);
      setResult("");
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
        icon:"success",
        text:"Account created successfully"
      })
      setResult("Signup failed. Please try again.");
      navigate('/')
    }
  }

  function handlelogin(e) {
    setUsersignup({ ...usersignup, [e.target.name]: e.target.value });
  }

  function loginroute() {
    navigate('/');
  }

  return (
    <div className='min-h-screen w-full bg-cyan-50 flex items-center justify-center px-4'>
      <div className=' absolute top-[-100px] right-0 z-0'></div>

      <div className='flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden z-10'>
        
        {/* Image section - only on medium and above */}
        <div className='hidden md:flex md:w-3/5 relative'>
          <img src='/bg-2.jpg' alt='background' className='object-cover w-full h-full rounded-xl' />
          <div className="absolute bottom-12 left-8 right-8 text-white bg-black bg-opacity-50 p-4 rounded-lg">
            <h4 className="text-2xl md:text-3xl font-bold mb-2">Join the <br /> Adventure</h4>
            <p className="text-sm md:text-base">
              Create an account documenting your travels and preserving your memories in your personal travel journal.
            </p>
          </div>
        </div>

        {/* Form section */}
        <div className='w-full md:w-2/5 p-6 sm:p-10 flex flex-col justify-center'>
          <form className='space-y-4' onSubmit={handlesubmit}>
            <h4 className='text-2xl font-semibold text-gray-800'>Signup</h4>

            <input
              type='text'
              placeholder='Name'
              name='name'
              value={usersignup.name}
              onChange={handlelogin}
              className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'
              required
            />
            <input
              type='email'
              placeholder='Email'
              name='email'
              value={usersignup.email}
              onChange={handlelogin}
              className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'
              required
            />
            <input
              type='text'
              placeholder='Mobile'
              name='mobile'
              value={usersignup.mobile}
              onChange={handlelogin}
              className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'
              required
            />
            <input
              type='password'
              placeholder='Password'
              name='password'
              value={usersignup.password}
              onChange={handlelogin}
              className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'
              required
            />
            <input
              type='password'
              placeholder='Confirm Password'
              name='confirmPassword'
              value={usersignup.confirmPassword}
              onChange={handlelogin}
              className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'
              required
            />

            <button
              type="submit"
              className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition"
            >
              SIGN UP
            </button>

            <div className="text-center text-gray-500">Or</div>

            <button
              onClick={loginroute}
              type="button"
              className="w-full border border-cyan-600 bg-cyan-100 text-cyan-700 py-3 rounded-lg hover:bg-white transition"
            >
              LOGIN
            </button>

            {result && <p className='text-red-600 text-sm text-center'>{result}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
