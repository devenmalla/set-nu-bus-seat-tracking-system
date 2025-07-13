
import React from 'react';
import { Bus, Users, Zap } from 'lucide-react';
import SeatGrid from './SeatGrid';

interface BusData {
  id: number;
  name: string;
  bookedSeats: number[];
}

interface BusComponentProps {
  bus: BusData;
  onSeatBook: (busId: number, seatNumber: number) => void;
}

const BusComponent = ({ bus, onSeatBook }: BusComponentProps) => {
  const totalSeats = 30;
  const bookedCount = bus.bookedSeats.length;
  const availableCount = totalSeats - bookedCount;
  const occupancyRate = (bookedCount / totalSeats) * 100;

  const getOccupancyColor = () => {
    if (occupancyRate === 0) return 'from-slate-400 to-slate-500';
    if (occupancyRate < 30) return 'from-green-400 to-green-500';
    if (occupancyRate < 70) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  const getStatusText = () => {
    if (occupancyRate === 0) return 'Empty';
    if (occupancyRate < 30) return 'Available';
    if (occupancyRate < 70) return 'Filling Up';
    if (occupancyRate < 100) return 'Almost Full';
    return 'Full';
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1">
      {/* Bus Header */}
      <div className={`bg-gradient-to-r ${getOccupancyColor()} p-6 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
              <Bus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{bus.name}</h3>
              <p className="text-white/80 font-medium">30 Seats Available</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-2xl mb-1">{occupancyRate.toFixed(0)}%</div>
            <div className="text-white/80 text-sm font-medium">{getStatusText()}</div>
          </div>
        </div>
      </div>

      {/* Seat Statistics */}
      <div className="p-6 bg-gradient-to-r from-slate-50/80 to-slate-100/80">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-700 font-semibold text-lg">Seat Status</span>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{bookedCount}</div>
              <div className="text-green-500 text-sm font-medium">Booked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{availableCount}</div>
              <div className="text-red-500 text-sm font-medium">Available</div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="mt-4">
          <div className="bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className={`bg-gradient-to-r ${getOccupancyColor()} h-3 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden`}
              style={{ width: `${occupancyRate}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="p-6">
        <SeatGrid
          busId={bus.id}
          bookedSeats={bus.bookedSeats}
          onSeatBook={onSeatBook}
        />
      </div>
    </div>
  );
};

export default BusComponent;
