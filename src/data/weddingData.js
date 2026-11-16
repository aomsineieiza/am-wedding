// Wedding configuration & details
// You can easily update couple names, dates, venue, bank info, and photos here

export const weddingData = {
  // Paste your Google Apps Script Web App URL here to save RSVP & Wishes directly to Google Sheets (docs.google.com/spreadsheets)
  googleSheetWebAppUrl:
    import.meta.env.VITE_GOOGLE_SHEET_SCRIPT_URL ||
    import.meta.env.VITE_GOOGLE_SHEET_URL ||
    "https://script.google.com/macros/s/AKfycbwW684uvWiNvQEce53Nt0SFQKvVlVN3ReAuqcdi0z7ZVZvahfwyF-Zwkp1NeHoENoPZ/exec",

  couple: {
    bride: "Aomsin",
    groom: "Mild",
    brideFull: "Aomsin P.",
    groomFull: "Mild T.",
    initials: "A & M",
    hashtag: "#AomsinMild2027",
    quote: "Every love story is beautiful, but ours is our favorite.",
    date: "2027-01-23T15:30:00+07:00", // Wedding date ISO string (23/01/2027 15:30)
    dateFormatted: "Saturday, January 23, 2027",
    thaiDateFormatted: "วันเสาร์ที่ 23 มกราคม 2570",
    tagline: "Together with our families, we joyfully invite you to celebrate our union.",
    logoImage: "/images/couple-logo.jpg",
    heroImage: "/images/prewedding-4.jpg",
    envelopeImage: "/images/prewedding-2.jpg",
  },

  music: {
    title: "삐그덕 (Seesaw)",
    artist: "Crush (크러쉬) Feat. IU (아이유)",
    youtubeId: "IVTYOsaO0Mw",
    youtubeUrl: "https://www.youtube.com/watch?v=IVTYOsaO0Mw",
  },

  venue: {
    name: "Le Pasiri (เลอปาสิริ)",
    hall: "Modern Classic Glasshouse & European Garden",
    city: "Nonthaburi, Thailand",
    thaiCity: "นนทบุรี",
    address: "8/24 Nakhon In Rd, Bang Phai, Mueang Nonthaburi District, Nonthaburi 11000",
    thaiAddress: "8/24 ถนนนครอินทร์ ตำบลบางไผ่ อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11000 (โซนพระราม 5 – ราชพฤกษ์)",
    phone: "+66659238659",
    phoneDisplay: "065-923-8659",
    googleMapsUrl: "https://www.google.com/maps/place/Le+Pasiri/@13.826864,100.4806948,17z/data=!3m1!4b1!4m16!1m9!4m8!1m0!1m6!1m2!1s0x30e29bc8df191987:0x7c7255c4e6b7cade!2sLe+Pasiri,+8,+24+Nakhon+In+Rd,+Bang+Phai,+Mueang+Nonthaburi+District,+Nonthaburi+11000!2m2!1d100.4855657!2d13.826864!3m5!1s0x30e29bc8df191987:0x7c7255c4e6b7cade!8m2!3d13.826864!4d100.4855657!16s%2Fg%2F11j24ypzfr",
    appleMapsUrl: "https://maps.apple.com/?q=Le+Pasiri&ll=13.826864,100.4855657",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.195!2d100.483377!3d13.826864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29bc8df191987%3A0x7c7255c4e6b7cade!2sLe%20Pasiri!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth",
    parkingTitle: "บริการที่จอดรถภายในโครงการ",
    parkingInfo: "มีลานจอดรถกว้างขวางภายในบริเวณสถานที่จัดงาน พร้อมเจ้าหน้าที่ดูแลอำนวยความสะดวกตลอดงาน",
    transitTitle: "การเดินทางและจุดสังเกต",
    transitInfo: "ติดถนนนครอินทร์ (โซนพระราม 5 – ราชพฤกษ์) เดินทางสะดวกจากสะพานพระราม 5 ถนนราชพฤกษ์ และถนนกาญจนาภิเษก",
  },

  schedule: [
    {
      id: "afternoon-evening-ceremony",
      period: "Afternoon & Evening Ceremony",
      periodThai: "พิธีบ่าย-เย็น",
      time: "15:30 - 21:00",
      venueRoom: "Le Pasiri Glasshouse Hall",
      dressCodeNote: "Dusty Blue, Pastel Blue, Light Blue, Ivory, Light Brown & Cream",
      googleCalStart: "20270123T083000Z", // 15:30 Bangkok (UTC+7)
      googleCalEnd: "20270123T140000Z",   // 21:00 Bangkok (UTC+7)
      icalStart: "20270123T153000",
      icalEnd: "20270123T210000",
      items: [
        { time: "15:30", title: "Monk Blessing Ceremony", desc: "พิธีสงฆ์เจริญพระพุทธมนต์เพื่อความเป็นสิริมงคล" },
        { time: "16:09", title: "Khan Maak Traditional Procession", desc: "ขบวนขันหมากและพิธีสู่ขอ" },
        { time: "16:39", title: "Auspicious Engagement Ring Exchange", desc: "พิธีสวมแหวนหมั้นตามฤกษ์มงคล" },
        { time: "17:30", title: "Sacred Water Pouring Ceremony", desc: "พิธีหลั่งน้ำพระพุทธมนต์และประสาทพร" },
        { time: "18:30", title: "Family Lunch Feast", desc: "รับประทานอาหารร่วมกับครอบครัวและแขกผู้มีเกียรติ" },
      ],
    },
  ],

  dressCode: {
    title: "Soft Blue & Warm Earth Harmony",
    subtitle: "โทนสีการแต่งกาย",
    description: "ร่วมสร้างบรรยากาศแสนอบอุ่นและละมุนตาในโทนสีฟ้าหม่น (Dusty Blue), ฟ้าพาสเทล (Pastel Blue), ฟ้าอ่อน (Light Blue), ขาวงาช้าง (Ivory), น้ำตาลอ่อน (Light Brown) และสีครีม (Cream)",
    note: "Gentlemen: Classic suit, blazer, or formal attire in soft blue, beige, cream, or light brown tones. Ladies: Elegant dress, gown, or modern contemporary attire in dusty/pastel blue, ivory, cream, or light brown tones.",
    palette: [
      { name: "Dusty Blue", hex: "#94AFC4", textDark: true },
      { name: "Pastel Blue", hex: "#B4CEE6", textDark: true },
      { name: "Light Blue", hex: "#D6EAF4", textDark: true },
      { name: "Ivory", hex: "#FAF8F0", textDark: true },
      { name: "Light Brown", hex: "#D2BEA8", textDark: true },
      { name: "Cream", hex: "#F3ECE1", textDark: true },
    ],
  },

  gallery: [
    {
      id: 1,
      title: "Save the Date • 23.01",
      caption: "สนามหญ้าสีเขียวกับลูกโป่งวันสำคัญของเรา 23 มกราคม",
      src: "/images/prewedding-4.jpg",
      aspect: "tall",
      objectPosition: "object-bottom",
    },
    {
      id: 2,
      title: "Cool & Playful Vibes",
      caption: "ลุคเท่ๆ สไตล์เราสองคนในสตูดิโอ",
      src: "/images/prewedding-1.jpg",
      aspect: "tall",
      objectPosition: "object-center",
    },
    {
      id: 3,
      title: "Under the Bridal Veil",
      caption: "สายตาและรอยยิ้มใต้ผ้าคลุมหน้าเจ้าสาว",
      src: "/images/prewedding-2.jpg",
      aspect: "tall",
      objectPosition: "object-bottom",
    },
    {
      id: 4,
      title: "Sweet Ribbon Moment",
      caption: "ความสดใสและรอยยิ้มในชุดโทนสีเบจและโบว์สีฟ้า",
      src: "/images/prewedding-5.jpg",
      aspect: "tall",
      objectPosition: "object-center",
    },
    {
      id: 5,
      title: "Hand in Hand Forever",
      caption: "กุมมือกันไว้พร้อมแหวนแทนคำมั่นสัญญา",
      src: "/images/prewedding-3.jpg",
      aspect: "tall",
      objectPosition: "object-center",
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
      accountNumber: "409-337914-5",
      cleanNumber: "4093379145",
      accountName: "Mild T. (Wedding Fund)",
      promptPay: "081-987-6543",
      color: "#4E2A84",
    },
  ],
};
