import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';
import { mockReminders, mockContacts } from '../data/mockData';
import { Reminder } from '../types';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getContactName(contactId: string): string {
  return mockContacts.find((c) => c.id === contactId)?.name || 'Desconocido';
}

interface Props {
  navigation: any;
}

export default function RemindersScreen({ navigation }: Props) {
  const [showCompleted, setShowCompleted] = useState(false);

  const pending = mockReminders.filter((r) => !r.completed);
  const completed = mockReminders.filter((r) => r.completed);

  const sortedPending = [...pending].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const sections = [
    { title: 'Pendientes', data: sortedPending },
    ...(showCompleted ? [{ title: 'Completados', data: completed }] : []),
  ];

  const renderReminder = ({ item }: { item: Reminder }) => (
    <TouchableOpacity
      style={[styles.card, item.completed && styles.cardCompleted]}
      onPress={() => navigation.navigate('Contactos', { screen: 'ContactDetail', params: { contactId: item.contactId } })}
      activeOpacity={0.7}
    >
      <TouchableOpacity style={styles.checkbox}>
        <Ionicons
          name={item.completed ? 'checkbox' : 'square-outline'}
          size={24}
          color={item.completed ? colors.success : colors.primary}
        />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, item.completed && styles.cardTitleDone]}>
          {item.title}
        </Text>
        <View style={styles.cardMeta}>
          <Ionicons name="person" size={14} color={colors.textLight} />
          <Text style={styles.metaText}>{getContactName(item.contactId)}</Text>
          <Ionicons name="calendar" size={14} color={colors.textLight} style={{ marginLeft: spacing.sm }} />
          <Text style={styles.metaText}>{formatDate(item.dueDate)}</Text>
        </View>
        {item.isRecurring && (
          <View style={styles.recurringBadge}>
            <Ionicons name="repeat" size={12} color={colors.primaryDark} />
            <Text style={styles.recurringText}>Recurrente</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recordatorios</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderReminder}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.toggleCompleted}
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <Ionicons
              name={showCompleted ? 'eye-off' : 'eye'}
              size={18}
              color={colors.primary}
            />
            <Text style={styles.toggleText}>
              {showCompleted ? 'Ocultar completados' : `Ver completados (${completed.length})`}
            </Text>
          </TouchableOpacity>
        }
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
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  cardTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.small,
    color: colors.textLight,
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
    backgroundColor: colors.tag.work,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  recurringText: {
    ...typography.small,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  toggleCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  toggleText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
});
