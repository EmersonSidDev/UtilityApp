import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, RadioButton, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ConversorPesoService from '../services/conversorPesoService';

export default function ConversorPesoFormView() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [valor, setValor] = useState('');
    const [unidadeOrigem, setUnidadeOrigem] = useState('kg');
    const [unidadeDestino, setUnidadeDestino] = useState('g');
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) carregarExistente(id);
    }, [id]);

    async function carregarExistente(theId) {
        try {
            const item = await ConversorPesoService.buscarPorId(theId);
            if (item) {
                setValor(String(item.valor ?? ''));
                setUnidadeOrigem(item.unidadeOrigem);
                setUnidadeDestino(item.unidadeDestino);
                setResultado(item.resultado);
            } else {
                Toast.show({ type: 'error', text1: 'Item não encontrado' });
            }
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Erro ao carregar', text2: String(err?.message ?? err) });
        }
    }

    function toKg(v, from) {
        const n = Number(v);
        if (from === 'g') return n / 1000;
        if (from === 'lb') return n * 0.453592;
        if (from === 'oz') return n * 0.0283495;
        return n;
    }

    function fromKg(v, to) {
        if (to === 'g') return v * 1000;
        if (to === 'lb') return v / 0.453592;
        if (to === 'oz') return v / 0.0283495;
        return v;
    }

    function calcular() {
        try {
            const v = Number(valor);
            if (isNaN(v)) throw new Error('Valor inválido');
            if (unidadeOrigem === unidadeDestino) throw new Error('Unidades devem ser diferentes');
            const emKg = toKg(v, unidadeOrigem);
            const res = fromKg(emKg, unidadeDestino);
            setResultado(res);
            Toast.show({
                type: 'success',
                text1: 'Conversão realizada',
                text2: `${v} ${unidadeOrigem} → ${res.toFixed(2)} ${unidadeDestino}`,
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
            const res = calcular();
            if (res === null) throw new Error('Não foi possível calcular');
            const dto = {
                id: id ?? undefined,
                valor: Number(valor),
                unidadeOrigem,
                unidadeDestino,
                resultado: Number(res),
                data: new Date().toISOString().slice(0, 10),
            };
            if (id) await ConversorPesoService.atualizar(dto);
            else await ConversorPesoService.criar(dto);
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
                                {['kg', 'g', 'lb', 'oz'].map(u => (
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
                                {['kg', 'g', 'lb', 'oz'].map(u => (
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
                        Resultado: {resultado !== null ? `${resultado.toFixed(2)} ${unidadeDestino}` : '—'}
                    </Text>

                    <View style={styles.actions}>
                        <Button
                            mode="outlined"
                            onPress={() => router.push('/view/conversorPesoListView')}
                            style={styles.actionBtn}
                        >
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
