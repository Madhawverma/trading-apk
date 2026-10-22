import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Path,
  Circle,
  Rect,
} from 'react-native-svg';
import { THEME } from '../constants/theme';
import { useTrading } from '../context/TradingContext';
import { LegalDocumentsModal } from './LegalDocumentsModal';

interface ProfileScreenProps {
  onNavigateToWallet?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigateToWallet }) => {
  const { account } = useTrading();
  const [showEmail, setShowEmail] = useState(false);
  const [showBenefitsMore, setShowBenefitsMore] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLegalDocsModal, setShowLegalDocsModal] = useState(false);

  // Pillar icon for Flexible HMR
  const renderPillarsIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="16" height="16" rx="2" stroke="#111624" strokeWidth="1.8" />
      <LineComp x1="9" y1="4" x2="9" y2="20" />
      <LineComp x1="15" y1="4" x2="15" y2="20" />
    </Svg>
  );

  const LineComp = ({ x1, y1, x2, y2 }: any) => (
    <Path d={`M${x1} ${y1} V${y2}`} stroke="#111624" strokeWidth="1.8" />
  );

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Exness?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header: Title Profile + Settings Gear */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={24} color="#111624" />
        </TouchableOpacity>
      </View>

      {/* SECTION 1: ACCOUNT */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Account</Text>

        {/* Login Row */}
        <View style={styles.rowItem}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Text style={styles.atSymbolText}>@</Text>
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowMainText}>Login</Text>
              <Text style={styles.rowSubText}>
                {showEmail ? 'trader@exness.com' : '******@*****.***'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowEmail(!showEmail)} style={styles.eyeBtn}>
            <Ionicons
              name={showEmail ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#6E7787"
            />
          </TouchableOpacity>
        </View>

        {/* Verification Progress Row */}
        <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-outline" size={18} color="#111624" />
            </View>
            <Text style={styles.rowSingleTitle}>Verification progress</Text>
          </View>
          <View style={styles.rowRightBadge}>
            <View style={styles.notVerifiedPill}>
              <Text style={styles.notVerifiedText}>Not verified</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#111624" />
          </View>
        </TouchableOpacity>

        {/* Verification & Deposit Callout Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerTopRow}>
            {/* Circular progress avatar */}
            <View style={styles.progressAvatarBox}>
              <Svg width={46} height={46} viewBox="0 0 46 46">
                <Circle cx="23" cy="23" r="21" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
                {/* 25% completed green arc */}
                <Path
                  d="M 23 2 A 21 21 0 0 1 44 23"
                  fill="none"
                  stroke="#9CA5B3"
                  strokeWidth="2.5"
                />
              </Svg>
              <View style={styles.innerAvatarIcon}>
                <Ionicons name="person-outline" size={20} color="#111624" />
              </View>
            </View>
            <Text style={styles.bannerMessageText}>
              Hello. Fill in your account details to make your first deposit
            </Text>
          </View>

          {/* Banner Action Buttons */}
          <View style={styles.bannerButtonsRow}>
            <TouchableOpacity style={styles.learnMoreBtn}>
              <Text style={styles.learnMoreText}>Learn more</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.completeBtn} onPress={onNavigateToWallet}>
              <Text style={styles.completeText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* SECTION 2: BENEFITS */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Benefits</Text>

        {/* Swap-free */}
        <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="moon-outline" size={18} color="#111624" />
            </View>
            <Text style={styles.rowSingleTitle}>Swap-free</Text>
          </View>
          <View style={styles.rowRightBadge}>
            <View style={styles.qualifiedPill}>
              <Text style={styles.qualifiedText}>Qualified</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#111624" />
          </View>
        </TouchableOpacity>

        {/* Flexible HMR */}
        <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>{renderPillarsIcon()}</View>
            <Text style={styles.rowSingleTitle}>Flexible HMR</Text>
          </View>
          <View style={styles.rowRightBadge}>
            <View style={styles.extendedPill}>
              <Text style={styles.extendedText}>Extended</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#111624" />
          </View>
        </TouchableOpacity>

        {/* Show More Button */}
        <TouchableOpacity
          style={styles.showMoreBtn}
          onPress={() => setShowBenefitsMore(!showBenefitsMore)}
          activeOpacity={0.7}
        >
          <Text style={styles.showMoreBtnText}>
            {showBenefitsMore ? 'Show less' : 'Show more'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECTION 3: CRYPTO WALLET */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Crypto wallet</Text>

        <TouchableOpacity
          style={styles.rowItem}
          activeOpacity={0.7}
          onPress={onNavigateToWallet}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="wallet-outline" size={18} color="#111624" />
            </View>
            <Text style={styles.rowSingleTitle}>Balance</Text>
          </View>
          <View style={styles.rowRightBadge}>
            <Text style={styles.walletBalanceText}>0.00 USD</Text>
            <Ionicons name="chevron-forward" size={18} color="#111624" />
          </View>
        </TouchableOpacity>
      </View>

      {/* SECTION 4: REFERRAL PROGRAM */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Referral program</Text>

        <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.purpleIconCircle}>
              <Ionicons name="wallet-outline" size={18} color="#7C3AED" />
            </View>
            <Text style={styles.referralText}>
              Earn a stable income by introducing clients to Exness
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#111624" />
        </TouchableOpacity>
      </View>

      {/* SECTION 5: SUPPORT */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Support</Text>

        {/* Support hub */}
        <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="heart-outline" size={18} color="#111624" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowMainText}>Support hub</Text>
              <Text style={styles.rowSubText}>Find answers to your questions</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#111624" />
        </TouchableOpacity>

        {/* Open a ticket */}
        <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="chatbox-outline" size={18} color="#111624" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowMainText}>Open a ticket</Text>
              <Text style={styles.rowSubText}>Fill the request form and we'll get back to you</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#111624" />
        </TouchableOpacity>

        {/* LiveChat */}
        <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="chatbubbles-outline" size={18} color="#111624" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowMainText}>LiveChat</Text>
              <Text style={styles.rowSubText}>Feel free to contact our customer support</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#111624" />
        </TouchableOpacity>

        {/* Suggest a feature */}
        <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="bulb-outline" size={18} color="#111624" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowMainText}>Suggest a feature</Text>
              <Text style={styles.rowSubText}>Help us become better</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#111624" />
        </TouchableOpacity>

        {/* Legal Documents */}
        <TouchableOpacity
          style={styles.rowItem}
          activeOpacity={0.7}
          onPress={() => setShowLegalDocsModal(true)}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="clipboard-outline" size={18} color="#111624" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowMainText}>Legal Documents</Text>
              <Text style={styles.rowSubText}>Exness (SC) Ltd</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#111624" />
        </TouchableOpacity>

        {/* Rate the app */}
        <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="thumbs-up-outline" size={18} color="#111624" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowMainText}>Rate the app</Text>
              <Text style={styles.rowSubText}>Please rate us in Google Play</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#111624" />
        </TouchableOpacity>

        {/* About the app */}
        <TouchableOpacity
          style={styles.rowItem}
          activeOpacity={0.7}
          onPress={() => setShowAboutModal(true)}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="information-circle-outline" size={18} color="#111624" />
            </View>
            <Text style={styles.rowSingleTitle}>About the app</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#111624" />
        </TouchableOpacity>
      </View>

      {/* LOG OUT BUTTON */}
      <View style={styles.logoutWrapper}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#D9383A" />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 110 }} />

      {/* ABOUT THE APP MODAL */}
      <Modal
        visible={showAboutModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <SafeAreaView style={styles.aboutModalContainer}>
          {/* Header */}
          <View style={styles.aboutHeader}>
            <TouchableOpacity
              onPress={() => setShowAboutModal(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.aboutBackBtn}
            >
              <Ionicons name="close" size={24} color="#111624" />
            </TouchableOpacity>
            <Text style={styles.aboutHeaderTitle}>About the app</Text>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView
            style={styles.aboutScrollView}
            contentContainerStyle={styles.aboutScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Exness Brand Emblem */}
            <View style={styles.aboutHero}>
              <View style={styles.aboutLogoBadge}>
                <Text style={styles.aboutLogoText}>ex</Text>
              </View>
              <Text style={styles.aboutAppTitle}>Exness Trade</Text>
              <View style={styles.aboutVersionBadge}>
                <View style={styles.greenPulseDot} />
                <Text style={styles.aboutVersionText}>Version 1.0.0 (Build 5702)</Text>
              </View>
              <Text style={styles.aboutTagline}>
                Born to trade · Instant withdrawals · 0% commission
              </Text>
            </View>

            {/* Concise Information Card */}
            <View style={styles.aboutCard}>
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Developer</Text>
                <Text style={styles.aboutValue}>Exness Global Limited</Text>
              </View>
              <View style={styles.aboutDivider} />

              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Trading Engine</Text>
                <Text style={styles.aboutValue}>MetaTrader 5 & Proprietary FIX API</Text>
              </View>
              <View style={styles.aboutDivider} />

              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Regulation</Text>
                <Text style={styles.aboutValue}>FSA (SD025) · CySEC · FCA</Text>
              </View>
              <View style={styles.aboutDivider} />

              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Server Status</Text>
                <View style={styles.serverStatusPill}>
                  <View style={styles.greenPulseDot} />
                  <Text style={styles.serverStatusPillText}>Operational (12ms)</Text>
                </View>
              </View>
            </View>

            {/* Quick Legal Links */}
            <View style={styles.aboutCard}>
              <TouchableOpacity
                style={styles.aboutLinkRow}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Terms of Business', 'Standard Exness Client Agreement and Business Terms apply to all live and demo trading accounts.')}
              >
                <Text style={styles.aboutLinkLabel}>Terms of Business</Text>
                <Ionicons name="chevron-forward" size={16} color="#8A92A6" />
              </TouchableOpacity>
              <View style={styles.aboutDivider} />

              <TouchableOpacity
                style={styles.aboutLinkRow}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Privacy Policy', 'Your personal data is encrypted with 256-bit AES encryption according to GDPR standard.')}
              >
                <Text style={styles.aboutLinkLabel}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={16} color="#8A92A6" />
              </TouchableOpacity>
              <View style={styles.aboutDivider} />

              <TouchableOpacity
                style={styles.aboutLinkRow}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Risk Disclosure', 'CFDs and leveraged financial instruments carry a high level of risk. Ensure you understand the mechanics before trading.')}
              >
                <Text style={styles.aboutLinkLabel}>Risk Disclosure</Text>
                <Ionicons name="chevron-forward" size={16} color="#8A92A6" />
              </TouchableOpacity>
            </View>

            {/* Copyright & Disclaimer Footer */}
            <View style={styles.aboutFooter}>
              <Text style={styles.aboutCopyrightText}>
                © 2008–2026 Exness. All rights reserved.
              </Text>
              <Text style={styles.aboutDisclaimerText}>
                Financial services provided by Exness Group. Trading contracts for difference (CFDs) carries a high risk to capital.
              </Text>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* LEGAL DOCUMENTS MODAL (1:1 MATCH TO SCREENSHOT) */}
      <LegalDocumentsModal
        visible={showLegalDocsModal}
        onClose={() => setShowLegalDocsModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#111624',
    fontSize: 26,
    fontWeight: '800',
  },
  settingsBtn: {
    padding: 4,
  },
  sectionBox: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#111624',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  atSymbolText: {
    color: '#111624',
    fontSize: 18,
    fontWeight: '700',
  },
  purpleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTextCol: {
    flex: 1,
  },
  rowMainText: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '600',
  },
  rowSubText: {
    color: '#6E7787',
    fontSize: 12,
    marginTop: 2,
  },
  rowSingleTitle: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '600',
  },
  eyeBtn: {
    padding: 6,
  },
  rowRightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notVerifiedPill: {
    backgroundColor: '#FDF0F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  notVerifiedText: {
    color: '#D9383A',
    fontSize: 11,
    fontWeight: '600',
  },
  qualifiedPill: {
    backgroundColor: '#E8F7F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qualifiedText: {
    color: '#00A868',
    fontSize: 11,
    fontWeight: '600',
  },
  extendedPill: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  extendedText: {
    color: '#6E7787',
    fontSize: 11,
    fontWeight: '600',
  },
  walletBalanceText: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '600',
  },
  referralText: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  bannerCard: {
    backgroundColor: '#FEFBF0',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FBEEC8',
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressAvatarBox: {
    width: 46,
    height: 46,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerAvatarIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerMessageText: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  bannerButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  learnMoreBtn: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  learnMoreText: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
  },
  completeBtn: {
    flex: 1,
    backgroundColor: '#FFDE00',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeText: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
  },
  showMoreBtn: {
    backgroundColor: '#F0F2F5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  showMoreBtnText: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutWrapper: {
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF1F1',
    paddingVertical: 14,
    borderRadius: 10,
  },
  logoutBtnText: {
    color: '#D9383A',
    fontSize: 14,
    fontWeight: '700',
  },

  /* ABOUT MODAL STYLES */
  aboutModalContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0F3',
  },
  aboutBackBtn: {
    padding: 4,
  },
  aboutHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111624',
  },
  aboutScrollView: {
    flex: 1,
  },
  aboutScrollContent: {
    padding: 16,
    gap: 16,
  },
  aboutHero: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  aboutLogoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#FFDE00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FFDE00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  aboutLogoText: {
    color: '#FFDE00',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1.5,
    marginTop: -3,
  },
  aboutAppTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111624',
    letterSpacing: -0.2,
  },
  aboutVersionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDF0F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00A868',
  },
  aboutVersionText: {
    fontSize: 12,
    color: '#4B5565',
    fontWeight: '600',
  },
  aboutTagline: {
    fontSize: 12,
    color: '#6E7787',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E8EBEF',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  aboutLabel: {
    fontSize: 14,
    color: '#6E7787',
    fontWeight: '400',
  },
  aboutValue: {
    fontSize: 13,
    color: '#111624',
    fontWeight: '600',
  },
  aboutDivider: {
    height: 1,
    backgroundColor: '#F0F2F5',
  },
  serverStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F7F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  serverStatusPillText: {
    fontSize: 12,
    color: '#00A868',
    fontWeight: '600',
  },
  aboutLinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  aboutLinkLabel: {
    fontSize: 14,
    color: '#111624',
    fontWeight: '500',
  },
  aboutFooter: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 6,
  },
  aboutCopyrightText: {
    fontSize: 12,
    color: '#8A92A6',
    fontWeight: '600',
  },
  aboutDisclaimerText: {
    fontSize: 11,
    color: '#9CA5B3',
    textAlign: 'center',
    lineHeight: 16,
  },
});
