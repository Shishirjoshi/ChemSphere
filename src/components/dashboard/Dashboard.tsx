import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  BookOpen, 
  Trophy, 
  Clock, 
  Star, 
  ChevronRight, 
  Target,
  Brain,
  Award,
  History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Page } from '../../App';
import { cn } from '../../lib/utils';
import { topics } from '../../data/topics';
import { Topic } from '../../types';

interface DashboardProps {
  onNavigate: (page: Page, topic?: Topic) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, userData } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6">
          <Zap size={48} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-center">Sign in to track your progress</h2>
        <p className="text-white/50 mb-8 max-w-md text-center">Join thousands of students and start your journey towards NEB Chemistry excellence.</p>
        <button 
          onClick={() => {}} // Sign in already handled by navbar trigger, but we could add a button here
          className="px-8 py-4 bg-cyan-500 text-white font-bold rounded-2xl"
        >
          Get Started
        </button>
      </div>
    );
  }

  const stats = [
    { label: 'Learning Streak', value: `${userData?.learningStreak || 0} Days`, icon: Zap, color: 'text-orange-400' },
    { label: 'Chapters Done', value: userData?.completedChapters?.length || 0, icon: BookOpen, color: 'text-blue-400' },
    { label: 'Total Points', value: userData?.totalPoints || 0, icon: Trophy, color: 'text-yellow-400' },
    { label: 'Study Time', value: '14.5h', icon: Clock, color: 'text-emerald-400' },
  ];

  const recentTopics = topics.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-black mb-2 tracking-tight">
            Namaste, <span className="text-cyan-400">{user.displayName?.split(' ')[0]}</span>!
          </h2>
          <p className="text-white/50 font-medium">Ready to continue your Organic Chemistry session?</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60">
           Last Active: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl"
          >
            <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4", stat.color)}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content: Progress & Recommendations */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           {/* Section 1: Weekly Performance */}
           <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                    <Target size={20} className="text-cyan-400" /> Exam Performance
                 </h3>
                 <button className="text-xs font-bold text-cyan-400 hover:underline">View Analytics</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                    <span className="text-[10px] font-bold text-white/30 uppercase block mb-3">MCQ Accuracy</span>
                    <div className="flex items-end gap-3">
                       <span className="text-3xl font-black">82%</span>
                       <span className="text-xs text-emerald-400 font-bold mb-1">+5% from last week</span>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[82%]" />
                    </div>
                 </div>
                 <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                    <span className="text-[10px] font-bold text-white/30 uppercase block mb-3">Syllabus Covered</span>
                    <div className="flex items-end gap-3">
                       <span className="text-3xl font-black">45%</span>
                       <span className="text-xs text-blue-400 font-bold mb-1">Grade 12 Only</span>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[45%]" />
                    </div>
                 </div>
                 <div className="p-6 rounded-2xl bg-white/2 border border-white/5 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] font-bold text-white/30 uppercase block mb-2">Current Rank</span>
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
                       <Award size={24} />
                    </div>
                    <span className="text-lg font-black italic">Silver II</span>
                 </div>
              </div>
           </div>

           {/* Section 2: Recent Activity */}
           <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                 <History size={20} className="text-purple-400" /> Continue Learning
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {recentTopics.map((topic, i) => (
                    <div 
                       key={topic.id}
                       className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all flex items-center justify-between cursor-pointer"
                       onClick={() => onNavigate('topic', topic)}
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                             <Zap size={20} />
                          </div>
                          <div>
                             <h4 className="font-bold text-lg">{topic.title}</h4>
                             <p className="text-xs text-white/40">{topic.category} Chemistry</p>
                          </div>
                       </div>
                       <ChevronRight size={20} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                    </div>
                 ))}
                 <button className="p-6 rounded-3xl border border-dashed border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-white/40 font-bold">
                    Browse All Topics <ChevronRight size={18} />
                 </button>
              </div>
           </div>
        </div>

        {/* Sidebar: Recommendations & Challenges */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="p-8 rounded-[2.5rem] bg-cyan-500/10 border border-cyan-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Brain size={120} />
              </div>
              <h3 className="text-xl font-black mb-4">Daily Challenge</h3>
              <p className="text-sm text-white/60 mb-6">Explain the geometry and bond angle of PCl₅ using VSEPR theory.</p>
              <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 mb-6">
                 <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                    <Star size={14} /> +200 Points
                 </div>
                 <span className="text-[10px] text-white/40 font-bold">Ends in 4h 12m</span>
              </div>
              <button className="w-full py-4 bg-white text-[#050B18] font-bold rounded-2xl hover:bg-cyan-400 transition-colors">
                 Solve Now
              </button>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col gap-6">
              <h3 className="text-lg font-bold">Weak Topics Analysis</h3>
              <div className="space-y-4">
                 {[
                    { label: 'Thermodynamics', level: 'Hard', val: 30 },
                    { label: 'Redox Reactions', level: 'Medium', val: 55 },
                    { label: 'Hydrocarbons', level: 'Hard', val: 42 }
                 ].map((item, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-white/80">{item.label}</span>
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{item.level}</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: `${item.val}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full py-3 bg-white/5 border border-white/10 text-white/60 font-bold rounded-xl text-sm hover:text-white transition-colors mt-2">
                 Get Suggested Notes
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
