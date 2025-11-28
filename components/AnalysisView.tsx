import React, { useState, useEffect } from 'react';
import { WorkflowType, AnalysisConfig, AnalysisResult, StatMethod } from '../types';
import { analyzeSequence } from '../services/geminiService';
import { 
  Dna, FileText, Zap, Loader2, FolderOpen, Layers, 
  Files, Settings, Table, Download, CheckCircle2, 
  Terminal, Database, UploadCloud 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AnalysisView: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowType>(WorkflowType.BULK_RNA);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Configuration States
  const [projectPath, setProjectPath] = useState('/data/projects/sample_01');
  const [expressionFile, setExpressionFile] = useState<string | null>(null);
  const [pValue, setPValue] = useState(0.05);
  const [logFC, setLogFC] = useState(1.0);
  const [statMethod, setStatMethod] = useState<StatMethod>(StatMethod.DESEQ2);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setLogs([]);

    // Simulate pipeline steps based on workflow
    addLog(`Initializing ${activeWorkflow} pipeline...`);
    
    // Mock simulation of time-consuming bio-tools
    const steps = getSimulationSteps(activeWorkflow);
    
    for (const step of steps) {
        await new Promise(r => setTimeout(r, 800)); // Simulate processing time
        addLog(step);
    }

    addLog("Generating final report and output tables...");

    try {
      const config: AnalysisConfig = {
        workflow: activeWorkflow,
        projectPath,
        pValueThreshold: pValue,
        log2fcThreshold: logFC,
        statMethod
      };
      
      const data = await analyzeSequence(config);
      setResult(data);
      addLog("Pipeline completed successfully.");
    } catch (e) {
      addLog("Error: Pipeline failed.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSimulationSteps = (type: WorkflowType) => {
    switch(type) {
      case WorkflowType.BULK_RNA:
        return [
          "Scanning fastq.gz files in directory...",
          "Running FastQC on 12 samples...",
          "Trimming adapters with fastp...",
          "Aligning reads using STAR...",
          "Indexing BAM files with samtools...",
          "Quantifying gene expression..."
        ];
      case WorkflowType.SINGLE_CELL:
        return [
          "Validating 10x Genomics directory structure...",
          "Running Cellranger count...",
          "Correcting barcodes and UMIs...",
          "Generating feature-barcode matrix...",
          "Performing dimensionality reduction (PCA/tSNE)..."
        ];
      case WorkflowType.DIFF_EXPRESSION:
        return [
          "Loading expression matrix...",
          "Checking group assignments...",
          `Running ${statMethod} statistics...`,
          "Filtering results (p < " + pValue + ")...",
          "Performing GO Enrichment Analysis...",
          "Performing KEGG Pathway Analysis..."
        ];
      default: return [];
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
      <div className="flex flex-col lg:flex-row h-full max-w-[1600px] mx-auto w-full p-4 lg:p-6 gap-6">
        
        {/* LEFT SIDEBAR: Workflow Selection */}
        <div className="w-full lg:w-64 flex flex-col gap-4 flex-shrink-0">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Pipelines</h2>
            <div className="space-y-2">
              <button
                onClick={() => setActiveWorkflow(WorkflowType.BULK_RNA)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                  activeWorkflow === WorkflowType.BULK_RNA
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Files size={18} />
                Bulk RNA-Seq
              </button>
              <button
                onClick={() => setActiveWorkflow(WorkflowType.SINGLE_CELL)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                  activeWorkflow === WorkflowType.SINGLE_CELL
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Dna size={18} />
                Single Cell
              </button>
              <button
                onClick={() => setActiveWorkflow(WorkflowType.DIFF_EXPRESSION)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                  activeWorkflow === WorkflowType.DIFF_EXPRESSION
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Table size={18} />
                Diff. Expression
              </button>
            </div>
          </div>

          {/* Configuration Panel based on Selection */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <Settings size={18} className="text-slate-400" />
              <h3 className="font-semibold">Configuration</h3>
            </div>

            {/* Bulk RNA Config */}
            {activeWorkflow === WorkflowType.BULK_RNA && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Input Directory</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={projectPath}
                      onChange={(e) => setProjectPath(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded bg-slate-50 font-mono"
                    />
                    <button className="p-2 bg-slate-100 border border-slate-200 rounded hover:bg-slate-200">
                      <FolderOpen size={14} />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Contains subfolders with *.fastq.gz</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Pipeline Tools</label>
                  <div className="space-y-2">
                    {['FastQC (Quality Control)', 'Fastp (Trimming)', 'STAR (Alignment)', 'Samtools (Sorting)'].map((tool, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-slate-600">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Single Cell Config */}
            {activeWorkflow === WorkflowType.SINGLE_CELL && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Platform</label>
                  <select className="w-full text-sm p-2 border border-slate-200 rounded-lg bg-white">
                    <option>10x Genomics (Cellranger)</option>
                    <option>BGI (DNBelab C4)</option>
                    <option>Smart-seq2</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Reference Genome</label>
                  <select className="w-full text-sm p-2 border border-slate-200 rounded-lg bg-white">
                    <option>Human (GRCh38)</option>
                    <option>Mouse (mm10)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Diff Expression Config */}
            {activeWorkflow === WorkflowType.DIFF_EXPRESSION && (
              <div className="space-y-5 animate-fade-in">
                <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-2">Expression Matrix</label>
                   <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                      <UploadCloud size={24} className="mx-auto text-slate-400 mb-2" />
                      <span className="text-xs text-slate-500">Upload or Select Server File</span>
                   </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Statistical Method</label>
                  <select 
                    value={statMethod}
                    onChange={(e) => setStatMethod(e.target.value as StatMethod)}
                    className="w-full text-sm p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {Object.values(StatMethod).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">P-value Cutoff</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={pValue}
                      onChange={(e) => setPValue(parseFloat(e.target.value))}
                      className="w-full text-sm p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Log2FC Cutoff</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={logFC}
                      onChange={(e) => setLogFC(parseFloat(e.target.value))}
                      className="w-full text-sm p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-2">Grouping Info</label>
                   <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
                      <Database size={14} />
                      <span>group_metadata.csv</span>
                   </div>
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`mt-8 w-full py-3 px-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                loading
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
              {loading ? 'Running...' : 'Run Analysis'}
            </button>

          </div>
        </div>

        {/* MIDDLE: Logs & Status */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
           <div className="bg-slate-900 text-slate-200 p-4 rounded-xl shadow-lg border border-slate-800 h-full flex flex-col font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-2">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-emerald-400" />
                  <span className="font-semibold text-slate-100">Pipeline Console</span>
                </div>
                {loading && <Loader2 size={14} className="animate-spin text-indigo-400" />}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                {logs.length === 0 && (
                   <span className="text-slate-600 italic">Waiting for job submission...</span>
                )}
                {logs.map((log, i) => (
                  <div key={i} className="break-all border-l-2 border-slate-700 pl-2">
                    <span className="text-slate-500">{log.split(']')[0]}]</span>
                    <span className="text-slate-300">{log.split(']')[1]}</span>
                  </div>
                ))}
                {logs.length > 0 && !loading && (
                  <div className="text-emerald-400 font-bold mt-4 animate-pulse">
                    > Process Completed.
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* RIGHT: Results Area */}
        <div className="w-full lg:w-1/2 flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded text-blue-600">
                <Layers size={18} />
              </div>
              <h2 className="font-semibold text-slate-800">Results Output</h2>
            </div>
            {result && (
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1">
                <CheckCircle2 size={10} />
                Done
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
             {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <Files size={48} className="mb-4 text-slate-300" />
                <p className="text-sm font-medium">No results generated yet.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center">
                <Loader2 size={48} className="animate-spin text-indigo-300 mb-4" />
                <p className="text-sm text-slate-500">Processing biological data...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                {/* Downloadable Files Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.files?.map((file, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-300 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-100 rounded text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                           {file.type === 'Excel' || file.type === 'CSV' ? <Table size={18} /> : <FileText size={18} />}
                         </div>
                         <div>
                           <div className="text-sm font-medium text-slate-700">{file.name}</div>
                           <div className="text-[10px] text-slate-400">{file.type} • {file.size}</div>
                         </div>
                      </div>
                      <button className="text-slate-400 hover:text-indigo-600">
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* AI Summary Report */}
                <div className="prose prose-sm prose-indigo max-w-none bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                   <h3 className="text-indigo-900 font-bold border-b border-indigo-100 pb-2 mb-4">
                     Analysis Report
                   </h3>
                   <ReactMarkdown>{result.markdown}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};