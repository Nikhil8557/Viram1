/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useEffect, useRef, useState, useMemo, ReactNode } from "react";
import { 
  Github, 
  ArrowRight, 
  Search, 
  Dna, 
  ShieldAlert, 
  Layers, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  Microscope,
  Cpu
} from "lucide-react";

// --- Components ---

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6">
      <div className="container mx-auto px-6 flex items-center justify-between backdrop-blur-md bg-bg/60 rounded-full border border-ink/5 py-3 shadow-2xl shadow-bg/50">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(224,121,74,0.8)]" />
          <span className="font-display text-xl tracking-tight group-hover:text-accent transition-colors">Viram</span>
        </a>
        
        <div className="hidden md:flex items-center gap-10">
          {["Philosophy", "Capabilities", "Pipeline"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>

        <a 
          href="https://github.com/Nikhil8557/Viram-Contribute" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase border border-accent/30 text-accent px-5 py-2 rounded-full hover:bg-accent/10 transition-all active:scale-95"
        >
          <Github size={14} />
          <span>GitHub</span>
        </a>
      </div>
    </nav>
  );
};

const DNAAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const amplitude = width * 0.2;
      const frequency = 0.025;
      const steps = 60;
      const spacing = height / steps;

      for (let i = 0; i < steps; i++) {
        const y = i * spacing;
        const phase = i * frequency + t;
        const x1 = cx + Math.sin(phase) * amplitude;
        const x2 = cx + Math.sin(phase + Math.PI) * amplitude;
        const s = (Math.sin(phase) + 1) / 2;

        // Draw connections
        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = '#4A4540';
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Nodes
          [[x1, '#E0794A'], [x2, '#4EAAB0']].forEach(([nx, col]) => {
            ctx.beginPath();
            ctx.arc(nx as number, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = col as string;
            ctx.globalAlpha = 0.8;
            ctx.fill();
            
            // Subtle glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = col as string;
            ctx.fill();
            ctx.shadowBlur = 0;
          });
        }

        // Draw backbone
        if (i > 0) {
          const prevPhase = (i - 1) * frequency + t;
          const px1 = cx + Math.sin(prevPhase) * amplitude;
          const px2 = cx + Math.sin(prevPhase + Math.PI) * amplitude;

          ctx.beginPath();
          ctx.moveTo(px1, (i - 1) * spacing);
          ctx.lineTo(x1, y);
          ctx.strokeStyle = '#E0794A';
          ctx.globalAlpha = 0.4 + s * 0.4;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(px2, (i - 1) * spacing);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = '#4EAAB0';
          ctx.globalAlpha = 0.4 + (1 - s) * 0.4;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      t += 0.01;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full max-w-md aspect-square bg-surface/20 rounded-[4rem] flex items-center justify-center overflow-hidden border border-ink/5 group transition-all duration-700 hover:border-accent/20">
      <div className="absolute inset-0 bg-radial-gradient from-accent/5 to-transparent pointer-events-none" />
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-1000" 
      />
    </div>
  );
};

const Reveal = ({ children, delay = 0 }: { children: ReactNode; delay?: number; key?: any }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const StatItem = ({ num, label, delay }: { num: string; label: string; delay: number }) => (
  <Reveal delay={delay}>
    <div className="text-center px-4 md:px-8 first:pl-0 last:pr-0 border-r border-ink/5 last:border-0 h-24 flex flex-col justify-center">
      <div className="font-display text-4xl md:text-5xl mb-1 tracking-tight">{num}</div>
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">{label}</div>
    </div>
  </Reveal>
);

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) => (
  <Reveal delay={delay}>
    <div className="group relative bg-surface/50 border border-ink/10 p-10 rounded-3xl overflow-hidden hover:border-accent2 transition-all duration-500">
      <div className="absolute inset-0 bg-accent2/0 group-hover:bg-accent2/[0.03] transition-colors duration-500" />
      <div className="relative z-10">
        <div className="w-14 h-14 bg-accent2-dim rounded-2xl flex items-center justify-center text-accent2 mb-8 group-hover:scale-110 transition-transform duration-500">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl mb-4">{title}</h3>
        <p className="text-ink-muted text-sm leading-relaxed">{description}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent2 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
    </div>
  </Reveal>
);

const PipelineStep = ({ num, title, body, delay }: { num: string; title: string; body: string; delay: number }) => (
  <Reveal delay={delay}>
    <div className="relative flex flex-col items-center text-center px-4 group">
      <div className="w-12 h-12 rounded-full border border-ink/10 bg-surface flex items-center justify-center font-mono text-xs text-accent mb-6 relative z-10 group-hover:border-accent group-hover:bg-accent/10 transition-all duration-500 ring-0 group-hover:ring-8 ring-accent/5">
        {num}
      </div>
      <h4 className="font-display text-lg mb-2 text-ink group-hover:text-accent transition-colors">{title}</h4>
      <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">{body}</p>
    </div>
  </Reveal>
);

const BackgroundElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Warm Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] aspect-square bg-accent/5 rounded-full blur-[120px] opacity-40 animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40%] aspect-square bg-accent2/5 rounded-full blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, #F9F7F2 1px, transparent 0)`,
          backgroundSize: '48px 48px' 
        }} 
      />
    </div>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white">
      <BackgroundElements />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
            <div className="relative z-10">
              <Reveal delay={0.1}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 font-display leading-[0.95]">
                  Stop the <br />
                  <span className="italic text-accent">Outbreak</span> <br />
                  Before It <span className="text-accent2">Starts</span>
                </h1>
              </Reveal>
              
              <Reveal delay={0.2}>
                <p className="text-ink-muted text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light">
                  AI-driven trajectory mapping to identify viral mutations, accelerate vaccine development, and ensure global pandemic readiness.
                </p>
              </Reveal>
              
              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-6 items-center">
                  <a 
                    href="https://github.com/Nikhil8557/Viram-Contribute" 
                    target="_blank"
                    className="group bg-accent text-bg px-10 py-5 rounded-2xl font-semibold flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-xl shadow-accent/20"
                  >
                    <Github size={20} />
                    <span>Contribute Now</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  
                  <a href="#philosophy" className="group flex items-center gap-2 text-ink-muted hover:text-ink transition-colors text-sm font-medium">
                    <span>Our Philosophy</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform opacity-50" />
                  </a>
                </div>
              </Reveal>
            </div>
            
            <div className="hidden lg:flex justify-end">
              <Reveal delay={0.4}>
                <DNAAnimation />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-ink/5 bg-surface/30 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem num="Stage 1" label="Development" delay={0} />
            <StatItem num="1.2M+" label="Sequences Refined" delay={0.1} />
            <StatItem num="100%" label="Open Science" delay={0.2} />
            <StatItem num="2x" label="Expected Faster" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20">
            <div className="lg:sticky lg:top-40 h-fit">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-[1px] w-8 bg-accent2" />
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent2">Human Foundation</span>
                </div>
                <h2 className="text-4xl md:text-5xl mb-8 leading-[1.1]">
                  Bridging the <br />
                  <span className="italic text-accent">Pulse between</span> <br />
                  Chaos and Response
                </h2>
                <p className="text-ink-muted leading-relaxed mb-8 font-light">
                  Viruses evolve at the speed of biological intent. Traditional response systems are reactive, cataloging catastrophes after they occur. Viram is proactive intelligence.
                </p>
                <div className="p-8 bg-surface border border-ink/5 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 font-display text-[6rem] opacity-[0.03] text-accent pointer-events-none group-hover:opacity-[0.06] transition-opacity">विराम</div>
                  <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-4">Etymology</h4>
                  <p className="text-sm italic text-ink-muted border-l-2 border-accent/20 pl-4 leading-relaxed">
                    Sanskrit: <span className="text-ink font-bold not-italic">Viram</span> (विराम) — to pause, to rest, to cease. We exist to <span className="text-accent underline underline-offset-4 font-semibold">stop</span> the cycle of reactive pandemic response.
                  </p>
                </div>
              </Reveal>
            </div>
            
            <div className="flex flex-col gap-8">
              {[
                { 
                  icon: Microscope, 
                  title: "Genomic Intelligence", 
                  body: "Ingesting raw genomic transcripts to build high-fidelity representations of viral states across the global landscape." 
                },
                { 
                  icon: TrendingUp, 
                  title: "Trajectory Forecasting", 
                  body: "Using recurrent architectures to predict the most statistically probable evolutionary jumps before they manifest in a host." 
                },
                { 
                  icon: ShieldAlert, 
                  title: "Readiness Protocols", 
                  body: "Automated triggering of alert systems for healthcare infrastructures based on predicted variant pathogenicity." 
                },
                { 
                  icon: Layers, 
                  title: "Collaborative Schema", 
                  body: "A fully open architecture where researchers contribute to the model weights and data curation for the common good." 
                }
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group flex gap-8 p-10 bg-surface/40 hover:bg-surface/80 border border-ink/5 hover:border-ink/10 rounded-3xl transition-all duration-500">
                    <div className="font-mono text-xs text-ink-faint pt-1">0{i+1}</div>
                    <div>
                      <h3 className="text-2xl mb-3 flex items-center gap-3">
                        {item.title}
                        <item.icon size={18} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-ink-muted font-light leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-32 bg-surface/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
            <div className="max-w-xl">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-[1px] w-8 bg-accent" />
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">Core Engine</span>
                </div>
                <h2 className="text-4xl md:text-5xl leading-tight italic">
                  Engineered for <br />
                  <span className="not-italic text-accent2">Predictive Certainty</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="text-ink-muted max-w-sm text-sm leading-relaxed mb-2 font-light">
                Our architecture fuses biological realism with machine precision to map the vast space of possible mutations.
              </p>
            </Reveal>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard 
              icon={Activity} 
              title="Trajectory Analysis" 
              description="Maps the path of mutation, forecasting potential jumps up to 96 hours ahead of conventional surveillance systems." 
              delay={0}
            />
            <FeatureCard 
              icon={Microscope} 
              title="Weak Variant Scanners" 
              description="Scanning sequences for pathologically attenuated variants — the ideal templates for next-gen vaccine development." 
              delay={0.1}
            />
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section id="pipeline" className="py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-24">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-[1px] w-8 bg-accent2" />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent2">Inference Flow</span>
                <div className="h-[1px] w-8 bg-accent2" />
              </div>
              <h2 className="text-4xl md:text-5xl italic">How <span className="not-italic">Viram</span> Functions</h2>
            </div>
          </Reveal>
          
          <div className="relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-y-16 md:gap-4 relative z-10">
              <PipelineStep 
                num="01" 
                title="Ingestion" 
                body="Universal adapter for FASTA, GISAID, and NCBI sequence formats." 
                delay={0}
              />
              <PipelineStep 
                num="02" 
                title="Alignment" 
                body="Spatial phylogenetics to position specific variants in the global tree." 
                delay={0.1}
              />
              <PipelineStep 
                num="03" 
                title="Forecasting" 
                body="Latent-space traversal predicts the next 10 most likely mutations." 
                delay={0.2}
              />
              <PipelineStep 
                num="04" 
                title="Vetting" 
                body="Pathogenicity metrics vs. vaccine candidacy scoring for every hit." 
                delay={0.3}
              />
              <PipelineStep 
                num="05" 
                title="Dispatch" 
                body="Secure webhook events for integrated vaccine labs and health networks." 
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 mb-20 px-6">
        <div className="container mx-auto">
          <div className="relative bg-surface rounded-[3rem] p-12 md:p-24 overflow-hidden border border-ink/5">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent2/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Reveal>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] w-8 bg-accent" />
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">Contribute</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl mb-8 leading-[1.1]">
                    Collective <br />
                    Intelligence for <br />
                    <span className="italic text-accent">Human Survival</span>
                  </h2>
                  <p className="text-ink-muted text-lg font-light leading-relaxed max-w-md">
                    Open Science means every mind can help defend every host. Join the mission to stop the next outbreak.
                  </p>
                </Reveal>
              </div>
              
              <div className="flex flex-col gap-8">
                <Reveal delay={0.2}>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <a 
                      href="https://github.com/Nikhil8557/Viram-Contribute" 
                      target="_blank"
                      className="w-full sm:w-auto bg-ink text-bg px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent transition-all duration-300"
                    >
                      <Github size={20} />
                      View Project
                    </a>
                    <a 
                      href="#" 
                      className="w-full sm:w-auto border border-ink/10 text-ink px-10 py-5 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-surface transition-all duration-300"
                    >
                      Documentation
                    </a>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex items-center gap-6 pt-4">
                    <span className="text-xs text-ink-muted font-mono uppercase tracking-widest">Global Collaborative Research</span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-ink/5 bg-bg relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <a href="#" className="font-display text-2xl tracking-tight">Viram</a>
              <p className="text-[10px] font-mono tracking-widest text-ink-faint uppercase">
                © 2026 Genome Intelligence Initiative · Open Science Collective
              </p>
            </div>
            
            <div className="flex gap-8">
              {["GitHub", "Research", "Docs", "Contact"].map(item => (
                <a 
                  key={item} 
                  href={item === "GitHub" ? "https://github.com/Nikhil8557/Viram-Contribute" : "#"}
                  target={item === "GitHub" ? "_blank" : undefined}
                  className="text-xs font-medium text-ink-muted hover:text-accent transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-ink-faint uppercase">
              <span>Humanity First</span>
              <div className="w-1 h-1 bg-accent rounded-full" />
              <span>Sanskrit: <span className="text-ink font-mono px-1">विराम</span> Stop</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
