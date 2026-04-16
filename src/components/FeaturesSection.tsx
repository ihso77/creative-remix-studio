import { motion } from "framer-motion";
import { Brain, Users, CheckSquare, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "ذكاء اصطناعي متقدم",
    description: "اقتراحات ذكية للوجهات بناءً على احتياجاتك واهتماماتك",
    gradient: "from-teal-500 to-emerald-500",
    bgGlow: "bg-teal-500/10",
  },
  {
    icon: Users,
    title: "سهولة الاستخدام",
    description: "واجهة بسيطة وسهلة مصممة خصيصاً للمعلمين والطلاب",
    gradient: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/10",
  },
  {
    icon: CheckSquare,
    title: "إدارة شاملة",
    description: "تتبع الرحلات والمشاركين والتقييمات بكل سهولة",
    gradient: "from-sky-500 to-blue-500",
    bgGlow: "bg-sky-500/10",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

      {/* Decorative blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

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
            <Sparkles className="w-4 h-4" />
            الميزات
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            مميزات <span className="text-gradient-primary">التطبيق</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            أدوات متكاملة لجعل تخطيط الرحلات المدرسية تجربة ممتعة وسلسة
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative bg-white rounded-2xl p-8 text-center card-shadow hover-lift border-gradient"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl ${f.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

              {/* Icon container */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                <f.icon className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-3/4 transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
