import { motion } from "framer-motion";
import { Compass, Map, Calendar, BarChart3 } from "lucide-react";

const steps = [
  { icon: Compass, title: "حدد اهتماماتك", desc: "أدخل الوجهة المفضلة وعدد الطلاب والاهتمامات" },
  { icon: Map, title: "احصل على اقتراح", desc: "الذكاء الاصطناعي يقترح أفضل الوجهات المناسبة" },
  { icon: Calendar, title: "خطط رحلتك", desc: "احفظ الاقتراح ونظم تفاصيل الرحلة" },
  { icon: BarChart3, title: "قيّم وشارك", desc: "قيّم تجربتك وشاركها مع الآخرين" },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-center text-foreground mb-14"
        >
          كيف يعمل التطبيق؟
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
