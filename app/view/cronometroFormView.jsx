import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import cronometroService from "../services/cronometroService";

export default function CronometroFormView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nome, setNome] = useState("");
  const [tempo, setTempo] = useState(0); // segundos
  const [rodando, setRodando] = useState(false);
  const [loading, setLoading] = useState(false);

  const intervaloRef = useRef(null);

  useEffect(() => {
    if (id) carregarExistente(id);
    return () => parar(); // limpa intervalo ao sair
  }, [id]);

  async function carregarExistente(theId) {
    try {
      const item = await cronometroService.buscarPorId(theId);
      if (item) {
        setNome(item.nome ?? "");
        setTempo(item.tempo ?? 0);
      } else {
        Toast.show({ type: "error", text1: "Item não encontrado" });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro ao carregar",
        text2: String(err?.message ?? err),
      });
    }
  }

  function iniciar() {
    if (rodando) return;
    setRodando(true);
    intervaloRef.current = setInterval(() => {
      setTempo((t) => t + 1);
    }, 1000);
  }

  function parar() {
    setRodando(false);
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  }

  function zerar() {
    parar();
    setTempo(0);
  }

  async function salvar() {
    setLoading(true);
    try {
      const dto = {
        id: id ?? undefined,
        nome,
        tempo,
        data: new Date().toISOString().slice(0, 10),
      };
      if (id) await cronometroService.atualizar(dto);
      else await cronometroService.criar(dto);
      Toast.show({ type: "success", text1: "Cronômetro salvo com sucesso!" });
      router.back();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro ao salvar",
        text2: String(err?.message ?? err),
      });
    } finally {
      setLoading(false);
    }
  }

  function formatarTempo(segundos) {
    const h = Math.floor(segundos / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((segundos % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (segundos % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Title title={id ? "Editar Cronômetro" : "Novo Cronômetro"} />
        <Card.Content>
          <TextInput
            label="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />

          <Text style={styles.tempo}>{formatarTempo(tempo)}</Text>

          <View style={styles.row}>
            <Button
              mode="contained"
              onPress={iniciar}
              disabled={rodando}
              style={styles.btn}
            >
              Iniciar
            </Button>
            <Button
              mode="outlined"
              onPress={parar}
              disabled={!rodando}
              style={styles.btn}
            >
              Pausar
            </Button>
            <Button mode="text" onPress={zerar} style={styles.btn}>
              Zerar
            </Button>
          </View>

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
  container: { flexGrow: 1, padding: 12, backgroundColor: "#fff" },
  input: { marginBottom: 12 },
  tempo: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  btn: { flex: 1, marginHorizontal: 4 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  actionBtn: { flex: 1, marginHorizontal: 6 },
});
