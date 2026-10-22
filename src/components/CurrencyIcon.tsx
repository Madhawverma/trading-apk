import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  Polygon,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

interface CurrencyIconProps {
  symbol: string;
  size?: number;
}

/* ==========================================================================
   INDIVIDUAL COUNTRY CIRCULAR FLAGS
   ========================================================================== */

export const renderUsFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.8" />
    {/* Red Stripes */}
    <Path d="M1 5.5H23M1 8.5H23M1 11.5H23M1 14.5H23M1 17.5H23" stroke="#D9383A" strokeWidth="1.6" />
    {/* Blue Canton */}
    <Rect x="0.8" y="0.8" width="11" height="11" rx="2" fill="#1665D8" />
    {/* Stars */}
    <Circle cx="4" cy="4" r="0.9" fill="#FFFFFF" />
    <Circle cx="8" cy="4" r="0.9" fill="#FFFFFF" />
    <Circle cx="6" cy="6.5" r="0.9" fill="#FFFFFF" />
    <Circle cx="4" cy="9" r="0.9" fill="#FFFFFF" />
    <Circle cx="8" cy="9" r="0.9" fill="#FFFFFF" />
  </Svg>
);

export const renderEuFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#003399" stroke="#E5E7EB" strokeWidth="0.8" />
    {/* 12 Yellow Stars ring */}
    <Circle cx="12" cy="4" r="1.1" fill="#FFCC00" />
    <Circle cx="16" cy="5" r="1.1" fill="#FFCC00" />
    <Circle cx="19" cy="8" r="1.1" fill="#FFCC00" />
    <Circle cx="20" cy="12" r="1.1" fill="#FFCC00" />
    <Circle cx="19" cy="16" r="1.1" fill="#FFCC00" />
    <Circle cx="16" cy="19" r="1.1" fill="#FFCC00" />
    <Circle cx="12" cy="20" r="1.1" fill="#FFCC00" />
    <Circle cx="8" cy="19" r="1.1" fill="#FFCC00" />
    <Circle cx="5" cy="16" r="1.1" fill="#FFCC00" />
    <Circle cx="4" cy="12" r="1.1" fill="#FFCC00" />
    <Circle cx="5" cy="8" r="1.1" fill="#FFCC00" />
    <Circle cx="8" cy="5" r="1.1" fill="#FFCC00" />
  </Svg>
);

export const renderUkFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="ukGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#012169" />
        <Stop offset="1" stopColor="#00184A" />
      </LinearGradient>
    </Defs>
    <Circle cx="12" cy="12" r="11.5" fill="url(#ukGrad)" stroke="#E5E7EB" strokeWidth="0.8" />
    {/* White diagonals */}
    <Path d="M1 1L23 23M23 1L1 23" stroke="#FFFFFF" strokeWidth="3.2" />
    {/* Red diagonals */}
    <Path d="M1 1L23 23M23 1L1 23" stroke="#C8102E" strokeWidth="1.6" />
    {/* White cross */}
    <Path d="M12 0.8V23.2M0.8 12H23.2" stroke="#FFFFFF" strokeWidth="5.2" />
    {/* Red cross */}
    <Path d="M12 0.8V23.2M0.8 12H23.2" stroke="#C8102E" strokeWidth="2.8" />
  </Svg>
);

export const renderJapanFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.8" />
    <Circle cx="12" cy="12" r="5" fill="#BC002D" />
  </Svg>
);

export const renderAustraliaFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#00008B" stroke="#E5E7EB" strokeWidth="0.8" />
    {/* Mini UK Flag in canton */}
    <Rect x="1" y="1" width="10" height="9" rx="1.5" fill="#012169" />
    <Path d="M1 1L11 10M11 1L1 10" stroke="#FFFFFF" strokeWidth="1.6" />
    <Path d="M1 1L11 10M11 1L1 10" stroke="#C8102E" strokeWidth="0.8" />
    <Path d="M6 1V10M1 5.5H11" stroke="#FFFFFF" strokeWidth="2.4" />
    <Path d="M6 1V10M1 5.5H11" stroke="#C8102E" strokeWidth="1.2" />
    {/* Southern Cross White Stars */}
    <Circle cx="18" cy="6" r="1" fill="#FFFFFF" />
    <Circle cx="16" cy="11" r="1" fill="#FFFFFF" />
    <Circle cx="20" cy="12" r="1" fill="#FFFFFF" />
    <Circle cx="18" cy="16" r="1.3" fill="#FFFFFF" />
    <Circle cx="6" cy="16" r="1.6" fill="#FFFFFF" />
  </Svg>
);

