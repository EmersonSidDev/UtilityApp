// app/view/compromissoListView.jsx
import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import CompromissoService from "../services/compromissoService";
import ContatoService from "../services/contatoService";

export default function CompromissoListView() {
  const [itens, setItens] = useState([]);
  const [contatosMap, setContatosMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try {
      const [compromissos, contatos] = await Promise.all([
        CompromissoService.buscarCompromissos(),
        ContatoService.buscarContatos(),
      ]);
      const map = Object.fromEntries(
        contatos.map(c => [String(c.id), { nome: c.nome, avatar: c.avatar }])
      );
      setContatosMap(map);
      setItens(Array.isArray(compromissos) ? compromissos : []);
    } catch (e) {
      console.error("Erro ao carregar compromissos:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        renderItem={({ item, index }) => {
          const contato = contatosMap[String(item.contatoId)] ?? {};
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.card, styles.cardRow, { backgroundColor: index % 2 ? "#FCE4EC" : "#E0F7FA" }]}
              onPress={() => router.push({ pathname: "/view/compromissoFormView", params: { id: String(item.id) } })}
            >
              <Image
                source={{ uri: contato.avatar || `https://i.pravatar.cc/150?u=${item.contatoId || "na"}` }}
                style={styles.avatar}
              />
              <View style={styles.info}>
                <Text style={styles.line}><Text style={styles.label}>Descrição: </Text>{item.descricao}</Text>
                <Text style={styles.line}><Text style={styles.label}>Data: </Text>{item.data}</Text>
                <Text style={styles.line}><Text style={styles.label}>Horário: </Text>{item.horario}</Text>
                <Text style={styles.line}><Text style={styles.label}>Contato: </Text>{contato.nome || item.contatoId}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* FAB Novo */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: "/view/compromissoFormView", params: { mode: "new" } })}
        accessibilityRole="button"
        accessibilityLabel="Adicionar compromisso"
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#F2F2F2", paddingHorizontal:10, paddingTop:10, paddingBottom:80 },
  lista: { gap: 10, paddingBottom: 16 },
  card: { backgroundColor:"#fff", margin:5, borderRadius:10, padding:12, elevation:2 },
  cardRow: { flexDirection:"row", alignItems:"center" },
  avatar: { width:64, height:64, borderRadius:32, marginRight:12 },
  info: { flex:1, gap:4 },
  label: { fontWeight:"bold" },
  line: { fontSize:14, color:"#333" },
  fab: {
    position:"absolute", right:50, bottom:100, width:100, height:100, borderRadius:50,
    backgroundColor:"#6200ee", alignItems:"center", justifyContent:"center", elevation:6, zIndex:50,
    ...(Platform.OS === "web" ? { boxShadow: "0 6px 16px rgba(0,0,0,0.3)" } : {}),
  },
});
