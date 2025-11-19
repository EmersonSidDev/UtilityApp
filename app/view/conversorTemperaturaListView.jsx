// app/view/conversorTemperaturaListView.jsx
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import conversorTemperaturaService from '../services/conversorTemperaturaService';

export default function conversorTemperaturaListView() {
  const router = useRouter();
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const lista = await conversorTemperaturaService.listar();
      setDados(lista || []);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar', text2: String(err?.message ?? err) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // carrega na montagem
    carregar();
  }, []);

  async function removerItem(id) {
    try {
      const ok = await conversorTemperaturaService.remover(id);
      if (ok) {
        Toast.show({ type: 'success', text1: 'Removido com sucesso' });
        carregar();
      } else {
        Toast.show({ type: 'error', text1: 'Item não encontrado' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao remover', text2: String(err?.message ?? err) });
    }
  }

  function renderItem({ item }) {
    return (
      <Card style={styles.card}>
        <Card.Title title={`${item.valor} ${item.unidadeOrigem} → ${item.resultado} ${item.unidadeDestino}`} />
        <Card.Content>
          <Text>Data: {item.data}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() =>
              router.push({
                pathname: '/view/conversorTemperaturaFormView',
                params: { id: String(item.id) },
              })
            }
          >
            Editar
          </Button>
          <Button onPress={() => removerItem(item.id)} textColor="red">
            Remover
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        style={styles.btnAdd}
        onPress={() => router.push({ pathname: '/view/conversorTemperaturaFormView' })}
      >
        Nova Conversão
      </Button>

      <FlatList
        data={dados}
        keyExtractor={(item) => (item.key ? item.key : String(item.id))}
        renderItem={renderItem}
        onRefresh={carregar}
        refreshing={loading}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma conversão salva</Text>}
        contentContainerStyle={{ paddingBottom: 35 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  card: { marginBottom: 10 },
  btnAdd: { marginVertical: 10 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, opacity: 0.6 },
});
