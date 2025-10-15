// app/view/tarefaFormView.jsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import TarefaService from "../services/TarefaService";
import { TAREFA_STATUS } from "../entities/TarefaEntity";

const STATUS_LIST = [
  { value: TAREFA_STATUS.ABERTO, label: "Aberto" },
  { value: TAREFA_STATUS.EM_ANDAMENTO, label: "Em andamento" },
  { value: TAREFA_STATUS.CONCLUIDO, label: "Concluído" },
];

export default function TarefaFormView() {
  const { id, mode } = useLocalSearchParams();
  const isNovo = mode === "new" || !id;

  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState({
    descricao: "",
    dataInicio: "",
    dataFim: "",
    status: TAREFA_STATUS.ABERTO,
  });

  useEffect(() => {
    (async () => {
      try {
        if (isNovo) { setCarregando(false); return; }
        const ent = await (TarefaService.buscaPorId?.(String(id)) ?? TarefaService.buscarPorId?.(String(id)));
        if (!ent) throw new Error("Tarefa não encontrada");
        setForm({
          descricao: ent.descricao ?? "",
          dataInicio: ent.dataInicio ?? "",
          dataFim: ent.dataFim ?? "",
          status: ent.status ?? TAREFA_STATUS.ABERTO,
        });
      } catch (e) {
        console.error(e);
        Alert.alert("Erro", "Não foi possível carregar a tarefa.");
      } finally {
        setCarregando(false);
      }
    })();
  }, [id, mode]);

  const salvar = async () => {
    try {
      // validação rápida no form (o service também valida)
      if (!form.descricao.trim()) return Alert.alert("Atenção", "Descrição é obrigatória.");
      if (!form.dataInicio) return Alert.alert("Atenção", "Data de início é obrigatória.");
      if (form.dataInicio && form.dataFim && form.dataFim < form.dataInicio) {
        return Alert.alert("Atenção", "Data de fim não pode ser anterior à data de início.");
      }

      if (isNovo) await TarefaService.salvarTarefa(form);
      else await TarefaService.atualizarTarefa(String(id), form);

      Alert.alert("OK", "Tarefa salva com sucesso!");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", e?.message ?? "Falha ao salvar a tarefa.");
    }
  };

  if (carregando) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{isNovo ? "Nova tarefa" : `Editar tarefa #${id}`}</Text>

      <TextInput
        style={styles.input}
        placeholder="Descrição da tarefa"
        value={form.descricao}
        onChangeText={(v) => setForm((f) => ({ ...f, descricao: v }))}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Data de início (YYYY-MM-DD)"
        value={form.dataInicio}
        onChangeText={(v) => setForm((f) => ({ ...f, dataInicio: v }))}
        inputMode="numeric"
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="Data de fim (YYYY-MM-DD)"
        value={form.dataFim}
        onChangeText={(v) => setForm((f) => ({ ...f, dataFim: v }))}
        inputMode="numeric"
        maxLength={10}
      />

      <Text style={styles.subtitulo}>Status</Text>
      <View style={styles.statusRow}>
        {STATUS_LIST.map((opt) => {
          const selected = form.status === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => setForm((f) => ({ ...f, status: opt.value }))}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F0F8FF" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  subtitulo: { fontSize: 16, fontWeight: "bold", marginTop: 8, marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  statusRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chipSelected: { backgroundColor: "#6200ee", borderColor: "#6200ee" },
  chipText: { color: "#333" },
  chipTextSelected: { color: "#fff", fontWeight: "600" },
});
