import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Availability config — easy to edit
const AVAILABILITY = {
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  days: [2, 3, 4], // Tue, Wed, Thu
  startHour: 13, // 1 PM ET
  endHour: 17,   // 5 PM ET (last slot starts at 4:15)
  slotMinutes: 45,
  timezone: "America/New_York",
  weeksAhead: 3, // show slots up to 3 weeks ahead
};

function generateSlots(): { date: string; start_time: string; end_time: string }[] {
  const slots: { date: string; start_time: string; end_time: string }[] = [];
  const now = new Date();
  
  // Convert current time to ET for comparison
  const etNow = new Date(now.toLocaleString("en-US", { timeZone: AVAILABILITY.timezone }));
  
  for (let dayOffset = 0; dayOffset <= AVAILABILITY.weeksAhead * 7; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    
    const dayOfWeek = new Date(date.toLocaleString("en-US", { timeZone: AVAILABILITY.timezone }));
    
    if (!AVAILABILITY.days.includes(dayOfWeek.getDay())) continue;
    
    const dateStr = date.toLocaleDateString("en-CA", { timeZone: AVAILABILITY.timezone }); // YYYY-MM-DD
    
    let currentMinutes = AVAILABILITY.startHour * 60;
    const endMinutes = AVAILABILITY.endHour * 60;
    
    while (currentMinutes + AVAILABILITY.slotMinutes <= endMinutes) {
      const startH = Math.floor(currentMinutes / 60);
      const startM = currentMinutes % 60;
      const endTotal = currentMinutes + AVAILABILITY.slotMinutes;
      const endH = Math.floor(endTotal / 60);
      const endM = endTotal % 60;
      
      const startTime = `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}:00`;
      const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`;
      
      // Skip past slots for today
      if (dayOffset === 0) {
        const slotDate = new Date(etNow);
        slotDate.setHours(startH, startM, 0, 0);
        if (slotDate <= etNow) {
          currentMinutes += AVAILABILITY.slotMinutes;
          continue;
        }
      }
      
      slots.push({ date: dateStr, start_time: startTime, end_time: endTime });
      currentMinutes += AVAILABILITY.slotMinutes;
    }
  }
  
  return slots;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get all existing bookings
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("booking_date, start_time")
      .eq("status", "confirmed");

    if (error) throw error;

    const bookedSet = new Set(
      (bookings || []).map((b: any) => `${b.booking_date}_${b.start_time}`)
    );

    // Generate all possible slots and filter out booked ones
    const allSlots = generateSlots();
    const availableSlots = allSlots.filter(
      (s) => !bookedSet.has(`${s.date}_${s.start_time}`)
    );

    return new Response(JSON.stringify({ slots: availableSlots }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
