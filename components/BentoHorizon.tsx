import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface BentoModule {
  id: string;
  num: string;
  title: string;
  role: string;
  era: string;
  accent: string;
  story: string;
  uxTruth: string;
  tags: string[];
}

const modules: BentoModule[] = [
  {
    id: 'bare-metal',
    num: '01',
    title: 'The Bare-Metal Foundation',
    role: 'IT System & Network Administrator · Trishna Biotech',
    era: '2020–2021',
    accent: '#00F3FF',
    story: "Before I ever designed a button, I learned what happens when the pipes break. Managing servers and keeping a biotech team online during global lockdowns taught me that reliability isn't an afterthought—it’s the ground floor of user trust. If the infrastructure stumbles, the most beautiful interface is just broken glass.",
    uxTruth: 'Great interaction design starts with understanding the physics of the network beneath it.',
    tags: ['Network Topology', 'Server Admin', 'System Uptime', 'CompTIA']
  },
  {
    id: 'human-pressure',
    num: '02',
    title: 'The Human Element under Pressure',
    role: 'Barista · Specialty Coffee',
    era: '9 Months',
    accent: '#F59E0B',
    story: 'A morning rush is the ultimate crash course in cognitive load. When twenty people need bespoke orders in under two minutes, you learn to read micro-expressions, eliminate unnecessary motion in your workspace, and design frictionless flow on the fly. It was user research without the spreadsheet.',
    uxTruth: "True empathy isn't a persona document; it's anticipating friction before someone has to ask.",
    tags: ['Real-time Empathy', 'Service Architecture', 'Workflow Speed']
  },
  {
    id: 'chaos-edge-cases',
    num: '03',
    title: 'Designing for Chaos & Edge Cases',
    role: 'Bartender · High-Volume Hospitality',
    era: '3 Months',
    accent: '#EC4899',
    story: "Behind a busy bar, edge cases aren't theoretical—they’re standing right in front of you. You learn to handle conflicting demands, de-escalate tension with grace, and maintain zero-error precision in an environment built on distraction. It gave me an obsession with calm, forgiving systems.",
    uxTruth: 'An interface proves its quality not in the happy path, but in how gracefully it handles chaos.',
    tags: ['Edge-case Management', 'Live Customization', 'Frictionless Service']
  },
  {
    id: 'invisible-pipeline',
    num: '04',
    title: 'The Invisible Pipeline',
    role: 'Logistics Specialist · LOGO Fulfilment GmbH, Germany',
    era: '2025–2026',
    accent: '#10B981',
    story: 'Coordinating luxury fulfillment across Europe showed me the hidden half of product design: the messy, complex operational engine that fulfills the promise made on screen. Orchestrating B2B data pipelines and automated workflows taught me systems-level thinking at scale.',
    uxTruth: 'The frontend experience is only as honest as the backend logic that delivers it.',
    tags: ['Data Analytics', 'CRM Workflows', 'Process Automation', 'Edge Logistics']
  },
  {
    id: 'code-and-craft',
    num: '05',
    title: 'Bridging Code & Craft',
    role: 'Web Developer & Brand Builder · Independent / Freelance',
    era: '2026',
    accent: '#A855F7',
    story: "I stopped drawing static pictures and started building with the actual grain of the web. Bridging visual identity with semantic, responsive front-end code taught me that design intent shouldn't get lost in translation—it should get sharpened by code.",
    uxTruth: 'Aesthetics without performance and accessible structure is just unfinished design.',
    tags: ['Responsive Design', 'HTML/CSS Architecture', 'Brand Systems', 'WebGL']
  },
  {
    id: 'complete-system',
    num: '06',
    title: 'The Complete System',
    role: 'User Experience Designer · Techsnap',
    era: '2026',
    accent: '#D4FF00',
    story: 'Redesigning an educational Super App was where every past thread collided: building accessible WCAG-compliant design systems, conducting honest usability tests, and turning complex learning journeys into intuitive, clean interactions that make difficult skills feel approachable.',
    uxTruth: 'Good UX engineering turns deep user research into scalable tokens that developers love building.',
    tags: ['Design Systems', 'WCAG AAA A11y', 'Figma Prototyping', 'Usability Testing']
  }
];

export const BentoHorizon: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section className="min-h-screen w-full bg-zinc-950 text-white py-20 px-6 md:px-16 flex flex-col justify-center relative overflow-hidden">
      {/* Background Volumetric Auras */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto w-full mb-10">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          04 // INTENTIONAL CAREER EVOLUTION · THE BENTO HORIZON
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-3">
          From Bare-Metal to Product Architecture
        </h2>
        <p className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
          A deliberate evolution of instincts: how bare-metal infrastructure, high-pressure human empathy, and operations automation converge into battle-tested Product UX Engineering.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m) => (
          <motion.div
            key={m.id}
            layoutId={`card-${m.id}`}
            onClick={() => setSelectedId(m.id)}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="p-6 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900/90 border border-white/10 backdrop-blur-xl cursor-pointer flex flex-col justify-between group transition-colors duration-200"
            style={{ borderLeft: `4px solid ${m.accent}` }}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-3 border-b border-white/10 pb-2">
                <span style={{ color: m.accent }} className="font-bold">{m.num} // {m.title.toUpperCase()}</span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-400">{m.era}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {m.title}
              </h3>
              <p className="text-xs font-mono text-zinc-400 mb-3">{m.role}</p>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">{m.story}</p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono mb-3">
                <span style={{ color: m.accent }} className="font-bold block mb-1">⚡ UX Engineering Truth</span>
                <p className="text-zinc-300 text-[11px] italic">{m.uxTruth}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {m.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BentoHorizon;
