"use client";

import React, { useEffect, useContext , use} from "react";
import { useRouter} from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import ProjectTaskSection from "@/Components/project task section/ProjectTaskSection";

const ProjectTasks = ({ params }) => {
  const {id} = use(params);
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect only after checking authentication
    }
  }, [loading, user, router]);
 
  return (
    <div className=" lg:pt-11 pt-12 p-2">
        <ProjectTaskSection projectId={id}/>
    </div>
  );
};

export default ProjectTasks;
