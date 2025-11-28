import React, { useState } from 'react';
import { ViewMode } from './types';
import { AnalysisView } from './components/AnalysisView';
import { PlottingPanel } from './components/PlottingPanel';
import { Microscope, BarChart3, LayoutDashboard, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.HOME);

  const NavButton = ({ mode, icon: Icon, label, active }: { mode: ViewMode, icon: any, label: string, active: boolean }) => (
    <button
      onClick={() => setView(mode)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'bg-white text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView(ViewMode.HOME)}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
              <Microscope size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              BioVisio<span className="font-light">AI</span>
            </span>
          </div>

          <nav className="flex items-center gap-3">
            <NavButton 
              mode={ViewMode.HOME} 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={view === ViewMode.HOME} 
            />
            <NavButton 
              mode={ViewMode.ANALYSIS} 
              icon={Microscope} 
              label="Sequence Analysis" 
              active={view === ViewMode.ANALYSIS} 
            />
            <NavButton 
              mode={ViewMode.PLOTTING} 
              icon={BarChart3} 
              label="Visualization" 
              active={view === ViewMode.PLOTTING} 
            />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {view === ViewMode.HOME && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="max-w-4xl text-center space-y-8">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                Biological Insights, <br/>
                <span className="text-indigo-600">Visualized.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Accelerate your bioinformatics workflow with AI-powered sequence analysis and publication-ready visualization tools.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-3xl mx-auto">
                <button 
                  onClick={() => setView(ViewMode.ANALYSIS)}
                  className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-indigo-200 transition-all hover:scale-[1.02] text-left"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Microscope size={120} className="text-indigo-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                      <Microscope size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyze Sequences</h3>
                    <p className="text-slate-500 mb-6">Translation, motifs, structure prediction, and AI summaries.</p>
                    <div className="flex items-center text-indigo-600 font-semibold">
                      Start Analysis <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setView(ViewMode.PLOTTING)}
                  className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-emerald-200 transition-all hover:scale-[1.02] text-left"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BarChart3 size={120} className="text-emerald-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                      <BarChart3 size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Create Plots</h3>
                    <p className="text-slate-500 mb-6">Volcano plots, heatmaps, and growth curves in seconds.</p>
                    <div className="flex items-center text-emerald-600 font-semibold">
                      Start Plotting <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-200 w-full flex justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Decorative mock logos */}
                 <img src="https://picsum.photos/100/40?random=1" className="h-8 object-contain opacity-50" alt="Partner 1" />
                 <img src="https://picsum.photos/100/40?random=2" className="h-8 object-contain opacity-50" alt="Partner 2" />
                 <img src="https://picsum.photos/100/40?random=3" className="h-8 object-contain opacity-50" alt="Partner 3" />
                 <img src="https://picsum.photos/100/40?random=4" className="h-8 object-contain opacity-50" alt="Partner 4" />
              </div>
            </div>
          </div>
        )}

        {view === ViewMode.ANALYSIS && (
          <div className="flex-1 animate-fade-in">
             <AnalysisView />
          </div>
        )}

        {view === ViewMode.PLOTTING && (
          <div className="flex-1 animate-fade-in">
            <PlottingPanel />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;