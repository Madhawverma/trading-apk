import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
  ClipPath,
  G,
} from 'react-native-svg';
import { THEME } from '../constants/theme';
import { useTrading } from '../context/TradingContext';
import { CurrencyIcon } from './CurrencyIcon';
import { TopMoversModal } from './TopMoversModal';
import { TradingSignalsModal, TradingSignalItem } from './TradingSignalsModal';
import { NewsModal, FullNewsItem } from './NewsModal';

const { width } = Dimensions.get('window');

interface InsightsScreenProps {
  onSelectInstrument?: (symbolName: string) => void;
}

interface NewsItem {
  id: string;
  headline: string;
  instrument: string;
  change: string;
  isUp: boolean;
  time: string;
  source: string;
  paragraphs: string[];
  takeaways: string[];
}

interface SignalItem {
  id: string;
  instrument: string;
  title: string;
  timeframe: string;
  direction: 'Intraday Bearish' | 'Intraday Bullish';
  time: string;
  pivot: number;
  tp1: number;
  tp2: number;
  sl: number;
  preference: string;
  alternative: string;
  commentary: string;
}

interface EventItem {
  id: string;
  title: string;
  country: string;
  countryName: string;
  flagType: string;
  impactBars: number;
  timing: string;
  timeUtc: string;
  day: 'today' | 'tomorrow' | 'this_week';
  actual: string;
  forecast: string;
  previous: string;
  description: string;
  relatedMarkets: string[];
}

interface MoverItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  digits: number;
  high24h: string;
  low24h: string;
  spread: string;
  trend: number[];
}

const NEWS_DATA: NewsItem[] = [
  {
    id: 'news-1',
    headline: "Iran's IRGC warns US of wider response, says seven vessels hit",
    instrument: 'USOIL',
    change: '↑ 1.26%',
    isUp: true,
    time: '6 minutes ago',
    source: 'Middle East Energy Bureau · Global News',
    paragraphs: [
      "Military leadership of Iran's Islamic Revolutionary Guard Corps issued a direct warning on Thursday indicating potential escalation across regional shipping corridors, alleging that commercial and security vessels have encountered targeted disruptions.",
      "Crude oil markets reacted promptly with USOIL climbing over 1.26% within early session trading, surpassing critical technical thresholds near $98.50 per barrel. Energy desks noted that supply risks through key maritime chokepoints are driving immediate risk premia back into the barrel.",
      "Maritime intelligence agencies confirm elevated monitoring status across regional straits, advising merchant carriers to implement heightened vessel self-protection protocols. Analysts at major energy research groups suggest sustained geopolitical tensions could keep Brent and WTI crude elevated toward $100 psychological resistance."
    ],
    takeaways: [
      "USOIL rallies over 1.25% on heightened geopolitical supply fears",
      "Key resistance watch at $99.50 – $100.00 psychological level",
      "Shipping route security risk premia returning to global commodity pricing"
    ]
  },
  {
    id: 'news-2',
    headline: 'Australian Dollar: RBA expectations support Aussie against US Dollar – Commerzbank',
    instrument: 'AUD/USD',
    change: '↓ 0.16%',
    isUp: false,
    time: '11 minutes ago',
    source: 'Commerzbank Research · FX Daily',
    paragraphs: [
      "The Reserve Bank of Australia continues to signal reluctance toward early monetary easing, citing resilient service sector inflation and persistent employment tightness across the domestic economy.",
      "In a research brief published this morning, Commerzbank foreign exchange strategists highlighted that while the US Dollar retains broad strength, the Aussie dollar maintains comparatively stronger relative carry advantage against European cross pairs.",
      "Technically, AUD/USD remains bounded within the 0.6550 - 0.6620 consolidation zone, with traders awaiting forthcoming quarterly CPI prints to determine whether the RBA could contemplate cash rate reductions earlier than mid-2025."
    ],
    takeaways: [
      "RBA hawkish bias limits Australian Dollar downside against major currencies",
      "AUD/USD key support established firmly around 0.6550 handle",
      "Quarterly inflation data slated as primary catalyst for upcoming directional breakout"
    ]
  },
  {
    id: 'news-3',
    headline: 'Canadian Dollar gathers strength on elevated oil prices',
    instrument: 'USD/CAD',
    change: '↓ 0.16%',
    isUp: false,
    time: '17 minutes ago',
    source: 'Commodity Currency Insights',
    paragraphs: [
      "The Canadian Dollar showed resilience against the greenback on Thursday, buoyed by the sharp resurgence in global crude benchmark prices, Canada's premier export commodity.",
      "USD/CAD drifted lower toward the 1.3820 handle as energy trade balances improved, offsetting softer domestic retail spending indicators published earlier in the week.",
      "Bank of Canada officials have indicated policy decisions will remain strictly meeting-by-meeting, allowing energy export strength to cushion consumer sector headwinds."
    ],
    takeaways: [
      "Oil price resurgence provides immediate tailwind for Canadian Dollar",
      "USD/CAD testing support at 1.3820 with downside pressure toward 1.3780",
      "Energy export gains counteracting domestic consumer retail softness"
    ]
  }
];

const SIGNALS_DATA: SignalItem[] = [
  {
    id: 'sig-eth-1',
    instrument: 'ETH',
    title: 'Ether / Dollar: RSI oversold',
    timeframe: '30 MIN',
    direction: 'Intraday Bearish',
    time: '14:23',
    pivot: 2467,
    tp1: 2394,
    tp2: 2375,
    sl: 2515,
    preference: 'Short positions below 2,467 with targets at 2,394 & 2,375 in extension.',
    alternative: 'Above 2,467 look for further upside with 2,520 & 2,560 as targets.',
    commentary: 'The RSI is breaking below its neutrality area at 50. The MACD is negative and below its signal line. The configuration is negative. Further downside expected.',
  },
  {
    id: 'sig-btc-1',
    instrument: 'BTC',
    title: 'Bitcoin / Dollar: RSI oversold',
    timeframe: '30 MIN',
    direction: 'Intraday Bearish',
    time: '14:22',
    pivot: 82820,
    tp1: 81155,
    tp2: 80777,
    sl: 83500,
    preference: 'Short positions below 82,820 with targets at 81,155 & 80,777 in extension.',
    alternative: 'Above 82,820 look for further upside with 83,900 & 84,600 as targets.',
    commentary: 'The downside prevails as long as 82,820 is resistance. Prices stay capped below falling moving averages.',
  },
  {
    id: 'sig-eurusd-1',
    instrument: 'EUR/USD',
    title: 'EUR/USD: Target 1.1280',
    timeframe: '30 MIN',
    direction: 'Intraday Bullish',
    time: '13:10',
    pivot: 1.1227,
    tp1: 1.128,
    tp2: 1.1292,
    sl: 1.119,
    preference: 'Long positions above 1.1227 with targets at 1.1280 & 1.1292 in extension.',
    alternative: 'Below 1.1227 look for further downside with 1.1180 as target.',
    commentary: 'Bullish divergence spotted on lower timeframe candles. 1.1227 support baseline remains robust.',
  },
  {
    id: 'sig-xauusd-1',
    instrument: 'XAU/USD',
    title: 'Gold: 4064 expected',
    timeframe: '30 MIN',
    direction: 'Intraday Bearish',
    time: '13:10',
    pivot: 4142,
    tp1: 4064,
    tp2: 4020,
    sl: 4175,
    preference: 'Short positions below 4,142 with targets at 4,064 & 4,020 in extension.',
    alternative: 'Above 4,142 look for recovery with 4,180 & 4,210 as alternative targets.',
    commentary: 'Gold contracts are cooling off from cycle highs, probing immediate key test levels at 4,064.',
  },
  {
    id: 'sig-1',
    instrument: 'DE30 (DAX 40)',
    title: 'DE30: key resistance at 25740',
    timeframe: '30 MIN',
    direction: 'Intraday Bearish',
    time: '11:55',
    pivot: 25740,
    tp1: 25420,
    tp2: 25220,
    sl: 25850,
    preference: 'Short positions below 25,740 with targets at 25,420 & 25,220 in extension.',
    alternative: 'Above 25,740 look for further upside with 25,940 & 26,100 as targets.',
    commentary: 'The RSI is breaking below its neutrality area at 50. The MACD is negative and below its signal line. The configuration is negative. Further downward momentum expected toward support targets.',
  },
];

