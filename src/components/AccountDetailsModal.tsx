import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import { THEME } from '../constants/theme';
import { TradingAccount } from '../types/trading';

interface AccountDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  account: TradingAccount;
  onDepositPress?: () => void;
  onWithdrawPress?: () => void;
  onHistoryPress?: () => void;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  visible,
  onClose,
  account,
  onDepositPress,
  onWithdrawPress,
  onHistoryPress,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'funds' | 'settings'>('funds');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    try {
      Clipboard.setString(text);
    } catch {
      // Clipboard fallback
    }
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#111624" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Standard</Text>
        </View>

        {/* Tab Switcher: Funds | Settings */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeSubTab === 'funds' && styles.tabItemActive]}
            onPress={() => setActiveSubTab('funds')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeSubTab === 'funds' && styles.tabTextActive]}>
              Funds
            </Text>
            {activeSubTab === 'funds' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeSubTab === 'settings' && styles.tabItemActive]}
            onPress={() => setActiveSubTab('settings')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeSubTab === 'settings' && styles.tabTextActive]}>
              Settings
            </Text>
            {activeSubTab === 'settings' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Copied Feedback Toast */}
        {copiedField && (
          <View style={styles.toastContainer}>
            <Ionicons name="checkmark-circle" size={16} color="#00A868" />
            <Text style={styles.toastText}>{copiedField} copied to clipboard</Text>
          </View>
        )}

        {/* Content Container */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeSubTab === 'funds' ? (
            /* ================= FUNDS TAB (SCREENSHOT 2) ================= */
            <View style={styles.tabContentContainer}>
              {/* Financial Metrics Card */}
              <View style={styles.card}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Balance</Text>
                  <Text style={styles.metricValue}>
                    {account.balance.toFixed(2)} {account.currency}
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Equity</Text>
                  <Text style={styles.metricValue}>
                    {account.equity.toFixed(2)} {account.currency}
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Floating P/L</Text>
                  <Text style={styles.metricValue}>
                    0.00 {account.currency}
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Margin</Text>
                  <Text style={styles.metricValue}>
                    {account.margin.toFixed(2)} {account.currency}
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Free margin</Text>
                  <Text style={styles.metricValue}>
                    {account.freeMargin.toFixed(2)} {account.currency}
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Margin level</Text>
                  <Text style={styles.metricValue}>—</Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Leverage</Text>
                  <Text style={styles.metricValue}>{account.leverage}</Text>
                </View>
              </View>

              {/* 4 Action Buttons Card */}
              <View style={styles.actionsCard}>
                {/* Deposit */}
                <TouchableOpacity
                  style={styles.actionCol}
                  onPress={() => {
                    onClose();
                    onDepositPress?.();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIconCircle}>
                    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="9.5" stroke="#111624" strokeWidth="1.8" />
                      <Path
                        d="M12 7.5V15.5M12 15.5L8.5 12M12 15.5L15.5 12"
                        stroke="#111624"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                  <Text style={styles.actionLabel}>Deposit</Text>
                </TouchableOpacity>

                {/* Withdraw */}
                <TouchableOpacity
                  style={styles.actionCol}
                  onPress={() => {
                    onClose();
                    onWithdrawPress?.();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIconCircle}>
                    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="9.5" stroke="#111624" strokeWidth="1.8" />
                      <Path
                        d="M8.5 15.5L15 9M15 9H9.8M15 9V14.2"
                        stroke="#111624"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                  <Text style={styles.actionLabel}>Withdraw</Text>
                </TouchableOpacity>

                {/* History */}
                <TouchableOpacity
                  style={styles.actionCol}
                  onPress={() => {
                    onClose();
                    onHistoryPress?.();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIconCircle}>
                    <Ionicons name="time-outline" size={22} color="#111624" />
                  </View>
                  <Text style={styles.actionLabel}>History</Text>
                </TouchableOpacity>

                {/* Transfer */}
                <TouchableOpacity
                  style={styles.actionCol}
                  onPress={() => {
                    handleCopy('Internal Transfer initiated', 'Transfer');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIconCircle}>
                    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M6 8.5H18M18 8.5L14.5 5M18 8.5L14.5 12"
                        stroke="#111624"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Path
                        d="M18 15.5H6M6 15.5L9.5 12M6 15.5L9.5 19"
                        stroke="#111624"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                  <Text style={styles.actionLabel}>Transfer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ================= SETTINGS TAB (SCREENSHOT 1) ================= */
            <View style={styles.tabContentContainer}>
              {/* Card 1: Type, Number, Nickname */}
              <View style={styles.card}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Type</Text>
                  <View style={styles.pillsContainer}>
                    <View style={styles.infoPill}>
                      <Text style={styles.infoPillText}>MT5</Text>
                    </View>
                    <View style={styles.infoPill}>
                      <Text style={styles.infoPillText}>Standard</Text>
                    </View>
                    <View style={styles.infoPill}>
                      <Text style={styles.infoPillText}>{account.type}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Number</Text>
                  <Text style={styles.metricValue}>#478501477</Text>
                </View>

                <TouchableOpacity style={styles.metricRow} activeOpacity={0.7}>
                  <Text style={styles.metricLabel}>Nickname</Text>
                  <View style={styles.rowRightWithChevron}>
                    <Text style={styles.metricValue}>Standard</Text>
                    <Ionicons name="chevron-forward" size={18} color="#8A92A6" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Section Header: STANDARD ACCOUNT */}
              <Text style={styles.sectionHeader}>STANDARD ACCOUNT</Text>

              {/* Card 2: Commission, Minimum spread, Max leverage */}
              <View style={styles.card}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Commission per side up to</Text>
                  <Text style={styles.metricValue}>0.00 USD</Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Minimum spread</Text>
                  <Text style={styles.metricValue}>0.2</Text>
                </View>

                <TouchableOpacity style={styles.metricRow} activeOpacity={0.7}>
                  <Text style={styles.metricLabel}>Max leverage</Text>
                  <View style={styles.rowRightWithChevron}>
                    <Text style={styles.metricValue}>{account.leverage}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#8A92A6" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Section Header: TRADING PLATFORM - META TRADER 5 */}
              <Text style={styles.sectionHeader}>TRADING PLATFORM – META TRADER 5</Text>

              {/* Card 3: Login, Server, Change password, Trading log */}
              <View style={styles.card}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Login</Text>
                  <View style={styles.rowRightWithCopy}>
                    <Text style={styles.metricValue}>478501477</Text>
                    <TouchableOpacity
                      onPress={() => handleCopy('478501477', 'Login number')}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      activeOpacity={0.6}
                    >
                      <Ionicons name="copy-outline" size={19} color="#111624" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Server</Text>
                  <View style={styles.rowRightWithCopy}>
                    <Text style={styles.metricValue}>Exness-MT5Real11</Text>
                    <TouchableOpacity
                      onPress={() => handleCopy('Exness-MT5Real11', 'Server')}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      activeOpacity={0.6}
                    >
                      <Ionicons name="copy-outline" size={19} color="#111624" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.metricRow} activeOpacity={0.7}>
                  <Text style={styles.metricLabel}>Change trading password</Text>
                  <Ionicons name="chevron-forward" size={18} color="#8A92A6" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.metricRow} activeOpacity={0.7}>
                  <Text style={styles.metricLabel}>Trading log</Text>
                  <Ionicons name="chevron-forward" size={18} color="#8A92A6" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111624',
    letterSpacing: -0.3,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0F3',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  tabItemActive: {
    // Active style
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8A92A6',
  },
  tabTextActive: {
    color: '#111624',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: '#111624',
  },
  toastContainer: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    backgroundColor: '#111624',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContainer: {
    padding: 16,
  },
  tabContentContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  metricLabel: {
    fontSize: 14,
    color: '#111624',
    fontWeight: '400',
  },
  metricValue: {
    fontSize: 14,
    color: '#111624',
    fontWeight: '500',
  },
  pillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoPill: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  infoPillText: {
    color: '#4B5565',
    fontSize: 12,
    fontWeight: '600',
  },
  rowRightWithChevron: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowRightWithCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A92A6',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: -4,
    paddingHorizontal: 4,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  actionCol: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: '#111624',
    fontWeight: '500',
  },
});
