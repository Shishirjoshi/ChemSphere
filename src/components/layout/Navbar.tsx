import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Home, Zap, BarChart2, User, LogIn, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Page } from '../../App';
import { cn } from '../../lib/utils';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, signIn, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'simulator', label: 'Simulator', icon: Zap },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3",
      isScrolled ? "bg-[#050B18]/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
            <Beaker className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              ChemSphere
            </h1>
            <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Nepal</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Page)}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-cyan-400",
                currentPage === item.id ? "text-cyan-400" : "text-white/70"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          
          <div className="h-6 w-px bg-white/10 mx-2" />

          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="w-10 h-10 rounded-full border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-colors"
              >
                <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="avatar" />
              </button>
              <button 
                onClick={logout}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#050B18] font-semibold text-sm hover:bg-cyan-400 transition-colors"
            >
              <LogIn size={18} />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#050B18] border-b border-white/10 p-4 flex flex-col gap-4 md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as Page);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-colors",
                  currentPage === item.id ? "bg-cyan-500/10 text-cyan-400" : "text-white/70 hover:bg-white/5"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
            {!user && (
              <button
                onClick={signIn}
                className="flex items-center justify-center gap-2 p-4 rounded-xl bg-cyan-500 text-white font-bold"
              >
                <LogIn size={20} />
                Sign In
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
