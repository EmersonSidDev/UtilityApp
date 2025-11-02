import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, RadioButton, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ConversorTempoService from '../services/ConversorTempoService';
import { tempoDecimals, formatNumber } from '../config/format';

export default function ConversorTempoFormView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
// Estados para os campos do formulário
  const [valor, setValor] = useState('');
  const [unidadeOrigem, setUnidadeOrigem] = useState('s');
  const [unidadeDestino, setUnidadeDestino] = useState('m');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) carregarExistente(id);
  }, [id]);
// Carregar dados existentes para edição
  async function carregarExistente(theId) {
    try {
      const item = await ConversorTempoService.buscarPorId(theId);
      if (item) {
        setValor(String(item.valor ?? ''));
        setUnidadeOrigem(item.unidadeOrigem ?? 's');
        setUnidadeDestino(item.unidadeDestino ?? 'm');
        setResultado(item.resultado ?? null);
      } else {
        Toast.show({ type: 'error', text1: 'Item não encontrado' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar', text2: String(err?.message ?? err) });
    }
  }
// Calcular a conversão de tempo
  async function calcular() {
    try {
      const entity = new (await import('../entities/ConversorTempoEntity')).default({
        valor,
        unidadeOrigem,
        unidadeDestino,
      });

      const res = await ConversorTempoService.calcular(entity);
      setResultado(res);
      Toast.show({
        type: 'success',
        text1: 'Conversão realizada',
        text2: `${entity.valor} ${entity.unidadeOrigem} → ${formatNumber(res, tempoDecimals)} ${entity.unidadeDestino}`,
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
        ? await ConversorTempoService.atualizar(dto)
        : await ConversorTempoService.criar(dto);

      Toast.show({ type: 'success', text1: 'Salvo com sucesso!' });
      router.push('/view/conversorTempoListView');
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao salvar', text2: String(err?.message ?? err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Title title={id ? 'Editar Conversão de Tempo' : 'Nova Conversão de Tempo'} />
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
                {['s', 'm', 'h'].map(u => (
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
                {['s', 'm', 'h'].map(u => (
                  <View style={styles.radioRow} key={u}>
                    <RadioButton value={u} />
                    <Text>{u}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </View>
          </View>

          <Button mode="contained" onPress={calcular} style={styles.btn}>
            Calcular
          </Button>
          
          <Text style={styles.resultado}>
            
            Resultado: {resultado !== null ? `${formatNumber(resultado, tempoDecimals)} ${unidadeDestino}` : '—'}
          </Text>

          <View style={styles.actions}>
            <Button mode="outlined" onPress={() => router.push('/view/conversorTempoListView')} style={styles.actionBtn}>
              Cancelar
            </Button>
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
