import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

interface TripSuggestion {
  destination: string;
  description: string;
  activities: string[];
  duration: string;
  tips: string;
}

const suggestionsDB: TripSuggestion[] = [
  {
    destination: "محمية الوعل - الرياض",
    description: "محمية طبيعية رائعة تجمع بين الحياة البرية والطبيعة الخلابة، مثالية للرحلات التعليمية.",
    activities: ["مشاهدة الحيوانات البرية", "التعلم عن البيئة الصحراوية", "التصوير الفوتوغرافي", "المشي في الطبيعة"],
    duration: "يوم واحد",
    tips: "يُفضل الزيارة في فصل الشتاء. أحضروا ماء كافي وواقي شمس.",
  },
  {
    destination: "متحف المستقبل - دبي",
    description: "من أجمل المتاحف التقنية في العالم، يعرض تقنيات المستقبل والذكاء الاصطناعي.",
    activities: ["استكشاف التقنيات المستقبلية", "تجارب تفاعلية", "ورش عمل تعليمية", "جولات إرشادية"],
    duration: "يوم واحد",
    tips: "احجزوا التذاكر مسبقاً. المتحف مناسب لجميع الأعمار.",
  },
  {
    destination: "جبل شمس - عُمان",
    description: "أعلى قمة جبلية في سلطنة عمان، توفر مناظر خلابة وتجربة تعليمية جيولوجية فريدة.",
    activities: ["تسلق الجبال", "دراسة التكوينات الجيولوجية", "التخييم", "مراقبة النجوم"],
    duration: "يومان",
    tips: "الطريق جبلي - تأكدوا من وسيلة نقل مناسبة. الجو بارد ليلاً.",
  },
  {
    destination: "واحة العين - أبوظبي",
    description: "موقع تراث عالمي لليونسكو يضم آلاف النخيل ونظام ري تقليدي عمره 3000 سنة.",
    activities: ["التعرف على نظام الأفلاج", "جولة في البساتين", "دراسة الزراعة التقليدية", "ورشة عمل تراثية"],
    duration: "نصف يوم",
    tips: "أفضل وقت للزيارة في الصباح الباكر. متاح مجاناً.",
  },
  {
    destination: "مركز الشيخ عبدالله السالم الثقافي - الكويت",
    description: "أكبر مجمع متاحف في الشرق الأوسط، يضم 6 متاحف تغطي الفضاء والطبيعة والعلوم.",
    activities: ["زيارة متحف الفضاء", "استكشاف عالم البحار", "تجارب علمية تفاعلية", "عروض القبة الفلكية"],
    duration: "يوم كامل",
    tips: "خصصوا وقتاً كافياً - المركز ضخم جداً. يوجد مطعم داخلي.",
  },
];

const AIPlannerPage = () => {
  const [destination, setDestination] = useState("");
  const [students, setStudents] = useState("");
  const [days, setDays] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TripSuggestion | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 2000));

    // Pick a suggestion based on input keywords
    const input = `${destination} ${interests}`.toLowerCase();
    let pick = suggestionsDB[Math.floor(Math.random() * suggestionsDB.length)];

    if (input.includes("طبيع") || input.includes("حيوان")) pick = suggestionsDB[0];
    else if (input.includes("تقن") || input.includes("مستقبل") || input.includes("ذكاء")) pick = suggestionsDB[1];
    else if (input.includes("جبل") || input.includes("تسلق") || input.includes("مغامر")) pick = suggestionsDB[2];
    else if (input.includes("تراث") || input.includes("تاريخ") || input.includes("زراع")) pick = suggestionsDB[3];
    else if (input.includes("علم") || input.includes("فضاء") || input.includes("متحف")) pick = suggestionsDB[4];

    setResult(pick);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              مدعوم بالذكاء الاصطناعي
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">خطط لرحلتك المدرسية</h1>
            <p className="text-muted-foreground">أدخل التفاصيل وسيقترح الذكاء الاصطناعي أفضل الوجهات</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-6 md:p-8 card-shadow space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  <MapPin className="w-4 h-4 inline ml-1" />
                  الوجهة المفضلة (اختياري)
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
                <label className="block text-sm font-bold text-foreground mb-1.5">
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
                <label className="block text-sm font-bold text-foreground mb-1.5">
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
                <label className="block text-sm font-bold text-foreground mb-1.5">
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
                  احصل على اقتراح
                </>
              )}
            </button>
          </motion.form>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-card rounded-2xl p-6 md:p-8 card-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">اقتراح الذكاء الاصطناعي</h2>
              </div>

              <h3 className="text-2xl font-extrabold text-primary mb-3">{result.destination}</h3>
              <p className="text-muted-foreground mb-5">{result.description}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <h4 className="font-bold text-foreground text-sm mb-2">🎯 الأنشطة المقترحة</h4>
                  <ul className="space-y-1">
                    {result.activities.map((a, i) => (
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
