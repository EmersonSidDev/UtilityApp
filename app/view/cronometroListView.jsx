import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function CronometroListView() {
  const router = useRouter();
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem("@historicoCronometro");
      setDados(data ? JSON.parse(data) : []);
    } catch (err) {
      Toast.show({ type: "error", text1: "Erro ao carregar", text2: String(err) });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const remover = async (id) => {
    try {
      const atualizado = dados.filter((d) => d.id !== id);
      await AsyncStorage.setItem("@historicoCronometro", JSON.stringify(atualizado));
      setDados(atualizado);
      Toast.show({ type: "success", text1: "Removido com sucesso" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Erro ao remover", text2: String(err) });
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={`Duração: ${item.duracao}`} />
      <Card.Content>
        <Text>Início: {item.inicio}</Text>
        <Text>Fim: {item.fim}</Text>
      </Card.Content>
      <Card.Actions>
        <IconButton icon="delete" iconColor="#d11a2a" onPress={() => remover(item.id)} />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        style={styles.btnAdd}
        onPress={() => router.push("/view/cronometroFormView")}
      >
        Novo Cronômetro
      </Button>

      <FlatList
        data={dados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={carregar}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum histórico salvo</Text>}
        contentContainerStyle={{ paddingBottom: 35 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  card: { marginBottom: 10 },
  btnAdd: { marginVertical: 10 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16, opacity: 0.6 },
});
