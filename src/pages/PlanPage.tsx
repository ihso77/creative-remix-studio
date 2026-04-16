import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MapPin, Calendar, Users, Loader2, Save, LogOut, History, GraduationCap, Wallet, Bus, ClipboardList, Tag, Volume2, VolumeX, CloudSun, Accessibility, Eye, Mic, MicOff, Captions, Trash2 } from "lucide-react";
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

// SpeechRecognition type declarations for browser API
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

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

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  isFinal: boolean;
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

  // Live Captions state (hearing impairment accessibility)
  const [isLiveCaptionsActive, setIsLiveCaptionsActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<TranscriptEntry[]>([]);
  const [interimText, setInterimText] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [showCaptionsPanel, setShowCaptionsPanel] = useState(true);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveTranscript, interimText]);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
    }
  }, []);

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
      toast.success("تم إنشاء الاقتراح بنجاح!");
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
      toast.success("تم حفظ الرحلة!");
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

  // ===== LIVE CAPTIONS - Speech to Text for Hearing Impaired =====
  const toggleLiveCaptions = useCallback(() => {
    if (isLiveCaptionsActive) {
      // Stop listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          recognitionRef.current.abort();
        }
      }
      setIsLiveCaptionsActive(false);
      setInterimText("");
      toast.success("تم إيقاف الترجمة الحية");
    } else {
      // Start listening
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        toast.error("متصفحك لا يدعم التعرف على الصوت. يرجى استخدام Chrome أو Edge.");
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.lang = "ar-SA";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsLiveCaptionsActive(true);
        toast.success("تم تفعيل الترجمة الحية - تحدث الآن!");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            const transcriptText = result[0].transcript.trim();
            if (transcriptText) {
              setLiveTranscript((prev) => [
                ...prev,
                {
                  id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  text: transcriptText,
                  timestamp: new Date(),
                  isFinal: true,
                },
              ]);
            }
          } else {
            interim += result[0].transcript;
          }
        }
        setInterimText(interim);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "no-speech") {
          // This is normal, just restart
          return;
        }
        if (event.error === "not-allowed") {
          toast.error("يرجى السماح بالوصول إلى الميكروفون لتفعيل الترجمة الحية");
          setIsLiveCaptionsActive(false);
          return;
        }
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        // Auto-restart if still active (continuous listening)
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // If it fails to restart, stop
            setIsLiveCaptionsActive(false);
          }
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {
        toast.error("حدث خطأ في تشغيل الترجمة الحية");
      }
    }
  }, [isLiveCaptionsActive]);

  const clearTranscript = useCallback(() => {
    setLiveTranscript([]);
    setInterimText("");
    toast.success("تم مسح الترجمة");
  }, []);

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
              {/* Live Captions Toggle - Hearing Impairment Feature */}
              {speechSupported && (
                <button
                  onClick={toggleLiveCaptions}
                  title={isLiveCaptionsActive ? "إيقاف الترجمة الحية" : "تفعيل الترجمة الحية لذوي الإعاقة السمعية"}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    isLiveCaptionsActive
                      ? "bg-red-500/20 text-red-600 animate-pulse"
                      : "bg-blue-500/20 text-blue-600 hover:opacity-80"
                  }`}
                >
                  {isLiveCaptionsActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isLiveCaptionsActive ? "إيقاف الترجمة" : "ترجمة حية"}
                </button>
              )}
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
              <p className="text-sm font-bold text-foreground">دعم ذوي الإعاقة السمعية والبصرية</p>
              <p className="text-xs text-muted-foreground mt-1">
                <strong>لضعاف السمع:</strong> اضغط &quot;ترجمة حية&quot; لتحويل أي كلام مسموع إلى نص مكتوب فوراً. يمكنك أيضاً الاستماع للاقتراح صوتياً أو قراءة النص.
                <br />
                <strong>لضعاف البصر:</strong> فعّل &quot;تباين عالي&quot; لتحسين الوضوح البصري.
              </p>
            </div>
          </motion.div>

          {/* ===== LIVE CAPTIONS PANEL - Hearing Impairment Feature ===== */}
          <AnimatePresence>
            {isLiveCaptionsActive && showCaptionsPanel && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="mb-6 rounded-2xl overflow-hidden card-shadow border-2 border-blue-400/40"
              >
                {/* Captions Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <Captions className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">الترجمة الحية - Live Captions</h3>
                      <p className="text-blue-100 text-xs">يتم تحويل الكلام إلى نص في الوقت الفعلي</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearTranscript}
                      title="مسح الترجمة"
                      className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowCaptionsPanel(false)}
                      title="إخفاء اللوحة"
                      className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="text-xs font-bold">✕</span>
                    </button>
                  </div>
                </div>

                {/* Captions Body */}
                <div className="bg-slate-900 p-5 min-h-[120px] max-h-[250px] overflow-y-auto">
                  {liveTranscript.length === 0 && !interimText ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Mic className="w-10 h-10 text-blue-400/50 mb-3" />
                      <p className="text-blue-200/60 text-sm">جاري الاستماع... تحدث الآن</p>
                      <p className="text-blue-300/40 text-xs mt-1">سيظهر النص هنا تلقائياً عند الكلام</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {liveTranscript.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white/10 rounded-xl px-4 py-2.5"
                        >
                          <p className="text-white text-sm leading-relaxed font-medium">{entry.text}</p>
                          <p className="text-blue-300/50 text-xs mt-1">
                            {entry.timestamp.toLocaleTimeString("ar-SA", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </p>
                        </motion.div>
                      ))}
                      {/* Interim (in-progress) text */}
                      {interimText && (
                        <div className="bg-blue-400/10 border border-blue-400/20 rounded-xl px-4 py-2.5">
                          <p className="text-blue-200/70 text-sm leading-relaxed italic">{interimText}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                            <span className="text-blue-300/40 text-xs">جاري الاستماع...</span>
                          </div>
                        </div>
                      )}
                      <div ref={transcriptEndRef} />
                    </div>
                  )}
                </div>

                {/* Captions Footer */}
                <div className="bg-slate-800 px-5 py-2.5 flex items-center justify-between border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isLiveCaptionsActive ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
                    <span className="text-xs text-slate-400">
                      {isLiveCaptionsActive ? "نشط - الاستماع مستمر" : "متوقف"}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {liveTranscript.length} {liveTranscript.length === 1 ? "جملة" : "جمل"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show collapsed captions indicator */}
          {isLiveCaptionsActive && !showCaptionsPanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4"
            >
              <button
                onClick={() => setShowCaptionsPanel(true)}
                className="flex items-center gap-2 bg-blue-500/20 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-500/30 transition-colors"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <Captions className="w-4 h-4" />
                عرض لوحة الترجمة الحية ({liveTranscript.length} جمل)
              </button>
            </motion.div>
          )}

          {/* Floating live text indicator when captions panel is hidden */}
          {isLiveCaptionsActive && interimText && !showCaptionsPanel && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 bg-slate-900/90 backdrop-blur-sm border border-blue-400/30 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Mic className="w-3 h-3 text-blue-400 animate-pulse" />
                <span className="text-blue-300/60 text-xs">ترجمة مباشرة:</span>
              </div>
              <p className="text-white text-sm">{interimText}</p>
            </motion.div>
          )}

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
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={handleSpeak}
                        title={isSpeaking ? "إيقاف القراءة" : "استمع للاقتراح صوتياً"}
                        className="flex items-center gap-1 bg-accent/20 text-accent-foreground px-3 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all">
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        {isSpeaking ? "إيقاف" : "استماع"}
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
                      <h4 className="font-bold text-foreground text-sm mb-2">الأنشطة المقترحة</h4>
                      <ul className="space-y-1">
                        {result.activities?.map((a, i) => (
                          <li key={i} className="text-sm text-muted-foreground">- {a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-secondary/50 rounded-xl p-4">
                        <h4 className="font-bold text-foreground text-sm mb-1">المدة المقترحة</h4>
                        <p className="text-sm text-muted-foreground">{result.duration}</p>
                      </div>
                      <div className="bg-secondary/50 rounded-xl p-4">
                        <h4 className="font-bold text-foreground text-sm mb-1">نصائح</h4>
                        <p className="text-sm text-muted-foreground">{result.tips}</p>
                      </div>
                      {result.estimated_cost && (
                        <div className="bg-secondary/50 rounded-xl p-4">
                          <h4 className="font-bold text-foreground text-sm mb-1">التكلفة التقريبية</h4>
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
