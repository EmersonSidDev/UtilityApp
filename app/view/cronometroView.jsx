import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";
import { cronometroService } from "../services/cronometroService";

export default function CronometroView() {
const [tempo, setTempo] = useState(0);
const [rodando, setRodando] = useState(false);

useEffect(() => {
return () => cronometroService.parar();
}, []);

const iniciar = () => {
setRodando(true);
cronometroService.iniciar(setTempo);
};

const parar = () => {
setRodando(false);
cronometroService.parar();
};

const resetar = () => {
setRodando(false);
cronometroService.resetar();
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
<View style={styles.container}>
<Card style={styles.card}>
<Card.Content style={styles.content}>
<Text style={styles.titulo}>Cronômetro</Text>
<Text style={styles.tempo}>{formatarTempo(tempo)}</Text>

      <View style={styles.row}>
        {rodando ? (
          <Button mode="contained" onPress={parar} style={styles.btn}>
            Parar
          </Button>
        ) : (
          <Button mode="contained" onPress={iniciar} style={styles.btn}>
            Iniciar
          </Button>
        )}

        <Button mode="outlined" onPress={resetar} style={styles.btn}>
          Resetar
        </Button>
      </View>

    </Card.Content>
  </Card>
</View>


);
}

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: "center",
alignItems: "center",
backgroundColor: "#F6F7FB",
padding: 20,
},
card: {
width: "100%",
maxWidth: 380,
borderRadius: 20,
elevation: 4,
backgroundColor: "#FFF",
},
content: {
alignItems: "center",
paddingVertical: 40,
},
titulo: {
fontSize: 24,
fontWeight: "700",
marginBottom: 8,
},
tempo: {
fontSize: 48,
fontWeight: "700",
marginBottom: 20,
},
row: {
flexDirection: "row",
gap: 12,
marginBottom: 12,
},
btn: {
marginHorizontal: 6,
borderRadius: 12,
},
voltar: {
marginTop: 8,
},
});