const EVENTS_DATA: EventItem[] = [
  {
    id: 'event-fomc',
    title: 'Fed Interest Rate Decision',
    country: 'USD',
    countryName: 'United States',
    flagType: 'US',
    impactBars: 3,
    timing: 'Today 18:00 – In 45 mins',
    timeUtc: '18:00 UTC',
    day: 'today',
    actual: 'Pending',
    forecast: '5.50%',
    previous: '5.50%',
    description: 'The Federal Open Market Committee (FOMC) sets the benchmark Federal Funds Rate. A rate hike typically strengthens the USD and dampens equity valuation, while an unexpected cut or dovish guidance sparks massive rallies in Gold (XAU/USD) and Wall Street indices (USTEC, US30).',
    relatedMarkets: ['EUR/USD', 'USD/JPY', 'XAU/USD', 'USTEC']
  },
  {
    id: 'event-nfp',
    title: 'Non-Farm Payrolls (NFP)',
    country: 'USD',
    countryName: 'United States',
    flagType: 'US',
    impactBars: 3,
    timing: 'Tomorrow 12:30 UTC',
    timeUtc: '12:30 UTC',
    day: 'tomorrow',
    actual: 'Pending',
    forecast: '+175K',
    previous: '+142K',
    description: 'Non-Farm Payrolls measures the net change in employment across the US economy, excluding farm workers and government employees. It represents the single most volatile economic monthly indicator for global currency pairs and precious metals.',
    relatedMarkets: ['EUR/USD', 'GBP/USD', 'XAU/USD', 'US30']
  },
  {
    id: 'event-cpi',
    title: 'Core Consumer Price Index (YoY)',
    country: 'USD',
    countryName: 'United States',
    flagType: 'US',
    impactBars: 3,
    timing: 'Tomorrow 12:30 UTC',
    timeUtc: '12:30 UTC',
    day: 'tomorrow',
    actual: 'Pending',
    forecast: '3.2%',
    previous: '3.3%',
    description: 'Core CPI measures changes in the price of a representative basket of consumer goods and services, excluding volatile food and energy components. Essential for Fed inflation targeting.',
    relatedMarkets: ['USD/JPY', 'XAU/USD', 'EUR/USD']
  },
  {
    id: 'event-ecb-rate',
    title: 'ECB Main Refinancing Rate',
    country: 'EUR',
    countryName: 'Eurozone',
    flagType: 'EU',
    impactBars: 3,
    timing: 'Today 12:15 – In 15 mins',
    timeUtc: '12:15 UTC',
    day: 'today',
    actual: '3.65%',
    forecast: '3.65%',
    previous: '3.90%',
    description: 'The European Central Bank sets the base lending rate for credit institutions across the 20 Eurozone nations. Key driver for EUR/USD and European equity benchmarks including the German DAX (DE30).',
    relatedMarkets: ['EUR/USD', 'EUR/GBP', 'DE30']
  },
  {
    id: 'event-ecb-press',
    title: 'ECB Monetary Policy Press Conference',
    country: 'EUR',
    countryName: 'Eurozone',
    flagType: 'EU',
    impactBars: 3,
    timing: 'Today 12:45 – In 45 mins',
    timeUtc: '12:45 UTC',
    day: 'today',
    actual: 'Pending',
    forecast: 'Neutral',
    previous: 'Dovish',
    description: 'ECB President Christine Lagarde answers questions regarding quantitative easing, inflation projections, and the economic trajectory of the European continent.',
    relatedMarkets: ['EUR/USD', 'EUR/JPY', 'DE30']
  },
  {
    id: 'event-jobless',
    title: 'Initial Jobless Claims',
    country: 'USD',
    countryName: 'United States',
    flagType: 'US',
    impactBars: 2,
    timing: 'Today 12:30 UTC',
    timeUtc: '12:30 UTC',
    day: 'today',
    actual: '219K',
    forecast: '218K',
    previous: '222K',
    description: 'Measures the number of individuals filing for initial state unemployment insurance benefits for the first time during the past week.',
    relatedMarkets: ['USD/JPY', 'XAU/USD']
  },
  {
    id: 'event-crude',
    title: 'EIA Crude Oil Stocks Change',
    country: 'USD',
    countryName: 'United States',
    flagType: 'US',
    impactBars: 2,
    timing: 'Today 14:30 UTC',
    timeUtc: '14:30 UTC',
    day: 'today',
    actual: 'Pending',
    forecast: '-1.85M',
    previous: '+0.83M',
    description: 'The US Energy Information Administration reports weekly changes in commercial crude oil barrels stored in facilities. A higher-than-expected drawdown directly lifts USOIL and UKOIL spot prices.',
    relatedMarkets: ['USOIL', 'UKOIL', 'USD/CAD']
  },
  {
    id: 'event-boe',
    title: 'Bank of England Official Bank Rate',
    country: 'GBP',
    countryName: 'United Kingdom',
    flagType: 'GB',
    impactBars: 3,
    timing: 'Tomorrow 11:00 UTC',
    timeUtc: '11:00 UTC',
    day: 'tomorrow',
    actual: 'Pending',
    forecast: '5.00%',
    previous: '5.25%',
    description: 'The Monetary Policy Committee (MPC) of the Bank of England votes on setting the UK interest rate. Directly impacts Cable (GBP/USD) and British gilt yields.',
    relatedMarkets: ['GBP/USD', 'EUR/GBP', 'UK100']
  },
  {
    id: 'event-uk-gdp',
    title: 'UK Gross Domestic Product (MoM)',
    country: 'GBP',
    countryName: 'United Kingdom',
    flagType: 'GB',
    impactBars: 2,
    timing: 'Tomorrow 06:00 UTC',
    timeUtc: '06:00 UTC',
    day: 'tomorrow',
    actual: 'Pending',
    forecast: '+0.2%',
    previous: '0.0%',
    description: 'Measures the annualized change in the inflation-adjusted market value of all goods and services produced by the UK economy.',
    relatedMarkets: ['GBP/USD', 'GBP/JPY']
  },
  {
    id: 'event-boj',
    title: 'Bank of Japan Policy Rate Decision',
    country: 'JPY',
    countryName: 'Japan',
    flagType: 'JP',
    impactBars: 3,
    timing: 'Friday 03:00 UTC',
    timeUtc: '03:00 UTC',
    day: 'this_week',
    actual: 'Pending',
    forecast: '0.25%',
    previous: '0.10%',
    description: 'The Bank of Japan policy board announces short-term policy interest rate decisions. Pivotal for JPY carry trade unwinding and Nikkei (JP225) equity swings.',
    relatedMarkets: ['USD/JPY', 'EUR/JPY', 'JP225']
  },
  {
    id: 'event-boc',
    title: 'Bank of Canada Rate Decision',
    country: 'CAD',
    countryName: 'Canada',
    flagType: 'CA',
    impactBars: 3,
    timing: 'This Week 13:45 UTC',
    timeUtc: '13:45 UTC',
    day: 'this_week',
    actual: 'Pending',
    forecast: '4.25%',
    previous: '4.50%',
    description: 'The Bank of Canada sets its target for the overnight rate. High correlation with Canadian petroleum export revenues and USD/CAD parity.',
    relatedMarkets: ['USD/CAD', 'CAD/JPY']
  },
  {
    id: 'event-rba',
    title: 'Reserve Bank of Australia Rate Decision',
    country: 'AUD',
    countryName: 'Australia',
    flagType: 'AU',
    impactBars: 3,
    timing: 'This Week 04:30 UTC',
    timeUtc: '04:30 UTC',
    day: 'this_week',
    actual: 'Pending',
    forecast: '4.35%',
    previous: '4.35%',
    description: 'RBA Governor statements and Cash Rate decisions dictate Australian Dollar liquidity and risk appetite across Asian-Pacific sessions.',
    relatedMarkets: ['AUD/USD', 'AUD/NZD']
  },
  {
    id: 'event-zew',
    title: 'German ZEW Economic Sentiment',
    country: 'EUR',
    countryName: 'Germany',
    flagType: 'DE',
    impactBars: 2,
    timing: 'Today 09:00 UTC',
    timeUtc: '09:00 UTC',
    day: 'today',
    actual: '13.1',
    forecast: '13.5',
    previous: '19.2',
    description: 'Survey of up to 300 German institutional investors and analysts regarding the six-month economic outlook for Germany.',
    relatedMarkets: ['DE30', 'EUR/USD']
  },
  {
    id: 'event-snb',
    title: 'SNB Monetary Policy Minutes',
    country: 'CHF',
    countryName: 'Switzerland',
    flagType: 'CH',
    impactBars: 2,
    timing: 'Today 13:00 UTC',
    timeUtc: '13:00 UTC',
    day: 'today',
    actual: 'Pending',
    forecast: 'Neutral',
    previous: '1.25%',
    description: 'The Swiss National Bank meeting minutes provide detailed rationale behind interest rate decisions, inflation outlook, and Swiss Franc safe-haven currency interventions.',
    relatedMarkets: ['USD/CHF', 'EUR/CHF']
  },
  {
    id: 'event-try',
    title: 'Consumer Confidence Index',
    country: 'TRY',
    countryName: 'Turkey',
    flagType: 'TR',
    impactBars: 2,
    timing: 'Today 12:30 UTC',
    timeUtc: '12:30 UTC',
    day: 'today',
    actual: '78.5',
    forecast: '77.2',
    previous: '76.8',
    description: 'The Turkish Statistical Institute Consumer Confidence reflects sentiment regarding general economic conditions and purchasing propensity.',
    relatedMarkets: ['USD/TRY', 'EUR/TRY']
  },
  {
    id: 'event-pln',
    title: 'Retail Sales YoY',
    country: 'PLN',
    countryName: 'Poland',
    flagType: 'PL',
    impactBars: 1,
    timing: 'Today 13:00 UTC',
    timeUtc: '13:00 UTC',
    day: 'today',
    actual: 'Pending',
    forecast: '4.8%',
    previous: '4.4%',
    description: 'Retail Sales measures inflation-adjusted sales at retail establishments across Poland, reflecting domestic consumer health.',
    relatedMarkets: ['EUR/PLN', 'USD/PLN']
  }
];

