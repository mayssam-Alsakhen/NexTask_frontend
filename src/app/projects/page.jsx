"use client";
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AddButton from '@/Components/add/AddButton'
import axios from 'axios'


function page() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        alert('You need to be logged in to view your projects');
        return;
      }
      try {
        const response = await axios.get(`http://localhost/nextask/get_projects.php?user_id=${user_id}`);
        if (response.data && response.data.projects) {
          setProjects(response.data.projects); 
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Failed to fetch projects');
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className='flex flex-wrap gap-x-12 gap-y-10 justify-center w-full h-full overflow-y-auto bg-secondDark py-10 md:px-10 sm:px-0 border-2 border-designing rounded-lg'>
<AddButton text={"Add A New Project"} link={"/addProject"}/>

{projects.map((project)=>(
  <div key={project.id} className='flex flex-col items-center lg:w-[350px] md:w-full sm:w-[250px] h-[300px] rounded-xl bg-second p-4 text-prime'>
  <h1 className='text-2xl font-bold mb-5'> {project.title} </h1>
  <p className='h-44 overflow-auto'>{project.description}</p>
  <div className='w-full flex justify-end text-designing font-bold'><Link  href={`/projects/${project.id}`}>Details</Link></div>
</div>
))}

    </div>
  )
}

export default page