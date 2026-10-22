import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useTrading } from '../context/TradingContext';
import { SymbolData, OrderType } from '../types/trading';

import { CurrencyIcon } from './CurrencyIcon';

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  symbol: SymbolData;
  initialType: OrderType;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  visible,
  onClose,
  symbol,
  initialType,
}) => {
  const { openPosition } = useTrading();
  const [orderType, setOrderType] = useState<OrderType>(initialType);
  const [lots, setLots] = useState(0.10);
  const [enableSl, setEnableSl] = useState(false);
  const [enableTp, setEnableTp] = useState(false);
  const [slValue, setSlValue] = useState('');
  const [tpValue, setTpValue] = useState('');

  const price = orderType === 'BUY' ? symbol.ask : symbol.bid;
  const estimatedMargin = ((price * lots * symbol.contractSize) / 2000).toFixed(2);

  const handleExecute = () => {
    const sl = enableSl && slValue ? parseFloat(slValue) : undefined;
    const tp = enableTp && tpValue ? parseFloat(tpValue) : undefined;

    openPosition(symbol, orderType, lots, sl, tp);
    onClose();
  };

  const adjustLots = (delta: number) => {
    setLots(prev => Math.max(0.01, Number((prev + delta).toFixed(2))));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CurrencyIcon symbol={symbol.id} size={32} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.symbolTitle}>{symbol.name}</Text>
                <Text style={styles.symbolSub}>{symbol.fullName}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={THEME.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Buy / Sell Toggle Tabs */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                orderType === 'SELL' && styles.sellBtnActive,
              ]}
              onPress={() => setOrderType('SELL')}
            >
              <Text style={styles.typeBtnTitle}>SELL</Text>
              <Text style={styles.typeBtnPrice}>{symbol.bid.toFixed(symbol.digits)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeBtn,
                orderType === 'BUY' && styles.buyBtnActive,
              ]}
              onPress={() => setOrderType('BUY')}
            >
              <Text style={styles.typeBtnTitle}>BUY</Text>
              <Text style={styles.typeBtnPrice}>{symbol.ask.toFixed(symbol.digits)}</Text>
            </TouchableOpacity>
          </View>

          {/* Volume / Lots Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Volume (Lots)</Text>
            <View style={styles.lotRow}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustLots(-0.05)}>
                <Text style={styles.stepText}>-0.05</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustLots(-0.01)}>
                <Text style={styles.stepText}>-0.01</Text>
              </TouchableOpacity>

              <View style={styles.lotDisplay}>
                <Text style={styles.lotValueText}>{lots.toFixed(2)}</Text>
              </View>

              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustLots(0.01)}>
                <Text style={styles.stepText}>+0.01</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjustLots(0.05)}>
                <Text style={styles.stepText}>+0.05</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stop Loss & Take Profit Toggles */}
          <View style={styles.sltpContainer}>
            {/* Take Profit */}
            <View style={styles.sltpItem}>
              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => setEnableTp(!enableTp)}
              >
                <Ionicons
                  name={enableTp ? 'checkbox' : 'square-outline'}
                  size={18}
                  color={THEME.colors.buyGreen}
                />
                <Text style={styles.sltpLabel}>Take Profit</Text>
              </TouchableOpacity>
              {enableTp && (
                <TextInput
                  style={styles.sltpInput}
                  placeholder={orderType === 'BUY' ? (price * 1.01).toFixed(symbol.digits) : (price * 0.99).toFixed(symbol.digits)}
                  placeholderTextColor={THEME.colors.textMuted}
                  keyboardType="numeric"
                  value={tpValue}
                  onChangeText={setTpValue}
                />
              )}
            </View>

            {/* Stop Loss */}
            <View style={styles.sltpItem}>
              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => setEnableSl(!enableSl)}
              >
                <Ionicons
                  name={enableSl ? 'checkbox' : 'square-outline'}
                  size={18}
                  color={THEME.colors.sellRed}
                />
                <Text style={styles.sltpLabel}>Stop Loss</Text>
              </TouchableOpacity>
              {enableSl && (
                <TextInput
                  style={styles.sltpInput}
                  placeholder={orderType === 'BUY' ? (price * 0.99).toFixed(symbol.digits) : (price * 1.01).toFixed(symbol.digits)}
                  placeholderTextColor={THEME.colors.textMuted}
                  keyboardType="numeric"
                  value={slValue}
                  onChangeText={setSlValue}
                />
              )}
            </View>
          </View>

          {/* Meta Info: Margin & Spread */}
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>
              Spread: <Text style={{ color: THEME.colors.textPrimary }}>{symbol.spread} pips</Text>
            </Text>
            <Text style={styles.metaLabel}>
              Required Margin: <Text style={{ color: THEME.colors.primary }}>${estimatedMargin} USD</Text>
            </Text>
          </View>

          {/* Confirm Execution Button */}
          <TouchableOpacity
            style={[
              styles.executeButton,
              { backgroundColor: orderType === 'BUY' ? THEME.colors.buyGreen : THEME.colors.sellRed },
            ]}
            onPress={handleExecute}
            activeOpacity={0.85}
          >
            <Text style={styles.executeButtonText}>
              CONFIRM {orderType} {lots} LOTS
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  symbolTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  symbolSub: {
    color: THEME.colors.textMuted,
    fontSize: 12,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: THEME.colors.surfaceLight,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceLight,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sellBtnActive: {
    backgroundColor: THEME.colors.sellRedBg,
    borderColor: THEME.colors.sellRed,
  },
  buyBtnActive: {
    backgroundColor: THEME.colors.buyGreenBg,
    borderColor: THEME.colors.buyGreen,
  },
  typeBtnTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  typeBtnPrice: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  lotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepBtn: {
    backgroundColor: THEME.colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  stepText: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  lotDisplay: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  lotValueText: {
    color: THEME.colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  sltpContainer: {
    backgroundColor: THEME.colors.surfaceLight,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    gap: 12,
    marginBottom: 16,
  },
  sltpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sltpLabel: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  sltpInput: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    color: THEME.colors.textPrimary,
    fontSize: 13,
    width: 120,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaLabel: {
    color: THEME.colors.textMuted,
    fontSize: 12,
  },
  executeButton: {
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginBottom: 10,
  },
  executeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
