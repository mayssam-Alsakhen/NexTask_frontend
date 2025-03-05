"use client";
import React, { useState, useEffect, useContext} from 'react'
import Link from 'next/link'
import AddButton from '@/Components/add/AddButton'
import axios from 'axios'
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function page() {
  const { user, loading } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
    const router = useRouter();

    useEffect(() => {
      if (loading) return;
      if (!user) {
        router.push("/login");
        return;
      }
      const fetchProjects = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/projects/user/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("API Response:", response.data); // Debugging

          if (response.data && response.data.data) {
            setProjects(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
          alert('Failed to fetch projects');
        }
      };

      fetchProjects();
    }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // Prevent rendering before redirection

  return (
    <div className='flex flex-wrap gap-x-12 gap-y-10 justify-center w-full h-full overflow-y-auto py-10 md:px-10 sm:px-0'>
      <AddButton text={"Add A New Project"} link={"/addProject"}/>

      {projects.map((project) => (
        <div
          key={project.id}
          className={`flex flex-col items-center lg:w-[350px] md:w-full sm:w-[250px] h-[250px] rounded-2xl shadow-md bg-[#b6c6ff] p-4 text-prime transition-all duration-300 ease-in-out transform hover:bg-gradient-to-r hover:from-designing hover:to-testing hover:text-white
 hover:shadow-2xl animate-slideFadeIn`}
        >
          <h2 className='text-xl font-bold mb-5'> {project.name} </h2>
          <p className='h-44 overflow-auto'>{project.description}</p>
          <div className='w-full flex justify-end text-[#1B263B] font-bold hover:text-[#E09F3E] transition-colors duration-300'>
            <Link href={`/projects/${project.id}`}>Details</Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default page
