"use client";
import React, { useState } from 'react';
import axios from 'axios';
import './login.css' 
import { useRouter } from "next/navigation";

function Login() {
    const [action , setAction] = useState('');
    const router = useRouter();
    //fetsh start
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage('');
      
      try {
          const response = await axios.post('http://127.0.0.1:8000/api/login', loginData, {
              headers: { 'Content-Type': 'application/json' }
          });
  
          console.log("Login Response:", response.data);
  
          if (response.data.token) {
              // Store token
              localStorage.setItem('token', response.data.token);
  
              // Fetch user details after login
              const meResponse = await axios.get('http://127.0.0.1:8000/api/me', {
                  headers: { Authorization: `Bearer ${response.data.token}` }
              });
  
              console.log("Me Response:", meResponse.data);
  
              // Store user data
              localStorage.setItem('user', JSON.stringify(meResponse.data));
              localStorage.setItem("user_id", meResponse.data.id);
  
              // Redirect to dashboard by changing `window.location`
              window.location.href = '/dashboard';
          } else {
              setErrorMessage(response.data.error || "Login failed");
          }
      } catch (error) {
          console.error("Error:", error);
          setErrorMessage(error.response?.data?.error || "An error occurred during login");
      }
  };
  
    
      const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/register', registerData,{headers:{'Content-Type': 'application/json'}} );
          console.log(response.data);   
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_id', response.data.user.id);
            setRegisterData({ name: '', email: '', password: '' });
            router.push('/dashboard');
        } else {
            setErrorMessage("Registration failed");
        }
        } catch (error) {
          console.error(error);
          setErrorMessage(error.response?.data?.error || "An error occurred during registration");
        }
      };
    
      const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        console.log(name, value);
        if (formType === 'login') {
          setLoginData({ ...loginData, [name]: value });
        } else if (formType === 'register') {
          setRegisterData({ ...registerData, [name]: value });
        }
      };
      //end

    const registerLink =()=>{
setAction('active');
setErrorMessage('');
    };

    const loginLink =()=>{
        setAction('');
        setErrorMessage('');
            };

  return (
    <div>
          <video autoPlay muted loop className='fixed top-0 left-0 -z-10 w-full h-full object-cover'>
  <source src="/login.mp4" type="video/mp4" />
</video>
<div className=' min-h-[100vh] w-full flex items-center justify-center'>
<div className={`wrapper ${action} flex items-center overflow-hidden relative md:w-[420px] sm:w-80 h-[450px] border-2 border-solide border-[#ffffff2a] backdrop-blur-3xl rounded-xl`}>
    <div className='formBox login w-full md:p-10 sm:p-3 '>
        <form onSubmit={handleLoginSubmit}>
            <h1 className='text-4xl text-center'>Login</h1>
            <div className='inputBox relative w-full h-[50px] my-8 mx-0'>
                <input type="email" name='email' required className='w-full h-full outline-none border border-solid border-[#ffffff2a] p-3 rounded-[40px] bg-[transparent]'
                onChange={(e) => handleInputChange(e, 'login')}
                 />
                <label>Email</label>
            </div>
            <div className='inputBox  relative w-full h-[50px] my-8 mx-0'>

                <input type="password" name='password' required className='w-full h-full outline-none border border-solid border-[#ffffff2a] p-3 rounded-[40px] bg-[transparent]'
                onChange={(e) => handleInputChange(e, 'login')}
                />
                <label>Password</label>
            </div>
            <button type='submit' className=' w-full h-11 rounded-[40px] cursor-pointer font-bold'>Login</button>
            {/* fetsh , handling errors */}
            {errorMessage && <p className='text-red-500 mt-2'>{errorMessage}</p>}
            <div className='registerLink text-center mt-5 mb-4'>
                Don not have an account? <a href="#" className=' font-semibold' onClick={registerLink}> Register</a>
            </div>
        </form>
    </div>

    {/* register */}
    <div className={'formBox register w-full  md:p-10 sm:p-3 absolute '}>
        <form onSubmit={handleRegisterSubmit}>
            <h1 className='text-4xl text-center'>Registration</h1>
            <div className='inputBox  relative w-full h-[50px] my-8 mx-0'>
                <input type="text" name="name" required className='w-full h-full outline-none border border-solid border-[#ffffff2a] p-3 rounded-[40px] bg-[transparent]' 
                onChange={(e) => handleInputChange(e, 'register')}
                />
                <label>Username</label>
            </div>
            <div className='inputBox  relative w-full h-[50px] my-8 mx-0'>
                <input type="email"  name="email" required className='w-full h-full outline-none border border-solid border-[#ffffff2a] p-3 rounded-[40px] bg-[transparent]'
                onChange={(e) => handleInputChange(e, 'register')}
                />
                <label>Email</label>
            </div>
            <div className='inputBox  relative w-full h-[50px] my-8 mx-0'>
                <input type="password" name='password' required className='w-full h-full outline-none border border-solid border-[#ffffff2a] p-3 rounded-[40px] bg-[transparent]'
                onChange={(e) => handleInputChange(e, 'register')} />
                <label>Password</label>
            </div>
           
            <button type='submit' className=' w-full h-11 rounded-[40px] cursor-pointer font-bold '>Register</button>
            {/* fetch errors */}
            {errorMessage && <p className='text-red-500 mt-2'>{errorMessage}</p>}
            <div className='registerLink text-center mt-5 mb-4'>
                 Already have an account? <a href="#" className='font-semibold' onClick={loginLink}> Login</a>
            </div>
        </form>
    </div>
 </div>
 </div>
  </div>
  )
}

export default Login