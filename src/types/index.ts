
export interface QRCode {
  id: string;
  context: string;
  createdAt: Date;
  expiryTime: Date;
  maxScans: number;
  scansUsed: number;
}

export interface Feedback {
  id: string;
  qrId: string;
  rating: number;
  comment: string;
  sentiment: SentimentType;
  createdAt: Date;
}

export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface QRGeneratorParams {
  context: string;
  expiryHours: number;
  maxScans: number;
}

export interface SentimentAnalysisResult {
  sentiment: SentimentType;
  score: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}
