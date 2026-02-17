export interface AuditParameter {
  id: string;
  label: string;
  description: string;
  category?: 'General' | 'Trading' | 'Payments' | 'Features';
}

export interface ComparisonData {
  parameterId: string;
  siteValue: string;
  officialValue: string;
  isMatch: boolean;
  verificationType?: 'ai' | 'manual';
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface BrokerAuditResult {
  url: string;
  brokerName: string;
  region: string;
  comparisons: Record<string, ComparisonData>;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'manual';
  sources?: GroundingSource[];
  error?: string;
}

export interface ProcessingStats {
  total: number;
  completed: number;
  errors: number;
}