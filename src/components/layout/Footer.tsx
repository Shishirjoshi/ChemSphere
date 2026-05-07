import React from 'react';
import { Beaker, Github, Twitter, Mail, Globe } from 'lucide-react';
import { Page } from '../../App';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#020610] border-t border-white/5 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Beaker className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-bold text-lg">ChemSphere</h3>
                <p className="text-[8px] text-cyan-400 font-mono tracking-widest uppercase">Nepal</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              The ultimate interactive chemistry learning platform specifically designed for NEB +2 students in Nepal.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-cyan-400">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-cyan-400">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-cyan-400">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/80">Platform</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('home')} className="text-white/50 hover:text-cyan-400 text-sm transition-colors">Hero Section</button></li>
              <li><button onClick={() => onNavigate('simulator')} className="text-white/50 hover:text-cyan-400 text-sm transition-colors">Bond Simulator</button></li>
              <li><button onClick={() => onNavigate('quiz')} className="text-white/50 hover:text-cyan-400 text-sm transition-colors">Interactive Quizzes</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="text-white/50 hover:text-cyan-400 text-sm transition-colors">Dashboard</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/80">Syllabus</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-cyan-400 text-sm transition-colors">Organic Chemistry</a></li>
              <li><a href="#" className="text-white/50 hover:text-cyan-400 text-sm transition-colors">Inorganic Chemistry</a></li>
              <li><a href="#" className="text-white/50 hover:text-cyan-400 text-sm transition-colors">Physical Chemistry</a></li>
              <li><a href="#" className="text-white/50 hover:text-cyan-400 text-sm transition-colors">NEB Exam Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/80">Contact</h4>
            <p className="text-white/50 text-sm mb-4">
              Have questions about NEB Chemistry? Reach out to us.
            </p>
            <div className="flex items-center gap-2 text-sm text-cyan-400 font-semibold mb-2">
              <Globe size={16} />
              <span>Kathmandu, Nepal</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Mail size={16} />
              <span>support@chemsphere.com.np</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs text-center md:text-left">
            © {new Date().getFullYear()} ChemSphere Nepal. Developed for NEB +2 Excellence.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-white/30 hover:text-white transition-colors text-xs">Privacy Policy</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-xs">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
