import { BrokerAuditResult, AuditParameter, ComparisonData } from '../types';

/**
 * SIMULATED VERIFICATION SCRIPT
 * This replaces the Gemini API as per user request.
 * It simulates a script crawling and searching for data.
 */

// Mock data for the simulation to make it feel real
const MOCK_BROKERS: Record<string, any> = {
  'pocket-option': { name: 'Pocket Option', region: 'Vanuatu / Global', minDep: '$50', truthDep: '$50', matchDep: true },
  'iq-option': { name: 'IQ Option', region: 'Cyprus / EEA', minDep: '$10', truthDep: '$10', matchDep: true },
  'binance': { name: 'Binance', region: 'Global / Multi', minDep: '$0', truthDep: '$0', matchDep: true },
  'default': { name: 'Generic Platform', region: 'Unknown', minDep: '$100', truthDep: '$250', matchDep: false }
};

export const runAuditScript = async (
  url: string, 
  selectedParams: AuditParameter[]
): Promise<BrokerAuditResult> => {
  // Simulate network/search latency
  const delay = 800 + Math.random() * 1200;
  await new Promise(resolve => setTimeout(resolve, delay));

  const urlKey = url.toLowerCase();
  const profile = Object.keys(MOCK_BROKERS).find(k => urlKey.includes(k)) || 'default';
  const data = MOCK_BROKERS[profile];

  const comparisons: Record<string, ComparisonData> = {};
  
  selectedParams.forEach(p => {
    // Basic simulation logic
    let siteVal = "Detected";
    let offVal = "Verified";
    let match = Math.random() > 0.15; // 85% match rate simulation

    if (p.id === 'min_deposit') {
      siteVal = data.minDep;
      offVal = data.truthDep;
      match = data.matchDep;
    } else if (p.id === 'broker_name') {
      siteVal = data.name;
      offVal = data.name;
      match = true;
    }

    comparisons[p.id] = {
      parameterId: p.id,
      siteValue: siteVal,
      officialValue: offVal,
      isMatch: match
    };
  });

  return {
    url,
    brokerName: data.name,
    region: data.region,
    comparisons,
    status: 'completed',
    sources: [
      { title: "Financial Services Authority", uri: "https://example.gov/fsa" },
      { title: "Regulatory Registry v4", uri: "https://example.org/registry" }
    ]
  };
};
