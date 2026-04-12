import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';
import { mockContacts, mockNotes, mockReminders } from '../data/mockData';

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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

interface Props {
  route: any;
  navigation: any;
}

export default function ContactDetailScreen({ route, navigation }: Props) {
  const { contactId } = route.params;
  const contact = mockContacts.find((c) => c.id === contactId);
  const notes = mockNotes.filter((n) => n.contactId === contactId);
  const reminders = mockReminders.filter((r) => r.contactId === contactId);

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>Contacto no encontrado</Text>
      </View>
    );
  }

  const hue = contact.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={[styles.avatarLarge, { backgroundColor: `hsl(${hue}, 60%, 70%)` }]}>
          <Text style={styles.avatarLargeText}>{getInitials(contact.name)}</Text>
        </View>
        <Text style={styles.name}>{contact.name}</Text>
        {contact.company && (
          <Text style={styles.subtitle}>
            {contact.position ? `${contact.position} · ` : ''}
            {contact.company}
          </Text>
        )}
        {contact.tags && (
          <View style={styles.tagsRow}>
            {contact.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: TAG_COLORS[tag]?.bg || colors.border }]}>
                <Text style={[styles.tagText, { color: TAG_COLORS[tag]?.text || colors.textSecondary }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.quickActions}>
        {contact.phone && (
          <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
            <Ionicons name="call" size={22} color={colors.primary} />
            <Text style={styles.actionLabel}>Llamar</Text>
          </TouchableOpacity>
        )}
        {contact.email && (
          <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`mailto:${contact.email}`)}>
            <Ionicons name="mail" size={22} color={colors.primary} />
            <Text style={styles.actionLabel}>Email</Text>
          </TouchableOpacity>
        )}
        {contact.phone && (
          <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`https://wa.me/${contact.phone?.replace(/\D/g, '')}`)}>
            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            <Text style={styles.actionLabel}>WhatsApp</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información personal</Text>
        <View style={styles.card}>
          {contact.birthday && (
            <InfoRow icon="gift" label="Cumpleaños" value={formatDate(contact.birthday)} />
          )}
          {contact.interests && contact.interests.length > 0 && (
            <InfoRow icon="heart" label="Intereses" value={contact.interests.join(', ')} />
          )}
          {contact.aspirations && (
            <InfoRow icon="rocket" label="Aspiraciones" value={contact.aspirations} />
          )}
        </View>
      </View>

      {/* Contexto */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contexto de la relación</Text>
        <View style={styles.card}>
          {contact.howWeMet && (
            <InfoRow icon="people" label="Cómo nos conocimos" value={contact.howWeMet} />
          )}
          {contact.sharedMemories && (
            <InfoRow icon="sparkles" label="Recuerdos" value={contact.sharedMemories} />
          )}
        </View>
      </View>

      {/* Notas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notas</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {notes.length === 0 ? (
          <Text style={styles.emptyText}>Sin notas aún</Text>
        ) : (
          notes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <Text style={styles.noteContent}>{note.content}</Text>
              <Text style={styles.noteDate}>{formatShortDate(note.createdAt)}</Text>
            </View>
          ))
        )}
      </View>

      {/* Recordatorios */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recordatorios</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {reminders.length === 0 ? (
          <Text style={styles.emptyText}>Sin recordatorios</Text>
        ) : (
          reminders.map((reminder) => (
            <View key={reminder.id} style={[styles.reminderCard, reminder.completed && styles.reminderCompleted]}>
              <TouchableOpacity style={styles.checkbox}>
                <Ionicons
                  name={reminder.completed ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={reminder.completed ? colors.success : colors.textLight}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={[styles.reminderTitle, reminder.completed && styles.reminderTitleDone]}>
                  {reminder.title}
                </Text>
                <Text style={styles.reminderDate}>
                  {formatShortDate(reminder.dueDate)}
                  {reminder.isRecurring && ' · Recurrente'}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon as any} size={18} color={colors.primary} style={styles.infoIcon} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarLargeText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    ...typography.h1,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tagText: {
    ...typography.small,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  infoIcon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.small,
    color: colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    ...typography.body,
  },
  emptyText: {
    ...typography.caption,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  noteCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteContent: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  noteDate: {
    ...typography.small,
    color: colors.textLight,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: spacing.sm,
  },
  reminderTitle: {
    ...typography.body,
    fontWeight: '500',
  },
  reminderTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  reminderDate: {
    ...typography.small,
    color: colors.textLight,
    marginTop: 2,
  },
});
