// app/view/tarefaListView.jsx
import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import TarefaService from "../services/TarefaService";
import { TAREFA_STATUS } from "../entities/TarefaEntity";

const statusLabel = (s) => {
  switch (s) {
    case TAREFA_STATUS.ABERTO: return "Aberto";
    case TAREFA_STATUS.EM_ANDAMENTO: return "Em andamento";
    case TAREFA_STATUS.CONCLUIDO: return "Concluído";
    default: return s;
  }
};
const statusColor = (s) => {
  switch (s) {
    case TAREFA_STATUS.ABERTO: return "#FF9800";        // laranja
    case TAREFA_STATUS.EM_ANDAMENTO: return "#0288D1";  // azul
    case TAREFA_STATUS.CONCLUIDO: return "#2E7D32";     // verde
    default: return "#757575";
  }
};

export default function TarefaListView() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregar(); }, []);
  const carregar = async () => {
    setCarregando(true);
    try {
      const lista = await TarefaService.buscarTodos();
      setTarefas(Array.isArray(lista) ? lista : []);
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
        data={tarefas}
        keyExtractor={(item, idx) => String(item?.id ?? `idx-${idx}`)}
        contentContainerStyle={styles.lista}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.card,
              styles.cardRow,
              { backgroundColor: index % 2 ? "#FCE4EC" : "#E0F7FA" },
            ]}
            onPress={() => router.push({ pathname: "/view/TarefaFormView", params: { id: String(item.id) } })}
          >
            {/* “Avatar” com ícone e cor pelo status */}
            <View style={[styles.avatar, { backgroundColor: statusColor(item.status) }]}>
              <MaterialIcons name="task-alt" size={24} color="#fff" />
            </View>

            <View style={styles.info}>
              <Text style={styles.line}>
                <Text style={styles.label}>Descrição: </Text>{item.descricao}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>Início: </Text>{item.dataInicio || "-"}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>Fim: </Text>{item.dataFim || "-"}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>Status: </Text>{statusLabel(item.status)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* FAB Novo */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: "/view/TarefaFormView", params: { mode: "new" } })}
        accessibilityRole="button"
        accessibilityLabel="Adicionar tarefa"
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
    position: "absolute", right: 50, bottom: 100, width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#6200ee", alignItems: "center", justifyContent: "center", elevation: 6, zIndex: 50,
  },
});
