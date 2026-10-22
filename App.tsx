import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from './src/constants/theme';
import { TradingProvider, useTrading } from './src/context/TradingContext';
import { AccountsScreen } from './src/components/AccountsScreen';
import { TradeScreen } from './src/components/TradeScreen';
import { InsightsScreen } from './src/components/InsightsScreen';
import { Watchlist } from './src/components/Watchlist';
import { TradingChart } from './src/components/TradingChart';
import { WalletTab } from './src/components/WalletTab';
import { ProfileScreen } from './src/components/ProfileScreen';
import { PerformanceScreen } from './src/components/PerformanceScreen';
import { BottomTabs, TabType } from './src/components/BottomTabs';
import { OrderModal } from './src/components/OrderModal';
import { SplashScreen } from './src/components/SplashScreen';
import { SymbolData, OrderType } from './src/types/trading';

const MainApp: React.FC = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabType>('accounts');
  const [selectedChartSymbol, setSelectedChartSymbol] = useState<SymbolData | null>(null);
  const [showDepositMethods, setShowDepositMethods] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [modalSymbol, setModalSymbol] = useState<SymbolData | null>(null);
  const [modalOrderType, setModalOrderType] = useState<OrderType>('BUY');
  const { selectedSymbol, setSelectedSymbol, symbols } = useTrading();

  const handleOpenTradeModal = (symbol: SymbolData, type: OrderType) => {
    setModalSymbol(symbol);
    setModalOrderType(type);
    setOrderModalVisible(true);
  };

  const handleSelectInstrument = (symbol: SymbolData) => {
    setSelectedSymbol(symbol);
    setSelectedChartSymbol(symbol);
    setCurrentTab('trade');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Status bar styling */}
        <StatusBar style={isSplashVisible ? 'light' : 'dark'} />

        {/* Main Screen Content based on Active Tab */}
        <View style={styles.contentContainer}>
        {/* ACCOUNTS TAB - Exact match to screenshot 1 */}
        {currentTab === 'accounts' && (
          <AccountsScreen
            onTradePress={() => {
              setSelectedChartSymbol(null);
              setCurrentTab('trade');
            }}
            onDepositPress={() => setCurrentTab('profile')}
            onSelectInstrument={handleSelectInstrument}
          />
        )}

        {/* TRADE TAB - Exact match to screenshot 2 */}
        {currentTab === 'trade' && (
          selectedChartSymbol ? (
            <View style={{ flex: 1 }}>
              {/* Back button to return to Trade List */}
              <View style={styles.chartHeaderBack}>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => setSelectedChartSymbol(null)}
                >
                  <Ionicons name="arrow-back" size={22} color="#111624" />
                  <Text style={styles.backBtnText}>Trade List</Text>
                </TouchableOpacity>
              </View>
              <TradingChart
                symbol={selectedChartSymbol}
                onOpenOrderModal={(type: OrderType) => handleOpenTradeModal(selectedChartSymbol, type)}
              />
            </View>
          ) : (
            <TradeScreen onSelectInstrument={handleSelectInstrument} />
          )
        )}

        {/* INSIGHTS TAB - Exact match to screenshots */}
        {currentTab === 'insights' && (
          <InsightsScreen
            onSelectInstrument={(symbolName) => {
              const clean = symbolName.replace('/', '').toUpperCase();
              const found = symbols.find(s => s.id.toUpperCase().includes(clean) || s.name.toUpperCase().includes(clean)) || symbols[0];
              handleSelectInstrument(found);
            }}
          />
        )}

        {/* PERFORMANCE TAB - Exact match to screenshot */}
        {currentTab === 'performance' && (
          <PerformanceScreen
            onTradePress={() => {
              setSelectedChartSymbol(null);
              setCurrentTab('trade');
            }}
          />
        )}

        {/* PROFILE TAB - Exact match to screenshots */}
        {currentTab === 'profile' && (
          showDepositMethods ? (
            <View style={{ flex: 1 }}>
              <View style={styles.chartHeaderBack}>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => setShowDepositMethods(false)}
                >
                  <Ionicons name="arrow-back" size={22} color="#111624" />
                  <Text style={styles.backBtnText}>Profile</Text>
                </TouchableOpacity>
              </View>
              <WalletTab />
            </View>
          ) : (
            <ProfileScreen onNavigateToWallet={() => setShowDepositMethods(true)} />
          )
        )}
      </View>

      {/* Bottom Navigation with 5 tabs */}
      <BottomTabs
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'trade') {
            setSelectedChartSymbol(null);
          }
          if (tab === 'profile') {
            setShowDepositMethods(false);
          }
          setCurrentTab(tab);
        }}
      />

      {/* Advanced Order Execution Drawer Modal */}
      {orderModalVisible && (
        <OrderModal
          visible={orderModalVisible}
          onClose={() => setOrderModalVisible(false)}
          symbol={modalSymbol || selectedSymbol}
          initialType={modalOrderType}
        />
      )}

      </SafeAreaView>

      {/* Official Exness Splash Screen on launch - Fullscreen seamless overlay */}
      {isSplashVisible && (
        <SplashScreen onFinish={() => setIsSplashVisible(false)} />
      )}
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <TradingProvider>
        <MainApp />
      </TradingProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 60,
  },
  chartHeaderBack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBEF',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '700',
  },
});
