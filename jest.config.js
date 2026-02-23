module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-reanimated|react-native-gesture-handler|react-native-vector-icons|react-native-worklets|react-native-draggable-flatlist)/)',
  ],
};
