"use client";
import React from 'react'
import axios from 'axios';
import { useState } from 'react';

export default function AddProject () {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user_id:'',  
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,  
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem('user_id');
    console.log("Retrieved user_id from localStorage:", user_id);
    if (!user_id) {
      alert('You must be logged in to add a project.');
      return;
    }
    const updatedFormData = {
      ...formData,
      user_id,
    };
    try {
      console.log("Sending data:", updatedFormData);
      const response = await axios.post('http://localhost/nextask/add_project.php', updatedFormData, {headers : {'Content-Type': 'application/json'}});
      if (response.data.success) {
        setFormData({ title: '', description: '', user_id: user_id });
        console.log(" the connection done with "+response.data);
        alert('Project added successfully');
        window.location.href = '/projects';
      } else {
        alert(response.data.error || 'An error occurred');
      }
    } catch (error) {
      console.log(error);
      alert('Error submitting the form');
    }
  };


  return (
    <div className='w-full h-full  overflow-y-auto bg-secondDark p-10 border-2 border-designing rounded-lg'>
    <div className=' w-full h-full flex justify-center items-center'>
       <div class="w-96 sm:h-[370px] md:h[450px] py-8 px-12 bg-slate-600 bg-opacity-40 text-prime ">
        <h2 className='text-second sm:text-lg md:text-2xl text-center font-bold'>Add Your Project Details</h2>
    <form onSubmit={handleSubmit} className='h-full'>
      <div className='h-full flex flex-col justify-evenly'>
      <input type="text" name="title" onChange={handleInputChange} placeholder="Project Title" className=' outline-none p-2 bg-slate-600 text-white'/>
      <textarea name="description" onChange={handleInputChange} placeholder='description' rows={5} className=' p-2 outline-none bg-slate-600 text-white'></textarea>
      <button type="submit" className='shadow-button hover:shadow-hoverButton hover:font-extrabold bg-second py-2 rounded-lg'> ADD</button>
      </div>
    </form>
  </div>
    </div>
    </div>
  )
}
