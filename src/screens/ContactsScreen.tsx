import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';
import { mockContacts } from '../data/mockData';
import { Contact } from '../types';

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  trabajo: { bg: colors.tag.work, text: colors.tag.workText },
  personal: { bg: colors.tag.personal, text: colors.tag.personalText },
  networking: { bg: colors.tag.networking, text: colors.tag.networkingText },
  familia: { bg: colors.tag.family, text: colors.tag.familyText },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({ name, photoUrl, size = 48 }: { name: string; photoUrl?: string; size?: number }) {
  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} />;
  }
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <View style={[styles.avatarPlaceholder, { width: size, height: size, borderRadius: size / 2, backgroundColor: `hsl(${hue}, 60%, 70%)` }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{getInitials(name)}</Text>
    </View>
  );
}

interface Props {
  navigation: any;
}

export default function ContactsScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');

  const filtered = mockContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => navigation.navigate('ContactDetail', { contactId: item.id })}
      activeOpacity={0.7}
    >
      <Avatar name={item.name} photoUrl={item.photoUrl} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.company && (
          <Text style={styles.contactCompany}>
            {item.position ? `${item.position} · ` : ''}
            {item.company}
          </Text>
        )}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {item.tags.map((tag) => (
              <View
                key={tag}
                style={[styles.tag, { backgroundColor: TAG_COLORS[tag]?.bg || colors.border }]}
              >
                <Text style={[styles.tagText, { color: TAG_COLORS[tag]?.text || colors.textSecondary }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contactos</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar contacto, empresa o etiqueta..."
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.count}>{filtered.length} contactos</Text>

      <FlatList
        data={filtered}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    padding: 0,
  },
  count: {
    ...typography.caption,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    marginRight: spacing.md,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...typography.h3,
    marginBottom: 2,
  },
  contactCompany: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  tagText: {
    ...typography.small,
    fontWeight: '500',
  },
});
