import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="مخطط الرحلات" width={40} height={40} />
          <span className="text-lg font-bold text-foreground">مخطط الرحلات</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            الرئيسية
          </Link>
          <Link to="/plan" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            ابدأ التخطيط
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
