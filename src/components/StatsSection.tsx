import { motion } from "framer-motion";
import { TrendingUp, Users, MapPin, Award } from "lucide-react";

const stats = [
  { icon: MapPin, value: "50+", label: "وجهة متاحة" },
  { icon: Users, value: "1000+", label: "مستخدم" },
  { icon: TrendingUp, value: "500+", label: "رحلة مخططة" },
  { icon: Award, value: "4.9", label: "تقييم المستخدمين" },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-primary-foreground/70 mx-auto mb-2" />
              <p className="text-3xl md:text-4xl font-extrabold text-primary-foreground">{stat.value}</p>
              <p className="text-sm text-primary-foreground/80 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
