import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useTrading } from '../context/TradingContext';

interface HeaderProps {
  onOpenDeposit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDeposit }) => {
  const { account, toggleAccountType } = useTrading();
  const [showAccountModal, setShowAccountModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* Top row: Brand & Account Selector */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>ex</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>EXNESS</Text>
            <Text style={styles.brandSub}>PRO TRADER</Text>
          </View>
        </View>

        {/* Account Pill */}
        <TouchableOpacity
          style={[
            styles.accountPill,
            account.type === 'Real' ? styles.realPill : styles.demoPill,
          ]}
          onPress={() => setShowAccountModal(true)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: account.type === 'Real' ? THEME.colors.buyGreen : THEME.colors.primary },
            ]}
          />
          <Text style={styles.accountPillText}>{account.type} MT5</Text>
          <Ionicons name="chevron-down" size={14} color={THEME.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Account Balance Summary Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Account Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.balanceValue}>
              {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text style={styles.currencyCode}>{account.currency}</Text>
          </View>
          <View style={styles.equityRow}>
            <Text style={styles.equityText}>
              Equity: <Text style={styles.equityHighlight}>${account.equity.toFixed(2)}</Text>
            </Text>
            <Text style={styles.marginText}>
              Margin: <Text style={{ color: THEME.colors.textPrimary }}>${account.margin.toFixed(2)}</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.depositBtn}
          onPress={onOpenDeposit}
          activeOpacity={0.85}
        >
          <Ionicons name="wallet-outline" size={16} color={THEME.colors.textDark} />
          <Text style={styles.depositBtnText}>Deposit</Text>
        </TouchableOpacity>
      </View>

      {/* Account Switcher Modal */}
      <Modal
        visible={showAccountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAccountModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Trading Account</Text>

            <TouchableOpacity
              style={[
                styles.accountOption,
                account.type === 'Demo' && styles.accountOptionActive,
              ]}
              onPress={() => {
                if (account.type !== 'Demo') toggleAccountType();
                setShowAccountModal(false);
              }}
            >
              <View style={styles.accountOptionLeft}>
                <View style={[styles.optionDot, { backgroundColor: THEME.colors.primary }]} />
                <View>
                  <Text style={styles.accountOptionName}>Standard Demo MT5</Text>
                  <Text style={styles.accountOptionServer}>Server: Exness-MT5Trial · #92841042</Text>
                </View>
              </View>
              <Text style={styles.accountOptionBalance}>$10,000.00</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.accountOption,
                account.type === 'Real' && styles.accountOptionActive,
              ]}
              onPress={() => {
                if (account.type !== 'Real') toggleAccountType();
                setShowAccountModal(false);
              }}
            >
              <View style={styles.accountOptionLeft}>
                <View style={[styles.optionDot, { backgroundColor: THEME.colors.buyGreen }]} />
                <View>
                  <Text style={styles.accountOptionName}>Standard Real MT5</Text>
                  <Text style={styles.accountOptionServer}>Server: Exness-Real12 · #51930281</Text>
                </View>
              </View>
              <Text style={styles.accountOptionBalance}>$520.40</Text>
            </TouchableOpacity>

            <View style={styles.leverageBadge}>
              <Ionicons name="speedometer-outline" size={14} color={THEME.colors.primary} />
              <Text style={styles.leverageText}>Maximum Leverage: {account.leverage}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.sm,
    paddingBottom: THEME.spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#FFDE00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeText: {
    color: '#FFDE00',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -1,
    marginTop: -2,
  },
  brandTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  brandSub: {
    color: THEME.colors.primary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  accountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
  },
  demoPill: {
    backgroundColor: 'rgba(245, 194, 0, 0.1)',
    borderColor: 'rgba(245, 194, 0, 0.3)',
  },
  realPill: {
    backgroundColor: 'rgba(0, 192, 118, 0.1)',
    borderColor: 'rgba(0, 192, 118, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  accountPillText: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
    gap: 4,
  },
  currencySymbol: {
    color: THEME.colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  balanceValue: {
    color: THEME.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  currencyCode: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  equityRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  equityText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  equityHighlight: {
    color: THEME.colors.buyGreen,
    fontWeight: '700',
  },
  marginText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  depositBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
  },
  depositBtnText: {
    color: THEME.colors.textDark,
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  modalTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  accountOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceLight,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  accountOptionActive: {
    borderColor: THEME.colors.primary,
  },
  accountOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accountOptionName: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  accountOptionServer: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  accountOptionBalance: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  leverageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.surfaceLight,
    padding: 10,
    borderRadius: THEME.borderRadius.sm,
    marginTop: 8,
  },
  leverageText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
});
