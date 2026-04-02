import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "أ. فاطمة المنصوري",
    role: "معلمة علوم",
    text: "التطبيق سهّل علينا تخطيط الرحلات المدرسية بشكل كبير. الاقتراحات الذكية وفرت علينا وقت ومجهود!",
  },
  {
    name: "أ. سالم الحربي",
    role: "مشرف أنشطة",
    text: "أفضل أداة لتنظيم الرحلات التعليمية. واجهة سهلة واقتراحات ممتازة تناسب طلابنا.",
  },
  {
    name: "طالبة - الصف العاشر",
    role: "طالبة",
    text: "الرحلة اللي خططنا لها بالتطبيق كانت أحلى رحلة! التطبيق اقترح أماكن ما كنا نعرفها.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-center text-foreground mb-14"
        >
          آراء المستخدمين
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-2xl p-6 card-shadow relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 left-4" />
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
