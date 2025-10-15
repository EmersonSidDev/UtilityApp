// components/BottomMenu.jsx
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

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
    backgroundColor: '#fff',
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
