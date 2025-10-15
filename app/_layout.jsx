import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import BottomMenu from './components/bottomMenu';
import TopMenu from './components/topMenu';

export default function Layout() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <TopMenu />
        <Slot />
        <BottomMenu />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});
