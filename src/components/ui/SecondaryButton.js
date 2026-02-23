import React from 'react';
import useTheme from '../../hooks/useTheme';
import BaseButton from './BaseButton';

export default function SecondaryButton(props) {
  const { theme } = useTheme();
  return <BaseButton {...props} palette={{ bg: theme.colors.card, border: theme.colors.border, text: theme.colors.textPrimary }} />;
}