export const renderCanadaFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.8" />
    {/* Red bars */}
    <Path d="M1 12A11.5 11.5 0 0 1 5.5 2.5V21.5A11.5 11.5 0 0 1 1 12Z" fill="#FF0000" />
    <Path d="M23 12A11.5 11.5 0 0 1 18.5 21.5V2.5A11.5 11.5 0 0 1 23 12Z" fill="#FF0000" />
    {/* Maple leaf */}
    <Path
      d="M12 6L13 9L15 8L14 11L16 11.5L14 13L15 15L12.5 14L12 18L11.5 14L9 15L10 13L8 11.5L10 11L9 8L11 9Z"
      fill="#FF0000"
    />
  </Svg>
);

export const renderSwissFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#D52B1E" stroke="#E5E7EB" strokeWidth="0.8" />
    <Rect x="10" y="5" width="4" height="14" rx="0.8" fill="#FFFFFF" />
    <Rect x="5" y="10" width="14" height="4" rx="0.8" fill="#FFFFFF" />
  </Svg>
);

export const renderNewZealandFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#00247D" stroke="#E5E7EB" strokeWidth="0.8" />
    <Rect x="1" y="1" width="10" height="9" rx="1.5" fill="#012169" />
    <Path d="M1 1L11 10M11 1L1 10" stroke="#FFFFFF" strokeWidth="1.6" />
    <Path d="M1 1L11 10M11 1L1 10" stroke="#C8102E" strokeWidth="0.8" />
    <Path d="M6 1V10M1 5.5H11" stroke="#FFFFFF" strokeWidth="2.4" />
    <Path d="M6 1V10M1 5.5H11" stroke="#C8102E" strokeWidth="1.2" />
    <Circle cx="18" cy="6" r="1.2" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.6" />
    <Circle cx="16" cy="11" r="1.1" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.6" />
    <Circle cx="20" cy="12" r="1.1" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.6" />
    <Circle cx="18" cy="17" r="1.4" fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.6" />
  </Svg>
);

export const renderSouthAfricaFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#007749" stroke="#E5E7EB" strokeWidth="0.8" />
    <Path d="M1 2.5A11.5 11.5 0 0 1 23 2.5L12 12Z" fill="#E03C31" />
    <Path d="M1 21.5A11.5 11.5 0 0 0 23 21.5L12 12Z" fill="#001489" />
    <Polygon points="1,2 11,12 1,22" fill="#000000" />
    <Path d="M1 4L9 12L1 20" stroke="#FFB612" strokeWidth="1.5" fill="none" />
    <Path d="M11 12H23" stroke="#FFFFFF" strokeWidth="3" />
    <Path d="M11 12H23" stroke="#007749" strokeWidth="1.8" />
  </Svg>
);

export const renderTurkeyFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#E30A17" stroke="#E5E7EB" strokeWidth="0.8" />
    <Circle cx="10" cy="12" r="4.5" fill="#FFFFFF" />
    <Circle cx="11.2" cy="12" r="3.8" fill="#E30A17" />
    <Polygon points="15,10.5 15.6,12 17,12 15.9,12.8 16.3,14.2 15.2,13.3 14,14.2 14.5,12.8 13.4,12 14.7,12" fill="#FFFFFF" />
  </Svg>
);

export const renderGermanyFlagSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#FFCE00" stroke="#E5E7EB" strokeWidth="0.8" />
    <Path d="M1 12A11.5 11.5 0 0 1 23 12H1Z" fill="#DD0000" />
    <Path d="M2.5 7.5A11.5 11.5 0 0 1 21.5 7.5H2.5Z" fill="#000000" />
  </Svg>
);

