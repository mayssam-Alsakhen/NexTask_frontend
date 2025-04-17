import React, { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

export default function Popup({ trigger, onBlur, children }) {
  const popupRef = useRef();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onBlur();
      }
    };

    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onBlur();
      }
    };

    if (trigger) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [trigger, onBlur]);

  if (!trigger) return null;

  return (
    <div className="z-50 fixed top-0 left-0 w-full h-screen bg-black/30 backdrop-blur-sm flex justify-center items-center">
      <div
        ref={popupRef}
        className="relative px-5 py-3 rounded-2xl mx-auto md:w-[60%] sm:w-[90%] shadow-2xl border-2 border-gray-200 bg-white flex-col flex items-center overflow-y-auto min-h-64 max-h-[90vh] 
        animate-fade-in-up"
      >
          {/* <button onClick={onBlur} className="self-end text-2xl text-prime">
  <IoClose />
</button> */}
        {children}
      </div>
    </div>
  );
}
