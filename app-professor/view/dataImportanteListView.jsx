// app/view/dataImportanteListView.jsx
import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import DataImportanteService from "../services/dataImportanteService";

export default function DataImportanteListView() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregar(); }, []);
  const carregar = async () => {
    setCarregando(true);
    try {
      const lista = await DataImportanteService.buscarTodos();
      setItens(Array.isArray(lista) ? lista : []);
    } catch (e) {
      console.error(e);
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
        data={itens}
        keyExtractor={(item, idx) => String(item?.id ?? `idx-${idx}`)}
        contentContainerStyle={styles.lista}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.card, styles.cardRow, { backgroundColor: index % 2 ? "#FCE4EC" : "#E0F7FA" }]}
            onPress={() => router.push({ pathname: "/view/dataImportanteFormView", params: { id: String(item.id) } })}
          >
            {/* “Avatar” à esquerda: ícone de calendário */}
            <View style={[styles.avatar, { backgroundColor: "#1976D2" }]}>
              <MaterialIcons name="event" size={24} color="#fff" />
            </View>

            {/* Infos à direita com labels em negrito */}
            <View style={styles.info}>
              <Text style={styles.line}>
                <Text style={styles.label}>Descrição: </Text>{item.descricao}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>Data: </Text>{item.data}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* FAB Novo */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: "/view/dataImportanteFormView", params: { mode: "new" } })}
        accessibilityRole="button"
        accessibilityLabel="Adicionar data importante"
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2", paddingHorizontal: 10, paddingTop: 10, paddingBottom: 80 },
  lista: { gap: 10, paddingBottom: 16 },
  card: { backgroundColor: "#fff", margin: 5, borderRadius: 10, padding: 12, elevation: 2 },
  cardRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 48, height: 48, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
    marginRight: 12,
  },
  info: { flex: 1, gap: 4 },
  label: { fontWeight: "bold" },
  line: { fontSize: 14, color: "#333" },
  fab: {
    position: "absolute", right: 50, bottom: 100, width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#6200ee", alignItems: "center", justifyContent: "center", elevation: 6, zIndex: 50,
    ...(Platform.OS === "web" ? { boxShadow: "0 6px 16px rgba(0,0,0,0.3)" } : {}),
  },
});
