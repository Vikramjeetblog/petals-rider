import { useAppStore } from '../store/AppStore';

export default function useTheme() {
  const { theme, state, dispatch } = useAppStore();

  const setThemeMode = (mode) => {
    dispatch({ type: 'SET_THEME_MODE', payload: mode });
  };

  return {
    theme,
    themeMode: state.themeMode,
    setThemeMode,
  };
}
