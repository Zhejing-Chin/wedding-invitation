"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function RSVPForm({ id, initialData }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Update Supabase
    const { error } = await supabase
      .from('rsvps')
      .update({ 
        attending: formData.attending, 
        dietary: formData.dietary,
        updated_at: new Date() 
      })
      .eq('id', id);

    if (!error) {
      // 2. Trigger Notification Webhook
      await fetch('/api/notify', {
        method: 'POST',
        body: JSON.stringify({ id, attending: formData.attending, dietary: formData.dietary }),
      });
      alert("RSVP Updated Successfully!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 justify-center">
        <button 
          type="button"
          onClick={() => setFormData({...formData, attending: true})}
          className={`p-4 border ${formData.attending === true ? 'bg-black text-white' : ''}`}
        >
          Will Attend
        </button>
        <button 
          type="button"
          onClick={() => setFormData({...formData, attending: false})}
          className={`p-4 border ${formData.attending === false ? 'bg-black text-white' : ''}`}
        >
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
    </form>
  );
}