// Wedding configuration & details
// You can easily update couple names, dates, venue, bank info, and photos here

export const weddingData = {
  couple: {
    bride: "Aomsin",
    groom: "Mild",
    brideFull: "Aomsin P.",
    groomFull: "Mild T.",
    initials: "A & M",
    hashtag: "#AomsinMild2026",
    quote: "Every love story is beautiful, but ours is our favorite.",
    date: "2026-11-28T09:09:00+07:00", // Wedding date ISO string
    dateFormatted: "Saturday, November 28, 2026",
    thaiDateFormatted: "วันเสาร์ที่ 28 พฤศจิกายน 2569",
    tagline: "Together with our families, we joyfully invite you to celebrate our union.",
  },

  venue: {
    name: "The Glasshouse Heritage Bangkok",
    hall: "The Grand Pavilion & Conservatory Lawn",
    address: "88 Sukhumvit Soi 55, Thonglor, Watthana, Bangkok 10110, Thailand",
    thaiAddress: "88 ซอยสุขุมวิท 55 (ทองหล่อ) แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110",
    phone: "+66 2 712 9988",
    phoneDisplay: "(02) 712-9988",
    googleMapsUrl: "https://maps.google.com/?q=The+Glasshouse+Heritage+Bangkok",
    appleMapsUrl: "https://maps.apple.com/?q=The+Glasshouse+Heritage+Bangkok",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7654124978184!2d100.58129037599026!3d13.732646697728956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e559e21703b%3A0xb15c48600a98d3d9!2sThong%20Lo%20Rd%2C%20Khwaeng%20Khlong%20Tan%20Nuea%2C%20Khet%20Watthana%2C%20Krung%20Thep%20Maha%20Nakhon!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth",
    parkingInfo: "Complimentary valet parking available on-site (capacity 250 cars). Shuttle service from BTS Thong Lo Station (Exit 3) departs every 15 minutes.",
  },

  schedule: [
    {
      id: "morning-ceremony",
      period: "Morning Ceremony",
      periodThai: "พิธีเช้า",
      time: "07:30 - 11:30",
      venueRoom: "Heritage Glasshouse Ballroom",
      dressCodeNote: "Traditional Formal / Pastel & Earth Tones",
      items: [
        { time: "07:30", title: "Monk Blessing Ceremony", desc: "พิธีสงฆ์เจริญพระพุทธมนต์เพื่อความเป็นสิริมงคล" },
        { time: "08:39", title: "Khan Maak Traditional Procession", desc: "ขบวนขันหมากและพิธีสู่ขอ" },
        { time: "09:09", title: "Auspicious Engagement Ring Exchange", desc: "พิธีสวมแหวนหมั้นตามฤกษ์มงคล" },
        { time: "10:00", title: "Sacred Water Pouring Ceremony", desc: "พิธีหลั่งน้ำพระพุทธมนต์และประสาทพร" },
        { time: "11:00", title: "Family Lunch Feast", desc: "รับประทานอาหารร่วมกับครอบครัวและแขกผู้มีเกียรติ" },
      ],
    },
    {
      id: "evening-reception",
      period: "Evening Celebration & Party",
      periodThai: "งานฉลองมงคลสมรส",
      time: "17:30 - 23:00",
      venueRoom: "Grand Conservatory Lawn & Ballroom",
      dressCodeNote: "Black Tie Optional / Formal Elegance",
      items: [
        { time: "17:30", title: "Welcome Cocktail & Photo Call", desc: "ลงทะเบียน ถ่ายภาพร่วมกับคู่บ่าวสาว และค็อกเทลต้อนรับ" },
        { time: "18:45", title: "Grand Entrance & Vow Sharing", desc: "เปิดตัวคู่บ่าวสาวและกล่าวคำมั่นสัญญา" },
        { time: "19:15", title: "Cake Cutting & Champagne Toast", desc: "พิธีตัดเค้กและฉลองความสุขร่วมกัน" },
        { time: "19:45", title: "Bouquet Toss & Dinner Banquet", desc: "โยนช่อดอกไม้และร่วมรับประทานอาหารค่ำ" },
        { time: "21:00", title: "After Party & Live Music", desc: "มินิคอนเสิร์ตและปาร์ตี้เฉลิมฉลองค่ำคืนอันน่าจดจำ" },
      ],
    },
  ],

  dressCode: {
    title: "Warm Earth & Champagne Romance",
    subtitle: "โทนสีการแต่งกาย",
    description: "To create an atmosphere of warmth and quiet luxury, we kindly request our guests to dress in modern editorial earth tones, warm champagne gold, olive sage, or soft blush.",
    note: "Gentlemen: Classic dark suit, linen blazer, or formal attire. Ladies: Elegant cocktail dress, silk gowns, or modern Thai contemporary.",
    palette: [
      { name: "Champagne Cream", hex: "#F4EFEB", textDark: true },
      { name: "Golden Sand", hex: "#C8B89E", textDark: true },
      { name: "Warm Taupe", hex: "#A38F70", textDark: false },
      { name: "Olive Sage", hex: "#9EAB9C", textDark: true },
      { name: "Soft Blush", hex: "#E6D2C9", textDark: true },
      { name: "Espresso Charcoal", hex: "#2D2926", textDark: false },
    ],
  },

  story: [
    {
      year: "2019",
      title: "First Encounter",
      subtitle: "A serendipitous rainy afternoon in Bangkok",
      desc: "We met by chance over coffee at a quiet book café. A conversation about architecture and favorite travel spots that was supposed to last twenty minutes turned into five hours of laughter.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
    },
    {
      year: "2022",
      title: "Adventures Across Borders",
      subtitle: "From mountain peaks to ocean sunsets",
      desc: "Through delayed flights, spontaneous road trips, and countless shared bowls of ramen, we discovered that anywhere in the world feels like home as long as we're side by side.",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
    },
    {
      year: "2025",
      title: "The Kyoto Proposal",
      subtitle: "Underneath the autumn maple leaves",
      desc: "In an ancient temple garden at dusk, surrounded by crimson autumn leaves, Mild got down on one knee. With tears and the easiest 'Yes' ever spoken, our forever was sealed.",
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
    },
    {
      year: "2026",
      title: "Our Next Chapter",
      subtitle: "Two families become one",
      desc: "Surrounded by our dearest friends and family, we take our next step into a lifetime of partnership, dreams, and endless love.",
      image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80",
    },
  ],

  gallery: [
    {
      id: 1,
      title: "In Your Arms",
      caption: "Bangkok Old Town Pre-Wedding Session",
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      aspect: "tall",
    },
    {
      id: 2,
      title: "Golden Hour Glow",
      caption: "Khao Yai Hills Sunset",
      src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
      aspect: "wide",
    },
    {
      id: 3,
      title: "Editorial Simplicity",
      caption: "Minimalist Studio Portrait",
      src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
      aspect: "tall",
    },
    {
      id: 4,
      title: "Hand in Hand",
      caption: "The quiet moments together",
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      aspect: "square",
    },
    {
      id: 5,
      title: "Autumn Whisper",
      caption: "Kyoto Pre-Wedding Journey",
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
      aspect: "square",
    },
    {
      id: 6,
      title: "Pure Celebration",
      caption: "Joy and genuine laughter",
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
      aspect: "wide",
    },
  ],

  bankAccounts: [
    {
      bank: "Kasikornbank (KBANK)",
      bankThai: "ธนาคารกสิกรไทย",
      accountNumber: "045-8-91234-5",
      cleanNumber: "0458912345",
      accountName: "Aomsin P. & Mild T.",
      promptPay: "089-123-4567",
      color: "#13805B",
    },
    {
      bank: "Siam Commercial Bank (SCB)",
      bankThai: "ธนาคารไทยพาณิชย์",
      accountNumber: "408-2-78901-2",
      cleanNumber: "4082789012",
      accountName: "Mild T. (Wedding Fund)",
      promptPay: "081-987-6543",
      color: "#4E2A84",
    },
  ],
};
