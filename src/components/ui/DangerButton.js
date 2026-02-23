import React from 'react';
import useTheme from '../../hooks/useTheme';
import BaseButton from './BaseButton';

export default function DangerButton(props) {
  const { theme } = useTheme();
  return <BaseButton {...props} palette={{ bg: theme.colors.danger, border: theme.colors.danger, text: '#FFFFFF' }} />;
}