/* Gold Bars circle icon (exact match to Exness XAU/USD gold element) */
export const renderGoldBarsSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#E2C275" stroke="#C9A24D" strokeWidth="0.8" />
    {/* Bottom Bar */}
    <Path d="M4 14.5L7 11.5H17L20 14.5L18 17.5H6L4 14.5Z" fill="#F4DE97" stroke="#9A7720" strokeWidth="0.8" />
    {/* Top Bar */}
    <Path d="M7 10L9.5 7.5H14.5L17 10L15.5 12.5H8.5L7 10Z" fill="#FFF2B8" stroke="#9A7720" strokeWidth="0.8" />
  </Svg>
);

/* Silver Bars circle icon */
export const renderSilverBarsSvg = (s: number) => (
  <Svg width={s} height={s} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11.5" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
    <Path d="M4 14.5L7 11.5H17L20 14.5L18 17.5H6L4 14.5Z" fill="#F1F5F9" stroke="#64748B" strokeWidth="0.8" />
    <Path d="M7 10L9.5 7.5H14.5L17 10L15.5 12.5H8.5L7 10Z" fill="#FFFFFF" stroke="#64748B" strokeWidth="0.8" />
  </Svg>
);

/* Helper to get flag SVG by 3-letter currency code */
const getFlagSvg = (currency: string, s: number) => {
  switch (currency.toUpperCase()) {
    case 'USD':
      return renderUsFlagSvg(s);
    case 'EUR':
      return renderEuFlagSvg(s);
    case 'GBP':
      return renderUkFlagSvg(s);
    case 'JPY':
      return renderJapanFlagSvg(s);
    case 'AUD':
      return renderAustraliaFlagSvg(s);
    case 'CAD':
      return renderCanadaFlagSvg(s);
    case 'CHF':
      return renderSwissFlagSvg(s);
    case 'NZD':
      return renderNewZealandFlagSvg(s);
    case 'ZAR':
      return renderSouthAfricaFlagSvg(s);
    case 'TRY':
      return renderTurkeyFlagSvg(s);
    case 'DEU':
      return renderGermanyFlagSvg(s);
    default:
      return renderUsFlagSvg(s);
  }
};

/* ==========================================================================
   MAIN CURRENCY / INSTRUMENT ICON COMPONENT
   ========================================================================== */

