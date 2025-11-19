import React, { useState, useEffect } from 'react';

export const ClockApp: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
    <div className="h-full w-full bg-[#F5F5F7] flex flex-col items-center justify-center gap-8 select-none">
        {/* Analog Clock Container */}
        <div className="relative w-56 h-56 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] border-4 border-white ring-1 ring-gray-200">
             
            {/* Hour Markers */}
            {[...Array(12)].map((_, i) => (
                <div 
                    key={i}
                    className={`absolute bg-gray-800 left-1/2 top-2 origin-[50%_104px] -translate-x-1/2 ${i % 3 === 0 ? 'h-4 w-1.5 bg-black' : 'h-2 w-1 bg-gray-400'}`}
                    style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
                />
            ))}

            {/* Hour Hand */}
            <div 
                className="absolute w-2 bg-black h-16 left-1/2 top-[46px] rounded-full origin-[50%_100%] -translate-x-1/2 shadow-sm"
                style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
            />

            {/* Minute Hand */}
             <div 
                className="absolute w-1.5 bg-black h-24 left-1/2 top-[14px] rounded-full origin-[50%_100%] -translate-x-1/2 shadow-sm"
                style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
            />

            {/* Second Hand */}
            <div 
                className="absolute w-0.5 bg-orange-500 h-28 left-1/2 top-[6px] origin-[50%_80%] -translate-x-1/2 z-10"
                style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
            >
                <div className="absolute w-2 h-2 bg-orange-500 rounded-full -top-1 left-1/2 -translate-x-1/2" />
            </div>

            {/* Center Cap */}
            <div className="absolute w-3 h-3 bg-white border-2 border-orange-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-sm" />
        </div>
        
        {/* Digital Time */}
        <div className="text-5xl font-extralight text-gray-800 font-variant-numeric tabular-nums tracking-wider">
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        <div className="text-sm font-medium text-orange-500 uppercase tracking-widest">
            {date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
    </div>
  );
};