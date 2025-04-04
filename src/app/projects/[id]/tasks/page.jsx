"use client";

import React, { useEffect, useContext , use} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import ProjectTaskSection from "@/Components/project task section/ProjectTaskSection";

const ProjectTasks = ({ params }) => {
  const {id} = use(params);
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect only after checking authentication
    }
  }, [loading, user, router]);
 

  const handleFilterChange = (newStatus) => {
    router.push(`/projects/${id}/tasks?status=${newStatus}`); // Update the URL with the new status
  };

  return (
    <div className=" lg:pt-11 pt-12 p-2">
        <ProjectTaskSection projectId={id} statusFilter={status} />
    </div>
  );
};

export default ProjectTasks;
