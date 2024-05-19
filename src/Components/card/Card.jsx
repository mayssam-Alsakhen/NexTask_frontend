"use client"
import Image from 'next/image';
import React, { useState } from 'react'

function Card() {
  const cards = [
    {
      id: 1,
      title: 'In Progress',
      descretion: 'doing all my task',
      status: 'In Progress',
      isImportant: false,
      start_date: '02/3/2023',
      end_date: '09/3/2023'

    },
    {
      id: 2,
      title: 'Pending',
      descretion: 'doing all my task to have it done on time so i should start',
      status: 'Pending',
      isImportant: false,
      start_date: '02/3/2023',
      end_date: '09/3/2023'

    },
    {
      id: 3,
      title: 'Completed',
      descretion: 'doing all my task having it completed is the best thing you will see on your task board doing all my task having it completed is the best thing you will see on your task board doing all my task having it completed is the best thing you will see on your task board',
      status: 'Completed',
      isImportant: false,
      start_date: '02/3/2023',
      end_date: '09/3/2023'

    },
    {
      id: 4,
      title: 'Testing',
      descretion: 'doing all my task',
      status: 'Testing',
      isImportant: false,
      start_date: '02/3/2023',
      end_date: '09/3/2023'

    },
    {
      id: 5,
      title: 'Pending important',
      descretion: 'doing all my task',
      status: 'Pending',
      isImportant: true,
      start_date: '02/3/2023',
      end_date: '09/3/2023'

    }
  ]
  const [cardOpen, setCardOpen] = useState(null);
  return (
    <div className='flex gap-[30px] flex-wrap justify-center gap-y-16'>
      {/* card  */}
      {cards.map(card => (
        <div key={card.id} onMouseEnter={() => setCardOpen(card.id)} onClick={() => setCardOpen(card.id)} onMouseLeave={() => setCardOpen(null)} className={`relative flex justify-center items-start md:w-[350px] sm:w-[230px] max-w-full h-[300px]  transition-all duration-500 rounded-2xl ${cardOpen == card.id? "h-[400px]" :''} ${card.status == 'In Progress' && card.isImportant ? "bg-important" : card.status == 'In Progress' && !card.isImportant ? "bg-progress" : card.status == 'Pending' && card.isImportant ? "bg-important" : card.status == 'Pending' && !card.isImportant ? 'bg-pending' : card.status == 'Completed' ? 'bg-done' : card.status == 'Testing' ? 'bg-testing' : "bg-prime"} `}>
          {/* image of the card */}
          <div className={`${cardOpen == card.id ? "top-[-80px] scale-75 transform" : ""} absolute top-5 md:w-[300px] sm:w-[185px] h-[220px] bg-prime rounded-xl overflow-hidden transition-all duration-500 `}>
            <Image className='absolute top-0 left-0 w-full h-full object-cover' />
          </div>
            {/* content of the card */}
          <div className={` ${cardOpen == card.id ? ' top-32 h-[256px] overflow-auto' : 'overflow-hidden top-[252px] h-8'}  text-prime absolute w-full px-12 text-center transition-all duration-500`}>
            <h1 className={`text-xl`}>{card.title}</h1>
            <p className={`text-sm `}>{card.end_date}</p>

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
            <p className='text-justify'>{card.descretion}</p>
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