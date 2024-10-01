'use client';

import { useState } from 'react';

export default function Appointment() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [food, setFood] = useState('');

  // Predefined food options
  const foodOptions = [
    { name: 'Pizza', value: 'pizza', image: '/images/pizza.jpg' },
    { name: 'Mala', value: 'mala', image: '/images/mala.jpg' },
    { name: 'Shabu', value: 'shabu', image: '/images/shabu.jpg' },
    { name: 'Steak', value: 'steak', image: '/images/steak.jpg' },
  ];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, time, food }),
    });
    if (response.ok) {
      alert('Appointment booked successfully!');
    } else {
      alert('Something went wrong.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="p-2 border" />
        </label>
        
        <label className="flex flex-col">
          Time:
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="p-2 border" />
        </label>

        <div className="flex flex-col gap-4">
          <span className="font-semibold">Food Selection:</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {foodOptions.map((option) => (
              <label key={option.value} className="flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  name="food"
                  value={option.value}
                  checked={food === option.value}
                  onChange={() => setFood(option.value)}
                  className="hidden"
                />
                <img
                  src={option.image}
                  alt={option.name}
                  className={`w-32 h-32 object-cover border-2 ${
                    food === option.value ? 'border-blue-500' : 'border-transparent'
                  }`}
                />
                <span className="mt-2">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Confirm Appointment</button>
      </form>
    </div>
  );
}
