// app/view/contatoListView.jsx
import { Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // já vem com Expo

import ContatoService from "../services/contatoService"; // <— IMPORT DEFAULT

export default function ContatoListView() {
  const [contatos, setContatos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregarContatos(); }, []);

  const carregarContatos = async () => {
    setCarregando(true);
    try {
      // 👇 usando o método no OBJETO
      const lista = await ContatoService.buscarContatos();
      setContatos(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
<View style={styles.container}>
  <FlatList
    data={contatos}
    keyExtractor={(item, i) => String(item?.id ?? `idx-${i}`)}
    contentContainerStyle={styles.lista}
    renderItem={({ item, index }) => (
      <TouchableOpacity 
                  onPress={() =>
              router.push({ pathname: "/view/contatoFormView", params: { id: String(item.id) } })
            }
          style={[styles.card, styles.cardRow, { backgroundColor: index % 2 ? "#FCE4EC" : "#E0F7FA" }]}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text><Text style={styles.label}>Nome: </Text>{item.nome}</Text>
          <Text><Text style={styles.label}>Telefone: </Text>{item.telefone}</Text>
          <Text><Text style={styles.label}>E-mail: </Text>{item.email}</Text>
          <Text><Text style={styles.label}>Categoria: </Text>{item.categoria}</Text>
          <Text><Text style={styles.label}>Sexo: </Text>{item.sexo}</Text>
          <Text><Text style={styles.label}>Favorito: </Text>{item.favorito ? "⭐ Sim" : "Não"}</Text>
        </View>
      </TouchableOpacity>
    )}
  />

  {/* FAB flutuante, fora da FlatList */}
  <TouchableOpacity style={styles.fab} onPress={() => router.push({ pathname: "/view/contatoFormView", params: { mode: "new" } })}>
    <MaterialIcons name="add" size={28} color="#fff" />
  </TouchableOpacity>
</View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2", paddingHorizontal: 10, paddingTop: 10, paddingBottom: 70 },
  lista: { justifyContent: "center", gap: 10 },

  // card agora é uma linha
  card: {
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 10,
    padding: 12,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // imagem à esquerda
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },

  // infos à direita
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontWeight: "bold",
  },
  line: {
    fontSize: 14,
    color: "#333",
  },

  // seu FAB permanece igual
  fab: {
    position: "absolute",
    right: 50,
    bottom: 100,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6200ee",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
});
