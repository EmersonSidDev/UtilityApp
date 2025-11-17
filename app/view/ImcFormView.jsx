import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ImcService from '../services/ImcService';

export default function ImcFormView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) carregarExistente(id);
  }, [id]);

  async function carregarExistente(theId) {
    try {
      const item = await ImcService.buscarPorId(theId);
      if (item) {
        setPeso(String(item.peso ?? ''));
        setAltura(String(item.altura ?? ''));
        setImc(item.imc ?? null);
      } else {
        Toast.show({ type: 'error', text1: 'Item não encontrado' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar', text2: String(err?.message ?? err) });
    }
  }

  function calcular() {
    try {
      const p = Number(peso);
      const a = Number(altura);

      if (isNaN(p) || isNaN(a)) throw new Error('Peso e altura devem ser numéricos');
      if (p <= 0) throw new Error('Peso deve ser maior que zero');
      if (a <= 0) throw new Error('Altura deve ser maior que zero');

      const resultado = p / (a * a);
      setImc(resultado);

      Toast.show({
        type: 'success',
        text1: 'IMC calculado',
        text2: `IMC: ${resultado.toFixed(2)}`
      });

      return resultado;
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro', text2: String(err.message || err) });
      setImc(null);
      return null;
    }
  }

  async function salvar() {
    setLoading(true);
    try {
      const res = calcular();
      if (res === null) throw new Error('Não foi possível calcular o IMC');

      const dto = {
        id: id ?? undefined,
        peso: Number(peso),
        altura: Number(altura),
        imc: Number(res),
        data: new Date().toISOString().slice(0, 10),
      };

      if (id) {
        await ImcService.atualizar(dto);
      } else {
        await ImcService.criar(dto);
      }

      Toast.show({ type: 'success', text1: 'Salvo com sucesso!' });
      router.back();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao salvar', text2: String(err?.message ?? err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Title title={id ? 'Editar IMC' : 'Novo IMC'} />
        <Card.Content>
          <TextInput
            label="Peso (kg)"
            value={peso}
            keyboardType="numeric"
            onChangeText={setPeso}
            style={styles.input}
          />

          <TextInput
            label="Altura (m)"
            value={altura}
            keyboardType="numeric"
            onChangeText={setAltura}
            style={styles.input}
          />

          <Button mode="contained" onPress={calcular} style={styles.btn}>
            Calcular
          </Button>

          <Text style={styles.resultado}>
            IMC: {imc !== null ? imc.toFixed(2) : '—'}
          </Text>

          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.actionBtn}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={salvar}
              loading={loading}
              style={styles.actionBtn}
            >
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
  btn: { marginTop: 12 },
  resultado: { textAlign: 'center', marginVertical: 16, fontSize: 16, fontWeight: 'bold' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 1, marginHorizontal: 6 },
});
