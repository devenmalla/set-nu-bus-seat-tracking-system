import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Users, Calendar } from 'lucide-react';
import BusComponent from '../components/BusComponent';
import Header from '../components/Header';
import StatsOverview from '../components/StatsOverview';
import ResetCodeModal from '../components/ResetCodeModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BusData {
  id: number;
  name: string;
  bookedSeats: number[];
}

const Index = () => {
  const [buses, setBuses] = useState<BusData[]>([
    { id: 1, name: 'Bus 1', bookedSeats: [] },
    { id: 2, name: 'Bus 2', bookedSeats: [] },
    { id: 3, name: 'Bus 3', bookedSeats: [] },
    { id: 4, name: 'Bus 4', bookedSeats: [] },
    { id: 5, name: 'Bus 5', bookedSeats: [] },
    { id: 6, name: 'Bus 6', bookedSeats: [] },
    { id: 7, name: 'Bus 7', bookedSeats: [] },
    { id: 8, name: 'Bus 8', bookedSeats: [] },
  ]);

  const [showResetModal, setShowResetModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          loadBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadBookings = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('bus_id, seat_number');

      if (error) {
        console.error('Error loading bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load seat bookings. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      // Group bookings by bus_id
      const bookingsByBus = bookings?.reduce((acc, booking) => {
        if (!acc[booking.bus_id]) {
          acc[booking.bus_id] = [];
        }
        acc[booking.bus_id].push(booking.seat_number);
        return acc;
      }, {} as Record<number, number[]>) || {};

      // Update buses with booked seats
      setBuses(prevBuses =>
        prevBuses.map(bus => ({
          ...bus,
          bookedSeats: bookingsByBus[bus.id] || []
        }))
      );
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load seat bookings. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const handleSeatBook = async (busId: number, seatNumber: number) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            bus_id: busId,
            seat_number: seatNumber
          }
        ]);

      if (error) {
        console.error('Error booking seat:', error);
        toast({
          title: "Booking Failed",
          description: "This seat may already be booked. Please try another seat.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Seat Booked!",
        description: `Seat ${seatNumber.toString().padStart(2, '0')} in ${buses.find(b => b.id === busId)?.name} has been booked successfully.`,
      });
    } catch (error) {
      console.error('Error booking seat:', error);
      toast({
        title: "Error",
        description: "Failed to book seat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetAllBuses = () => {
    setShowResetModal(true);
  };

  const confirmReset = async (adminCode: string) => {
    try {
      // Verify admin code
      const { data: validCodes, error: codeError } = await supabase
        .from('admin_codes')
        .select('code')
        .eq('code', adminCode);

      if (codeError) {
        console.error('Error verifying admin code:', codeError);
        return false;
      }

      if (!validCodes || validCodes.length === 0) {
        return false;
      }

      // Delete all bookings
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (deleteError) {
        console.error('Error resetting bookings:', deleteError);
        toast({
          title: "Reset Failed",
          description: "Failed to reset all buses. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "All Buses Reset",
        description: "All seat bookings have been cleared successfully.",
      });
      
      setShowResetModal(false);
      return true;
    } catch (error) {
      console.error('Error during reset:', error);
      toast({
        title: "Error",
        description: "Failed to reset buses. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const totalSeats = buses.length * 30;
  const totalBooked = buses.reduce((sum, bus) => sum + bus.bookedSeats.length, 0);
  const totalAvailable = totalSeats - totalBooked;

  // Group buses in pairs for 2-column layout
  const busPairs = [];
  for (let i = 0; i < buses.length; i += 2) {
    busPairs.push(buses.slice(i, i + 2));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <StatsOverview 
            totalSeats={totalSeats}
            totalBooked={totalBooked}
            totalAvailable={totalAvailable}
            onResetAll={handleResetAllBuses}
          />
        </div>

        {/* Two-column bus layout */}
        <div className="space-y-8">
          {busPairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {pair.map((bus) => (
                <BusComponent
                  key={bus.id}
                  bus={bus}
                  onSeatBook={handleSeatBook}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Booking Instructions</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-slate-600">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100">
                <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-red-500 rounded-lg shadow-md flex-shrink-0"></div>
                <span className="font-medium">Available seats (click to book)</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-lg shadow-md flex-shrink-0"></div>
                <span className="font-medium">Booked seats (cannot be cancelled)</span>
              </div>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Each bus has 30 seats arranged in 6 rows
              </p>
              <p className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Your booking is automatically saved and synced in real-time
              </p>
              <p className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                All users see the same seat availability instantly
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 font-medium">
            Crafted with ❤️ by <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Deven Malla</span>
          </p>
        </div>
      </main>

      <ResetCodeModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={confirmReset}
      />
    </div>
  );
};

export default Index;
