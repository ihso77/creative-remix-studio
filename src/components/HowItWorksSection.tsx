import { motion } from "framer-motion";
import { Compass, Map, Calendar, BarChart3, Layers } from "lucide-react";

const steps = [
  { icon: Compass, title: "حدد اهتماماتك", desc: "أدخل الوجهة المفضلة وعدد الطلاب والاهتمامات", color: "from-teal-500 to-emerald-500" },
  { icon: Map, title: "احصل على اقتراح", desc: "الذكاء الاصطناعي يقترح أفضل الوجهات المناسبة", color: "from-amber-500 to-orange-500" },
  { icon: Calendar, title: "خطط رحلتك", desc: "احفظ الاقتراح ونظم تفاصيل الرحلة", color: "from-sky-500 to-blue-500" },
  { icon: BarChart3, title: "قيّم وشارك", desc: "قيّم تجربتك وشاركها مع الآخرين", color: "from-rose-500 to-pink-500" },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 hex-pattern opacity-30 pointer-events-none" />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-teal-50/50 to-transparent rounded-full blur-3xl pointer-events-none" />

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
            <Layers className="w-4 h-4" />
            خطوات بسيطة
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            كيف يعمل <span className="text-gradient-primary">التطبيق؟</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            أربع خطوات فقط للوصول إلى رحلة مدرسية مثالية
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-l from-teal-200 via-amber-200 to-sky-200 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
              className="text-center relative z-10 group"
            >
              {/* Step icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className="relative inline-block mb-5"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow relative z-10`}>
                  <step.icon className="w-9 h-9 text-white" />
                </div>
                {/* Step number badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 300 }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs font-extrabold shadow-md border-2 border-gray-100 z-20"
                >
                  <span className={`bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                    {i + 1}
                  </span>
                </motion.div>
                {/* Ripple effect on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              </motion.div>

              {/* Step text */}
              <motion.h3
                whileHover={{ scale: 1.02 }}
                className="font-bold text-foreground mb-2 text-lg"
              >
                {step.title}
              </motion.h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
