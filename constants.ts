import { DataPoint } from './types';

export const SAMPLE_FASTA = `>Sample_Sequence_BRCA1
ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCTGTCTGGAGTTGATCAAGGAACCTGTCTCCACAAAGTGTGACCACATATTTTGCAAATTTTGCATGCTGAAACTTCTCAACCAGAAGAAAGGGCCTTCACAGTGTCCTTTATGTAAGAATGATATAACCAAAAGGAGCCTACAAGAAAGTACGAGATTTAGTCAACTTGTTGAAGAGCTATTGAAAATCATTTGTGCTTTTCAGCTTGACACAGGTTTGGAG`;

export const SAMPLE_VOLCANO_DATA: DataPoint[] = Array.from({ length: 100 }, (_, i) => {
  const log2FoldChange = (Math.random() * 10) - 5;
  const pValue = Math.random() * 0.1; // Skew towards significant
  const negLog10P = -Math.log10(pValue);
  
  return {
    name: `Gene_${i}`,
    x: parseFloat(log2FoldChange.toFixed(2)),
    y: parseFloat(negLog10P.toFixed(2)),
    category: Math.abs(log2FoldChange) > 2 && negLog10P > 1.3 ? 'Significant' : 'Not Significant'
  };
});

export const SAMPLE_EXPRESSION_DATA: DataPoint[] = [
  { name: 'Control 1', value: 120, category: 'Control' },
  { name: 'Control 2', value: 132, category: 'Control' },
  { name: 'Control 3', value: 101, category: 'Control' },
  { name: 'Treated 1', value: 450, category: 'Treated' },
  { name: 'Treated 2', value: 480, category: 'Treated' },
  { name: 'Treated 3', value: 430, category: 'Treated' },
];

export const SAMPLE_GROWTH_DATA: DataPoint[] = [
  { name: '0h', value: 0.1 },
  { name: '2h', value: 0.15 },
  { name: '4h', value: 0.3 },
  { name: '6h', value: 0.8 },
  { name: '8h', value: 1.5 },
  { name: '10h', value: 2.1 },
  { name: '12h', value: 2.3 },
];
