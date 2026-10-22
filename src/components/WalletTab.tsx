import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useTrading } from '../context/TradingContext';

const DEPOSIT_METHODS = [
  {
    id: 'usdt_trc20',
    name: 'Tether (USDT TRC20)',
    time: 'Instant · 0% Fee',
    icon: 'logo-bitcoin',
    popular: true,
  },
  {
    id: 'upi_inr',
    name: 'Instant UPI / NetBanking',
    time: 'Instant · 0% Fee',
    icon: 'card-outline',
    popular: true,
  },
  {
    id: 'card',
    name: 'Visa / Mastercard / Apple Pay',
    time: 'Instant · 0% Fee',
    icon: 'card',
    popular: false,
  },
  {
    id: 'binance_pay',
    name: 'Binance Pay',
    time: 'Instant · 0% Fee',
    icon: 'flash-outline',
    popular: false,
  },
  {
    id: 'skrill',
    name: 'Skrill / Neteller',
    time: 'Instant · 0% Fee',
    icon: 'wallet-outline',
    popular: false,
  },
];

export const WalletTab: React.FC = () => {
  const { account, depositFunds } = useTrading();
  const [selectedMethod, setSelectedMethod] = useState(DEPOSIT_METHODS[0].id);

  const handleDepositQuick = (amt: number) => {
    depositFunds(amt);
    Alert.alert(
      'Deposit Successful',
      `+$${amt.toLocaleString()} USD has been credited to your ${account.type} MT5 account.`
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Account Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.badgeRow}>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={THEME.colors.buyGreen} />
            <Text style={styles.verifiedText}>Fully Verified · Exness Pro</Text>
          </View>
          <Text style={styles.accountNumberTag}>#92841042</Text>
        </View>

        <Text style={styles.balanceLabel}>Total Available Funds</Text>
        <Text style={styles.balanceBig}>
          ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Free Margin</Text>
            <Text style={styles.metaVal}>${account.freeMargin.toFixed(2)}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Max Leverage</Text>
            <Text style={[styles.metaVal, { color: THEME.colors.primary }]}>{account.leverage}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Base Currency</Text>
            <Text style={styles.metaVal}>{account.currency}</Text>
          </View>
        </View>
      </View>

      {/* Quick Test Demo Deposit Buttons */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Test Funds ({account.type})</Text>
      </View>
      <View style={styles.quickDepositRow}>
        <TouchableOpacity
          style={styles.quickDepositBtn}
          onPress={() => handleDepositQuick(500)}
        >
          <Text style={styles.quickDepositText}>+$500</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickDepositBtn}
          onPress={() => handleDepositQuick(1000)}
        >
          <Text style={styles.quickDepositText}>+$1,000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickDepositBtn}
          onPress={() => handleDepositQuick(5000)}
        >
          <Text style={styles.quickDepositText}>+$5,000</Text>
        </TouchableOpacity>
      </View>

      {/* Real Deposit Methods */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Deposit Payment Methods</Text>
        <Text style={styles.sectionSub}>Zero Commission</Text>
      </View>

      {DEPOSIT_METHODS.map(method => {
        const isSelected = selectedMethod === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[styles.methodCard, isSelected && styles.methodCardActive]}
            onPress={() => setSelectedMethod(method.id)}
            activeOpacity={0.8}
          >
            <View style={styles.methodLeft}>
              <View style={styles.methodIconBox}>
                <Ionicons name={method.icon as any} size={20} color={THEME.colors.primary} />
              </View>
              <View>
                <View style={styles.methodNameRow}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  {method.popular && (
                    <View style={styles.popularTag}>
                      <Text style={styles.popularText}>POPULAR</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.methodTime}>{method.time}</Text>
              </View>
            </View>

            <Ionicons
              name={isSelected ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={isSelected ? THEME.colors.primary : THEME.colors.textMuted}
            />
          </TouchableOpacity>
        );
      })}

      {/* Security & Settings Info */}
      <View style={styles.securityBox}>
        <View style={styles.secRow}>
          <Ionicons name="shield-checkmark" size={18} color={THEME.colors.buyGreen} />
          <Text style={styles.secTitle}>Negative Balance Protection Active</Text>
        </View>
        <Text style={styles.secDesc}>
          Your trading account is protected by Exness instant risk-management and 0-spread accounts.
        </Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.lg,
  },
  balanceCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 192, 118, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    color: THEME.colors.buyGreen,
    fontSize: 10,
    fontWeight: '700',
  },
  accountNumberTag: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  balanceLabel: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  balanceBig: {
    color: THEME.colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 12,
  },
  metaCol: {
    alignItems: 'center',
  },
  metaLabel: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  metaVal: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionSub: {
    color: THEME.colors.buyGreen,
    fontSize: 11,
    fontWeight: '600',
  },
  quickDepositRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  quickDepositBtn: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceElevated,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  quickDepositText: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 10,
  },
  methodCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: THEME.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodName: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  popularTag: {
    backgroundColor: 'rgba(245, 194, 0, 0.15)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  popularText: {
    color: THEME.colors.primary,
    fontSize: 8,
    fontWeight: '800',
  },
  methodTime: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  securityBox: {
    backgroundColor: THEME.colors.surfaceLight,
    padding: 14,
    borderRadius: THEME.borderRadius.md,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.buyGreen,
  },
  secRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  secTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  secDesc: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
});
