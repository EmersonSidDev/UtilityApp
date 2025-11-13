import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function CronometroFormView() {
  const router = useRouter();
  const [tempo, setTempo] = useState(0);
  const [rodando, setRodando] = useState(false);
  const inicioRef = useRef(null);
  const intervaloRef = useRef(null);

  const iniciarOuParar = () => {
    if (!rodando) {
      setRodando(true);
      inicioRef.current = new Date();
      const inicio = Date.now() - tempo;
      intervaloRef.current = setInterval(() => {
        setTempo(Date.now() - inicio);
      }, 10);
    } else {
      setRodando(false);
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  };

  const salvarLog = async () => {
    if (!inicioRef.current || tempo === 0) {
      Toast.show({
        type: "info",
        text1: "Nada para salvar",
        text2: "Inicie e pare o cronômetro antes de salvar.",
      });
      return;
    }

    const fim = new Date();
    const novoLog = {
      id: Date.now(),
      inicio: inicioRef.current.toLocaleTimeString(),
      fim: fim.toLocaleTimeString(),
      duracao: formatarTempo(tempo),
    };

    try {
      const data = await AsyncStorage.getItem("@historicoCronometro");
      const historico = data ? JSON.parse(data) : [];
      const atualizado = [novoLog, ...historico];
      await AsyncStorage.setItem("@historicoCronometro", JSON.stringify(atualizado));

      Toast.show({
        type: "success",
        text1: "Sessão salva",
        text2: `Duração: ${novoLog.duracao}`,
      });

      resetar();
      router.push("/view/cronometroListView");
    } catch (err) {
      Toast.show({ type: "error", text1: "Erro ao salvar", text2: String(err) });
    }
  };

  const resetar = () => {
    parar();
    setTempo(0);
  };

  const parar = () => {
    setRodando(false);
    clearInterval(intervaloRef.current);
    intervaloRef.current = null;
  };

  const formatarTempo = (ms) => {
    const totalCentis = Math.floor(ms / 10);
    const centis = totalCentis % 100;
    const totalSeconds = Math.floor(totalCentis / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    const pad = (n, z = 2) => ("00" + n).slice(-z);
    return `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Text style={styles.titulo}>Cronômetro</Text>
          <Text style={styles.tempo}>{formatarTempo(tempo)}</Text>

          <View style={styles.row}>
            <Button
              mode="contained"
              icon={rodando ? "stop" : "play"}
              onPress={iniciarOuParar}
              style={[styles.btnMain, rodando ? styles.btnStop : styles.btnStart]}
            >
              {rodando ? "Stop" : "Start"}
            </Button>

            <Button
              mode="outlined"
              icon="content-save"
              onPress={salvarLog}
              style={styles.btnMain}
            >
              Salvar
            </Button>
          </View>

          <Button
            mode="text"
            onPress={() => router.push("/view/cronometroListView")}
          >
            Ver histórico
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F6F7FB", padding: 20 },
  card: { width: "100%", maxWidth: 380, borderRadius: 20, elevation: 4, backgroundColor: "#FFF" },
  content: { alignItems: "center", paddingVertical: 40 },
  titulo: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  tempo: { fontSize: 48, fontWeight: "700", marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 16 },
  btnMain: { flex: 1, marginHorizontal: 6, borderRadius: 12 },
  btnStart: { backgroundColor: "#6d44ff" },
  btnStop: { backgroundColor: "#d11a2a" },
});
