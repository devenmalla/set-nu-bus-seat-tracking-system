
import React from 'react';
import { Users, Calendar, RotateCcw, TrendingUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatsOverviewProps {
  totalSeats: number;
  totalBooked: number;
  totalAvailable: number;
  onResetAll: () => void;
}

const StatsOverview = ({ totalSeats, totalBooked, totalAvailable, onResetAll }: StatsOverviewProps) => {
  const occupancyRate = totalSeats > 0 ? (totalBooked / totalSeats) * 100 : 0;

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200/50">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl shadow-xl">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Real-time Seat Availability
            </h2>
            <p className="text-lg text-slate-500 font-medium">Live booking dashboard</p>
          </div>
        </div>

        <Button
          onClick={onResetAll}
          variant="outline"
          className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-600 hover:from-red-100 hover:to-pink-100 hover:border-red-300 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-semibold"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset All Buses
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl font-bold mb-1">{totalSeats}</div>
          <div className="text-blue-100 font-medium">Total Seats</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl font-bold mb-1">{totalBooked}</div>
          <div className="text-green-100 font-medium">Booked</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl font-bold mb-1">{totalAvailable}</div>
          <div className="text-red-100 font-medium">Available</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl font-bold mb-1">{occupancyRate.toFixed(0)}%</div>
          <div className="text-amber-100 font-medium">Occupancy</div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Overall Occupancy
          </span>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {occupancyRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
            style={{ width: `${occupancyRate}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
