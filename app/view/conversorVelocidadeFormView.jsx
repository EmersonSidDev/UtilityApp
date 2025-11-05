// app/view/conversorVelocidadeFormView.jsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, RadioButton, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ConversorVelocidadeService from '../services/ConversorVelocidadeService';

export default function ConversorVelocidadeFormView() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  
  const [valor, setValor] = useState('');
  const [unidadeOrigem, setUnidadeOrigem] = useState('m/s');
  const [unidadeDestino, setUnidadeDestino] = useState('km/h');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) carregarExistente(id);
  }, [id]);

  async function carregarExistente(theId) {
    try {
      const item = await ConversorVelocidadeService.buscarPorId(theId);
      if (item) {
        setValor(String(item.valor ?? ''));
        setUnidadeOrigem(item.unidadeOrigem ?? 'm/s');
        setUnidadeDestino(item.unidadeDestino ?? 'km/h');
        setResultado(item.resultado ?? null);
      } else {
        Toast.show({ type: 'error', text1: 'Item não encontrado' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar', text2: String(err?.message ?? err) });
    }
  }

  async function calcular() {
  try {
    const entity = new (await import('../entities/ConversaoVelocidadeEntity')).default({
      valor,
      unidadeOrigem,
      unidadeDestino,
    });

    const res = await ConversorVelocidadeService.calcular(entity);
    setResultado(res);
    Toast.show({
      type: 'success',
      text1: 'Conversão realizada',
      text2: `${entity.valor} ${entity.unidadeOrigem} → ${res.toFixed(2)} ${entity.unidadeDestino}`,
    });
    return res;
  } catch (err) {
    Toast.show({ type: 'error', text1: 'Erro', text2: String(err.message || err) });
    setResultado(null);
    return null;
  }
}


  async function salvar() {
  setLoading(true);
  try {
    const res = await calcular(); 

    if (res === null) throw new Error('Não foi possível calcular');

    const dto = {
      id: id ?? undefined,
      valor: Number(valor),
      unidadeOrigem,
      unidadeDestino,
      resultado: Number(res),
      data: new Date().toISOString().slice(0, 10),
    };

    const { conversao } = id
      ? await ConversorVelocidadeService.atualizar(dto)
      : await ConversorVelocidadeService.criar(dto);

    console.log('Salvo:', conversao);

    Toast.show({ type: 'success', text1: 'Salvo com sucesso!' });

    router.push('/view/conversorVelocidadeListView');
  } catch (err) {
    Toast.show({ type: 'error', text1: 'Erro ao salvar', text2: String(err?.message ?? err) });
  } finally {
    setLoading(false);
  }
}


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Title title={id ? 'Editar Conversão' : 'Nova Conversão'} />
        <Card.Content>
          <TextInput
            label="Valor"
            value={valor}
            keyboardType="numeric"
            onChangeText={setValor}
            style={styles.input}
          />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Origem</Text>
              <RadioButton.Group onValueChange={setUnidadeOrigem} value={unidadeOrigem}>
                {['m/s', 'km/h', 'mph'].map(u => (
                  <View style={styles.radioRow} key={u}>
                    <RadioButton value={u} />
                    <Text>{u}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Destino</Text>
              <RadioButton.Group onValueChange={setUnidadeDestino} value={unidadeDestino}>
                {['m/s', 'km/h', 'mph'].map(u => (
                  <View style={styles.radioRow} key={u}>
                    <RadioButton value={u} />
                    <Text>{u}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </View>
          </View>

          <Button mode="contained" onPress={calcular} style={styles.btn}>Calcular</Button>

          <Text style={styles.resultado}>
            Resultado: {resultado !== null ? `${resultado.toFixed(2)} ${unidadeDestino}` : '—'}
          </Text>

          <View style={styles.actions}>
            <Button mode="outlined" onPress={() => router.push('/view/conversorVelocidadeListView')} style={styles.actionBtn}>Cancelar</Button>
            <Button mode="contained" onPress={salvar} loading={loading} style={styles.actionBtn}>
              Salvar
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 12, backgroundColor: '#fff' },
  input: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { flex: 1, padding: 8 },
  label: { fontWeight: '600', marginBottom: 4 },
  radioRow: { flexDirection: 'row', alignItems: 'center' },
  btn: { marginTop: 12 },
  resultado: { textAlign: 'center', marginVertical: 16, fontSize: 16, fontWeight: 'bold' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 1, marginHorizontal: 6 },
});
