'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ProjectOverviewSection() {
  const [projects, setProjects] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/projects/user/${localStorage.getItem('user_id')}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.data && response.data.data) {
          const sorted = response.data.data.sort(
            (a, b) => (b.progress ?? 0) - (a.progress ?? 0)
          );
          setProjects(sorted);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Failed to fetch projects');
      }
    };

    fetchProjects();
  }, []);

  const visibleProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <div className="bg-white/60 py-3 px-6 rounded-lg lg:w-[60%] md:w-[50%] w-full shadow-md">
      <h2 className="text-xl font-semibold mb-8">Top Projects by Progress</h2>

      <div
        className={`space-y-3 transition-all duration-300 max-h-80 ${
          showAll ? 'overflow-y-auto' : 'overflow-hidden'
        }`}
      >
        {visibleProjects.length > 0 ? (
          visibleProjects.map((project) => {
            const progress = project.progress ?? 0;

            return (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="block"
              >
                <div className="flex items-center space-x-3">
                  {/* Project name */}
                  <span className="w-32  truncate">{project.name}</span>

                  {/* Progress bar */}
                  <div className="flex-1 h-4 rounded-full">
                    <div
                      className="h-4 bg-main  rounded-r-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {/* Progress percentage */}
                  <span className="w-10 text-sm text-right text-gray-600">
                    {progress}%
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">No projects found.</p>
        )}
      </div>

      {projects.length > 6 && (
        <div className="mt-4 text-center">
          <button
              onClick={() => setShowAll((prev) => !prev)}
              className="w-full text-center text-blue-500 hover:underline mt-2"
            >
              {showAll ? "Show less ↑" : `See all (${projects.length}) →`}
            </button>
        </div>
      )}
    </div>
  );
}
