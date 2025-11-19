import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, FAB, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { formatNumber, tempoDecimals } from '../config/format';
import ConversorTempoService from '../services/ConversorTempoService';


// Tela de listagem das conversões de tempo realizadas
export default function ConversorTempoListView() {
  const [lista, setLista] = useState([]);
  const router = useRouter();

  async function carregar() {
    try {
      const dados = await ConversorTempoService.listar();
      setLista(dados);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar', text2: String(err?.message ?? err) });
    }
  }
// Recarregar a lista sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );
// Excluir uma conversão da lista
  async function excluir(id) {
    try {
      await ConversorTempoService.remover(id);
      Toast.show({ type: 'success', text1: 'Item removido com sucesso' });
      carregar();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao excluir', text2: String(err?.message ?? err) });
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={`${item.valor} ${item.unidadeOrigem} → ${formatNumber(item.resultado, tempoDecimals)} ${item.unidadeDestino}`} />
            <Card.Content>
              <Text>Data: {item.data}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => router.push(`/view/conversorTempoFormView?id=${item.id}`)}>Editar</Button>
              <Button onPress={() => excluir(item.id)} textColor="red">Excluir</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma conversão registrada.</Text>}
        contentContainerStyle={{ paddingBottom: 35 }}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/view/conversorTempoFormView')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  card: { marginBottom: 12 },
  vazio: { textAlign: 'center', marginTop: 40, color: '#888' },
  fab: { position:'absolute', right: 16, bottom: 52, backgroundColor: '#7d25f0ff' },
});
