import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export type TabType = 'accounts' | 'trade' | 'insights' | 'performance' | 'profile';

interface BottomTabsProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  currentTab,
  onTabChange,
}) => {
  // 4-squares grid icon for Accounts
  const renderGridIcon = (isActive: boolean) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7.5" height="7.5" rx="1.5" stroke={isActive ? '#111624' : '#9CA5B3'} strokeWidth="2.2" />
      <Rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" stroke={isActive ? '#111624' : '#9CA5B3'} strokeWidth="2.2" />
      <Rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" stroke={isActive ? '#111624' : '#9CA5B3'} strokeWidth="2.2" />
      <Rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke={isActive ? '#111624' : '#9CA5B3'} strokeWidth="2.2" />
    </Svg>
  );

  // Sliders icon for Trade
  const renderSlidersIcon = (isActive: boolean) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M7 3V21" stroke={isActive ? '#111624' : '#9CA5B3'} strokeWidth="2.2" strokeLinecap="round" />
      <Rect x="4.5" y="8" width="5" height="5" rx="1.2" fill={isActive ? '#111624' : '#9CA5B3'} />
      <Path d="M17 3V21" stroke={isActive ? '#111624' : '#9CA5B3'} strokeWidth="2.2" strokeLinecap="round" />
      <Rect x="14.5" y="13" width="5" height="5" rx="1.2" fill={isActive ? '#111624' : '#9CA5B3'} />
    </Svg>
  );

  // Globe icon for Insights
  const renderGlobeIcon = (isActive: boolean) => (
    <Ionicons
      name="globe-outline"
      size={22}
      color={isActive ? '#111624' : '#9CA5B3'}
    />
  );

  // Performance bar chart icon
  const renderPerformanceIcon = (isActive: boolean) => (
    <Ionicons
      name="stats-chart-outline"
      size={21}
      color={isActive ? '#111624' : '#9CA5B3'}
    />
  );

  // Profile icon
  const renderProfileIcon = (isActive: boolean) => (
    <Ionicons
      name="person-circle-outline"
      size={23}
      color={isActive ? '#111624' : '#9CA5B3'}
    />
  );

  const tabs: { key: TabType; label: string; renderIcon: (isActive: boolean) => React.ReactNode }[] = [
    {
      key: 'accounts',
      label: 'Accounts',
      renderIcon: renderGridIcon,
    },
    {
      key: 'trade',
      label: 'Trade',
      renderIcon: renderSlidersIcon,
    },
    {
      key: 'insights',
      label: 'Insights',
      renderIcon: renderGlobeIcon,
    },
    {
      key: 'performance',
      label: 'Performance',
      renderIcon: renderPerformanceIcon,
    },
    {
      key: 'profile',
      label: 'Profile',
      renderIcon: renderProfileIcon,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <View style={styles.iconBox}>{tab.renderIcon(isActive)}</View>
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? '#111624' : '#9CA5B3' },
                isActive && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EBEF',
    paddingTop: 8,
    paddingBottom: 22,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  activeTabLabel: {
    fontWeight: '700',
    color: '#111624',
  },
});
