import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  Beaker, 
  Zap, 
  BookOpen, 
  Save, 
  Share2, 
  Download,
  AlertCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Topic } from '../../types';
import { cn } from '../../lib/utils';

interface TopicDetailsProps {
  topic: Topic;
  onBack: () => void;
  onNavigate?: (page: string, topic?: Topic) => void;
}

export const TopicDetails: React.FC<TopicDetailsProps> = ({ topic, onBack, onNavigate }) => {
  // Demo content for each topic - In a real app this might come from a DB or files
  const getContent = (id: string) => {
    switch (id) {
      case 'hydrocarbons':
        return `
# Hydrocarbons: Alkanes, Alkenes, and Alkynes

Hydrocarbons are organic compounds composed entirely of hydrogen and carbon. They are the simplest organic compounds and form the basis of organic chemistry.

## 1. Alkanes (Saturated Hydrocarbons)
Alkanes have the general formula **CnH2n+2**. All carbon atoms are **sp3 hybridized**.
- **Important Reaction:** Chlorination in presence of sunlight.
  - \`CH4 + Cl2 → CH3Cl + HCl\`

## 2. Alkenes (Unsaturated Hydrocarbons)
Alkenes contain at least one C=C double bond. General formula: **CnH2n**.
- ** sp2 hybridization** for carbon atoms in the double bond.
- **Markownikoff's Rule:** In addition reactions of unsymmetrical alkenes, the negative part of the reagent adds to the carbon atom having fewer hydrogen atoms.

## 3. Alkynes
Contain at least one C≡C triple bond. General formula: **CnH2n-2**.
- ** sp hybridization**.
- **Acidity:** Terminal alkynes are weakly acidic due to sp hybridization of carbon.
        `;
      case 'chemical-equilibrium':
        return `
# Chemical Equilibrium

Chemical equilibrium is the state in which both reactants and products are present in concentrations which have no further tendency to change with time.

## 1. Law of Mass Action
At a constant temperature, the rate of a chemical reaction is directly proportional to the product of the active masses of the responding substances.

## 2. Le Chatelier's Principle
If a system at equilibrium is subjected to a change in concentration, pressure, or temperature, the system shifts in a direction that tends to counteract the effect of the change.

### Effects:
- **Concentration:** Adding reactant shifts equilibrium to the product side.
- **Pressure:** Increasing pressure shifts equilibrium towards the side with fewer moles of gas.
- **Temperature:** Increasing temperature favors endothermic reactions.
        `;
      case 'molecular-shape':
        return `
# Molecular Shape Visualizer: VSEPR Theory & Hybridization

Understanding molecular geometry is crucial for predicting chemical reactivity, polarity, and properties of compounds.

## VSEPR Theory (Valence Shell Electron Pair Repulsion Theory)

The VSEPR model states that electron pairs (both bonding and non-bonding) around a central atom will arrange themselves to minimize repulsion.

### Electron Arrangement Strategies:
1. **Electron pairs repel each other**
2. **Lone pairs take up more space than bonding pairs**
3. **Electron geometry ≠ Molecular geometry** (lone pairs are not counted in molecular shape)

## Hybridization

Hybridization explains how atomic orbitals mix to form new hybrid orbitals suitable for bonding.

### Common Hybridizations:
- **sp**: Linear geometry, 2 electron groups
- **sp²**: Trigonal planar, 3 electron groups
- **sp³**: Tetrahedral, 4 electron groups
- **sp³d**: Trigonal bipyramidal, 5 electron groups
- **sp³d²**: Octahedral, 6 electron groups

## Molecular Polarity

The overall polarity of a molecule depends on:
1. **Electronegativity differences** between atoms
2. **Molecular geometry** (dipoles must cancel for nonpolar molecules)

A molecule is **polar** if the dipole moments do not cancel; **nonpolar** if they do.

## Examples from the Visualizer

- **Water (H₂O)**: Bent shape due to 2 lone pairs on oxygen. Polar molecule.
- **Methane (CH₄)**: Perfect tetrahedron. Nonpolar despite C-H bonds.
- **Ammonia (NH₃)**: Trigonal pyramidal. Polar molecule with 1 lone pair.
- **Carbon Dioxide (CO₂)**: Linear shape. Nonpolar despite polar C=O bonds.
        `;
      default:
        return "Detailed content for this topic is coming soon! Our educators are preparing high-quality visual notes for you.";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8 pb-32">
       {/* Breadcrumbs & Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-4">
             <button 
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-bold text-white/40 hover:text-cyan-400 transition-colors w-fit group"
             >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Lessons
             </button>
             <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest border border-cyan-500/20">
                   NEB Grade 12
                </span>
                <span className="text-white/20">•</span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                   <Clock size={12} /> {topic.learningTime}
                </span>
             </div>
             <h1 className="text-4xl lg:text-6xl font-black tracking-tight">{topic.title}</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
                <Save size={20} />
             </button>
             <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
                <Share2 size={20} />
             </button>
             <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#050B18] font-bold hover:bg-cyan-400 transition-colors">
                <Download size={18} /> Download PDF
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
             <div className="p-8 lg:p-12 rounded-[2.5rem] bg-white/2 border border-white/5 backdrop-blur-xl mb-12">
                <div className="prose prose-invert prose-cyan max-w-none prose-headings:font-black prose-p:text-white/70 prose-li:text-white/70 prose-strong:text-cyan-400 prose-code:text-cyan-300">
                   <ReactMarkdown>{getContent(topic.id)}</ReactMarkdown>
                </div>
             </div>

             <div className="p-8 rounded-[2rem] bg-[#0A1020] border-l-4 border-cyan-500">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400">
                   <AlertCircle size={20} /> NEB Exam Insights
                </h4>
                <p className="text-white/60 text-sm leading-relaxed italic">
                   "Frequently asked as a 5-mark question in Group B. Focus on the chemical properties of Alkenes and the mechanism of addition reactions."
                </p>
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-8">
             {/* Interaction Card */}
             <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-2xl shadow-cyan-500/20 group">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Zap size={32} />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Interactive Visualizer</h3>
                <p className="text-white/80 text-sm mb-8 leading-relaxed">Don't just read about molecules. See their atoms, rotate their bonds, and understand the geometry in our real-time 3D lab.</p>
                <button 
                  onClick={() => {
                    if (topic.id === 'molecular-shape' && onNavigate) {
                      onNavigate('molecular-shape', topic);
                    }
                  }}
                  className="w-full py-4 bg-white text-blue-700 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-cyan-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={topic.id !== 'molecular-shape'}
                >
                   Launch Lab <ChevronRight size={20} />
                </button>
             </div>

             {/* Formulas Card */}
             <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <FileText size={20} className="text-cyan-400" /> Key Formulas
                </h3>
                <div className="space-y-4">
                   {topic.formulas.map((formula, i) => (
                      <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-cyan-300">
                         {formula}
                      </div>
                   ))}
                   {topic.formulas.length === 0 && (
                      <p className="text-white/30 text-sm italic">No specific numerical formulas for this section.</p>
                   )}
                </div>
             </div>

             {/* Related Topics */}
             <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/30">Next Up</h3>
                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                         <BookOpen size={18} />
                      </div>
                      <div>
                         <h4 className="font-bold text-sm">Alcohols and Ethers</h4>
                         <p className="text-[10px] text-white/30 uppercase">Organic Chemistry</p>
                      </div>
                   </div>
                   <ChevronRight size={18} className="text-white/20 group-hover:text-white" />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
