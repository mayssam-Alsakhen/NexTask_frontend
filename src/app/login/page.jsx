"use client";
import React, { useState } from 'react';
import './login.css' 

function Login() {
    const [action , setAction] = useState('');
    const registerLink =()=>{
setAction('active')
    };

    const loginLink =()=>{
        setAction('')
            };
   
  return (
    <div>
          <video autoPlay muted loop className='fixed top-0 left-0 -z-10 w-full h-full object-cover'>
  <source src="/login.mp4" type="video/mp4" />
</video>
<div className=' min-h-[100vh] w-full flex items-center justify-center'>
<div className={`wrapper ${action} flex items-center overflow-hidden relative md:w-[420px] sm:w-80 h-[450px] border-2 border-solide border-[#ffffff2a] backdrop-blur-3xl rounded-xl`}>
    <div className='formBox login w-full md:p-10 sm:p-3 '>
        <form action="">
            <h1 className='text-4xl text-center'>Login</h1>
            <div className='inputBox relative w-full h-[50px] my-8 mx-0'>
                <input type="text"  required className='w-full h-full outline-none border border-solid border-[#ffffff2a] p-3 rounded-[40px] bg-[transparent]' />
                <label>UserName</label>
            </div>
            <div className='inputBox  relative w-full h-[50px] my-8 mx-0'>
                <input type="password" required className='w-full h-full outline-none border border-solid border-[#ffffff2a] p-3 rounded-[40px] bg-[transparent]' />
                <label>Password</label>
            </div>
           
            {/* <div className='remember flex  justify-between mt-[-15px] mb-4'>
                <label>
                    <input type="checkbox" />
                    Remember me
                </label>
                <a href="#"> Forgot password ?</a>
            </div> */}
            <button type='submit' className=' w-full h-11 rounded-[40px] cursor-pointer font-bold'>Login</button>
            <div className='registerLink text-center mt-5 mb-4'>
                Don not have an account? <a href="#" className=' font-semibold' onClick={registerLink}> Register</a>
            </div>
        </form>
    </div>

    {/* register */}
    <div className={'formBox register w-full  md:p-10 sm:p-3 absolute '}>
        <form action="">
            <h1 className='text-4xl text-center'>Registration</h1>
            <div className='inputBox  relative w-full h-[50px] my-8 mx-0'>
                <input type="text"  required className='w-full h-full outline-none border border-solid border-[#ffffff2a] p-3 rounded-[40px] bg-[transparent]' />
                <label>Username</label>
            </div>
            <div className='inputBox  relative w-full h-[50px] my-8 mx-0'>
                <input type="email"  required className='w-full h-full outline-none border border-solid border-[#ffffff2a] p-3 rounded-[40px] bg-[transparent]' />
                <label>Email</label>
            </div>
            <div className='inputBox  relative w-full h-[50px] my-8 mx-0'>
                <input type="password"  required className='w-full h-full outline-none border border-solid border-[#ffffff2a] p-3 rounded-[40px] bg-[transparent]' />
                <label>Password</label>
            </div>
            {/*  */}
            {/* <div className='remember flex  justify-between mt-[-15px] mb-4'>
                <label>
                    <input type="checkbox" />
                    Remember me
                </label>
                <a href="#"> agree terms..</a>
            </div> */}
            <button type='submit' className=' w-full h-11 rounded-[40px] cursor-pointer font-bold '>Register</button>
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