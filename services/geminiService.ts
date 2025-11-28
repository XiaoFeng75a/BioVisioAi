import { GoogleGenAI } from "@google/genai";
import { WorkflowType, AnalysisConfig, AnalysisResult } from "../types";

const getSystemInstruction = (config: AnalysisConfig): string => {
  const baseInstruction = "You are an expert senior bioinformatician. You have just completed a complex analysis pipeline.";
  
  switch (config.workflow) {
    case WorkflowType.BULK_RNA:
      return `${baseInstruction} The user ran an upstream Bulk RNA-Seq pipeline (FastQC -> Fastp -> STAR -> Samtools). Summarize the typical output files expected (Expression Matrix, BAM files) and provide a brief quality control report template assuming high-quality data (Q30 > 90%). Format as Markdown.`;
    case WorkflowType.SINGLE_CELL:
      return `${baseInstruction} The user ran a Single Cell RNA-Seq pipeline (Cellranger/BGI). Explain the generated outputs (Barcodes, Features, Matrix) and interpret a hypothetical clustering result showing 5 distinct cell populations. Format as Markdown.`;
    case WorkflowType.DIFF_EXPRESSION:
      return `${baseInstruction} The user ran Differential Expression Analysis using ${config.statMethod || 'Standard methods'}. Thresholds: P-value < ${config.pValueThreshold}, Log2FC > ${config.log2fcThreshold}. 
      Generate a scientific summary of the results assuming 150 significant genes were found (100 Up, 50 Down). 
      Briefly interpret the biological significance of top GO terms: 'Cell Cycle' and 'Immune Response'.`;
    default:
      return baseInstruction;
  }
};

export const analyzeSequence = async (config: AnalysisConfig): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in environment variables");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // In a real app, this would trigger the actual shell commands (fastqc, Rscript, etc.)
    // Here we simulate the AI interpreting the "results" of those commands.
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a bioinformatics analysis report for workflow: ${config.workflow}`,
      config: {
        systemInstruction: getSystemInstruction(config),
        temperature: 0.3, 
      }
    });

    let mockFiles: Array<{ name: string; type: string; size: string }> = [];

    if (config.workflow === WorkflowType.DIFF_EXPRESSION) {
      mockFiles = [
        { name: 'all_genes_matrix.csv', type: 'CSV', size: '12.4 MB' },
        { name: 'up_regulated_genes.csv', type: 'CSV', size: '1.2 MB' },
        { name: 'down_regulated_genes.csv', type: 'CSV', size: '0.8 MB' },
        { name: 'GO_enrichment.xlsx', type: 'Excel', size: '450 KB' },
        { name: 'KEGG_pathways.xlsx', type: 'Excel', size: '320 KB' },
        { name: 'Reactome_analysis.csv', type: 'CSV', size: '210 KB' },
      ];
    } else if (config.workflow === WorkflowType.BULK_RNA) {
      mockFiles = [
        { name: 'gene_count_matrix.txt', type: 'TXT', size: '8.5 MB' },
        { name: 'multiqc_report.html', type: 'HTML', size: '2.1 MB' },
        { name: 'alignment_stats.json', type: 'JSON', size: '15 KB' },
      ];
    } else {
      mockFiles = [
        { name: 'filtered_feature_bc_matrix.h5', type: 'HDF5', size: '45 MB' },
        { name: 'web_summary.html', type: 'HTML', size: '3.5 MB' },
        { name: 'cloupe.cloupe', type: 'Loupe', size: '12 MB' },
      ];
    }

    return {
      markdown: response.text || "Analysis complete.",
      files: mockFiles,
      timestamp: new Date().toLocaleTimeString(),
      status: 'SUCCESS'
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      markdown: `### Workflow Error\n\nFailed to execute pipeline. Details: ${(error as Error).message}`,
      timestamp: new Date().toLocaleTimeString(),
      status: 'ERROR'
    };
  }
};