const MOVERS_DATA: MoverItem[] = [
  {
    id: 'HK50',
    symbol: 'HK50',
    name: 'Hong Kong 50 Index',
    price: '22908.40',
    change: '↓ 2.67%',
    digits: 2,
    high24h: '23450.00',
    low24h: '22820.00',
    spread: '4.2',
    trend: [0.8, 0.45, 0.38, 0.35, 0.3, 0.28]
  },
  {
    id: 'XAGEUR',
    symbol: 'XAG/EUR',
    name: 'Silver vs Euro',
    price: '49.965',
    change: '↓ 2.31%',
    digits: 3,
    high24h: '51.200',
    low24h: '49.750',
    spread: '1.8',
    trend: [0.82, 0.55, 0.42, 0.38, 0.32, 0.25]
  },
  {
    id: 'JP225',
    symbol: 'JP225',
    name: 'Nikkei 225 Index',
    price: '63142.30',
    change: '↓ 2.07%',
    digits: 2,
    high24h: '64500.00',
    low24h: '62980.00',
    spread: '5.0',
    trend: [0.78, 0.6, 0.48, 0.4, 0.35, 0.3]
  },
  {
    id: 'XAGGBP',
    symbol: 'XAG/GBP',
    name: 'Silver vs British Pound',
    price: '41.982',
    change: '↓ 2.15%',
    digits: 3,
    high24h: '42.800',
    low24h: '41.720',
    spread: '2.1',
    trend: [0.75, 0.58, 0.45, 0.38, 0.3, 0.28]
  }
];

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ onSelectInstrument }) => {
  const { account, openPosition, symbols } = useTrading();

  // Active Interactive Modals
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<SignalItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedMover, setSelectedMover] = useState<MoverItem | null>(null);
  const [showTopMoversModal, setShowTopMoversModal] = useState(false);
  const [showTradingSignalsModal, setShowTradingSignalsModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);

  const handleOpenNewsDetail = (item: FullNewsItem) => {
    const newsItem: NewsItem = {
      id: item.id,
      headline: item.headline,
      instrument: item.instrument,
      change: item.change,
      isUp: item.isUp,
      time: item.time,
      source: item.source,
      paragraphs: item.paragraphs,
      takeaways: item.takeaways,
    };
    setSelectedNews(newsItem);
  };

  const handleOpenSignalDetail = (sig: TradingSignalItem) => {
    const signalItem: SignalItem = {
      id: sig.id,
      instrument: sig.instrument,
      title: sig.headline,
      timeframe: sig.timeframe || '30 MIN',
      direction: sig.isUp ? 'Intraday Bullish' : 'Intraday Bearish',
      time: sig.time,
      pivot: sig.pivot || 100,
      tp1: sig.tp1 || 90,
      tp2: sig.tp2 || 85,
      sl: sig.sl || 105,
      preference: sig.preference || sig.description,
      alternative: sig.alternative || 'Above pivot look for further upside.',
      commentary: sig.commentary || sig.description,
    };
    setSelectedSignal(signalItem);
  };

  // Quick trade feedback
  const [tradeExecutedText, setTradeExecutedText] = useState<string | null>(null);

  // Events Modal & Filter State
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [eventsFilter, setEventsFilter] = useState<'ALL' | 'HIGH' | 'TODAY' | 'TOMORROW' | 'THIS_WEEK'>('ALL');

  const filteredEvents = EVENTS_DATA.filter(evt => {
    if (eventsFilter === 'HIGH') return evt.impactBars === 3;
    if (eventsFilter === 'TODAY') return evt.day === 'today';
    if (eventsFilter === 'TOMORROW') return evt.day === 'tomorrow';
    if (eventsFilter === 'THIS_WEEK') return evt.day === 'this_week';
    return true;
  });

  // Universal Country Flag Roundel Renderer
  const renderCountryFlag = (flagType: string, size = 24) => {
    switch (flagType.toUpperCase()) {
      case 'US':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Defs>
              <ClipPath id={`clip-us-${size}`}>
                <Circle cx="12" cy="12" r="11" />
              </ClipPath>
            </Defs>
            <G clipPath={`url(#clip-us-${size})`}>
              <Rect x="0" y="0" width="24" height="24" fill="#B22234" />
              <Rect x="0" y="3.7" width="24" height="3.7" fill="#FFFFFF" />
              <Rect x="0" y="11.1" width="24" height="3.7" fill="#FFFFFF" />
              <Rect x="0" y="18.5" width="24" height="3.7" fill="#FFFFFF" />
              <Rect x="0" y="0" width="11" height="13" fill="#3C3B6E" />
              <Circle cx="3.5" cy="4" r="1" fill="#FFFFFF" />
              <Circle cx="7.5" cy="4" r="1" fill="#FFFFFF" />
              <Circle cx="5.5" cy="7" r="1" fill="#FFFFFF" />
              <Circle cx="3.5" cy="10" r="1" fill="#FFFFFF" />
              <Circle cx="7.5" cy="10" r="1" fill="#FFFFFF" />
            </G>
            <Circle cx="12" cy="12" r="11.5" stroke="#E5E7EB" strokeWidth="1" fill="none" />
          </Svg>
        );
      case 'EU':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="11" fill="#003399" />
            <Circle cx="12" cy="5" r="0.9" fill="#FFCC00" />
            <Circle cx="15.5" cy="6" r="0.9" fill="#FFCC00" />
            <Circle cx="18" cy="8.5" r="0.9" fill="#FFCC00" />
            <Circle cx="19" cy="12" r="0.9" fill="#FFCC00" />
            <Circle cx="18" cy="15.5" r="0.9" fill="#FFCC00" />
            <Circle cx="15.5" cy="18" r="0.9" fill="#FFCC00" />
            <Circle cx="12" cy="19" r="0.9" fill="#FFCC00" />
            <Circle cx="8.5" cy="18" r="0.9" fill="#FFCC00" />
            <Circle cx="6" cy="15.5" r="0.9" fill="#FFCC00" />
            <Circle cx="5" cy="12" r="0.9" fill="#FFCC00" />
            <Circle cx="6" cy="8.5" r="0.9" fill="#FFCC00" />
            <Circle cx="8.5" cy="6" r="0.9" fill="#FFCC00" />
          </Svg>
        );
      case 'GB':
      case 'UK':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Defs>
              <ClipPath id={`clip-uk-${size}`}>
                <Circle cx="12" cy="12" r="11" />
              </ClipPath>
            </Defs>
            <G clipPath={`url(#clip-uk-${size})`}>
              <Rect x="0" y="0" width="24" height="24" fill="#012169" />
              <Path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="4" />
              <Path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="2.2" />
              <Path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" strokeWidth="6" />
              <Path d="M12 0 V24 M0 12 H24" stroke="#C8102E" strokeWidth="3.6" />
            </G>
            <Circle cx="12" cy="12" r="11.5" stroke="#E5E7EB" strokeWidth="1" fill="none" />
          </Svg>
        );
      case 'JP':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="11" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
            <Circle cx="12" cy="12" r="5.5" fill="#BC002D" />
          </Svg>
        );
      case 'CA':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Defs>
              <ClipPath id={`clip-ca-${size}`}>
                <Circle cx="12" cy="12" r="11" />
              </ClipPath>
            </Defs>
            <G clipPath={`url(#clip-ca-${size})`}>
              <Rect x="0" y="0" width="24" height="24" fill="#D80027" />
              <Rect x="6" y="0" width="12" height="24" fill="#FFFFFF" />
              <Path d="M12 6.5 L13.5 10 L15.5 9.5 L14.5 12 L16.5 13 L14 14 L14 16 L12 14.5 L10 16 L10 14 L7.5 13 L9.5 12 L8.5 9.5 L10.5 10 Z" fill="#D80027" />
            </G>
            <Circle cx="12" cy="12" r="11.5" stroke="#E5E7EB" strokeWidth="1" fill="none" />
          </Svg>
        );
      case 'AU':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="11" fill="#00008B" />
            <Circle cx="16.5" cy="6.5" r="1.1" fill="#FFFFFF" />
            <Circle cx="19" cy="9.5" r="1.1" fill="#FFFFFF" />
            <Circle cx="15.5" cy="16" r="1.1" fill="#FFFFFF" />
            <Circle cx="18" cy="14" r="1.1" fill="#FFFFFF" />
            <Circle cx="17.2" cy="11.5" r="0.7" fill="#FFFFFF" />
            <Circle cx="7" cy="15.5" r="2" fill="#FFFFFF" />
          </Svg>
        );
      case 'DE':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Defs>
              <ClipPath id={`clip-de-${size}`}>
                <Circle cx="12" cy="12" r="11" />
              </ClipPath>
            </Defs>
            <G clipPath={`url(#clip-de-${size})`}>
              <Rect x="0" y="0" width="24" height="8" fill="#000000" />
              <Rect x="0" y="8" width="24" height="8" fill="#DD0000" />
              <Rect x="0" y="16" width="24" height="8" fill="#FFCE00" />
            </G>
            <Circle cx="12" cy="12" r="11.5" stroke="#E5E7EB" strokeWidth="1" fill="none" />
          </Svg>
        );
      case 'CH':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="11" fill="#D52B1E" />
            <Rect x="10" y="6.5" width="4" height="11" rx="0.5" fill="#FFFFFF" />
            <Rect x="6.5" y="10" width="11" height="4" rx="0.5" fill="#FFFFFF" />
          </Svg>
        );
      case 'TR':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="11" fill="#E30A17" />
            <Circle cx="11" cy="12" r="5" fill="#FFFFFF" />
            <Circle cx="12.2" cy="12" r="4.2" fill="#E30A17" />
            <Path d="M14.5 12 L15.2 13.5 L13.8 12.6 L15.2 12.6 L13.8 13.5 Z" fill="#FFFFFF" />
          </Svg>
        );
      case 'PL':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Defs>
              <ClipPath id={`clip-pl-${size}`}>
                <Circle cx="12" cy="12" r="11" />
              </ClipPath>
            </Defs>
            <G clipPath={`url(#clip-pl-${size})`}>
              <Rect x="0" y="0" width="24" height="12" fill="#FFFFFF" />
              <Rect x="0" y="12" width="24" height="12" fill="#DC143C" />
            </G>
            <Circle cx="12" cy="12" r="11.5" stroke="#E5E7EB" strokeWidth="1" fill="none" />
          </Svg>
        );
      default:
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="11" fill="#1665D8" />
            <SvgText x="12" y="15" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">
              {flagType.slice(0, 2)}
            </SvgText>
          </Svg>
        );
    }
  };

  // Hong Kong Flag roundel with "50"
  const renderHkFlag = () => (
    <Svg width={30} height={30} viewBox="0 0 32 32">
      <Circle cx="16" cy="16" r="15" fill="#E30A17" />
      <Circle cx="16" cy="16" r="6" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
      <Rect x="8" y="19" width="16" height="8" rx="2" fill="#111624" />
      <SvgText x="16" y="25.5" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle">
        50
      </SvgText>
    </Svg>
  );

  // Japan Flag roundel with "225"
  const renderJpFlag = () => (
    <Svg width={30} height={30} viewBox="0 0 32 32">
      <Circle cx="16" cy="16" r="15" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
      <Circle cx="16" cy="16" r="8" fill="#E30A17" />
      <Rect x="7" y="19" width="18" height="8" rx="2" fill="#111624" />
      <SvgText x="16" y="25.5" fill="#FFFFFF" fontSize="6" fontWeight="900" textAnchor="middle">
        225
      </SvgText>
    </Svg>
  );

  // Dual Icon: Silver Ingot + EU Flag
  const renderXagEurIcon = () => (
    <View style={styles.dualIconRow}>
      <View style={styles.silverBadge}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Rect x="2" y="10" width="12" height="9" rx="1.5" fill="#B0B7C3" stroke="#8C939F" strokeWidth="1" />
          <Rect x="9" y="4" width="12" height="9" rx="1.5" fill="#D8DEE9" stroke="#9AA1AD" strokeWidth="1" />
        </Svg>
      </View>
      <View style={styles.overlapFlag}>
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="11" fill="#1665D8" />
          <Circle cx="12" cy="7" r="1.2" fill="#FFDE00" />
          <Circle cx="12" cy="17" r="1.2" fill="#FFDE00" />
          <Circle cx="7" cy="12" r="1.2" fill="#FFDE00" />
          <Circle cx="17" cy="12" r="1.2" fill="#FFDE00" />
        </Svg>
      </View>
    </View>
  );

  // Dual Icon: Silver + UK Flag
  const renderXagGbpIcon = () => (
    <View style={styles.dualIconRow}>
      <View style={styles.silverBadge}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Rect x="2" y="10" width="12" height="9" rx="1.5" fill="#B0B7C3" stroke="#8C939F" strokeWidth="1" />
          <Rect x="9" y="4" width="12" height="9" rx="1.5" fill="#D8DEE9" stroke="#9AA1AD" strokeWidth="1" />
        </Svg>
      </View>
      <View style={styles.overlapFlag}>
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="11" fill="#012169" />
          <Path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="3" />
          <Path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="1.5" />
          <Path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" strokeWidth="5" />
          <Path d="M12 0 V24 M0 12 H24" stroke="#C8102E" strokeWidth="3" />
        </Svg>
      </View>
    </View>
  );

  // Mini sparkline
  const renderMiniSparkline = (points: number[]) => {
    const w = 80;
    const h = 24;
    const pathD = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * w;
        const y = h - val * h;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <Svg width={w} height={h}>
        <Line x1="0" y1={h * 0.3} x2={w} y2={h * 0.3} stroke="#9CA5B3" strokeWidth="1" strokeDasharray="2.5, 2.5" />
        <Path d={pathD} fill="none" stroke="#D9383A" strokeWidth="1.5" strokeLinecap="round" />
      </Svg>
    );
  };

  // Signal Chart Preview Graphic
  const renderSignalChart = (title = 'DE30') => {
    return (
      <Svg width={230} height={105} viewBox="0 0 230 105">
        <Rect x="0" y="0" width="230" height="105" fill="#FAFAFA" />
        <SvgText x="8" y="14" fill="#333333" fontSize="8" fontWeight="bold">
          {title.includes('DE30') ? 'Dax 30 MIN' : 'Cac 40 30 MIN'}
        </SvgText>
        <SvgText x="8" y="24" fill="#888888" fontSize="6.5">
          Thursday, October 22, 2026 8:25:08 AM CET
        </SvgText>
        <Line x1="8" y1="32" x2="16" y2="32" stroke="#D9383A" strokeWidth="2" />
        <SvgText x="19" y="34" fill="#777777" fontSize="5.5">MA 20 + BB</SvgText>
        <Line x1="48" y1="32" x2="56" y2="32" stroke="#1665D8" strokeWidth="2" />
        <SvgText x="59" y="34" fill="#777777" fontSize="5.5">MA 50</SvgText>

        <Line x1="6" y1="42" x2="190" y2="42" stroke="#66BB6A" strokeWidth="0.8" />
        <SvgText x="194" y="44" fill="#388E3C" fontSize="5.5">26100</SvgText>
        <Line x1="6" y1="50" x2="190" y2="50" stroke="#81C784" strokeWidth="0.8" />
        <SvgText x="194" y="52" fill="#388E3C" fontSize="5.5">25940</SvgText>

        <Rect x="192" y="56" width="34" height="9" fill="#1665D8" rx="1.5" />
        <SvgText x="209" y="63" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">
          {title.includes('DE30') ? '25740' : '7980'}
        </SvgText>
        <Line x1="6" y1="60" x2="190" y2="60" stroke="#1665D8" strokeWidth="1.2" />

        <Rect x="192" y="68" width="34" height="8" fill="#D9383A" rx="1.5" />
        <SvgText x="209" y="74.5" fill="#FFFFFF" fontSize="5.5" fontWeight="bold" textAnchor="middle">
          {title.includes('DE30') ? '25420' : '7890'}
        </SvgText>
        <Line x1="6" y1="72" x2="190" y2="72" stroke="#D9383A" strokeWidth="1" />

        <Path d="M 10 70 Q 50 62 90 74 T 170 65 L 170 85 Q 90 90 10 82 Z" fill="rgba(217, 56, 58, 0.08)" />
        <Path d="M 10 74 Q 30 68 50 72 T 80 82 T 110 80 T 130 65 T 150 62 T 165 72" fill="none" stroke="#333333" strokeWidth="1.5" />

        <Line x1="150" y1="62" x2="175" y2="82" stroke="#1665D8" strokeWidth="2.5" />
        <Path d="M 175 82 L 168 78 L 174 72 Z" fill="#1665D8" />
        <SvgText x="40" y="99" fill="#999999" fontSize="6">Oct 19</SvgText>
        <SvgText x="145" y="99" fill="#999999" fontSize="6">Oct 26</SvgText>
      </Svg>
    );
  };

  // Thumbnail News Icons
  const renderOilNewsThumb = () => (
    <View style={styles.newsThumbBox}>
      <Svg width={54} height={54} viewBox="0 0 54 54">
        <Rect width="54" height="54" fill="#F4EDE2" rx="6" />
        <Circle cx="18" cy="22" r="10" fill="#3D3B38" />
        <Circle cx="32" cy="18" r="8" fill="#5A5652" />
        <Path d="M0 38 Q 27 34 54 38 L 54 54 L 0 54 Z" fill="#2E2C2A" />
        <Path d="M 12 36 L 24 24 L 32 30 L 44 20" stroke="#E67E22" strokeWidth="1.5" fill="none" />
      </Svg>
    </View>
  );

  const renderCoinNewsThumb = () => (
    <View style={styles.newsThumbBox}>
      <Svg width={54} height={54} viewBox="0 0 54 54">
        <Rect width="54" height="54" fill="#F0F2F5" rx="6" />
        <Rect x="8" y="24" width="6" height="18" fill="#B0B7C3" />
        <Rect x="16" y="16" width="7" height="26" fill="#8C939F" />
        <Rect x="25" y="20" width="8" height="22" fill="#9AA1AD" />
        <Circle cx="34" cy="36" r="9" fill="#E8EDF2" stroke="#9AA1AD" strokeWidth="1.5" />
        <Circle cx="24" cy="40" r="8" fill="#FFFFFF" stroke="#8C939F" strokeWidth="1.5" />
      </Svg>
    </View>
  );

  const renderMapleNewsThumb = () => (
    <View style={styles.newsThumbBox}>
      <Svg width={54} height={54} viewBox="0 0 54 54">
        <Rect width="54" height="54" fill="#F7F1E8" rx="6" />
        <Circle cx="18" cy="22" r="9" fill="#E67E22" />
        <Path d="M 38 16 L 36 26 L 44 28 L 34 34 L 36 44 L 28 38 L 26 46 L 24 38 L 18 42 L 20 34 L 14 30 L 22 28 Z" fill="#333333" />
      </Svg>
    </View>
  );

  const handleExecuteSignalTrade = (signal: SignalItem) => {
    const symbolObj = symbols.find(s => s.id === 'USTEC') || symbols[0];
    openPosition(symbolObj, 'SELL', 0.10, signal.sl, signal.tp1);
    setTradeExecutedText(`SELL 0.10 Lots on ${signal.instrument} executed successfully!`);
    setTimeout(() => {
      setTradeExecutedText(null);
      setSelectedSignal(null);
    }, 1800);
  };

  const handleExecuteMoverTrade = (mover: MoverItem, type: 'BUY' | 'SELL') => {
    const symbolObj = symbols.find(s => s.id === 'USTEC') || symbols[0];
    openPosition(symbolObj, type, 0.10);
    setTradeExecutedText(`${type} 0.10 Lots on ${mover.symbol} executed successfully!`);
    setTimeout(() => {
      setTradeExecutedText(null);
      setSelectedMover(null);
    }, 1800);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Floating Pill: 0.00 USD : */}
      <View style={styles.topCenterPillRow}>
        <View style={styles.balancePill}>
          <Text style={styles.balancePillText}>
            {account.balance.toFixed(2)} USD
          </Text>
          <Ionicons name="ellipsis-vertical" size={13} color="#111624" />
        </View>
      </View>

      {/* Screen Title */}
      <Text style={styles.mainTitle}>Insights</Text>

      {/* 1. TOP MOVERS SECTION */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>TOP MOVERS</Text>
        <TouchableOpacity onPress={() => setShowTopMoversModal(true)}>
          <Text style={styles.showMoreLink}>Show more</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topMoversScroll}
      >
        {MOVERS_DATA.map((mover, idx) => (
          <TouchableOpacity
            key={mover.id}
            style={styles.moverCard}
            onPress={() => setSelectedMover(mover)}
            activeOpacity={0.8}
          >
            <View style={styles.moverHeader}>
              <CurrencyIcon symbol={mover.id || mover.symbol} size={26} />
              <Text style={styles.moverTitle}>{mover.symbol}</Text>
            </View>
            <View style={styles.moverSparkline}>
              {renderMiniSparkline(mover.trend)}
            </View>
            <Text style={styles.moverPrice}>{mover.price}</Text>
            <Text style={styles.moverChange}>{mover.change}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 2. TRADING SIGNALS SECTION */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>TRADING SIGNALS</Text>
        <TouchableOpacity onPress={() => setShowTradingSignalsModal(true)}>
          <Text style={styles.showMoreLink}>Show more</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.signalsScroll}
      >
        {SIGNALS_DATA.map(sig => (
          <TouchableOpacity
            key={sig.id}
            style={styles.signalCard}
            onPress={() => setSelectedSignal(sig)}
            activeOpacity={0.85}
          >
            <View style={styles.signalChartContainer}>
              {renderSignalChart(sig.title)}
            </View>
            <View style={styles.signalBody}>
              <Text style={styles.signalTitle}>{sig.title}</Text>
              <View style={styles.signalBottomRow}>
                <View style={styles.intradayBadge}>
                  <Text style={styles.intradayText}>↓ Intraday</Text>
                </View>
                <Text style={styles.signalTime}>{sig.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 3. UPCOMING EVENTS SECTION */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>UPCOMING EVENTS</Text>
        <TouchableOpacity onPress={() => setShowAllEventsModal(true)}>
          <Text style={styles.showMoreLink}>Show more</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.eventsCard}>
        {EVENTS_DATA.slice(0, 4).map((evt, idx) => (
          <React.Fragment key={evt.id}>
            <TouchableOpacity
              style={styles.eventRow}
              onPress={() => setSelectedEvent(evt)}
              activeOpacity={0.7}
            >
              {renderCountryFlag(evt.flagType, 24)}
              <View style={styles.eventInfoCol}>
                <Text style={styles.eventTitle}>{evt.title}</Text>
                <View style={styles.eventMetaRow}>
                  <Text style={styles.eventCountry}>{evt.country}</Text>
                  <View style={styles.impactBarsRow}>
                    <View style={[styles.bar, evt.impactBars >= 1 ? styles.barYellow : styles.barGrey]} />
                    <View style={[styles.bar, evt.impactBars >= 2 ? styles.barYellow : styles.barGrey]} />
                    <View style={[styles.bar, evt.impactBars >= 3 ? styles.barYellow : styles.barGrey]} />
                  </View>
                  <Text style={styles.eventTiming}>{evt.timing}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA5B3" />
            </TouchableOpacity>
            {idx < EVENTS_DATA.length - 1 && <View style={styles.itemDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* 4. TOP NEWS SECTION */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>TOP NEWS</Text>
        <TouchableOpacity onPress={() => setShowNewsModal(true)}>
          <Text style={styles.showMoreLink}>Show more</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.newsListCard}>
        {NEWS_DATA.map((news, idx) => (
          <React.Fragment key={news.id}>
            <TouchableOpacity
              style={styles.newsRow}
              onPress={() => setSelectedNews(news)}
              activeOpacity={0.7}
            >
              {idx === 0 && renderOilNewsThumb()}
              {idx === 1 && renderCoinNewsThumb()}
              {idx === 2 && renderMapleNewsThumb()}
              <View style={styles.newsTextCol}>
                <Text style={styles.newsHeadline}>{news.headline}</Text>
                <View style={styles.newsMetaRow}>
                  <Text style={styles.newsInstrument}>{news.instrument}</Text>
                  <Text style={news.isUp ? styles.newsGain : styles.newsLoss}>{news.change}</Text>
                  <Text style={styles.newsTime}>{news.time}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA5B3" />
            </TouchableOpacity>
            {idx < NEWS_DATA.length - 1 && <View style={styles.itemDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* ========================================================= */}
      {/* 1. NEWS DETAIL MODAL (FULL ARTICLE & TRADING IMPACT)       */}
      {/* ========================================================= */}
      <Modal
        visible={selectedNews !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedNews(null)}
      >
        {selectedNews && (
          <View style={styles.modalFullContainer}>
            {/* Modal Top Bar */}
            <View style={styles.modalTopBar}>
              <TouchableOpacity
                style={styles.modalBackIconBtn}
                onPress={() => setSelectedNews(null)}
              >
                <Ionicons name="arrow-back" size={24} color="#111624" />
              </TouchableOpacity>
              <Text style={styles.modalTopBarCategory}>Financial News</Text>
              <TouchableOpacity style={styles.modalBackIconBtn}>
                <Ionicons name="share-social-outline" size={20} color="#111624" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
              {/* Instrument & Time pill badge */}
              <View style={styles.newsDetailMetaBadgeRow}>
                <View style={styles.newsInstrumentPill}>
                  <Text style={styles.newsInstrumentPillText}>{selectedNews.instrument}</Text>
                  <Text
                    style={[
                      styles.newsInstrumentChangeText,
                      { color: selectedNews.isUp ? '#1665D8' : '#D9383A' },
                    ]}
                  >
                    {selectedNews.change}
                  </Text>
                </View>
                <Text style={styles.newsDetailTimeText}>{selectedNews.time}</Text>
              </View>

              {/* Big Headline */}
              <Text style={styles.newsDetailHeadline}>{selectedNews.headline}</Text>

              {/* Source attribution */}
              <View style={styles.newsSourceRow}>
                <Ionicons name="newspaper-outline" size={16} color="#6E7787" />
                <Text style={styles.newsSourceText}>{selectedNews.source}</Text>
              </View>

              {/* Article Paragraphs */}
              <View style={styles.paragraphsBox}>
                {selectedNews.paragraphs.map((p, idx) => (
                  <Text key={idx} style={styles.newsParagraphText}>
                    {p}
                  </Text>
                ))}
              </View>

              {/* Key Takeaways Card */}
              <View style={styles.takeawaysCard}>
                <View style={styles.takeawaysHeader}>
                  <Ionicons name="flash" size={16} color="#FFDE00" />
                  <Text style={styles.takeawaysTitle}>Market Takeaways</Text>
                </View>
                {selectedNews.takeaways.map((t, idx) => (
                  <View key={idx} style={styles.takeawayItemRow}>
                    <Text style={styles.takeawayBullet}>•</Text>
                    <Text style={styles.takeawayText}>{t}</Text>
                  </View>
                ))}
              </View>

              {/* Quick Trade CTA Button */}
              <TouchableOpacity
                style={styles.yellowModalCTA}
                onPress={() => {
                  setSelectedNews(null);
                  if (onSelectInstrument) onSelectInstrument(selectedNews.instrument);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.yellowModalCTAText}>
                  Trade {selectedNews.instrument} Now
                </Text>
              </TouchableOpacity>

              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* ========================================================= */}
      {/* 2. TRADING SIGNAL DETAIL MODAL (TRADING CENTRAL ANALYSIS)   */}
      {/* ========================================================= */}
      <Modal
        visible={selectedSignal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedSignal(null)}
      >
        {selectedSignal && (
          <View style={styles.modalFullContainer}>
            <View style={styles.modalTopBar}>
              <TouchableOpacity
                style={styles.modalBackIconBtn}
                onPress={() => setSelectedSignal(null)}
              >
                <Ionicons name="arrow-back" size={24} color="#111624" />
              </TouchableOpacity>
              <Text style={styles.modalTopBarCategory}>Technical Signal</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
              {/* Signal Header Info */}
              <View style={styles.signalDetailHeader}>
                <View>
                  <Text style={styles.signalDetailTitle}>{selectedSignal.instrument}</Text>
                  <Text style={styles.signalDetailSub}>{selectedSignal.title}</Text>
                </View>
                <View style={styles.intradayBadgeBig}>
                  <Text style={styles.intradayBadgeBigText}>{selectedSignal.direction}</Text>
                </View>
              </View>

              {/* Large Chart Canvas Graphic */}
              <View style={styles.signalLargeChartBox}>
                {renderSignalChart(selectedSignal.title)}
              </View>

              {tradeExecutedText && (
                <View style={styles.toastSuccess}>
                  <Ionicons name="checkmark-circle" size={18} color="#00A868" />
                  <Text style={styles.toastSuccessText}>{tradeExecutedText}</Text>
                </View>
              )}

              {/* Strategy Preference Card */}
              <View style={styles.signalStrategyCard}>
                <Text style={styles.strategyTitle}>Analyst Preference</Text>
                <Text style={styles.strategyBodyText}>{selectedSignal.preference}</Text>

                <View style={styles.strategyDivider} />

                <Text style={styles.strategyTitleAlt}>Alternative Scenario</Text>
                <Text style={styles.strategyBodyText}>{selectedSignal.alternative}</Text>
              </View>

              {/* Key Price Levels Table */}
              <View style={styles.levelsTable}>
                <View style={styles.levelRow}>
                  <Text style={styles.levelLabel}>Key Resistance / Pivot</Text>
                  <Text style={[styles.levelVal, { color: '#1665D8' }]}>{selectedSignal.pivot}</Text>
                </View>
                <View style={styles.levelRow}>
                  <Text style={styles.levelLabel}>Take Profit 1 (Target 1)</Text>
                  <Text style={[styles.levelVal, { color: '#00A868' }]}>{selectedSignal.tp1}</Text>
                </View>
                <View style={styles.levelRow}>
                  <Text style={styles.levelLabel}>Take Profit 2 (Target 2)</Text>
                  <Text style={[styles.levelVal, { color: '#00A868' }]}>{selectedSignal.tp2}</Text>
                </View>
                <View style={styles.levelRow}>
                  <Text style={styles.levelLabel}>Stop Loss</Text>
                  <Text style={[styles.levelVal, { color: '#D9383A' }]}>{selectedSignal.sl}</Text>
                </View>
              </View>

              {/* Technical Commentary */}
              <View style={styles.commentaryCard}>
                <Text style={styles.commentaryTitle}>Technical Commentary</Text>
                <Text style={styles.commentaryText}>{selectedSignal.commentary}</Text>
              </View>

              {/* Execute Trade Button */}
              <TouchableOpacity
                style={styles.yellowModalCTA}
                onPress={() => handleExecuteSignalTrade(selectedSignal)}
                activeOpacity={0.85}
              >
                <Text style={styles.yellowModalCTAText}>
                  Execute {selectedSignal.direction} Order
                </Text>
              </TouchableOpacity>

              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* ========================================================= */}
      {/* 3. UPCOMING EVENT DETAIL MODAL (ECONOMIC CALENDAR)          */}
      {/* ========================================================= */}
      <Modal
        visible={selectedEvent !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedEvent(null)}
      >
        {selectedEvent && (
          <View style={styles.modalFullContainer}>
            <View style={styles.modalTopBar}>
              <TouchableOpacity
                style={styles.modalBackIconBtn}
                onPress={() => setSelectedEvent(null)}
              >
                <Ionicons name="arrow-back" size={24} color="#111624" />
              </TouchableOpacity>
              <Text style={styles.modalTopBarCategory}>Economic Calendar</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
              {/* Event Header with Flag */}
              <View style={styles.eventDetailHeader}>
                <View style={styles.eventFlagLarge}>
                  {renderCountryFlag(selectedEvent.flagType, 36)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
                  <Text style={styles.eventDetailCountry}>
                    {selectedEvent.countryName} ({selectedEvent.country})
                  </Text>
                </View>
              </View>

              {/* Timing & Impact Pill */}
              <View style={styles.eventPillRow}>
                <View style={styles.timeTag}>
                  <Ionicons name="time-outline" size={14} color="#111624" />
                  <Text style={styles.timeTagText}>{selectedEvent.timing}</Text>
                </View>
                <View style={styles.impactTag}>
                  <Text style={styles.impactTagText}>
                    {selectedEvent.impactBars === 3 ? 'High Impact' : selectedEvent.impactBars === 2 ? 'Medium Impact' : 'Low Impact'}
                  </Text>
                </View>
              </View>

              {/* Economic Numbers Card (Actual, Forecast, Previous) */}
              <View style={styles.economicNumbersCard}>
                <View style={styles.numCol}>
                  <Text style={styles.numLabel}>Actual</Text>
                  <Text style={styles.numValActual}>{selectedEvent.actual}</Text>
                </View>
                <View style={styles.numDivider} />
                <View style={styles.numCol}>
                  <Text style={styles.numLabel}>Forecast</Text>
                  <Text style={styles.numVal}>{selectedEvent.forecast}</Text>
                </View>
                <View style={styles.numDivider} />
                <View style={styles.numCol}>
                  <Text style={styles.numLabel}>Previous</Text>
                  <Text style={styles.numVal}>{selectedEvent.previous}</Text>
                </View>
              </View>

              {/* Event Meaning & Why It Matters */}
              <View style={styles.eventDescriptionCard}>
                <Text style={styles.eventDescTitle}>About This Indicator</Text>
                <Text style={styles.eventDescBody}>{selectedEvent.description}</Text>
              </View>

              {/* Related Trading Markets */}
              <View style={styles.relatedMarketsCard}>
                <Text style={styles.relatedTitle}>Impacted Trading Instruments</Text>
                <View style={styles.relatedChipsRow}>
                  {selectedEvent.relatedMarkets.map((m, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.marketChip}
                      onPress={() => {
                        setSelectedEvent(null);
                        if (onSelectInstrument) onSelectInstrument(m);
                      }}
                    >
                      <Text style={styles.marketChipText}>{m}</Text>
                      <Ionicons name="arrow-forward" size={12} color="#111624" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* ========================================================= */}
      {/* 3B. ALL UPCOMING EVENTS FULL MODAL (ECONOMIC CALENDAR)     */}
      {/* ========================================================= */}
      <Modal
        visible={showAllEventsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAllEventsModal(false)}
      >
        <SafeAreaView style={styles.modalFullContainer}>
          {/* Top Bar with Close button and title */}
          <View style={styles.modalTopBar}>
            <TouchableOpacity
              style={styles.modalBackIconBtn}
              onPress={() => setShowAllEventsModal(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#111624" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.modalTopBarCategory}>Economic Calendar</Text>
              <Text style={styles.calendarSubtitle}>Upcoming Global Events ({filteredEvents.length})</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          {/* Filter Pills Bar */}
          <View style={styles.filterBarContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterPillScrollContent}
            >
              {[
                { key: 'ALL', label: 'All Events' },
                { key: 'HIGH', label: '🔥 High Impact' },
                { key: 'TODAY', label: 'Today' },
                { key: 'TOMORROW', label: 'Tomorrow' },
                { key: 'THIS_WEEK', label: 'This Week' },
              ].map(f => (
                <TouchableOpacity
                  key={f.key}
                  style={[
                    styles.filterPill,
                    eventsFilter === f.key && styles.filterPillActive,
                  ]}
                  onPress={() => setEventsFilter(f.key as any)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      eventsFilter === f.key && styles.filterPillTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Scrollable Event Cards List */}
          <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
            <View style={styles.allEventsListCard}>
              {filteredEvents.map((evt, idx) => (
                <React.Fragment key={evt.id}>
                  <TouchableOpacity
                    style={styles.allEventsItemRow}
                    onPress={() => setSelectedEvent(evt)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.allEventsFlagWrap}>
                      {renderCountryFlag(evt.flagType, 28)}
                    </View>
                    <View style={styles.eventInfoCol}>
                      <Text style={styles.eventTitle} numberOfLines={1}>
                        {evt.title}
                      </Text>
                      <View style={styles.eventMetaRow}>
                        <Text style={styles.eventCountry}>{evt.country}</Text>
                        <View style={styles.impactBarsRow}>
                          <View style={[styles.bar, evt.impactBars >= 1 ? styles.barYellow : styles.barGrey]} />
                          <View style={[styles.bar, evt.impactBars >= 2 ? styles.barYellow : styles.barGrey]} />
                          <View style={[styles.bar, evt.impactBars >= 3 ? styles.barYellow : styles.barGrey]} />
                        </View>
                        <Text style={styles.eventTiming}>{evt.timing}</Text>
                      </View>
                      <View style={styles.eventForecastBadge}>
                        <Text style={styles.forecastLabel}>
                          Forecast: <Text style={{ color: '#111624', fontWeight: '700' }}>{evt.forecast}</Text>  ·  Prior: <Text style={{ color: '#6E7787' }}>{evt.previous}</Text>
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA5B3" />
                  </TouchableOpacity>
                  {idx < filteredEvents.length - 1 && <View style={styles.itemDivider} />}
                </React.Fragment>
              ))}
            </View>
            <View style={{ height: 60 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ========================================================= */}
      {/* 4. TOP MOVER DETAIL MODAL (QUICK TRADING DRAWER)           */}
      {/* ========================================================= */}
      <Modal
        visible={selectedMover !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedMover(null)}
      >
        {selectedMover && (
          <View style={styles.modalFullContainer}>
            <View style={styles.modalTopBar}>
              <TouchableOpacity
                style={styles.modalBackIconBtn}
                onPress={() => setSelectedMover(null)}
              >
                <Ionicons name="arrow-back" size={24} color="#111624" />
              </TouchableOpacity>
              <Text style={styles.modalTopBarCategory}>Market Mover</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
              <View style={styles.moverDetailHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CurrencyIcon symbol={selectedMover.id || selectedMover.symbol} size={34} />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.moverDetailSymbol}>{selectedMover.symbol}</Text>
                    <Text style={styles.moverDetailFullName}>{selectedMover.name}</Text>
                  </View>
                </View>
                <View style={styles.moverDetailPriceBox}>
                  <Text style={styles.moverDetailPriceText}>{selectedMover.price}</Text>
                  <Text style={styles.moverDetailChangeText}>{selectedMover.change}</Text>
                </View>
              </View>

              {tradeExecutedText && (
                <View style={styles.toastSuccess}>
                  <Ionicons name="checkmark-circle" size={18} color="#00A868" />
                  <Text style={styles.toastSuccessText}>{tradeExecutedText}</Text>
                </View>
              )}

              {/* Sparkline Visual */}
              <View style={styles.moverDetailChartCard}>
                <Text style={styles.chartPeriodLabel}>24h Intraday Trend</Text>
                <View style={{ alignItems: 'center', marginVertical: 14 }}>
                  {renderMiniSparkline(selectedMover.trend)}
                </View>
                <View style={styles.moverStatsRow}>
                  <View style={styles.statCol}>
                    <Text style={styles.statColLabel}>24h High</Text>
                    <Text style={styles.statColVal}>{selectedMover.high24h}</Text>
                  </View>
                  <View style={styles.statCol}>
                    <Text style={styles.statColLabel}>24h Low</Text>
                    <Text style={styles.statColVal}>{selectedMover.low24h}</Text>
                  </View>
                  <View style={styles.statCol}>
                    <Text style={styles.statColLabel}>Spread</Text>
                    <Text style={[styles.statColVal, { color: '#FFB800' }]}>{selectedMover.spread} pts</Text>
                  </View>
                </View>
              </View>

              {/* Instant Buy / Sell Actions */}
              <View style={styles.moverActionButtonsRow}>
                <TouchableOpacity
                  style={styles.sellActionBtn}
                  onPress={() => handleExecuteMoverTrade(selectedMover, 'SELL')}
                >
                  <Text style={styles.actionBtnBoldText}>SELL</Text>
                  <Text style={styles.actionBtnPriceText}>{selectedMover.price}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buyActionBtn}
                  onPress={() => handleExecuteMoverTrade(selectedMover, 'BUY')}
                >
                  <Text style={styles.actionBtnBoldText}>BUY</Text>
                  <Text style={styles.actionBtnPriceText}>{selectedMover.price}</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* 5. TOP MOVERS FULL MODAL (1:1 with Screenshot) */}
      <TopMoversModal
        visible={showTopMoversModal}
        onClose={() => setShowTopMoversModal(false)}
        onSelectInstrument={onSelectInstrument}
      />

      {/* 6. TRADING SIGNALS FULL MODAL (1:1 with Screenshot) */}
      <TradingSignalsModal
        visible={showTradingSignalsModal}
        onClose={() => setShowTradingSignalsModal(false)}
        onSelectSignal={handleOpenSignalDetail}
      />

      {/* 7. NEWS FULL MODAL (1:1 with Screenshot) */}
      <NewsModal
        visible={showNewsModal}
        onClose={() => setShowNewsModal(false)}
        onSelectNews={handleOpenNewsDetail}
      />

      <View style={{ height: 110 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  topCenterPillRow: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 2,
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8EBEF',
  },
  balancePillText: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
  },
  mainTitle: {
    color: '#111624',
    fontSize: 24,
    fontWeight: '800',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    color: '#7E8B9B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  showMoreLink: {
    color: '#1665D8',
    fontSize: 13,
    fontWeight: '600',
  },
  topMoversScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  moverCard: {
    backgroundColor: '#FFFFFF',
    width: 110,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E8EBEF',
  },
  moverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  moverTitle: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '800',
  },
  moverSparkline: {
    marginVertical: 4,
    alignItems: 'center',
  },
  moverPrice: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  moverChange: {
    color: '#D9383A',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  dualIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  silverBadge: {
    zIndex: 1,
  },
  overlapFlag: {
    marginLeft: -6,
    zIndex: 2,
  },
  signalsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  signalCard: {
    backgroundColor: '#FFFFFF',
    width: 230,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    overflow: 'hidden',
  },
  signalChartContainer: {
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBEF',
  },
  signalBody: {
    padding: 10,
  },
  signalTitle: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  signalBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intradayBadge: {
    backgroundColor: '#E03D40',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  intradayText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  signalTime: {
    color: '#9CA5B3',
    fontSize: 11,
  },
  eventsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E8EBEF',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  eventInfoCol: {
    flex: 1,
  },
  eventTitle: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  eventCountry: {
    color: '#111624',
    fontSize: 11,
    fontWeight: '700',
  },
  impactBarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  bar: {
    width: 3.5,
    height: 10,
    borderRadius: 1,
  },
  barYellow: {
    backgroundColor: '#FFB800',
  },
  barGrey: {
    backgroundColor: '#D1D5DB',
  },
  eventTiming: {
    color: '#9CA5B3',
    fontSize: 11,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F0F2F5',
  },
  newsListCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E8EBEF',
  },
  newsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  newsThumbBox: {
    width: 54,
    height: 54,
    borderRadius: 6,
    overflow: 'hidden',
  },
  newsTextCol: {
    flex: 1,
  },
  newsHeadline: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 6,
  },
  newsMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newsInstrument: {
    color: '#9CA5B3',
    fontSize: 11,
    fontWeight: '600',
  },
  newsGain: {
    color: '#1665D8',
    fontSize: 11,
    fontWeight: '700',
  },
  newsLoss: {
    color: '#D9383A',
    fontSize: 11,
    fontWeight: '700',
  },
  newsTime: {
    color: '#9CA5B3',
    fontSize: 11,
  },

  /* MODALS STYLES */
  modalFullContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBEF',
  },
  modalBackIconBtn: {
    padding: 6,
  },
  modalTopBarCategory: {
    color: '#111624',
    fontSize: 15,
    fontWeight: '700',
  },
  modalScrollBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  newsDetailMetaBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newsInstrumentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newsInstrumentPillText: {
    color: '#111624',
    fontSize: 12,
    fontWeight: '700',
  },
  newsInstrumentChangeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  newsDetailTimeText: {
    color: '#9CA5B3',
    fontSize: 12,
  },
  newsDetailHeadline: {
    color: '#111624',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 12,
  },
  newsSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  newsSourceText: {
    color: '#6E7787',
    fontSize: 12,
    fontWeight: '500',
  },
  paragraphsBox: {
    gap: 14,
    marginBottom: 24,
  },
  newsParagraphText: {
    color: '#262E3B',
    fontSize: 15,
    lineHeight: 24,
  },
  takeawaysCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    marginBottom: 24,
  },
  takeawaysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  takeawaysTitle: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '700',
  },
  takeawayItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  takeawayBullet: {
    color: '#FFDE00',
    fontSize: 16,
    fontWeight: '900',
  },
  takeawayText: {
    color: '#4B5565',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  yellowModalCTA: {
    backgroundColor: '#FFDE00',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  yellowModalCTAText: {
    color: '#111624',
    fontSize: 15,
    fontWeight: '800',
  },

  /* Signal modal styles */
  signalDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  signalDetailTitle: {
    color: '#111624',
    fontSize: 20,
    fontWeight: '800',
  },
  signalDetailSub: {
    color: '#6E7787',
    fontSize: 12,
    marginTop: 2,
  },
  intradayBadgeBig: {
    backgroundColor: '#E03D40',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  intradayBadgeBigText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  signalLargeChartBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    overflow: 'hidden',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  toastSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F7F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  toastSuccessText: {
    color: '#00A868',
    fontSize: 13,
    fontWeight: '700',
  },
  signalStrategyCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    marginBottom: 16,
  },
  strategyTitle: {
    color: '#D9383A',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  strategyTitleAlt: {
    color: '#1665D8',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  strategyBodyText: {
    color: '#111624',
    fontSize: 13,
    lineHeight: 18,
  },
  strategyDivider: {
    height: 1,
    backgroundColor: '#E8EBEF',
    marginVertical: 10,
  },
  levelsTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  levelLabel: {
    color: '#6E7787',
    fontSize: 13,
  },
  levelVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  commentaryCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    marginBottom: 20,
  },
  commentaryTitle: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  commentaryText: {
    color: '#4B5565',
    fontSize: 12,
    lineHeight: 18,
  },

  /* Event Modal */
  eventDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  eventFlagLarge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetailTitle: {
    color: '#111624',
    fontSize: 18,
    fontWeight: '800',
  },
  eventDetailCountry: {
    color: '#6E7787',
    fontSize: 12,
    marginTop: 2,
  },
  eventPillRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  timeTagText: {
    color: '#111624',
    fontSize: 12,
    fontWeight: '600',
  },
  impactTag: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  impactTagText: {
    color: '#F57F17',
    fontSize: 12,
    fontWeight: '700',
  },
  economicNumbersCard: {
    flexDirection: 'row',
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    marginBottom: 18,
  },
  numCol: {
    flex: 1,
    alignItems: 'center',
  },
  numDivider: {
    width: 1,
    backgroundColor: '#E8EBEF',
  },
  numLabel: {
    color: '#7E8B9B',
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  numValActual: {
    color: '#00A868',
    fontSize: 16,
    fontWeight: '800',
  },
  numVal: {
    color: '#111624',
    fontSize: 16,
    fontWeight: '700',
  },
  eventDescriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    padding: 14,
    marginBottom: 18,
  },
  eventDescTitle: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  eventDescBody: {
    color: '#4B5565',
    fontSize: 13,
    lineHeight: 19,
  },
  relatedMarketsCard: {
    marginBottom: 20,
  },
  relatedTitle: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  relatedChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  marketChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  marketChipText: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Mover Modal */
  moverDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moverDetailSymbol: {
    color: '#111624',
    fontSize: 22,
    fontWeight: '800',
  },
  moverDetailFullName: {
    color: '#6E7787',
    fontSize: 12,
    marginTop: 2,
  },
  moverDetailPriceBox: {
    alignItems: 'flex-end',
  },
  moverDetailPriceText: {
    color: '#111624',
    fontSize: 20,
    fontWeight: '800',
  },
  moverDetailChangeText: {
    color: '#D9383A',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  moverDetailChartCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    padding: 14,
    marginBottom: 20,
  },
  chartPeriodLabel: {
    color: '#7E8B9B',
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  moverStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E8EBEF',
    paddingTop: 10,
  },
  statCol: {
    alignItems: 'center',
  },
  statColLabel: {
    color: '#7E8B9B',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  statColVal: {
    color: '#111624',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  moverActionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  sellActionBtn: {
    flex: 1,
    backgroundColor: '#D9383A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyActionBtn: {
    flex: 1,
    backgroundColor: '#00A868',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnBoldText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  actionBtnPriceText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  calendarSubtitle: {
    fontSize: 11,
    color: '#8A92A6',
    fontWeight: '500',
    marginTop: 2,
  },
  filterBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0F3',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  filterPillScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
  },
  filterPillActive: {
    backgroundColor: '#111624',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6E7787',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  allEventsListCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  allEventsItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  allEventsFlagWrap: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventForecastBadge: {
    marginTop: 4,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  forecastLabel: {
    fontSize: 11,
    color: '#4B5565',
  },
});
