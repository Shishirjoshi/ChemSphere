import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreBoardProps {
  score: number;
  streak: number;
  level: number;
  bondsFormed: number;
  achievement: string | null;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, streak, level, bondsFormed, achievement }) => {
  const levelThresholds = [0, 100, 300, 600, 1000, 1500];
  const nextThreshold = levelThresholds[Math.min(level, levelThresholds.length - 1)] || 1500;
  const prevThreshold = levelThresholds[Math.max(level - 1, 0)] || 0;
  const progress = Math.min(100, ((score - prevThreshold) / (nextThreshold - prevThreshold)) * 100);

  const levelNames = ['Novice', 'Apprentice', 'Chemist', 'Senior', 'Expert', 'Master'];
  const levelColors = ['#60A5FA', '#34D399', '#A78BFA', '#FDBA74', '#F472B6', '#FDE68A'];

  return (
    <div className="space-y-2">
      {/* Achievement Toast */}
      <AnimatePresence>
        {achievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/40 rounded-xl p-2 text-center"
          >
            <div className="text-lg">🏆</div>
            <div className="text-xs text-yellow-300 font-orbitron font-bold">{achievement}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Score', value: score.toLocaleString(), icon: '⭐', color: '#FDE68A' },
          { label: 'Streak', value: `×${streak}`, icon: '🔥', color: '#F87171' },
          { label: 'Bonds', value: bondsFormed, icon: '🔗', color: '#34D399' },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-2 text-center"
          >
            <div className="text-base">{item.icon}</div>
            <motion.div
              key={item.value}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-base font-black font-orbitron"
              style={{ color: item.color }}
            >
              {item.value}
            </motion.div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wide font-rajdhani">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Level progress */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-2.5">
        <div className="flex justify-between items-center mb-1.5">
          <span
            className="text-xs font-bold font-orbitron"
            style={{ color: levelColors[Math.min(level - 1, levelColors.length - 1)] }}
          >
            {levelNames[Math.min(level - 1, levelNames.length - 1)]}
          </span>
          <span className="text-[10px] text-slate-500 font-rajdhani">Lv.{level}</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${levelColors[Math.min(level - 1, levelColors.length - 1)]}, ${levelColors[Math.min(level, levelColors.length - 1)]})` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-[9px] text-slate-500 mt-1 font-rajdhani text-right">{score} / {nextThreshold} XP</div>
      </div>
    </div>
  );
};

export default ScoreBoard;
