"use client"
import Image from 'next/image';
import Comment from '../comments/comments';
import React, { useEffect, useState } from 'react';
import comments from "../../../public/comment.svg"

function Card() {
const [openCommentId, setOpenCommentId] = useState(null);

const toggleComments = (id) => {
  setOpenCommentId(openCommentId === id ? null : id); 
};

  console.log(new Date());
  const [card, setCards] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost/nextask/');
        const result = await response.json();
        if (response.ok) {
          setCards(result);
        } else {
          setError(result.error );
        }
      } catch (error) {
        setError('Error fetching data.');
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      id: 1,
      title: 'In Progress',
      description: 'doing all my task on time and trackng your tasks',
      status: 'In Progress',
      isImportant: false,
      start_date: '02/3/2023',
      due_date: '09/3/2023'

    },
    {
      id: 2,
      title: 'Pending',
      description: 'doing all my task to have it done on time so i should start',
      status: 'Pending',
      isImportant: false,
      start_date: '02/3/2023',
      due_date: '09/3/2023'

    },
    {
      id: 3,
      title: 'Completed',
      description: 'doing all my task having it completed is the best thing you will see on your task board doing all my task having it completed is the best thing you will see on your task board doing all my task having it completed is the best thing you will see on your task board',
      status: 'Completed',
      isImportant: false,
      start_date: '02/3/2023',
      due_date: '09/3/2023'

    },
    {
      id: 4,
      title: 'Testing',
      description: 'doing all my task',
      status: 'Testing',
      isImportant: false,
      start_date: '02/3/2023',
      due_date: '09/3/2023'

    },
    {
      id: 5,
      title: 'Pending important ',
      description: 'doing all my task',
      status: 'Pending',
      isImportant: true,
      start_date: '02/3/2023',
      due_date: '09/3/2023'

    }
  ]
  const [cardOpen, setCardOpen] = useState(null);
  return (
    <div className='flex gap-[30px] flex-wrap justify-center gap-y-16'>
      {/* card  */}
      {cards.map(card => (
        <div key={card.id} onMouseEnter={() => setCardOpen(card.id)} onClick={() => setCardOpen(card.id)} onMouseLeave={() => setCardOpen(null)} 
        className={`relative flex justify-center items-start lg:w-[350px] md:w-full sm:w-[230px] h-[300px] ${cardOpen == card.id? "h-[400px]" :''}  transition-all duration-500 rounded-2xl 
        ${card.status == 'In Progress' && card.isImportant ? "bg-important" : card.status == 'In Progress' && !card.isImportant ? "bg-progress" : card.status == 'Pending' && card.isImportant ? "bg-important" : card.status == 'Pending' && !card.isImportant ? 'bg-pending' : card.status == 'Completed' ? 'bg-done' : card.status == 'Testing' ? 'bg-testing' : "bg-prime"} `}>
          {/* image of the card */}
          <div className={`${cardOpen == card.id ? "top-[-80px] scale-75 transform" : ""} absolute top-5 md:w-[300px] sm:w-[185px] h-[220px] bg-prime rounded-xl overflow-hidden transition-all duration-500 `}>
            <Image src={`${card.status == 'Testing'? "/testing.png" : card.status=='Pending' && !card.isImportant? '/pending.png':card.status=='Completed'? "/done.jpg" : card.status =='In Progress' && !card.isImportant? '/progress.jpg': card.status=='In Progress' ?'/important.jpg' :card.status=='Pending' ? '/important.jpg' :''}`} width={200} height={200} className='absolute top-0 left-0 w-full h-full object-cover hover:scale-125 transition-all duration-500 transform' />
          </div>
            {/* content of the card */}
            {/* title */}
          <div className={` ${cardOpen == card.id ? ' top-32 h-[256px] overflow-auto' : 'overflow-hidden top-[252px] h-8'}  text-prime absolute w-full md:px-12 sm:px-2 text-center transition-all duration-500`}>
           <div className='flex justify-between items-center mb-3 '>
            <h1 className={`text-xl max-w-56 text-left`}>{card.title}</h1>
            <div className=' cursor-pointer' onClick={() => toggleComments(card.id)} onBlur={() => toggleComments(null)}>
            <Image src={comments} width={25 } height={25} alt='comments'/>
            </div>
            </div>
            {openCommentId === card.id? <div><Comment/></div> :
            <div>
            <p className={`text-sm `}>{card.due_date}</p>

            {/* icon */}
            {card.status == 'In Progress' ? <div>
              <script src="https://cdn.lordicon.com/lordicon.js"></script>
              <lord-icon
                className='increase'
                src="https://cdn.lordicon.com/yxyampao.json"
                trigger={`${cardOpen == card.id ? "in" : ""}`}
                speed='0.5s'
                colors="primary:#050d2b"
                style={{ width: '50px', height: '50px' }}>
              </lord-icon>
            </div> : card.status == 'Pending' ? <div>
              <script src="https://cdn.lordicon.com/lordicon.js"></script>
              <lord-icon
                className='assigment'
                src="https://cdn.lordicon.com/vdjwmfqs.json"
                trigger={`${cardOpen == card.id ? "in" : ""}`}
                colors="primary:#050d2b"
                style={{ width: '50px', height: '50px' }}>
              </lord-icon>
            </div> : card.status == 'Completed' ? <div>
              <script src="https://cdn.lordicon.com/lordicon.js"></script>
              <lord-icon
                className='checked'
                src="https://cdn.lordicon.com/oqdmuxru.json"
                trigger={`${cardOpen == card.id ? "in" : ""}`}
                state="morph-check-in"
                colors="primary:#050d2b"
                style={{ width: '50px', height: '50px' }}>
              </lord-icon>
            </div> : card.status == 'Testing' ? <div>
              <script src="https://cdn.lordicon.com/lordicon.js"></script>
              <lord-icon
                src="https://cdn.lordicon.com/nizfqlnk.json"
                trigger={`${cardOpen == card.id ? "in" : ""}`}
                colors="primary:#050d2b"
                style={{ width: '50px', height: '50px' }}>
              </lord-icon>
            </div> : ''}
            {/* text desc */}
            
            <p className='text-justify' >{card.description}</p> 
            </div>}
            {/* footer */}
            <div className=' border-t border-prime my-8 py-3'>
                    <div>
                      <p className={`bg-second bg-opacity-25 backdrop-blur-lg py-2 rounded-full text-sm font-bold ${card.status == 'In Progress' && card.isImportant ? "bg-important" : card.status == 'In Progress' && !card.isImportant ? "text-progresstext" : card.status == 'Pending' && card.isImportant ? "text-importanttext" : card.status == 'Pending' && !card.isImportant ? 'text-pendingtext' : card.status == 'Completed' ? 'text-donetext' : card.status == 'Testing' ? 'text-testingtext' : "bg-prime"} `}>{card.status}</p>
                    </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Card