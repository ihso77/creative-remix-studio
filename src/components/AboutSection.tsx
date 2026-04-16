import { motion } from "framer-motion";
import { GraduationCap, Globe, Shield, Zap, Heart, Star, Info } from "lucide-react";

const aboutPoints = [
  {
    icon: GraduationCap,
    title: "تعليمي 100%",
    desc: "مصمم خصيصاً للبيئة التعليمية والرحلات المدرسية",
    color: "from-teal-400 to-emerald-500",
  },
  {
    icon: Globe,
    title: "وجهات متنوعة",
    desc: "اقتراحات لأفضل الوجهات في الخليج العربي والعالم",
    color: "from-sky-400 to-blue-500",
  },
  {
    icon: Shield,
    title: "آمن وموثوق",
    desc: "بياناتك محمية بأعلى معايير الأمان والخصوصية",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Zap,
    title: "سريع وذكي",
    desc: "ذكاء اصطناعي يقدم اقتراحات فورية ودقيقة",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Heart,
    title: "مجاني للجميع",
    desc: "استخدم التطبيق مجاناً بدون أي رسوم مخفية",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: Star,
    title: "تقييمات ومراجعات",
    desc: "شارك تجربتك وقيّم الرحلات السابقة",
    color: "from-violet-400 to-purple-500",
  },
];

const AboutSection = () => {
  return (
    <section className="py-24 relative overflow-hidden gradient-mesh">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-teal-100/50 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-gradient-to-tr from-amber-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Info className="w-4 h-4" />
            عن التطبيق
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            نبذة عن <span className="text-gradient-primary">التطبيق</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            مخطط الرحلات الذكي هو تطبيق يساعد المعلمين والطلاب على تخطيط الرحلات المدرسية بسهولة
            باستخدام أحدث تقنيات الذكاء الاصطناعي. يقدم اقتراحات ذكية ومخصصة بناءً على احتياجاتكم.
          </p>
        </motion.div>

        {/* About Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {aboutPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-5 card-shadow hover:card-hover-shadow transition-all duration-300 border border-white/60"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${point.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow`}
              >
                <point.icon className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
