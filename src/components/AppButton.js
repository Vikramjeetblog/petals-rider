import React from 'react';
import PrimaryButton from './ui/PrimaryButton';
import SecondaryButton from './ui/SecondaryButton';
import DangerButton from './ui/DangerButton';

export default function AppButton({ variant = 'primary', ...props }) {
  if (variant === 'secondary') return <SecondaryButton {...props} />;
  if (variant === 'danger') return <DangerButton {...props} />;
  return <PrimaryButton {...props} />;
}
