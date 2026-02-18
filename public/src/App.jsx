import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Settings, Moon, Sun, X, Heart, 
  User, ListMusic, ChevronRight, Search, Calendar, Type, Clock, 
  ShieldCheck, AlertTriangle, Send, Star, Volume2 
} from 'lucide-react';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0);
  const [currentReaderIndex, setCurrentReaderIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('player'); 
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState('medium');
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('quran_favs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('quran_favs', JSON.stringify(favorites));
  }, [favorites]);

  const readers = useMemo(() => [
    { id: 'h_khalil', name: 'الحافظ خليل إسماعيل', style: 'المقام العراقي', color: 'from-amber-900 to-black', server: 'server9.mp3quran.net/h_khalil', icon: '🇮🇶' },
    { id: 'harak', name: 'عبد الناصر حرك', style: 'التلاوة العراقية', color: 'from-blue-900 to-black', server: 'server16.mp3quran.net/harak', icon: '🇮🇶' },
    { id: 'afs', name: 'مشاري العفاسي', style: 'عذب التلاوة', color: 'from-emerald-600 to-teal-900', server: 'server8.mp3quran.net/afs', icon: '🇰🇼' },
    { id: 'basit', name: 'عبد الباسط عبد الصمد', style: 'المصحف المجود', color: 'from-amber-700 to-orange-900', server: 'server7.mp3quran.net/basit', icon: '🇪🇬' },
    { id: 'minsh', name: 'محمد صديق المنشاوي', style: 'المنشاوي المرتل', color: 'from-blue-700 to-indigo-900', server: 'server10.mp3quran.net/minsh', icon: '🇪🇬' },
    { id: 'shur', name: 'سعود الشريم', style: 'الترتيل المكي', color: 'from-cyan-700 to-blue-900', server: 'server7.mp3quran.net/shur', icon: '🇸🇦' },
    { id: 'maher', name: 'ماهر المعيقلي', style: 'الخاشع المكي', color: 'from-red-700 to-stone-900', server: 'server12.mp3quran.net/maher', icon: '🇸🇦' },
    { id: 'sds', name: 'عبد الرحمن السديس', style: 'سديس الحرم', color: 'from-amber-800 to-yellow-900', server: 'server7.mp3quran.net/sds', icon: '🇸🇦' },
    { id: 'ajm', name: 'أحمد العجمي', style: 'الصوت القوي', color: 'from-indigo-600 to-blue-800', server: 'server10.mp3quran.net/ajm', icon: '🇸🇦' },
    { id: 'hussary', name: 'محمود خليل الحصري', style: 'شيخ القراء', color: 'from-slate-700 to-slate-900', server: 'server13.mp3quran.net/hussary', icon: '🇪🇬' },
  ], []);

  const surahs = useMemo(() => [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء",
    "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان",
    "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى",
    "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور",
    "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة",
    "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن",
    "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار",
    "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل",
    "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر",
    "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص",
    "الفلق", "الناس"
  ].map((name, index) => ({
    id: (index + 1).toString().padStart(3, '0'),
    name: name,
    index: index
  })), []);

  const currentAudioUrl = `https://${readers[currentReaderIndex].server}/${surahs[currentSurahIndex].id}.mp3`;

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentSurahIndex, currentReaderIndex]);

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => setIsPlaying(false));
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) setProgress((current / duration) * 100);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center ${isDarkMode ? 'bg-black text-white' : 'bg-stone-50 text-black'}`} dir="rtl">
      <header className="w-full max-w-4xl p-6 flex justify-between items-center">
        <button onClick={() => setShowSettings(true)} className="p-3 bg-white/5 rounded-2xl"><Settings size={20}/></button>
        <h1 className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">مصحف رمضان 2025</h1>
        <button onClick={() => setShowAbout(true)} className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 font-bold">i</button>
      </header>

      <nav className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-8">
        {['player', 'readers', 'surahs'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-emerald-500 text-white' : 'opacity-40'}`}>
            {tab === 'player' ? 'المشغل' : tab === 'readers' ? 'القراء' : 'السور'}
          </button>
        ))}
      </nav>

      <main className="flex-1 w-full max-w-4xl px-6 pb-20 overflow-y-auto">
        {activeTab === 'player' && (
          <div className="flex flex-col items-center">
             <div className={`w-64 h-64 rounded-[3rem] bg-gradient-to-br ${readers[currentReaderIndex].color} flex items-center justify-center shadow-2xl relative`}>
                <Moon size={80} className="text-white/80" fill="currentColor"/>
                <button onClick={() => {
                  const id = surahs[currentSurahIndex].id;
                  setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
                }} className="absolute top-4 left-4 p-2 bg-black/20 rounded-full">
                  <Heart size={20} fill={favorites.includes(surahs[currentSurahIndex].id) ? "red" : "none"} color={favorites.includes(surahs[currentSurahIndex].id) ? "red" : "white"}/>
                </button>
             </div>
             <div className="text-center mt-8">
                <h2 className="text-4xl font-black">{surahs[currentSurahIndex].name}</h2>
                <p className="text-xl opacity-60 mt-2">{readers[currentReaderIndex].name}</p>
             </div>
             <div className="w-full mt-10">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{width: `${progress}%`}}/>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => setCurrentSurahIndex(p => (p-1+surahs.length)%surahs.length)}><SkipBack size={30}/></button>
                  <button onClick={togglePlay} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center">
                    {isPlaying ? <Pause fill="black"/> : <Play fill="black" className="ml-1"/>}
                  </button>
                  <button onClick={() => setCurrentSurahIndex(p => (p+1)%surahs.length)}><SkipForward size={30}/></button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'readers' && (
          <div className="grid gap-3">
            {readers.map((r, i) => (
              <button key={r.id} onClick={() => {setCurrentReaderIndex(i); setActiveTab('player');}} className="p-4 bg-white/5 rounded-2xl flex items-center gap-4 border border-transparent hover:border-emerald-500/30">
                <span className="text-2xl">{r.icon}</span>
                <div className="text-right">
                  <p className="font-bold">{r.name}</p>
                  <p className="text-xs opacity-40">{r.style}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'surahs' && (
          <div className="grid grid-cols-2 gap-3">
            {surahs.map(s => (
              <button key={s.id} onClick={() => {setCurrentSurahIndex(s.index); setActiveTab('player');}} className="p-4 bg-white/5 rounded-2xl font-bold">
                {s.name}
              </button>
            ))}
          </div>
        )}
      </main>

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-stone-900 p-8 rounded-[3rem] border border-white/10 w-full max-w-sm">
            <div className="flex justify-between items-center mb-8 text-white">
              <h3 className="font-black text-2xl">الإعدادات</h3>
              <button onClick={() => setShowSettings(false)}><X/></button>
            </div>
            <div className="space-y-4">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full p-4 bg-white/5 rounded-2xl flex justify-between font-bold text-white">
                <span>المظهر الليلي</span>
                {isDarkMode ? <Moon size={18}/> : <Sun size={18}/>}
              </button>
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} src={currentAudioUrl} onTimeUpdate={handleTimeUpdate} onEnded={() => setCurrentSurahIndex(p => (p+1)%surahs.length)}/>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        body { font-family: 'Cairo', sans-serif; margin: 0; }
      `}</style>
    </div>
  );
}


