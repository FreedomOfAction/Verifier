import { AuditParameter } from './types';

export const APP_MANIFEST_DESCRIPTION = {
  role: "Automated Data Audit and Verification Agent",
  mission: "To analyze financial web content and verify claims against official regulatory registries and primary documentation using a localized scripting engine and search grounding logic.",
  capabilities: [
    "Autonomous URL queue processing",
    "Multi-parameter discrepancy detection",
    "Regulatory cross-referencing",
    "Evidence-based truth extraction"
  ],
  logic_framework: "The agent operates as a strict data extraction script. It identifies specific claims (e.g., minimum deposits, regulation status) on target URLs and attempts to find confirming or conflicting evidence from official sources. It prioritizes grounding over generative assumptions."
};

export const AVAILABLE_PARAMETERS: AuditParameter[] = [
  // --- GENERAL (INFO PANEL) ---
  { id: 'broker_type', label: 'Broker Type', description: 'What type of broker is this? (Example: crypto, forex, stocks, multi-asset)', category: 'General' },
  { id: 'broker_name', label: 'Broker Name', description: 'The name of the broker or trading platform.', category: 'General' },
  { id: 'website', label: 'Official Website', description: 'Official website address for this broker.', category: 'General' },
  { id: 'rating', label: 'Rating', description: 'How good is this broker? (Usually a score out of 5)', category: 'General' },
  { id: 'regulators', label: 'Regulators', description: 'Who, if anyone, regulates or licenses this broker?', category: 'General' },
  { id: 'countries', label: 'Supporting Countries', description: 'Where is this broker available? (Which countries do they serve?)', category: 'General' },
  { id: 'languages', label: 'Languages', description: 'Which languages does the platform support for its website/app?', category: 'General' },
  { id: 'customer_support', label: 'Customer Support', description: 'Support channels and availability.', category: 'General' },
  { id: 'broker_image', label: 'Broker Image', description: 'Upload the broker’s logo or official image.', category: 'General' },
  { id: 'referral_reward', label: 'Referral Reward', description: 'Do they pay you for bringing new clients? (Affiliate bonus)', category: 'General' },
  { id: 'affiliate_link', label: 'Affiliate Link', description: 'A special signup link for partners or affiliates.', category: 'General' },

  // --- TRADING ---
  { id: 'min_deposit', label: 'Minimum Deposit', description: 'What’s the smallest amount you need to open an account?', category: 'Trading' },
  { id: 'min_withdrawal', label: 'Minimum Withdrawal', description: 'Smallest withdrawal amount allowed.', category: 'Trading' },
  { id: 'min_trade_size', label: 'Minimum Trade Size', description: 'Smallest position size allowed.', category: 'Trading' },
  { id: 'payout_percent', label: 'Payout %', description: 'How much profit can you get per winning trade (if options/binary)?', category: 'Trading' },
  { id: 'assets', label: 'Assets', description: 'What can you trade? (Examples: currencies, crypto, stocks, etc.)', category: 'Trading' },
  { id: 'instrument', label: 'Instruments', description: 'What specific assets or product types are available? (Detailed assets)', category: 'Trading' },
  { id: 'spreads', label: 'Spreads', description: 'Trading costs (Forex spreads or crypto spreads).', category: 'Trading' },
  { id: 'margin_trading', label: 'Margin/Leverage', description: 'Can you borrow money (trade with leverage) on this platform?', category: 'Trading' },
  { id: 'expiry_times', label: 'Expiry Times', description: 'How long do trades last (options only)?', category: 'Trading' },
  { id: 'forex_assets', label: 'Forex Assets', description: 'Which currency pairs can you trade?', category: 'Trading' },
  { id: 'crypto_coins', label: 'Crypto Coins', description: 'Which cryptocurrencies can you use for deposits or trading?', category: 'Trading' },
  { id: 'commodities', label: 'Commodities', description: 'Which commodities can you trade (gold, oil, etc.)?', category: 'Trading' },
  { id: 'volatility_index', label: 'Volatility Index', description: 'Do they offer synthetic/volatility indices for trading?', category: 'Trading' },
  { id: 'market_maker', label: 'Market Maker', description: 'Is the broker a “market maker” (sets its own prices)?', category: 'Trading' },
  { id: 'perpetual_swaps', label: 'Perpetual Swaps', description: 'Does the broker offer perpetual crypto contracts?', category: 'Trading' },
  { id: 'reits_elws', label: 'REITs / ELWs', description: 'Can you invest in real estate investment trusts or equity-linked warrants?', category: 'Trading' },
  { id: 'stock_forex_mining', label: 'Exchange/Mining', description: 'Can you trade on actual exchanges or mine crypto?', category: 'Trading' },

  // --- FEATURES (TRADING FEATURES PANEL) ---
  { id: 'mobile_apps', label: 'Mobile App', description: 'Does the broker have an app for your phone/tablet?', category: 'Features' },
  { id: 'platforms', label: 'Platforms', description: 'Which trading software can you use? (MT4, MT5, web, mobile, etc.)', category: 'Features' },
  { id: 'metatrader', label: 'MetaTrader 4/5', description: 'Can you trade using MetaTrader 4/5?', category: 'Features' },
  { id: 'tradingview', label: 'TradingView', description: 'Does the platform integrate TradingView charts or tools?', category: 'Features' },
  { id: 'ctrader', label: 'cTrader', description: 'Can you trade using the cTrader platform?', category: 'Features' },
  { id: 'demo_account', label: 'Demo Account', description: 'Can you open a practice (demo) account with fake money?', category: 'Features' },
  { id: 'trydemo_link', label: 'Try Demo Link', description: 'Direct link to a demo signup page.', category: 'Features' },
  { id: 'bonus', label: 'Bonus', description: 'Does the broker offer any welcome bonuses or loyalty programs?', category: 'Features' },
  { id: 'algo_trader', label: 'Algo Trader', description: 'Can you use automated trading robots or scripts?', category: 'Features' },
  { id: 'social_trading', label: 'Social/Copy Trading', description: 'Can you copy other traders’ deals automatically?', category: 'Features' },
  { id: 'trade_signals', label: 'Trade Signals', description: 'Does the broker send you trading tips or signal services?', category: 'Features' },
  { id: 'ai_machine_learning', label: 'AI/ML Features', description: 'Does the platform use AI or machine learning features?', category: 'Features' },
  { id: 'negative_balance', label: 'Neg Balance Protection', description: 'Can your account go negative (owe money)?', category: 'Features' },
  { id: 'managed_accounts', label: 'Managed Accounts', description: 'Can someone else manage your trading account for you?', category: 'Features' },
  { id: 'special_account_types', label: 'STP/ECN/DMA Accounts', description: 'Does it offer STP/ECN, DMA, or MAM/PAMM managed accounts?', category: 'Features' },
  { id: 'option_types', label: 'Option Types', description: 'Boundary, Ladder, or Binary Options contracts.', category: 'Features' },
  { id: 'crypto_features', label: 'Staking/Lending', description: 'Do they offer crypto staking, lending, or AMM services?', category: 'Features' },
  { id: 'third_party_tools', label: 'Autochartist/Signal', description: 'Does it provide Autochartist, Trading Central, or ESignal?', category: 'Features' },
  { id: 'tournaments', label: 'Tournaments', description: 'Do they run trading competitions or demo contests?', category: 'Features' },
  { id: 'vps_hosting', label: 'VPS Hosting', description: 'Can you get a private server (VPS) for automated trading?', category: 'Features' },
  { id: 'p2p_trading', label: 'P2P Trading', description: 'Does the broker have a peer-to-peer crypto marketplace?', category: 'Features' },
  { id: 'tools', label: 'Extra Tools', description: 'Extra trading tools (charts, calendars, analysis, etc.)', category: 'Features' },
  { id: 'islamic_account', label: 'Islamic Account', description: 'Do they offer Sharia-compliant (swap-free) accounts?', category: 'Features' },

  // --- PAYMENTS (PAYMENT FEATURES PANEL) ---
  { id: 'payment_methods', label: 'Payment Methods', description: 'How can you pay in or withdraw (card, wallet, bank, crypto, etc.)?', category: 'Payments' },
  { id: 'counter_currency', label: 'Base Currencies', description: 'What currencies can your account balance use? (USD, EUR, etc.)', category: 'Payments' },
  { id: 'local_currency_support', label: 'Local Support', description: 'Support for local currencies in specific regions.', category: 'Payments' },
  { id: 'inactivity_fee', label: 'Inactivity Fee', description: 'Do you get charged for not using your account for a while?', category: 'Payments' },
  { id: 'discount_percent', label: 'Discount %', description: 'If there’s a promo, what % discount is offered?', category: 'Payments' },
  { id: 'discount_expiry', label: 'Discount Expiry', description: 'When does any special discount expire?', category: 'Payments' },
];

export const BINARY_OPTIONS_PRESET_IDS = [
  'broker_name',
  'broker_type',
  'website',
  'min_deposit',
  'min_withdrawal',
  'min_trade_size',
  'local_currency_support',
  'regulators',
  'countries',
  'languages',
  'mobile_apps',
  'payout_percent',
  'option_types',
  'payment_methods',
  'bonus',
  'assets',
  'customer_support'
];

export const CRYPTO_BROKERS_PRESET_IDS = AVAILABLE_PARAMETERS.map(p => p.id);

export const DEMO_URLS = [
  "https://www.binaryoptions.com/pocket-option/",
  "https://www.daytrading.com/iq-option",
  "https://tradersunion.com/brokers/crypto/view/binance/",
];