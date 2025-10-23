import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Text, HelperText, Menu } from 'react-native-paper';

export default function ConversorTempo() {
  const [valor, setValor] = useState('');
  const [unidade, setUnidade] = useState('s');
  const [menuVisivel, setMenuVisivel] = useState(false);

  const segundos =
    unidade === 's' ? parseFloat(valor || 0) :
    unidade === 'm' ? parseFloat(valor || 0) * 60 :
    unidade === 'h' ? parseFloat(valor || 0) * 3600 : 0;

  const minutos = segundos / 60;
  const horas = segundos / 3600;

  const formatar = (n) => {
    if (!isFinite(n)) return '—';
    if (Math.abs(Math.round(n) - n) < 1e-12) return String(Math.round(n));
    return parseFloat(n.toFixed(6)).toString();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Conversor de Tempo" subtitle="Segundos / Minutos / Horas" />
        <Card.Content>
          <HelperText type="info">
            Digite um valor em segundos, minutos ou horas — o resultado aparecerá automaticamente nas três unidades.
          </HelperText>

          <View style={styles.row}>
            <TextInput
              label="Valor"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
              mode="outlined"
              style={{ flex: 1, marginRight: 8 }}
            />

            <Menu
              visible={menuVisivel}
              onDismiss={() => setMenuVisivel(false)}
              anchor={
                <Button mode="outlined" onPress={() => setMenuVisivel(true)}>
                  {unidade === 's' ? 'Segundos' : unidade === 'm' ? 'Minutos' : 'Horas'}
                </Button>
              }
            >
              <Menu.Item onPress={() => { setUnidade('s'); setMenuVisivel(false); }} title="Segundos (s)" />
              <Menu.Item onPress={() => { setUnidade('m'); setMenuVisivel(false); }} title="Minutos (min)" />
              <Menu.Item onPress={() => { setUnidade('h'); setMenuVisivel(false); }} title="Horas (h)" />
            </Menu>
          </View>

          <View style={styles.resultado}>
            <Text variant="labelSmall">Horas</Text>
            <Text variant="titleLarge">{formatar(horas)}</Text>
          </View>

          <View style={styles.resultado}>
            <Text variant="labelSmall">Minutos</Text>
            <Text variant="titleLarge">{formatar(minutos)}</Text>
          </View>

          <View style={styles.resultado}>
            <Text variant="labelSmall">Segundos</Text>
            <Text variant="titleLarge">{formatar(segundos)}</Text>
          </View>

          <HelperText type="info" style={{ marginTop: 8 }}>
            Aceita números decimais. Para limpar, apague o valor no campo.
          </HelperText>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  resultado: {
    marginTop: 12,
    backgroundColor: '#f0f3f8',
    borderRadius: 8,
    padding: 12,
  },
});
