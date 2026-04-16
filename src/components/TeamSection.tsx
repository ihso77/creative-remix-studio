import { motion } from "framer-motion";
import { Users } from "lucide-react";

const teamMembers = [
  { name: "مها موسى البلوشية", initials: "مم", gradient: "from-teal-400 to-emerald-500" },
  { name: "مهره عبدالله البلوشي", initials: "مع", gradient: "from-amber-400 to-orange-500" },
  { name: "نورة سلطان العربية", initials: "نس", gradient: "from-sky-400 to-blue-500" },
  { name: "ميرة سليمان الرئيسية", initials: "مس", gradient: "from-rose-400 to-pink-500" },
  { name: "آمنة إسماعيل البلوشية", initials: "آا", gradient: "from-violet-400 to-purple-500" },
];

const TeamSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-teal-50/50 to-amber-50/50 rounded-full blur-3xl pointer-events-none" />

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
            <Users className="w-4 h-4" />
            فريق العمل
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            <span className="text-gradient-primary">فريقنا</span>
          </h2>
          <p className="text-muted-foreground text-lg">فريق صناع الأثر — عمل الطالبات</p>
        </motion.div>

        {/* Team members */}
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="flex flex-col items-center gap-4 group cursor-default"
            >
              {/* Avatar with gradient ring */}
              <div className="relative">
                {/* Outer glow ring */}
                <div className={`absolute -inset-1.5 bg-gradient-to-br ${member.gradient} rounded-full opacity-0 group-hover:opacity-30 blur-md transition-all duration-500`} />
                {/* Gradient ring */}
                <div className={`relative w-22 h-22 rounded-full p-[3px] bg-gradient-to-br ${member.gradient}`}>
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className={`text-xl font-bold bg-gradient-to-br ${member.gradient} bg-clip-text text-transparent`}>
                      {member.initials}
                    </span>
                  </div>
                </div>
              </div>
              {/* Name */}
              <motion.h3
                whileHover={{ scale: 1.02 }}
                className="text-sm font-bold text-foreground text-center group-hover:text-primary transition-colors duration-300"
              >
                {member.name}
              </motion.h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
