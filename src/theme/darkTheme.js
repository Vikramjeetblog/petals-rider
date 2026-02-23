import spacing from '../constants/spacing';
import typography from '../constants/typography';
import shadows from '../constants/shadows';

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#22C55E',
    primaryDark: '#16A34A',
    background: '#0B1220',
    card: '#111827',
    border: '#1F2937',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    success: '#22C55E',
    successSoft: '#14532D',
    warning: '#FB923C',
    danger: '#F87171',
    muted: '#6B7280',
    info: '#60A5FA',
  },
  spacing,
  typography,
  shadows,
  radius: {
    card: 16,
    button: 16,
    pill: 999,
  },
};

export default darkTheme;
