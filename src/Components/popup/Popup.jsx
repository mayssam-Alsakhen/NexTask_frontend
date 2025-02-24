import React from 'react'

export default function Popup(props) {
    return (props.trigger) ? ( 
        <div className=" z-50 fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex justify-center items-center">
        
            <div className=" relative p-5 rounded-2xl mx-auto md:w-[50%] sm:w-[80%] bg-white flex-col flex items-center min-h-fit h-80">
            <button className=" self-end"><p onClickCapture={props.onBlur} className=' text-3xl text-primary'>x</p></button>
          {props.children}
            </div>
    
            </div>
      )
      : null 
}
