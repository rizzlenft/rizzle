import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle2, User, Mail, ArrowRight, Loader2, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

interface Slot {
  date: string;
  start_time: string;
  end_time: string;
}

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email: string;
  meeting_link: string;
}

const formatDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};

const formatTime = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

const groupSlotsByDate = (slots: Slot[]) => {
  const grouped: Record<string, Slot[]> = {};
  slots.forEach((slot) => {
    if (!grouped[slot.date]) grouped[slot.date] = [];
    grouped[slot.date].push(slot);
  });
  return grouped;
};

const BookSession = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-available-slots");
      if (error) throw error;
      setSlots(data.slots || []);
    } catch (e: any) {
      setError("Failed to load available slots. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot || !clientName.trim() || !clientEmail.trim()) return;
    setBooking(true);
    setError("");
    try {
      const { data, error } = await supabase.functions.invoke("create-booking", {
        body: {
          date: selectedSlot.date,
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          client_name: clientName.trim(),
          client_email: clientEmail.trim(),
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setConfirmed(data.booking);
    } catch (e: any) {
      setError(e.message || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const grouped = groupSlotsByDate(slots);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient bg */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/5 blur-[160px]" />
      </div>

      <SiteHeader />

      <div className="relative z-10 pt-24 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs text-primary mb-4">
              <span>🎯</span> Payment confirmed — pick your slot
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Schedule Your 45-Minute
              <span className="block text-primary text-glow-sm">Web3 Consultation</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Choose an available time below. All times are in Eastern Time (ET).
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Confirmation state */}
            {confirmed ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-sm p-8 text-center box-glow-sm"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">You're Booked!</h2>
                <p className="text-muted-foreground mb-6">Your consultation has been confirmed.</p>

                <div className="mx-auto max-w-sm space-y-3 text-left">
                  <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/50 px-4 py-3">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{formatDate(confirmed.booking_date)}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/50 px-4 py-3">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">
                      {formatTime(confirmed.start_time)} – {formatTime(confirmed.end_time)} ET
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/50 px-4 py-3">
                    <Video className="h-4 w-4 text-primary shrink-0" />
                    <a href={confirmed.meeting_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                      {confirmed.meeting_link}
                    </a>
                  </div>
                </div>

                <p className="mt-6 text-xs text-muted-foreground">
                  A confirmation has been saved. Check your email for details.
                </p>
              </motion.div>
            ) : loading ? (
              <motion.div key="loading" className="flex flex-col items-center py-20">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
                <p className="text-muted-foreground text-sm">Loading available slots…</p>
              </motion.div>
            ) : (
              <motion.div key="slots" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error && (
                  <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {Object.keys(grouped).length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    No available slots right now. Please check back later.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Slot selection */}
                    <div className="space-y-4">
                      {Object.entries(grouped).map(([date, dateSlots]) => (
                        <div key={date} className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
                          <div className="px-4 py-3 border-b border-border/30 bg-secondary/30">
                            <h3 className="font-mono text-sm font-semibold text-foreground flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-primary" />
                              {formatDate(date)}
                            </h3>
                          </div>
                          <div className="p-3 flex flex-wrap gap-2">
                            {dateSlots.map((slot) => {
                              const isSelected =
                                selectedSlot?.date === slot.date && selectedSlot?.start_time === slot.start_time;
                              return (
                                <button
                                  key={`${slot.date}-${slot.start_time}`}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`rounded-lg border px-4 py-2 font-mono text-sm transition-all duration-200 ${
                                    isSelected
                                      ? "border-primary bg-primary/20 text-primary box-glow-sm"
                                      : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                  }`}
                                >
                                  <Clock className="inline h-3 w-3 mr-1.5 -mt-0.5" />
                                  {formatTime(slot.start_time)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Booking form */}
                    <AnimatePresence>
                      {selectedSlot && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm p-6 space-y-4 box-glow-sm">
                            <h3 className="font-display text-lg font-semibold text-foreground">
                              Confirm Your Booking
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(selectedSlot.date)} at {formatTime(selectedSlot.start_time)} – {formatTime(selectedSlot.end_time)} ET
                            </p>
                            <div className="space-y-3">
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                  type="text"
                                  placeholder="Your Name"
                                  value={clientName}
                                  onChange={(e) => setClientName(e.target.value)}
                                  className="w-full rounded-lg border border-border bg-input pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                  type="email"
                                  placeholder="Your Email"
                                  value={clientEmail}
                                  onChange={(e) => setClientEmail(e.target.value)}
                                  className="w-full rounded-lg border border-border bg-input pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            </div>
                            <button
                              onClick={handleBook}
                              disabled={booking || !clientName.trim() || !clientEmail.trim()}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-mono text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {booking ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  Confirm Booking
                                  <ArrowRight className="h-4 w-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookSession;
