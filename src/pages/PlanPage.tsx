import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MapPin, Calendar, Users, Loader2, Save, LogOut, History, GraduationCap, Wallet, Bus, ClipboardList, Tag, Volume2, VolumeX, CloudSun, Accessibility, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface WeatherInfo {
  temperature: string;
  description: string;
  recommendation: string;
}

interface TripSuggestion {
  destination: string;
  description: string;
  activities: string[];
  duration: string;
  tips: string;
  estimated_cost?: string;
  latitude?: number;
  longitude?: number;
  weather?: WeatherInfo;
}

const AIPlannerPage = () => {
  const [destination, setDestination] = useState("");
  const [students, setStudents] = useState("");
  const [days, setDays] = useState("");
  const [interests, setInterests] = useState("");
  const [tripType, setTripType] = useState("");
  const [budget, setBudget] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [transportation, setTransportation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<TripSuggestion | null>(null);
  const [user, setUser] = useState<any>(null);
  const [savedTrips, setSavedTrips] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [highContrast, setHighContrast] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) loadTrips();
  }, [user]);

  const loadTrips = async () => {
    const { data } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setSavedTrips(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSpokenText("");

    try {
      const { data, error } = await supabase.functions.invoke("trip-suggest", {
        body: { destination, students, days, interests, tripType, budget, gradeLevel, transportation, notes },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setResult(data.suggestion);
      toast.success("تم إنشاء الاقتراح بنجاح! ✨");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ في الذكاء الاصطناعي");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("trips").insert({
        user_id: user.id,
        destination: result.destination,
        students_count: students ? parseInt(students) : null,
        days: days ? parseInt(days) : null,
        interests,
        ai_suggestion: result as any,
      });
      if (error) throw error;
      toast.success("تم حفظ الرحلة! 🎉");
      loadTrips();
    } catch (err: any) {
      toast.error(err.message || "خطأ في الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const buildSpeechText = useCallback((r: TripSuggestion) => {
    let text = `الوجهة المقترحة: ${r.destination}. ${r.description}. `;
    if (r.weather) {
      text += `حالة الطقس: ${r.weather.description}، درجة الحرارة ${r.weather.temperature}. ${r.weather.recommendation}. `;
    }
    text += `الأنشطة المقترحة: ${r.activities?.join("، ")}. `;
    text += `المدة: ${r.duration}. `;
    text += `نصائح: ${r.tips}. `;
    if (r.estimated_cost) text += `التكلفة التقريبية: ${r.estimated_cost}.`;
    return text;
  }, []);

  const handleSpeak = useCallback(() => {
    if (!result) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = buildSpeechText(result);
    setSpokenText(text);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [result, isSpeaking, buildSpeechText]);

  const contrastClass = highContrast ? "contrast-125 font-bold" : "";

  return (
    <div className={`min-h-screen bg-background ${contrastClass}`}>
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between mb-8 gap-3"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-2">
                <Sparkles className="w-4 h-4" />
                مدعوم بالذكاء الاصطناعي الحقيقي
              </div>
              <h1 className="text-3xl font-extrabold text-foreground">خطط لرحلتك المدرسية</h1>
              <p className="text-muted-foreground text-sm mt-1">أدخل التفاصيل وسيقترح الذكاء الاصطناعي أفضل الوجهات مع خريطة وطقس</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setHighContrast(!highContrast)}
                title="تباين عالي لذوي الإعاقة"
                className="flex items-center gap-1 bg-accent/20 text-accent-foreground px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <Eye className="w-4 h-4" />
                {highContrast ? "عادي" : "تباين عالي"}
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <History className="w-4 h-4" />
                رحلاتي
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            </div>
          </motion.div>

          {/* Accessibility banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6 bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3"
          >
            <Accessibility className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground">دعم ذوي الإعاقة السمعية</p>
              <p className="text-xs text-muted-foreground mt-1">
                يمكنك الاستماع للاقتراح صوتياً أو قراءة النص المكتوب. كما يمكنك تفعيل وضع التباين العالي للوضوح البصري.
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="lg:col-span-2 bg-card rounded-2xl p-6 card-shadow space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <MapPin className="w-4 h-4 inline ml-1" />
                    الوجهة المفضلة
                  </label>
                  <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)}
                    placeholder="مثال: دبي، عُمان..."
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <Tag className="w-4 h-4 inline ml-1" />
                    نوع الرحلة
                  </label>
                  <select value={tripType} onChange={(e) => setTripType(e.target.value)}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                    <option value="">اختر نوع الرحلة</option>
                    <option value="تعليمية">رحلة تعليمية</option>
                    <option value="ترفيهية">رحلة ترفيهية</option>
                    <option value="ثقافية">رحلة ثقافية</option>
                    <option value="رياضية">رحلة رياضية</option>
                    <option value="علمية">رحلة علمية</option>
                    <option value="مغامرات">رحلة مغامرات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <Users className="w-4 h-4 inline ml-1" />
                    عدد الطلاب
                  </label>
                  <input type="number" value={students} onChange={(e) => setStudents(e.target.value)}
                    placeholder="25"
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <GraduationCap className="w-4 h-4 inline ml-1" />
                    الصف الدراسي
                  </label>
                  <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                    <option value="">اختر الصف</option>
                    <option value="1-3">الصفوف الأولية (1-3)</option>
                    <option value="4-6">الصفوف المتوسطة الدنيا (4-6)</option>
                    <option value="7-9">الصفوف المتوسطة العليا (7-9)</option>
                    <option value="10-12">الصفوف الثانوية (10-12)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <Calendar className="w-4 h-4 inline ml-1" />
                    عدد الأيام
                  </label>
                  <input type="number" value={days} onChange={(e) => setDays(e.target.value)}
                    placeholder="1"
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <Wallet className="w-4 h-4 inline ml-1" />
                    الميزانية لكل طالب (ر.ع)
                  </label>
                  <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)}
                    placeholder="مثال: 50"
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <Bus className="w-4 h-4 inline ml-1" />
                    وسيلة النقل
                  </label>
                  <select value={transportation} onChange={(e) => setTransportation(e.target.value)}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                    <option value="">اختر وسيلة النقل</option>
                    <option value="حافلة مدرسية">حافلة مدرسية</option>
                    <option value="باص سياحي">باص سياحي</option>
                    <option value="طائرة">طائرة</option>
                    <option value="قارب">قارب / باص بحري</option>
                    <option value="قطار">قطار</option>
                    <option value="سيارات خاصة">سيارات خاصة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <Sparkles className="w-4 h-4 inline ml-1" />
                    الاهتمامات
                  </label>
                  <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)}
                    placeholder="طبيعة، تقنية، تاريخ..."
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-1">
                  <ClipboardList className="w-4 h-4 inline ml-1" />
                  ملاحظات إضافية
                </label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تفاصيل إضافية ترغب بإضافتها..."
                  rows={3}
                  className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />الذكاء الاصطناعي يفكر...</>
                ) : (
                  <><Send className="w-5 h-5" />احصل على اقتراح ذكي</>
                )}
              </button>
            </motion.form>

            {/* Sidebar - History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-card rounded-2xl p-5 card-shadow ${showHistory ? "" : "hidden lg:block"}`}
            >
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                رحلاتي السابقة
              </h3>
              {savedTrips.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">لا توجد رحلات محفوظة بعد</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {savedTrips.map((trip) => (
                    <div key={trip.id} className="bg-secondary/50 rounded-lg p-3 cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => setResult((trip.ai_suggestion as any) || null)}>
                      <p className="font-bold text-sm text-foreground">{(trip.ai_suggestion as any)?.destination || trip.destination}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(trip.created_at).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mt-8 space-y-6"
              >
                {/* Main result card */}
                <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent" />
                      <h2 className="text-xl font-bold text-foreground">اقتراح الذكاء الاصطناعي</h2>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSpeak}
                        title={isSpeaking ? "إيقاف القراءة" : "استمع للاقتراح صوتياً"}
                        className="flex items-center gap-1 bg-accent/20 text-accent-foreground px-3 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all">
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        {isSpeaking ? "إيقاف" : "استماع 🔊"}
                      </button>
                      <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-60">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        حفظ الرحلة
                      </button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-extrabold text-primary mb-3">{result.destination}</h3>
                  <p className="text-muted-foreground mb-5 leading-relaxed">{result.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-5">
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <h4 className="font-bold text-foreground text-sm mb-2">🎯 الأنشطة المقترحة</h4>
                      <ul className="space-y-1">
                        {result.activities?.map((a, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-secondary/50 rounded-xl p-4">
                        <h4 className="font-bold text-foreground text-sm mb-1">⏱ المدة المقترحة</h4>
                        <p className="text-sm text-muted-foreground">{result.duration}</p>
                      </div>
                      <div className="bg-secondary/50 rounded-xl p-4">
                        <h4 className="font-bold text-foreground text-sm mb-1">💡 نصائح</h4>
                        <p className="text-sm text-muted-foreground">{result.tips}</p>
                      </div>
                      {result.estimated_cost && (
                        <div className="bg-secondary/50 rounded-xl p-4">
                          <h4 className="font-bold text-foreground text-sm mb-1">💰 التكلفة التقريبية</h4>
                          <p className="text-sm text-muted-foreground">{result.estimated_cost}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Weather card */}
                {result.weather && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-gradient-to-r from-sky-500/10 to-amber-500/10 border border-sky-500/20 rounded-2xl p-6 card-shadow"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CloudSun className="w-5 h-5 text-sky-500" />
                      <h3 className="text-lg font-bold text-foreground">حالة الطقس في {result.destination}</h3>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="bg-background/60 rounded-xl p-4 text-center">
                        <p className="text-3xl font-extrabold text-primary">{result.weather.temperature}</p>
                        <p className="text-xs text-muted-foreground mt-1">درجة الحرارة</p>
                      </div>
                      <div className="bg-background/60 rounded-xl p-4 text-center">
                        <p className="text-lg font-bold text-foreground">{result.weather.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">الحالة</p>
                      </div>
                      <div className="bg-background/60 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground">{result.weather.recommendation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Map */}
                {result.latitude && result.longitude && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-card rounded-2xl overflow-hidden card-shadow"
                  >
                    <div className="p-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">الخريطة التفاعلية</h3>
                    </div>
                    <div className="h-[350px] w-full">
                      <MapContainer
                        center={[result.latitude, result.longitude]}
                        zoom={12}
                        scrollWheelZoom={false}
                        className="h-full w-full z-0"
                        key={`${result.latitude}-${result.longitude}`}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[result.latitude, result.longitude]}>
                          <Popup>
                            <strong>{result.destination}</strong>
                            <br />
                            {result.description?.substring(0, 80)}...
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </motion.div>
                )}

                {/* Spoken text transcript (accessibility) */}
                {spokenText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border-2 border-accent/30 rounded-2xl p-6 card-shadow"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Accessibility className="w-5 h-5 text-accent" />
                      <h3 className="text-lg font-bold text-foreground">النص المكتوب للصوت الإرشادي</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{spokenText}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIPlannerPage;
