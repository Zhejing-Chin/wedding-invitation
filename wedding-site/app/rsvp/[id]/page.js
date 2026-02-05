import { createClient } from '@supabase/supabase-js';
import RSVPForm from '@/components/RSVPForm';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Page({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 1. Fetch the anonymous record
  const { data: rsvp, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('id', id)
    .single();

  // 2. If ID doesn't exist, show error
  if (error || !rsvp) {
    return <div className="h-screen flex items-center justify-center">Invalid Invite Link.</div>;
  }

  // Define your stories/sections here
  const storySections = [
    { img: "/img1.jpg", title: "The Beginning", text: "It all started with a shared laugh and a long walk." },
    { img: "/img2.jpg", title: "Our Favorite Place", text: "Finding beauty in the quiet moments together." },
    { img: "/img3.jpg", title: "The Proposal", text: "A simple 'Yes' that changed our lives forever." },
    { img: "/img4.jpg", title: "The Big Day", text: "We can't wait to celebrate our love with you." },
    { img: "/img5.jpg", title: "Join Us", text: "Please let us know if you can make it by July 1st." },
  ];

  return (
    <main className="min-h-screen bg-[#faf9f6] py-20 px-4">
      {/* 1. HERO HEADER */}
      <section className="max-w-4xl mx-auto text-center mb-24">
        <h1 className="text-5xl md:text-7xl font-serif text-stone-800 mb-4">Our Wedding</h1>
        <p className="text-stone-500 uppercase tracking-[0.3em] text-sm md:text-base">
          August 20, 2026 • Paris, France
        </p>
      </section>
        
      {/* 2. SEQUENTIAL Z-PATTERN GALLERY */}
      <section className="max-w-5xl mx-auto">
        {storySections.map((section, index) => (
          <div 
            key={index} 
            className={`flex flex-col md:flex-row items-center gap-12 mb-24 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image Wrapper */}
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={section.img} 
                  alt={section.title} 
                  className="object-cover w-full h-full" 
                />
              </div>
            </div>

            {/* Text Wrapper */}
            <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif text-stone-800">
                {section.title}
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed italic">
                "{section.text}"
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. FINAL RSVP SECTION */}
      <section className="max-w-2xl mx-auto mt-32">
        <div className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl border border-stone-100 text-center">
          <h2 className="text-4xl font-serif mb-8 text-stone-800">Will you join us?</h2>
          <RSVPForm id={id} initialData={rsvp} />
        </div>
      </section>
      
      <footer className="mt-20 text-center text-stone-400 text-sm tracking-widest uppercase">
        Made with Love • 2026
      </footer>
    </main>
  );
}