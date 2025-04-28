// components/Tooltip.js
import React from "react";
const Tooltip = ({ icon, tooltipText, iconClass = "" }) => {
  return (
    <div className="relative group w-[65px]">
      {/* Icon */}
      <div className={`${iconClass} text-lg  text-button`}>
        {icon}
      </div>

      {/* Tooltip */}
      <div className={`absolute left-full ml-2 w-[80px] text-center bottom-0 transform -translate-x-1/2 p-1 ${tooltipText=='Pending'? 'bg-pending':tooltipText=='In Progress'? 'bg-progress':tooltipText=='Test'? 'bg-testing':'bg-done'} text-baseText text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
        {tooltipText}
      </div>
    </div>
  );
};

export default Tooltip;
