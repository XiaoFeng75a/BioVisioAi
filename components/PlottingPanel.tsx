import React, { useState, useEffect } from 'react';
import { PlotType, DataPoint } from '../types';
import { SAMPLE_VOLCANO_DATA, SAMPLE_EXPRESSION_DATA, SAMPLE_GROWTH_DATA } from '../constants';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, Legend, Cell, ReferenceLine 
} from 'recharts';
import { BarChart2, TrendingUp, Grid, Settings2, Download } from 'lucide-react';

export const PlottingPanel: React.FC = () => {
  const [plotType, setPlotType] = useState<PlotType>(PlotType.SCATTER);
  const [data, setData] = useState<DataPoint[]>(SAMPLE_VOLCANO_DATA);
  const [customDataText, setCustomDataText] = useState('');

  // Update text area when plot type changes to show relevant sample data
  useEffect(() => {
    let sample = [];
    switch(plotType) {
      case PlotType.SCATTER: sample = SAMPLE_VOLCANO_DATA; break;
      case PlotType.BAR: sample = SAMPLE_EXPRESSION_DATA; break;
      case PlotType.LINE: sample = SAMPLE_GROWTH_DATA; break;
      default: sample = SAMPLE_VOLCANO_DATA;
    }
    setData(sample);
    setCustomDataText(JSON.stringify(sample, null, 2));
  }, [plotType]);

  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCustomDataText(text);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setData(parsed);
      }
    } catch (err) {
      // Allow user to type without constant errors, validate on blur or submit if needed
    }
  };

  const renderChart = () => {
    const commonProps = {
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (plotType) {
      case PlotType.SCATTER:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Log2 Fold Change" 
                stroke="#64748b" 
                label={{ value: 'Log2 Fold Change', position: 'bottom', offset: 0, fill: '#64748b' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="-Log10 P-value" 
                stroke="#64748b"
                label={{ value: '-Log10 P-value', angle: -90, position: 'left', fill: '#64748b' }} 
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <ReferenceLine x={0} stroke="#94a3b8" />
              <ReferenceLine y={1.3} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'p=0.05', fill: '#ef4444', fontSize: 12 }} />
              <Scatter name="Genes" data={data} fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.category === 'Significant' ? '#ef4444' : '#94a3b8'} opacity={0.7} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
      case PlotType.BAR:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                 {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.category === 'Control' ? '#94a3b8' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case PlotType.LINE:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Select a plot type</div>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Controls */}
      <div className="w-full lg:w-1/4 flex flex-col gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Settings2 size={20} />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Configuration</h2>
          </div>

          <label className="block text-sm font-medium text-slate-600 mb-2">Chart Type</label>
          <div className="grid grid-cols-1 gap-2 mb-6">
            <button 
              onClick={() => setPlotType(PlotType.SCATTER)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${plotType === PlotType.SCATTER ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            >
              <Grid size={18} />
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">Volcano / Scatter</span>
                <span className="text-[10px] opacity-70">Differential Expression</span>
              </div>
            </button>
            <button 
              onClick={() => setPlotType(PlotType.BAR)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${plotType === PlotType.BAR ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            >
              <BarChart2 size={18} />
              <div className="flex flex-col items-start">
                 <span className="font-medium text-sm">Bar Chart</span>
                 <span className="text-[10px] opacity-70">Quantification</span>
              </div>
            </button>
            <button 
              onClick={() => setPlotType(PlotType.LINE)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${plotType === PlotType.LINE ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            >
              <TrendingUp size={18} />
               <div className="flex flex-col items-start">
                <span className="font-medium text-sm">Line Chart</span>
                <span className="text-[10px] opacity-70">Time Series / Growth</span>
               </div>
            </button>
          </div>

          <label className="block text-sm font-medium text-slate-600 mb-2">Data Source (JSON)</label>
          <textarea 
            className="w-full h-40 p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            value={customDataText}
            onChange={handleDataChange}
          />
        </div>
      </div>

      {/* Main Plot Area */}
      <div className="w-full lg:w-3/4 flex flex-col h-[600px] lg:h-auto">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-semibold text-slate-800">Visualization Output</h3>
             <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
               <Download size={16} />
               Export PNG
             </button>
          </div>
          <div className="flex-1 w-full min-h-0">
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
};