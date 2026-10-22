import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { THEME } from '../constants/theme';
import { useTrading } from '../context/TradingContext';
import { SymbolData } from '../types/trading';
import { CurrencyIcon } from './CurrencyIcon';
import { AccountDetailsModal } from './AccountDetailsModal';

interface AccountsScreenProps {
  onTradePress: () => void;
  onDepositPress: () => void;
  onSelectInstrument: (symbol: SymbolData) => void;
}

export const AccountsScreen: React.FC<AccountsScreenProps> = ({
  onTradePress,
  onDepositPress,
  onSelectInstrument,
}) => {
  const { account, symbols, positions, closedOrders, closePosition, toggleAccountType } = useTrading();
  const [activeOrderTab, setActiveOrderTab] = useState<'open' | 'pending' | 'closed'>('open');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Sliders icon (custom SVG to match exact Exness Trade button)
  const renderTradeSliders = () => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      {/* Left slider */}
      <Path d="M7 3V21" stroke="#111624" strokeWidth="2.2" strokeLinecap="round" />
      <Rect x="4.5" y="8" width="5" height="5" rx="1.5" fill="#111624" />
      {/* Right slider */}
      <Path d="M17 3V21" stroke="#111624" strokeWidth="2.2" strokeLinecap="round" />
      <Rect x="14.5" y="13" width="5" height="5" rx="1.5" fill="#111624" />
    </Svg>
  );

  // Deposit arrow down inside circle
  const renderDepositIcon = () => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke="#111624" strokeWidth="1.8" />
      <Path d="M12 7.5V15.5M12 15.5L8.5 12M12 15.5L15.5 12" stroke="#111624" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  // Withdraw arrow up-right inside circle
  const renderWithdrawIcon = () => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke="#111624" strokeWidth="1.8" />
      <Path d="M8.5 15.5L15 9M15 9H9.8M15 9V14.2" stroke="#111624" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  // Transfer opposing horizontal arrows
  const renderTransferIcon = () => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M6 8.5H18M18 8.5L14.5 5M18 8.5L14.5 12" stroke="#111624" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18 15.5H6M6 15.5L9.5 12M6 15.5L9.5 19" stroke="#111624" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  // Gold + US flag icon for XAU/USD
  const renderGoldIcon = () => (
    <CurrencyIcon symbol="XAUUSD" size={32} />
  );

  // Bitcoin orange roundel icon
  const renderBtcIcon = () => (
    <CurrencyIcon symbol="BTC" size={32} />
  );

  // USTEC NDX Flag roundel
  const renderUstecIcon = () => (
    <CurrencyIcon symbol="USTEC" size={32} />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Bar with Clock and Bell */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <View style={styles.topRightIcons}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="alarm-outline" size={24} color={THEME.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color={THEME.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Account Card */}
      <View style={styles.accountCard}>
        {/* Top Card Row */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.accountTitleRow}>
            <Text style={styles.accountStandardText}>Standard</Text>
            <Text style={styles.accountNumberText}> # 478501477</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setShowSettingsModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={17} color={THEME.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Pills Row (Real, MT5, Standard) */}
        <View style={styles.pillsRow}>
          <TouchableOpacity
            style={styles.pill}
            onPress={toggleAccountType}
            activeOpacity={0.8}
          >
            <Text style={styles.pillText}>{account.type}</Text>
          </TouchableOpacity>
          <View style={styles.pill}>
            <Text style={styles.pillText}>MT5</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Standard</Text>
          </View>
        </View>

        {/* Large Balance Display */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>
            {account.balance.toFixed(2)} USD
          </Text>
        </View>

        {/* 4 Circular Action Buttons */}
        <View style={styles.actionButtonsRow}>
          {/* Trade Button (Yellow) */}
          <TouchableOpacity
            style={styles.actionBtnCol}
            onPress={onTradePress}
            activeOpacity={0.8}
          >
            <View style={styles.yellowTradeCircle}>
              {renderTradeSliders()}
            </View>
            <Text style={styles.actionBtnLabel}>Trade</Text>
          </TouchableOpacity>

          {/* Deposit Button */}
          <TouchableOpacity
            style={styles.actionBtnCol}
            onPress={onDepositPress}
            activeOpacity={0.8}
          >
            <View style={styles.greyActionCircle}>
              {renderDepositIcon()}
            </View>
            <Text style={styles.actionBtnLabel}>Deposit</Text>
          </TouchableOpacity>

          {/* Withdraw Button */}
          <TouchableOpacity
            style={styles.actionBtnCol}
            onPress={onDepositPress}
            activeOpacity={0.8}
          >
            <View style={styles.greyActionCircle}>
              {renderWithdrawIcon()}
            </View>
            <Text style={styles.actionBtnLabel}>Withdraw</Text>
          </TouchableOpacity>

          {/* Transfer Button */}
          <TouchableOpacity
            style={styles.actionBtnCol}
            onPress={onDepositPress}
            activeOpacity={0.8}
          >
            <View style={styles.greyActionCircle}>
              {renderTransferIcon()}
            </View>
            <Text style={styles.actionBtnLabel}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Orders Segment Tab Bar */}
      <View style={styles.orderTabBar}>
        <View style={styles.tabButtonsGroup}>
          <TouchableOpacity
            style={styles.orderTabItem}
            onPress={() => setActiveOrderTab('open')}
          >
            <Text
              style={[
                styles.orderTabText,
                activeOrderTab === 'open' && styles.orderTabTextActive,
              ]}
            >
              Open
            </Text>
            {activeOrderTab === 'open' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.orderTabItem}
            onPress={() => setActiveOrderTab('pending')}
          >
            <Text
              style={[
                styles.orderTabText,
                activeOrderTab === 'pending' && styles.orderTabTextActive,
              ]}
            >
              Pending
            </Text>
            {activeOrderTab === 'pending' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.orderTabItem}
            onPress={() => setActiveOrderTab('closed')}
          >
            <Text
              style={[
                styles.orderTabText,
                activeOrderTab === 'closed' && styles.orderTabTextActive,
              ]}
            >
              Closed
            </Text>
            {activeOrderTab === 'closed' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sortFilterBtn}>
          <Ionicons name="swap-vertical-outline" size={20} color={THEME.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Orders Content or Next Trade Carousel */}
      {activeOrderTab === 'open' && positions.length === 0 ? (
        <View style={styles.ordersSection}>
          <Text style={styles.noOrdersText}>
            No open orders. Find your next trade:
          </Text>

          {/* Horizontal Scrolling Instruments Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          >
            {/* Card 1: XAU/USD */}
            {(() => {
              const xau = symbols.find(s => s.id === 'XAUUSD') || {
                id: 'XAUUSD',
                name: 'XAU/USD',
                fullName: 'Gold vs US Dollar',
                category: 'Metals' as const,
                bid: 4088.436,
                ask: 4088.580,
                spread: 1.4,
                changePercent: -0.9,
                high24h: 4120,
                low24h: 4050,
                digits: 3,
                sparkline: [],
                contractSize: 100,
              };
              return (
                <TouchableOpacity
                  style={styles.instrumentCard}
                  onPress={() => onSelectInstrument(xau)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cardSymbolTitle}>XAU/USD</Text>
                  <View style={styles.cardIconWrapper}>{renderGoldIcon()}</View>
                  <Text style={styles.cardPriceText}>{xau.bid.toFixed(3)}</Text>
                  <View
                    style={[
                      styles.changeBadge,
                      { backgroundColor: xau.changePercent < 0 ? THEME.colors.sellRedBg : THEME.colors.buyGreenBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.changeBadgeText,
                        { color: xau.changePercent < 0 ? THEME.colors.sellRed : THEME.colors.buyGreen },
                      ]}
                    >
                      {xau.changePercent < 0 ? '↓ ' : '↑ '}
                      {xau.changePercent.toFixed(2)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })()}

            {/* Card 2: BTC */}
            {(() => {
              const btc = symbols.find(s => s.id === 'BTCUSD') || {
                id: 'BTCUSD',
                name: 'BTC',
                fullName: 'Bitcoin',
                category: 'Crypto' as const,
                bid: 82729.13,
                ask: 82740.00,
                spread: 10,
                changePercent: -1.55,
                high24h: 84000,
                low24h: 81000,
                digits: 2,
                sparkline: [],
                contractSize: 1,
              };
              return (
                <TouchableOpacity
                  style={styles.instrumentCard}
                  onPress={() => onSelectInstrument(btc)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cardSymbolTitle}>BTC</Text>
                  <View style={styles.cardIconWrapper}>{renderBtcIcon()}</View>
                  <Text style={styles.cardPriceText}>{btc.bid.toFixed(2)}</Text>
                  <View
                    style={[
                      styles.changeBadge,
                      { backgroundColor: btc.changePercent < 0 ? THEME.colors.sellRedBg : THEME.colors.buyGreenBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.changeBadgeText,
                        { color: btc.changePercent < 0 ? THEME.colors.sellRed : THEME.colors.buyGreen },
                      ]}
                    >
                      {btc.changePercent < 0 ? '↓ ' : '↑ '}
                      {btc.changePercent.toFixed(2)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })()}

            {/* Card 3: USTEC */}
            {(() => {
              const ustec = symbols.find(s => s.id === 'USTEC') || {
                id: 'USTEC',
                name: 'USTEC',
                fullName: 'US Tech 100',
                category: 'Indices' as const,
                bid: 29371.54,
                ask: 29373.00,
                spread: 1.5,
                changePercent: -0.81,
                high24h: 29500,
                low24h: 29100,
                digits: 2,
                sparkline: [],
                contractSize: 1,
              };
              return (
                <TouchableOpacity
                  style={styles.instrumentCard}
                  onPress={() => onSelectInstrument(ustec)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cardSymbolTitle}>USTEC</Text>
                  <View style={styles.cardIconWrapper}>{renderUstecIcon()}</View>
                  <Text style={styles.cardPriceText}>{ustec.bid.toFixed(2)}</Text>
                  <View
                    style={[
                      styles.changeBadge,
                      { backgroundColor: ustec.changePercent < 0 ? THEME.colors.sellRedBg : THEME.colors.buyGreenBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.changeBadgeText,
                        { color: ustec.changePercent < 0 ? THEME.colors.sellRed : THEME.colors.buyGreen },
                      ]}
                    >
                      {ustec.changePercent < 0 ? '↓ ' : '↑ '}
                      {ustec.changePercent.toFixed(2)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })()}
          </ScrollView>
        </View>
      ) : activeOrderTab === 'open' && positions.length > 0 ? (
        <View style={styles.ordersListContainer}>
          {positions.map(pos => {
            const isProfit = pos.pnl >= 0;
            return (
              <View key={pos.id} style={styles.positionItemCard}>
                <View style={styles.posItemHeader}>
                  <View style={styles.posItemLeft}>
                    <CurrencyIcon symbol={pos.symbolId} size={28} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.posItemSymbol}>{pos.symbolName}</Text>
                      <View
                        style={[
                          styles.posTypeBadge,
                          { backgroundColor: pos.type === 'BUY' ? THEME.colors.buyGreenBg : THEME.colors.sellRedBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.posTypeBadgeText,
                            { color: pos.type === 'BUY' ? THEME.colors.buyGreen : THEME.colors.sellRed },
                          ]}
                        >
                          {pos.type} {pos.lots}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.posItemPnl,
                      { color: isProfit ? THEME.colors.buyGreen : THEME.colors.sellRed },
                    ]}
                  >
                    {isProfit ? '+' : ''}${pos.pnl.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.posItemDetails}>
                  <Text style={styles.posDetailText}>
                    Open: {pos.openPrice} → Now: {pos.currentPrice}
                  </Text>
                  <TouchableOpacity
                    style={styles.posCloseBtn}
                    onPress={() => closePosition(pos.id)}
                  >
                    <Text style={styles.posCloseBtnText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      ) : activeOrderTab === 'pending' ? (
        <View style={styles.emptyOrdersBox}>
          <Text style={styles.emptyOrdersText}>No pending orders.</Text>
        </View>
      ) : (
        <View style={styles.ordersListContainer}>
          {closedOrders.length === 0 ? (
            <View style={styles.emptyOrdersBox}>
              <Text style={styles.emptyOrdersText}>No closed orders yet.</Text>
            </View>
          ) : (
            closedOrders.map(order => (
              <View key={order.id} style={styles.positionItemCard}>
                <View style={styles.posItemHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CurrencyIcon symbol={order.symbolId} size={28} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.posItemSymbol}>{order.symbolName} {order.type} {order.lots}</Text>
                      <Text style={styles.posDetailText}>Closed at {order.closeTime}</Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.posItemPnl,
                      { color: order.pnl >= 0 ? THEME.colors.buyGreen : THEME.colors.sellRed },
                    ]}
                  >
                    {order.pnl >= 0 ? '+' : ''}${order.pnl.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Account Settings / Funds Modal (1:1 match to Exness screenshot) */}
      <AccountDetailsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        account={account}
        onDepositPress={onDepositPress}
        onWithdrawPress={onDepositPress}
        onHistoryPress={() => setActiveOrderTab('closed')}
      />

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },
  topRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    padding: 2,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountStandardText: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '700',
  },
  accountNumberText: {
    color: '#9CA5B3',
    fontSize: 14,
    fontWeight: '500',
  },
  settingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  pill: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pillText: {
    color: '#111624',
    fontSize: 12,
    fontWeight: '500',
  },
  balanceContainer: {
    marginBottom: 18,
  },
  balanceText: {
    color: '#111624',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 4,
  },
  actionBtnCol: {
    alignItems: 'center',
    gap: 6,
  },
  yellowTradeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFDE00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greyActionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnLabel: {
    color: '#111624',
    fontSize: 12,
    fontWeight: '500',
  },
  orderTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBEF',
  },
  tabButtonsGroup: {
    flexDirection: 'row',
    gap: 22,
  },
  orderTabItem: {
    paddingBottom: 10,
    position: 'relative',
  },
  orderTabText: {
    color: '#9CA5B3',
    fontSize: 15,
    fontWeight: '600',
  },
  orderTabTextActive: {
    color: '#111624',
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#111624',
  },
  sortFilterBtn: {
    paddingBottom: 10,
  },
  ordersSection: {
    paddingTop: 16,
  },
  noOrdersText: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  carouselContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  instrumentCard: {
    backgroundColor: '#FFFFFF',
    width: 114,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EBEF',
  },
  cardSymbolTitle: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  cardIconWrapper: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardPriceText: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  changeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  flagIconPair: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goldBarBadge: {
    marginRight: -6,
    zIndex: 1,
  },
  usFlagCircle: {
    zIndex: 2,
  },
  btcCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F7931A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btcText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  ustecCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ordersListContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  positionItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8EBEF',
  },
  posItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  posItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  posItemSymbol: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '700',
  },
  posTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  posTypeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  posItemPnl: {
    fontSize: 14,
    fontWeight: '700',
  },
  posItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posDetailText: {
    color: '#9CA5B3',
    fontSize: 11,
  },
  posCloseBtn: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  posCloseBtnText: {
    color: '#D9383A',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyOrdersBox: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyOrdersText: {
    color: '#9CA5B3',
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalHeaderTitle: {
    color: '#111624',
    fontSize: 16,
    fontWeight: '700',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E8EBEF',
    marginVertical: 12,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  modalInfoLabel: {
    color: '#6E7787',
    fontSize: 13,
  },
  modalInfoVal: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '600',
  },
  modalActionBtn: {
    marginTop: 16,
    backgroundColor: '#FFDE00',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalActionBtnText: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '700',
  },
});
