import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';
import { mockContacts, mockFollowUps } from '../data/mockData';
import { FollowUp } from '../types';

const FOLLOW_UP_ICONS: Record<FollowUp['icon'], { name: keyof typeof Ionicons.glyphMap; bg: string }> = {
  note: { name: 'document-text', bg: colors.tertiary },
  coffee: { name: 'cafe', bg: colors.tertiary },
  forward: { name: 'arrow-redo', bg: colors.tertiary },
  gift: { name: 'gift', bg: colors.tertiary },
  call: { name: 'call', bg: colors.tertiary },
};

function getTimeAgo(dateStr?: string): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  if (weeks < 1) return 'This week';
  if (weeks === 1) return '1w ago';
  return `${weeks}w ago`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardScreen() {
  const [followUps, setFollowUps] = useState(mockFollowUps);
  const priorityContacts = mockContacts.filter((c) => c.isFavorite);
  const totalCircles = mockContacts.length;
  const dueToday = 12;
  const pulseRate = 84;

  const toggleFollowUp = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, completed: !f.completed } : f))
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kinship Ledger</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="search" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JT</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Relationship Pulse title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Relationship Pulse</Text>
          <View style={styles.pulseDot} />
        </View>

        {/* Network Health Card */}
        <View style={styles.healthCard}>
          <Text style={styles.healthLabel}>NETWORK HEALTH</Text>
          <Text style={styles.healthStatus}>Thriving</Text>
          <View style={styles.healthStats}>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatNumber}>{totalCircles}</Text>
              <Text style={styles.healthStatLabel}>TOTAL{'\n'}CIRCLES</Text>
            </View>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatNumber}>{dueToday}</Text>
              <Text style={styles.healthStatLabel}>DUE{'\n'}TODAY</Text>
            </View>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatNumber}>{pulseRate}%</Text>
              <Text style={styles.healthStatLabel}>PULSE RATE</Text>
            </View>
          </View>
        </View>

        {/* Gifting Window */}
        <View style={styles.giftingCard}>
          <Ionicons name="gift" size={28} color={colors.primary} />
          <Text style={styles.giftingTitle}>Gifting Window</Text>
          <Text style={styles.giftingText}>
            3 key anniversaries are approaching in the next fortnight.
          </Text>
          <TouchableOpacity style={styles.giftingBtn}>
            <Text style={styles.giftingBtnText}>View Events</Text>
          </TouchableOpacity>
        </View>

        {/* Priority Contacts */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Priority Contacts</Text>
            <Text style={styles.sectionSubtitle}>
              Deepen these connections this week
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All &gt;</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={priorityContacts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contactsList}
          renderItem={({ item }) => (
            <View style={styles.contactCard}>
              <View style={styles.contactAvatarWrap}>
                {item.photoUrl ? (
                  <Image
                    source={{ uri: item.photoUrl }}
                    style={styles.contactAvatar}
                  />
                ) : (
                  <View style={styles.contactAvatarFallback}>
                    <Text style={styles.contactAvatarText}>
                      {getInitials(item.name)}
                    </Text>
                  </View>
                )}
                {item.isFavorite && (
                  <View style={styles.starBadge}>
                    <Ionicons name="star" size={10} color={colors.surface} />
                  </View>
                )}
              </View>
              <Text style={styles.contactName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.contactMet}>
                Last met {getTimeAgo(item.lastMet)}
              </Text>
              <View style={styles.contactActions}>
                <TouchableOpacity style={styles.contactActionBtn}>
                  <Ionicons name="cafe-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactActionBtn}>
                  <Ionicons name="mail-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Upcoming Follow-ups */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>
          Upcoming Follow-ups
        </Text>

        {followUps.map((item) => {
          const iconConfig = FOLLOW_UP_ICONS[item.icon];
          return (
            <View
              key={item.id}
              style={[styles.followUpCard, item.completed && styles.followUpDone]}
            >
              <View
                style={[styles.followUpIcon, { backgroundColor: iconConfig.bg }]}
              >
                <Ionicons
                  name={iconConfig.name}
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={styles.followUpContent}>
                <Text
                  style={[
                    styles.followUpTitle,
                    item.completed && styles.followUpTitleDone,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.followUpDesc}>{item.description}</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFollowUp(item.id)}
                style={[
                  styles.followUpCheck,
                  item.completed && styles.followUpCheckDone,
                ]}
              >
                {item.completed && (
                  <Ionicons name="checkmark" size={16} color={colors.surface} />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color={colors.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '600',
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.primary,
  },
  sectionSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary,
    marginTop: 8,
    marginLeft: 6,
  },

  // Network Health
  healthCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  healthLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: colors.tertiary,
    marginBottom: spacing.xs,
  },
  healthStatus: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: spacing.lg,
  },
  healthStats: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  healthStat: {},
  healthStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.tertiary,
  },
  healthStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.textLight,
    marginTop: 2,
  },

  // Gifting Window
  giftingCard: {
    backgroundColor: colors.tertiary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  giftingTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.sm,
  },
  giftingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  giftingBtn: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
  },
  giftingBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },

  // Priority Contacts
  contactsList: {
    gap: spacing.md,
  },
  contactCard: {
    width: 150,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  contactAvatarWrap: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  contactAvatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  starBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  contactMet: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  contactActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Follow-ups
  followUpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  followUpDone: {
    opacity: 0.5,
  },
  followUpIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  followUpContent: {
    flex: 1,
  },
  followUpTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  followUpTitleDone: {
    textDecorationLine: 'line-through',
  },
  followUpDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  followUpCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  followUpCheckDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
