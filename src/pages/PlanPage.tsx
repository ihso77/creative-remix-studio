import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, MapPin, Calendar, Users, Loader2, Save, LogOut, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface TripSuggestion {
  destination: string;
  description: string;
  activities: string[];
  duration: string;
  tips: string;
  estimated_cost?: string;
}

const AIPlannerPage = () => {
  const [destination, setDestination] = useState("");
  const [students, setStudents] = useState("");
  const [days, setDays] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<TripSuggestion | null>(null);
  const [user, setUser] = useState<any>(null);
  const [savedTrips, setSavedTrips] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
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

    try {
      const { data, error } = await supabase.functions.invoke("trip-suggest", {
        body: { destination, students, days, interests },
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-2">
                <Sparkles className="w-4 h-4" />
                مدعوم بالذكاء الاصطناعي الحقيقي
              </div>
              <h1 className="text-3xl font-extrabold text-foreground">خطط لرحلتك المدرسية</h1>
              <p className="text-muted-foreground text-sm mt-1">أدخل التفاصيل وسيقترح الذكاء الاصطناعي أفضل الوجهات</p>
            </div>
            <div className="flex gap-2">
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
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="مثال: دبي، عُمان..."
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <Users className="w-4 h-4 inline ml-1" />
                    عدد الطلاب
                  </label>
                  <input
                    type="number"
                    value={students}
                    onChange={(e) => setStudents(e.target.value)}
                    placeholder="25"
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <Calendar className="w-4 h-4 inline ml-1" />
                    عدد الأيام
                  </label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="1"
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    <Sparkles className="w-4 h-4 inline ml-1" />
                    الاهتمامات
                  </label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="طبيعة، تقنية، تاريخ..."
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    الذكاء الاصطناعي يفكر...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    احصل على اقتراح ذكي
                  </>
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
                    <div key={trip.id} className="bg-secondary/50 rounded-lg p-3">
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
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-card rounded-2xl p-6 md:p-8 card-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-bold text-foreground">اقتراح الذكاء الاصطناعي</h2>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  حفظ الرحلة
                </button>
              </div>

              <h3 className="text-2xl font-extrabold text-primary mb-3">{result.destination}</h3>
              <p className="text-muted-foreground mb-5">{result.description}</p>

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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPlannerPage;
