import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, BookOpen, Layers, Target, ClipboardList, TrendingUp, ArrowRight, ChevronRight, Beaker } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import { Page } from '../../App';
import { topics } from '../../data/topics';
import { cn } from '../../lib/utils';
import { Topic } from '../../types';

interface LandingPageProps {
  onNavigate: (page: Page, topic?: Topic) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'Organic' | 'Inorganic' | 'Physical'>('Organic');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    { icon: Zap, title: "Bond Simulation", desc: "Interact with atoms and visualize bond formations in 3D.", color: "text-yellow-400" },
    { icon: Layers, title: "Organic Visualizer", desc: "Understand carbon chains and reaction mechanisms visually.", color: "text-emerald-400" },
    { icon: BookOpen, title: "Exam-Focused Learning", desc: "Notes specifically curated for NEB board exams.", color: "text-blue-400" },
    { icon: Target, title: "Interactive Quizzes", desc: "Practice with timed MCQs and detailed explanations.", color: "text-purple-400" },
    { icon: ClipboardList, title: "Quick Revision", desc: "Formula sheets and summary boards for last-minute prep.", color: "text-cyan-400" },
    { icon: TrendingUp, title: "Progress Tracking", desc: "Analyze your performance and identify weak areas.", color: "text-rose-400" }
  ];

  const filteredTopics = topics.filter(t => t.category === activeCategory);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Next-Gen Learning
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
              Master Chemistry Through <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent px-1">
                Interactive Simulations
              </span>
            </h1>
            <p className="text-lg text-white/60 mb-10 max-w-lg leading-relaxed">
              Break free from textbooks. Visualize atomic bonds, organic mechanisms, and physical laws in a high-fidelity 3D environment designed for NEB +2 students.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('simulator')}
                className="group relative px-8 py-4 bg-cyan-500 text-white font-bold rounded-2xl overflow-hidden active:scale-95 transition-transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex items-center gap-2">
                  Try Bond Simulator <Zap size={18} />
                </div>
              </button>
              <button 
                onClick={() => {
                  const molTopic = topics.find(t => t.id === 'molecular-shape');
                  if (molTopic) onNavigate('topic', molTopic);
                }}
                className="group relative px-8 py-4 bg-purple-500 text-white font-bold rounded-2xl overflow-hidden active:scale-95 transition-transform hover:bg-purple-600"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex items-center gap-2">
                  Molecular Shape Visualizer <Beaker size={18} />
                </div>
              </button>
              <button 
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
                onClick={() => {
                   const topicsSection = document.getElementById('topics');
                   topicsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Learning
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/10 blur-[100px] rounded-full" />
            <HeroVisual />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative bg-[#060D1E]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-black mb-4">Science Meets Interaction</h2>
            <p className="text-white/50 max-w-2xl mx-auto">Our platform combines cutting-edge web technology with the NEB syllabus to make chemistry more engaging than ever or school.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group p-8 rounded-3xl bg-white/2 border border-white/5 hover:border-cyan-500/30 hover:bg-white/5 transition-all duration-500"
              >
                <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all", f.color)}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="topics" className="py-24 px-4 bg-transparent relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full -z-10" />
         
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
               <div>
                  <h2 className="text-3xl lg:text-5xl font-black mb-4">NEB Exam Topics</h2>
                  <p className="text-white/50 max-w-xl">Curated content highlighting high-yield exam sections for Grade 11 & 12.</p>
               </div>
               
               <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                  {['Organic', 'Inorganic', 'Physical'].map((cat) => (
                     <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={cn(
                           "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                           activeCategory === cat ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-white/50 hover:text-white"
                        )}
                     >
                        {cat}
                     </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {filteredTopics.map((topic, i) => (
                  <motion.div
                     key={topic.id}
                     initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="group relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 p-8 hover:bg-white/[0.08] transition-all flex flex-col md:flex-row gap-6 items-start"
                  >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity" />
                     
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                           <span className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/20">
                              {topic.nebImportance} Importance
                           </span>
                           <span className={cn(
                              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                              topic.difficulty === 'Hard' ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                           )}>
                              {topic.difficulty}
                           </span>
                        </div>
                        <h3 className="text-2xl font-black mb-3">{topic.title}</h3>
                        <p className="text-white/50 text-sm mb-6 leading-relaxed">
                           {topic.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-8">
                           {topic.formulas.slice(0, 2).map((f, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs font-mono py-1.5 px-3 rounded-lg bg-black/40 text-cyan-300 border border-white/5">
                                 {f}
                              </div>
                           ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-auto">
                           <button 
                             onClick={() => onNavigate('topic', topic)}
                             className="flex items-center gap-2 text-sm font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors"
                           >
                              Explore Topic <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                           <span className="text-white/20 text-xs">•</span>
                           <span className="text-white/40 text-xs flex items-center gap-1">
                              <BookOpen size={14} /> {topic.learningTime}
                           </span>
                        </div>
                     </div>
                     
                     <div className="relative w-full md:w-32 aspect-square rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center p-6 group-hover:scale-105 transition-transform">
                        <Beaker size={48} className="text-cyan-400" />
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-cyan-900/10">
         <div className="max-w-4xl mx-auto text-center px-4 py-16 rounded-[3rem] bg-white/5 border border-white/10 relative overflow-hidden backdrop-blur-md">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full" />
            
            <h2 className="text-4xl lg:text-6xl font-black mb-6">Ready to see the <br /> <span className="text-cyan-400">invisible?</span></h2>
            <p className="text-white/60 mb-10 max-w-lg mx-auto">Download notes, attempt mock tests, and join thousands of students mastering NEB Chemistry today.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
               <button 
                 onClick={() => onNavigate('simulator')}
                 className="w-full sm:w-auto px-10 py-5 bg-white text-[#050B18] font-black rounded-2xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
               >
                  Try Now <ChevronRight size={20} />
               </button>
               <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-colors">
                  Join Community
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};
