"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function RSVPForm({ id, initialData }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    // 1. Update Supabase
    const { error } = await supabase
      .from('rsvps')
      .update({ 
        attending: formData.attending, 
        dietary: formData.dietary,
        updated_at: new Date() 
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      setStatus("error");
    } else {
      setStatus("success");

      // 2. Add the celebratory confetti!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#44403c', '#a8a29e', '#f5f5f4'] // Elegant wedding tones
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 justify-center">
        <button 
          type="button"
          onClick={() => setFormData({...formData, attending: true})}
          className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 font-medium tracking-wide
            ${formData.attending === true 
              ? 'bg-[#f4acb7] border-[#f4acb7] text-white shadow-md scale-[1.02]' 
              : 'bg-white/50 border-[#f4acb7] text-[#9d8189] hover:bg-white/80'
            }`}
        >
          Will Attend
        </button>
        <button 
          type="button"
          onClick={() => setFormData({...formData, attending: false})}
          className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 font-medium tracking-wide
            ${formData.attending === false 
              ? 'bg-[#f4acb7] border-[#f4acb7] text-white shadow-md scale-[1.02]' 
              : 'bg-white/50 border-[#f4acb7] text-[#9d8189] hover:bg-white/80'
            }`}        >
          Cannot Attend
        </button>
      </div>

      <textarea 
        placeholder="Dietary Requirements"
        className="w-full border p-2 text-black"
        value={formData.dietary || ''}
        onChange={(e) => setFormData({...formData, dietary: e.target.value})}
      />

      <button disabled={loading} className="w-full bg-blue-600 text-white p-3 uppercase tracking-widest">
        {loading ? "Saving..." : "Update RSVP"}
      </button>

      {status === "success" && (
        <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl text-center">
          <p className="text-green-800 font-medium">Your RSVP has been updated!</p>
          <p className="text-green-600 text-sm">We've sent a notification to the couple.</p>
        </div>
      )}

      {status === "error" && (
        <p className="mt-4 text-red-500 text-center text-sm">
          Something went wrong. Please try again.
        </p>
      )}

    </form>
  );
}