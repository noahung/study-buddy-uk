import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import StudyBuddyApp from '../src/StudyBuddyApp';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StudyBuddyApp />
      <StatusBar style="auto" />
    </View>
  );
}
