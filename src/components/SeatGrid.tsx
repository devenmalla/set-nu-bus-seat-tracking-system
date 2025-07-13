
import React from 'react';

interface SeatGridProps {
  busId: number;
  bookedSeats: number[];
  onSeatBook: (busId: number, seatNumber: number) => void;
}

const SeatGrid = ({ busId, bookedSeats, onSeatBook }: SeatGridProps) => {
  const totalSeats = 30;
  const seatsPerRow = 6;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  const handleSeatClick = (seatNumber: number) => {
    if (!bookedSeats.includes(seatNumber)) {
      onSeatBook(busId, seatNumber);
    }
  };

  const renderSeat = (seatNumber: number) => {
    const isBooked = bookedSeats.includes(seatNumber);
    const seatLabel = seatNumber.toString().padStart(2, '0');

    return (
      <button
        key={seatNumber}
        onClick={() => handleSeatClick(seatNumber)}
        disabled={isBooked}
        className={`
          w-14 h-14 rounded-lg font-bold text-lg transition-all duration-200 border-2 shadow-md
          flex items-center justify-center
          ${isBooked 
            ? 'bg-green-500 border-green-600 text-white cursor-not-allowed' 
            : 'bg-red-500 border-red-600 text-white hover:bg-red-400 hover:border-red-500 hover:scale-105 cursor-pointer active:scale-95'
          }
        `}
        title={isBooked ? `Seat ${seatLabel} - Already Booked` : `Seat ${seatLabel} - Click to Book`}
      >
        {seatLabel}
      </button>
    );
  };

  const renderRow = (rowIndex: number) => {
    const startSeat = rowIndex * seatsPerRow + 1;
    const seatsInThisRow = Math.min(seatsPerRow, totalSeats - rowIndex * seatsPerRow);
    
    return (
      <div key={rowIndex} className="flex justify-center items-center gap-3 mb-4">
        {/* Left side seats (3 seats) */}
        <div className="flex gap-2">
          {Array.from({ length: Math.min(3, seatsInThisRow) }, (_, seatIndex) => 
            renderSeat(startSeat + seatIndex)
          )}
        </div>
        
        {/* Aisle space */}
        <div className="w-8 flex items-center justify-center">
          <div className="w-1 h-12 bg-blue-300 rounded-full opacity-50"></div>
        </div>
        
        {/* Right side seats (3 seats) */}
        <div className="flex gap-2">
          {Array.from({ length: Math.max(0, seatsInThisRow - 3) }, (_, seatIndex) => 
            renderSeat(startSeat + 3 + seatIndex)
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
      {/* Bus Front Indicator */}
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl text-base font-bold shadow-lg flex items-center gap-2">
          🚌 <span>FRONT</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="space-y-1">
        {Array.from({ length: rows }, (_, rowIndex) => renderRow(rowIndex))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded border border-red-600"></div>
            <span className="text-slate-700 text-sm font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded border border-green-600"></div>
            <span className="text-slate-700 text-sm font-medium">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
