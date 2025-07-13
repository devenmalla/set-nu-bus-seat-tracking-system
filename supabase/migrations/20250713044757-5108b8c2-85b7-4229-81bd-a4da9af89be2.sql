
-- Create bookings table to store seat reservations
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id INTEGER NOT NULL,
  seat_number INTEGER NOT NULL,
  booked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(bus_id, seat_number)
);

-- Create admin_codes table to store reset codes
CREATE TABLE public.admin_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the default admin code
INSERT INTO public.admin_codes (code, description) 
VALUES ('SETNU2024', 'Default admin reset code');

-- Enable Row Level Security (but make tables publicly accessible for now)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_codes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since no authentication is implemented yet)
CREATE POLICY "Allow public read access to bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to bookings" 
  ON public.bookings 
  FOR DELETE 
  USING (true);

CREATE POLICY "Allow public read access to admin codes" 
  ON public.admin_codes 
  FOR SELECT 
  USING (true);

-- Enable real-time functionality
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.bookings;
