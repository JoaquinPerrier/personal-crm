export const colors = {
  primary: '#0D1B3E',
  primaryLight: '#1a2d5a',
  secondary: '#C5A059',
  secondaryLight: '#d4b577',
  tertiary: '#E5D1A2',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F0F1F3',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  tag: {
    work: '#DBEAFE',
    workText: '#1D4ED8',
    personal: '#FEE2E2',
    personalText: '#DC2626',
    networking: '#D1FAE5',
    networkingText: '#059669',
    family: '#FEF3C7',
    familyText: '#D97706',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: colors.text,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textLight,
  },
};
