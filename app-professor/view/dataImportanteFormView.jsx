// app/view/dataImportanteFormView.jsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import DataImportanteService from "../services/dataImportanteService";

export default function DataImportanteFormView() {
  const { id, mode } = useLocalSearchParams();
  const isNovo = mode === "new" || !id;

  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState({
    descricao: "",
    data: "", // "YYYY-MM-DD"
  });

  useEffect(() => {
    (async () => {
      try {
        if (isNovo) { setCarregando(false); return; }
        const ent = await (DataImportanteService.buscaPorId?.(String(id)) ?? DataImportanteService.buscarPorId?.(String(id)));
        if (!ent) throw new Error("Registro não encontrado");
        setForm({
          descricao: ent.descricao ?? "",
          data: ent.data ?? "",
        });
      } catch (e) {
        console.error(e);
        Alert.alert("Erro", "Não foi possível carregar a data importante.");
      } finally {
        setCarregando(false);
      }
    })();
  }, [id, mode]);

  const salvar = async () => {
    try {
      // validação rápida (o service também valida)
      if (!form.descricao.trim()) return Alert.alert("Atenção", "Descrição é obrigatória.");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(form.data)) return Alert.alert("Atenção", "Data no formato YYYY-MM-DD.");

      if (isNovo) await DataImportanteService.salvarDataImportante(form);
      else await DataImportanteService.atualizarDataImportante(String(id), form);

      Alert.alert("OK", "Registro salvo com sucesso!");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", e?.message ?? "Falha ao salvar.");
    }
  };

  if (carregando) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{isNovo ? "Nova data importante" : `Editar #${id}`}</Text>

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={form.descricao}
        onChangeText={(v) => setForm((f) => ({ ...f, descricao: v }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Data (YYYY-MM-DD)"
        value={form.data}
        onChangeText={(v) => setForm((f) => ({ ...f, data: v }))}
        inputMode="numeric"
        maxLength={10}
      />

      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F0F8FF" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
