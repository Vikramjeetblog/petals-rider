import React from 'react';
import useTheme from '../../hooks/useTheme';
import BaseButton from './BaseButton';

export default function PrimaryButton(props) {
  const { theme } = useTheme();
  return <BaseButton {...props} palette={{ bg: theme.colors.primary, border: theme.colors.primary, text: '#FFFFFF' }} />;
}