export const CurrencyIcon: React.FC<CurrencyIconProps> = ({ symbol, size = 26 }) => {
  const clean = symbol.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const cSize = Math.round(size * 0.84);
  const dualWidth = Math.round(cSize * 1.55);
  const overlapOffset = Math.round(cSize * 0.55);

  // 1. CRYPTO ICONS
  if (clean === 'BTC' || clean === 'BTCUSD') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#F7931A' }]}>
        <Text style={[styles.cryptoSymbolText, { fontSize: size * 0.58 }]}>₿</Text>
      </View>
    );
  }

  if (clean === 'ETH' || clean === 'ETHUSD') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#F0F2F5' }]}>
        <Svg width={size * 0.75} height={size * 0.75} viewBox="0 0 24 24" fill="none">
          <Path d="M12 2L4 12L12 16L20 12L12 2Z" fill="#343434" />
          <Path d="M12 16L4 12L12 22L20 12L12 16Z" fill="#8C8C8C" />
        </Svg>
      </View>
    );
  }

  if (clean === 'SOL' || clean === 'SOLUSD') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#111624' }]}>
        <Svg width={size * 0.75} height={size * 0.75} viewBox="0 0 24 24" fill="none">
          <Path d="M4 6H20L17 9H1L4 6Z" fill="#00FFA3" />
          <Path d="M1 12H17L20 15H4L1 12Z" fill="#DC1FFF" />
          <Path d="M4 18H20L17 21H1L4 18Z" fill="#00FFA3" />
        </Svg>
      </View>
    );
  }

  if (clean === 'XRP' || clean === 'XRPUSD') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#23292F' }]}>
        <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none">
          <Path d="M19 4L15 8L17 10L21 6L19 4Z" fill="#FFFFFF" />
          <Path d="M5 4L9 8L7 10L3 6L5 4Z" fill="#FFFFFF" />
          <Path d="M12 14L16 18L14 20L10 16L12 14Z" fill="#FFFFFF" />
          <Path d="M12 14L8 18L10 20L14 16L12 14Z" fill="#FFFFFF" />
        </Svg>
      </View>
    );
  }

  if (clean === 'DOGE' || clean === 'DOGEUSD') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#C2A633' }]}>
        <Text style={[styles.cryptoSymbolText, { fontSize: size * 0.6, color: '#FFFFFF' }]}>Ð</Text>
      </View>
    );
  }

  if (clean === 'BNB' || clean === 'BNBUSD') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#F0B90B' }]}>
        <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none">
          <Path d="M12 4L14.5 6.5L12 9L9.5 6.5L12 4Z" fill="#FFFFFF" />
          <Path d="M12 15L14.5 17.5L12 20L9.5 17.5L12 15Z" fill="#FFFFFF" />
          <Path d="M5.5 10.5L8 13L5.5 15.5L3 13L5.5 10.5Z" fill="#FFFFFF" />
          <Path d="M18.5 10.5L21 13L18.5 15.5L16 13L18.5 10.5Z" fill="#FFFFFF" />
          <Path d="M12 10.5L14.5 13L12 15.5L9.5 13L12 10.5Z" fill="#FFFFFF" />
        </Svg>
      </View>
    );
  }

  // 2. METALS (Exact match to screenshot XAU/USD gold circle + US Flag)
  if (clean === 'XAUUSD' || clean === 'XAU') {
    return (
      <View style={{ width: dualWidth, height: cSize, flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
        <View style={{ width: cSize, height: cSize, borderRadius: cSize / 2, overflow: 'hidden', zIndex: 1 }}>
          {renderGoldBarsSvg(cSize)}
        </View>
        <View
          style={{
            position: 'absolute',
            left: overlapOffset,
            top: 0,
            width: cSize,
            height: cSize,
            borderRadius: cSize / 2,
            borderWidth: 1.5,
            borderColor: '#FFFFFF',
            overflow: 'hidden',
            zIndex: 2,
          }}
        >
          {renderUsFlagSvg(cSize)}
        </View>
      </View>
    );
  }

  if (clean === 'XAGUSD' || clean === 'XAG') {
    return (
      <View style={{ width: dualWidth, height: cSize, flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
        <View style={{ width: cSize, height: cSize, borderRadius: cSize / 2, overflow: 'hidden', zIndex: 1 }}>
          {renderSilverBarsSvg(cSize)}
        </View>
        <View
          style={{
            position: 'absolute',
            left: overlapOffset,
            top: 0,
            width: cSize,
            height: cSize,
            borderRadius: cSize / 2,
            borderWidth: 1.5,
            borderColor: '#FFFFFF',
            overflow: 'hidden',
            zIndex: 2,
          }}
        >
          {renderUsFlagSvg(cSize)}
        </View>
      </View>
    );
  }

  // 3. ENERGIES
  if (clean === 'USOIL' || clean === 'WTI') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#111624' }]}>
        <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 3C12 3 6 11 6 15.5C6 18.8 8.7 21.5 12 21.5C15.3 21.5 18 18.8 18 15.5C18 11 12 3 12 3Z"
            fill="#FFFFFF"
          />
        </Svg>
      </View>
    );
  }

  if (clean === 'UKOIL' || clean === 'BRENT') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#0A2540' }]}>
        <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 3C12 3 6 11 6 15.5C6 18.8 8.7 21.5 12 21.5C15.3 21.5 18 18.8 18 15.5C18 11 12 3 12 3Z"
            fill="#38BDF8"
          />
        </Svg>
      </View>
    );
  }

  if (clean === 'XNGUSD' || clean === 'NATGAS') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#1665D8' }]}>
        <Ionicons name="flame" size={size * 0.65} color="#FFFFFF" />
      </View>
    );
  }

  // 4. INDICES (Exact match to screenshot USTEC with NDX center pill)
  if (clean === 'USTEC' || clean === 'NAS100') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} viewBox="0 0 32 32">
          <Circle cx="16" cy="16" r="15" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.8" />
          <Path d="M1 7H31M1 11H31M1 15H31M1 19H31M1 23H31" stroke="#D9383A" strokeWidth="2.2" />
          <Rect x="1" y="1" width="14" height="14" rx="2" fill="#1665D8" />
          <Circle cx="4.5" cy="4.5" r="1" fill="#FFFFFF" />
          <Circle cx="10.5" cy="4.5" r="1" fill="#FFFFFF" />
          <Circle cx="7.5" cy="7.5" r="1" fill="#FFFFFF" />
          <Circle cx="4.5" cy="10.5" r="1" fill="#FFFFFF" />
          <Circle cx="10.5" cy="10.5" r="1" fill="#FFFFFF" />
          {/* NDX Center Pill */}
          <Rect x="5" y="11" width="22" height="10" rx="3" fill="#111624" />
          <SvgText x="16" y="18.5" fill="#FFFFFF" fontSize="6.8" fontWeight="900" textAnchor="middle">
            NDX
          </SvgText>
        </Svg>
      </View>
    );
  }

  if (clean === 'US30' || clean === 'DJI') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} viewBox="0 0 32 32">
          <Circle cx="16" cy="16" r="15" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.8" />
          <Path d="M1 7H31M1 11H31M1 15H31M1 19H31M1 23H31" stroke="#D9383A" strokeWidth="2.2" />
          <Rect x="1" y="1" width="14" height="14" rx="2" fill="#1665D8" />
          <Circle cx="4.5" cy="4.5" r="1" fill="#FFFFFF" />
          <Circle cx="10.5" cy="4.5" r="1" fill="#FFFFFF" />
          <Circle cx="7.5" cy="7.5" r="1" fill="#FFFFFF" />
          <Circle cx="4.5" cy="10.5" r="1" fill="#FFFFFF" />
          <Circle cx="10.5" cy="10.5" r="1" fill="#FFFFFF" />
          <Rect x="5" y="11" width="22" height="10" rx="3" fill="#111624" />
          <SvgText x="16" y="18.5" fill="#FFFFFF" fontSize="6.8" fontWeight="900" textAnchor="middle">
            DJI
          </SvgText>
        </Svg>
      </View>
    );
  }

  // 5. STOCKS
  if (clean === 'AAPL') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#F0F2F5' }]}>
        <Ionicons name="logo-apple" size={size * 0.7} color="#111624" />
      </View>
    );
  }

  if (clean === 'TSLA') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#E82127' }]}>
        <Text style={[styles.cryptoSymbolText, { fontSize: size * 0.6, color: '#FFFFFF' }]}>T</Text>
      </View>
    );
  }

  if (clean === 'NVDA') {
    return (
      <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#76B900' }]}>
        <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="8" stroke="#FFFFFF" strokeWidth="2.5" />
          <Path d="M12 4 C16 4 19 8 19 12" stroke="#FFFFFF" strokeWidth="2" />
        </Svg>
      </View>
    );
  }

  // 6. FOREX PAIRS (6-letter dual flag)
  if (clean.length === 6) {
    const base = clean.slice(0, 3);
    const quote = clean.slice(3, 6);
    return (
      <View style={{ width: dualWidth, height: cSize, flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
        <View style={{ width: cSize, height: cSize, borderRadius: cSize / 2, overflow: 'hidden', zIndex: 1 }}>
          {getFlagSvg(base, cSize)}
        </View>
        <View
          style={{
            position: 'absolute',
            left: overlapOffset,
            top: 0,
            width: cSize,
            height: cSize,
            borderRadius: cSize / 2,
            borderWidth: 1.5,
            borderColor: '#FFFFFF',
            overflow: 'hidden',
            zIndex: 2,
          }}
        >
          {getFlagSvg(quote, cSize)}
        </View>
      </View>
    );
  }

  // Fallback single currency flag or clean badge
  return (
    <View style={[styles.cryptoCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#F0F2F5' }]}>
      {getFlagSvg(clean.slice(0, 3), cSize)}
    </View>
  );
};

const styles = StyleSheet.create({
  cryptoCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cryptoSymbolText: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
