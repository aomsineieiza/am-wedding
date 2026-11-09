import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquareHeart, Send, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';

const DEFAULT_WISHES = [
  {
    id: 1,
    name: "The Parents",
    relation: "Family",
    message: "ขอให้ลูกทั้งสองมีความสุขมากๆ ครองรักกันด้วยความเข้าใจ อดทน และเป็นกำลังใจให้กันในทุกๆ วันนะลูก",
    date: "2026-11-01",
    hearts: 28,
  },
  {
    id: 2,
    name: "Ploy & Team Bridesmaids",
    relation: "Bridesmaids",
    message: "May your journey together be as radiant and joyful as your smile today! So honored to witness Aomsin & Mild's love story.",
    date: "2026-11-02",
    hearts: 19,
  },
  {
    id: 3,
    name: "Ken & Groomsmen",
    relation: "Groomsmen",
    message: "To the happiest couple in town! Mild, take great care of our girl. Wishing you endless laughter and happiness!",
    date: "2026-11-03",
    hearts: 15,
  },
];

export default function WishesWall() {
  const { couple } = weddingData;
  const [wishes, setWishes] = useState([]);
  const [likedMap, setLikedMap] = useState({});
  const [newAuthor, setNewAuthor] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadWishes = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
      const userWishes = stored
        .filter((entry) => entry.wishes && entry.wishes.trim())
        .map((entry, idx) => ({
          id: `rsvp-${idx}`,
          name: entry.fullName,
          relation: 'Wedding Guest',
          message: entry.wishes,
          date: entry.submittedAt ? entry.submittedAt.slice(0, 10) : '2026-11-10',
          hearts: 5,
        }));
      setWishes([...DEFAULT_WISHES, ...userWishes]);
    } catch {
      setWishes(DEFAULT_WISHES);
    }
  };

  useEffect(() => {
    loadWishes();
  }, []);

  const handleLike = (id) => {
    setLikedMap((prev) => {
      const isLiked = !!prev[id];
      return { ...prev, [id]: !isLiked };
    });
    setWishes((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const isLiked = !!likedMap[id];
          return { ...w, hearts: isLiked ? w.hearts - 1 : w.hearts + 1 };
        }
        return w;
      })
    );
  };

  const handleAddWish = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newMessage.trim()) return;

    setIsSubmitting(true);
    const newEntry = {
      id: `wish-${Date.now()}`,
      name: newAuthor.trim(),
      relation: 'Guest',
      message: newMessage.trim(),
      date: new Date().toISOString().slice(0, 10),
      hearts: 1,
    };

    setTimeout(() => {
      setWishes((prev) => [newEntry, ...prev]);
      setNewAuthor('');
      setNewMessage('');
      setIsSubmitting(false);

      // Save to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        stored.push({
          fullName: newEntry.name,
          contact: 'Guestbook',
          attending: 'yes',
          guestCount: 1,
          wishes: newEntry.message,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('wedding_rsvps', JSON.stringify(stored));
      } catch (err) {
        console.error(err);
      }
    }, 400);
  };

  return (
    <section id="guestbook" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#F7F4EF]/40">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.3em] text-[#A38F70] font-medium mb-3"
          >
            Warm Thoughts
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl text-[#2D2926] font-light tracking-tight"
          >
            Guestbook &amp; Wishes
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-16 h-px bg-[#C8B89E] mx-auto mt-6"
          />
        </div>

        {/* Quick Leave a Wish Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto mb-14 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D8] shadow-md shadow-[#2D2926]/5"
        >
          <div className="flex items-center gap-2 mb-4 text-[#2D2926]">
            <MessageSquareHeart className="w-5 h-5 text-[#C8B89E]" />
            <h3 className="font-serif text-xl font-normal">Leave a Blessing for the Couple</h3>
          </div>
          <form onSubmit={handleAddWish} className="space-y-3">
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Your Name (ชื่อของคุณ)"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#C8B89E]"
            />
            <textarea
              rows="2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write your wishes for Aomsin & Mild..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#C8B89E] resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newAuthor.trim() || !newMessage.trim()}
              className="w-full py-2.5 rounded-full bg-[#2D2926] hover:bg-[#A38F70] text-white text-xs font-sans uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-[#C8B89E]" />
              <span>Post Your Blessing</span>
            </button>
          </form>
        </motion.div>

        {/* Wishes Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishes.map((item, idx) => {
            const isLiked = !!likedMap[item.id];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-[#E8E2D8] shadow-xs hover:border-[#C8B89E] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-serif text-lg text-[#2D2926] font-medium leading-snug">
                        {item.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider text-[#A38F70]">
                        {item.relation}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#A38F70] font-mono">{item.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#6B635B] font-light leading-relaxed italic mb-4">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-[#E8E2D8]/60">
                  <button
                    type="button"
                    onClick={() => handleLike(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                      isLiked
                        ? 'bg-rose-50 text-rose-600 font-medium'
                        : 'text-[#6B635B] hover:text-[#2D2926]'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-current text-rose-500' : 'text-[#C8B89E]'
                      }`}
                    />
                    <span>{item.hearts}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

