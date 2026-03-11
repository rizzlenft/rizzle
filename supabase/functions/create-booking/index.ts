import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date, start_time, end_time, client_name, client_email } = await req.json();

    if (!date || !start_time || !end_time || !client_name || !client_email) {
      throw new Error("Missing required fields: date, start_time, end_time, client_name, client_email");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check for existing booking at this slot (prevent double booking)
    const { data: existing } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_date", date)
      .eq("start_time", start_time)
      .eq("status", "confirmed")
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "This time slot has already been booked. Please choose another." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 409 }
      );
    }

    // Generate a placeholder meeting link
    const meetingLink = `https://meet.google.com/rizzle-${Date.now().toString(36)}`;

    // Insert booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        booking_date: date,
        start_time,
        end_time,
        client_name,
        client_email,
        meeting_link: meetingLink,
        status: "confirmed",
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ booking }), {
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
