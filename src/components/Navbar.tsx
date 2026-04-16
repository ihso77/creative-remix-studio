import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100"
          : "bg-white/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.img
            src={logo}
            alt="مخطط الرحلات"
            width={40}
            height={40}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
            className="drop-shadow-sm"
          />
          <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            مخطط الرحلات
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium animated-underline">
            الرئيسية
          </Link>
          {user ? (
            <Link
              to="/plan"
              className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              لوحة التخطيط
            </Link>
          ) : (
            <>
              <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium animated-underline">
                تسجيل الدخول
              </Link>
              <Link
                to="/auth"
                className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
