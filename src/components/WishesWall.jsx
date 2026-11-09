import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquareHeart, Send, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';

const DEFAULT_WISHES = [
  {
    id: 1,
    name: "คุณพ่อ & คุณแม่",
    relation: "ครอบครัว",
    message: "ขอให้ลูกทั้งสองมีความสุขมากๆ ครองรักกันด้วยความเข้าใจ อดทน และเป็นกำลังใจให้กันในทุกๆ วันนะลูก",
    date: "2026-11-01",
    hearts: 32,
  },
  {
    id: 2,
    name: "แก๊งเพื่อนเจ้าสาว (Bridesmaids)",
    relation: "เพื่อนเจ้าสาว",
    message: "ยินดีกับออมสินและมายด์มากๆ ขอให้มีความสุข มีรอยยิ้ม และความรักที่เบ่งบานในทุกวันเลยนะ!",
    date: "2026-11-02",
    hearts: 24,
  },
  {
    id: 3,
    name: "เพื่อนๆ มหาวิทยาลัย",
    relation: "เพื่อนสนิท",
    message: "ยินดีด้วยนะมายด์ ดูแลออมสินดีๆ นะ ขอให้รักกันยาวนานและมีความสุขที่สุดเลย!",
    date: "2026-11-03",
    hearts: 18,
  },
];

export default function WishesWall() {
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
          relation: 'แขกผู้มีเกียรติ',
          message: entry.wishes,
          date: entry.submittedAt ? entry.submittedAt.slice(0, 10) : '2026-11-10',
          hearts: 8,
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
      relation: 'แขกผู้มีเกียรติ',
      message: newMessage.trim(),
      date: new Date().toISOString().slice(0, 10),
      hearts: 1,
    };

    setTimeout(() => {
      setWishes((prev) => [newEntry, ...prev]);
      setNewAuthor('');
      setNewMessage('');
      setIsSubmitting(false);

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
    }, 350);
  };

  return (
    <section id="guestbook" className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-50/70">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FE] text-[#0074E2] text-xs font-semibold mb-3 border border-[#C4DDFB]"
          >
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>GUESTBOOK &amp; WISHES</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
          >
            สมุดประสาทพรและคำอวยพร
          </motion.h2>
          <p className="text-sm text-slate-500 mt-2 font-normal">
            ส่งมอบความรัก ความปรารถนาดี และข้อความแห่งความสุขแด่คู่บ่าวสาว
          </p>
        </div>

        {/* Quick Leave a Wish Form - Fastwork Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto mb-14 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md shadow-slate-900/5"
        >
          <div className="flex items-center gap-2 mb-4 text-slate-900">
            <Sparkles className="w-5 h-5 text-[#0074E2]" />
            <h3 className="text-lg font-bold">เขียนคำอวยพรแด่ ออมสิน &amp; มายด์</h3>
          </div>
          <form onSubmit={handleAddWish} className="space-y-3">
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="ชื่อของคุณ (เช่น คุณเป็ด เพื่อนมัธยม)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0074E2]"
            />
            <textarea
              rows="2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="เขียนข้อความอวยพรคู่บ่าวสาว..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0074E2] resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newAuthor.trim() || !newMessage.trim()}
              className="w-full py-2.5 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>โพสต์คำอวยพร</span>
            </button>
          </form>
        </motion.div>

        {/* Wishes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishes.map((item, idx) => {
            const isLiked = !!likedMap[item.id];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#C4DDFB] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-[#0074E2] bg-[#EBF4FE] px-2 py-0.5 rounded-full border border-[#C4DDFB]">
                        {item.relation}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{item.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mb-4">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleLike(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                      isLiked
                        ? 'bg-rose-50 text-rose-600 font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-current text-rose-500' : 'text-slate-400'
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
