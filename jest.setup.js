jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View').default;
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    LongPressGestureHandler: View,
    State: {},
    Directions: {},
    default: {},
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(async () => ({ didCancel: true })),
  launchImageLibrary: jest.fn(async () => ({ didCancel: true })),
}));

jest.mock('react-native-draggable-flatlist', () => {
  const React = require('react');
  const { FlatList } = require('react-native');

  return ({ data, renderItem, keyExtractor, refreshControl }) => (
    React.createElement(FlatList, {
      data,
      renderItem: ({ item, index }) => renderItem({ item, index, drag: jest.fn(), isActive: false }),
      keyExtractor,
      refreshControl,
    })
  );
});

jest.mock(
  '@react-native-community/netinfo',
  () => ({
    addEventListener: jest.fn(() => jest.fn()),
    fetch: jest.fn(async () => ({ isConnected: true, isInternetReachable: true })),
    default: {
      addEventListener: jest.fn(() => jest.fn()),
      fetch: jest.fn(async () => ({ isConnected: true, isInternetReachable: true })),
    },
  }),
  { virtual: true }
);
