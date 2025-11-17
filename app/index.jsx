// app/index.jsx
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';

export default function Index() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2983/2983789.png',
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Utility App</Text>
          <Text style={styles.subtitle}>
            O aplicativo para o seu dia a dia.
          </Text>
          <Text style={styles.description}>
            Conversões rápidas, cálculos úteis e ferramentas práticas — tudo em
            um só lugar.
          </Text>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() =>
              router.push('/view/conversorVelocidadeListView')
            }
          >
            🚀 Conversor de Velocidade
          </Button>

          <Button
            mode="contained"
            style={[styles.button, styles.weightButton]}
            onPress={() => router.push('/view/conversorPesoListView')}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            ⚖️ Conversor de Peso
          </Button>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() =>
              router.push('/view/conversorMedidaListView')
            }
          >
            📏 Conversor de Medida
          </Button>
          
          <Button
            mode="contained"
            style={[styles.button]}
            onPress={() =>
              router.push('/view/conversorTempoListView')
            }
          >
            ⏳ Conversor de Tempo
          </Button>

          <Button
            mode="contained"
            style={[styles.button, styles.weightButton]}
            onPress={() => router.push('/view/cronometroFormView')}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Cronômetro
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    fontSize: 15,
    color: '#666',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 4,
    width: '100%',
  },
});
