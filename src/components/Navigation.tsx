import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Trophy, Users, Scale, FileText, Medal, TrendingUp, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { path: "/competitions", label: "Змагання", icon: Trophy },
    { path: "/judges", label: "Судді", icon: Scale },
    { path: "/teams", label: "Команди", icon: Users },
    { path: "/documents", label: "Документи", icon: FileText },
    { path: "/results", label: "Результати", icon: Medal },
    { path: "/rankings", label: "Рейтинг", icon: TrendingUp, protected: true },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">SAR Ukraine</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isDisabled = item.protected && !user;
              
              return (
                <Link
                  key={item.path}
                  to={isDisabled ? "#" : item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDisabled
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-foreground hover:bg-secondary"
                  }`}
                  onClick={(e) => isDisabled && e.preventDefault()}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Вийти
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">Увійти</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isDisabled = item.protected && !user;
              
              return (
                <Link
                  key={item.path}
                  to={isDisabled ? "#" : item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDisabled
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-foreground hover:bg-secondary"
                  }`}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t">
              {user ? (
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Вийти
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link to="/auth">Увійти</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
