import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';
import { mockNotes, mockContacts } from '../data/mockData';
import { Note } from '../types';

function getContactName(contactId: string): string {
  return mockContacts.find((c) => c.id === contactId)?.name || 'Desconocido';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
}

function groupNotesByContact(notes: Note[]): { title: string; contactId: string; data: Note[] }[] {
  const grouped: Record<string, Note[]> = {};
  notes.forEach((note) => {
    if (!grouped[note.contactId]) grouped[note.contactId] = [];
    grouped[note.contactId].push(note);
  });

  return Object.entries(grouped).map(([contactId, data]) => ({
    title: getContactName(contactId),
    contactId,
    data: data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  }));
}

interface Props {
  navigation: any;
}

export default function NotesScreen({ navigation }: Props) {
  const sections = groupNotesByContact(mockNotes);

  const renderNote = ({ item }: { item: Note }) => (
    <View style={styles.noteCard}>
      <Text style={styles.noteContent}>{item.content}</Text>
      <Text style={styles.noteDate}>{formatDate(item.createdAt)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notas</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        renderSectionHeader={({ section }) => (
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() =>
              navigation.navigate('Contactos', {
                screen: 'ContactDetail',
                params: { contactId: (section as any).contactId },
              })
            }
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No hay notas aún</Text>
            <Text style={styles.emptySubtext}>Tus notas rápidas aparecerán acá</Text>
          </View>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
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
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  noteDate: {
    ...typography.small,
    color: colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  emptySubtext: {
    ...typography.caption,
  },
});
