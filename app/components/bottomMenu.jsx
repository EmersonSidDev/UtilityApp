
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function BottomMenu() {
  const router = useRouter();

  return (
    <View style={styles.menu}>
      <Pressable onPress={() => router.push('/')}>
        <Text style={styles.menuText}>🏠 Início</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    width: '100%',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0
  },
  menuText: {
    fontSize: 16,
    color: '#007AFF'
  }
});