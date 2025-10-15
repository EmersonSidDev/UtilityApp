// app/view/compromissoFormView.jsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Image, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import CompromissoService from "../services/compromissoService";
import ContatoService from "../services/contatoService";

export default function CompromissoFormView() {
  const { id, mode } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    descricao: "", data: "", horario: "", contatoId: ""
  });

  const [contatos, setContatos] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  // carrega contato e, se edição, o compromisso
  useEffect(() => {
    (async () => {
      try {
        const listaContatos = await ContatoService.buscarContatos();
        setContatos(listaContatos);

        if (!id || mode === "new") { setLoading(false); return; }
        const c = await (CompromissoService.buscaPorId?.(String(id)) ?? CompromissoService.buscarPorId?.(String(id)));
        if (!c) throw new Error("Compromisso não encontrado");
        setForm({
          descricao: c.descricao ?? "",
          data: c.data ?? "",
          horario: c.horario ?? "",
          contatoId: c.contatoId ?? "",
        });
      } catch (e) {
        console.error(e);
        Alert.alert("Erro", "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, mode]);

  const contatoSelecionado = contatos.find(ct => String(ct.id) === String(form.contatoId));

  const salvar = async () => {
    try {
      if (!form.descricao || !form.data || !form.horario || !form.contatoId) {
        Alert.alert("Atenção", "Informe descrição, data, horário e contato.");
        return;
      }
      if (mode === "new" || !id) {
        await CompromissoService.salvarCompromisso(form);
      } else {
        await CompromissoService.atualizarCompromisso(String(id), form);
      }
      Alert.alert("OK", "Compromisso salvo com sucesso!");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", e?.message ?? "Falha ao salvar o compromisso.");
    }
  };

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      {/* Cabeçalho com contato escolhido (se houver) */}
      {contatoSelecionado ? (
        <View style={styles.headerContato}>
          <Image source={{ uri: contatoSelecionado.avatar }} style={styles.headerAvatar} />
          <View>
            <Text style={styles.headerNome}>{contatoSelecionado.nome}</Text>
            <Text style={styles.headerSub}>{contatoSelecionado.telefone}</Text>
          </View>
        </View>
      ) : null}

      <Text style={styles.titulo}>{id ? `Editar compromisso #${id}` : "Novo compromisso"}</Text>

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
      />

      <TextInput
        style={styles.input}
        placeholder="Horário (HH:mm)"
        value={form.horario}
        onChangeText={(v) => setForm((f) => ({ ...f, horario: v }))}
      />

      {/* Seletor simples de contato (abre/fecha a listinha) */}
      <TouchableOpacity
        style={styles.select}
        onPress={() => setShowPicker((s) => !s)}
        activeOpacity={0.8}
      >
        <Text style={styles.selectText}>
          {contatoSelecionado ? `Contato: ${contatoSelecionado.nome}` : "Escolher contato"}
        </Text>
      </TouchableOpacity>

      {showPicker ? (
        <View style={styles.pickerBox}>
          <FlatList
            data={contatos}
            keyExtractor={(item, idx) => String(item?.id ?? `idx-${idx}`)}
            style={{ maxHeight: 240 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pickerItem}
                onPress={() => { setForm((f) => ({ ...f, contatoId: String(item.id) })); setShowPicker(false); }}
              >
                <Image source={{ uri: item.avatar }} style={styles.pickerAvatar} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ fontWeight: "bold" }}>{item.nome}</Text>
                  <Text style={{ color: "#666" }}>{item.telefone}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}

      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:"#F0F8FF" },
  titulo: { fontSize:22, fontWeight:"bold", marginBottom:12 },
  input: { backgroundColor:"#fff", borderRadius:8, padding:12, marginBottom:10, borderWidth:1, borderColor:"#ddd" },

  headerContato: { flexDirection:"row", alignItems:"center", gap:12, marginBottom:12 },
  headerAvatar: { width:48, height:48, borderRadius:24 },
  headerNome: { fontSize:16, fontWeight:"bold" },
  headerSub: { fontSize:12, color:"#666" },

  select: { backgroundColor:"#fff", borderRadius:8, padding:12, marginBottom:10, borderWidth:1, borderColor:"#ddd" },
  selectText: { color:"#333" },

  pickerBox: { backgroundColor:"#fff", borderWidth:1, borderColor:"#ddd", borderRadius:8, marginBottom:12 },
  pickerItem: { flexDirection:"row", alignItems:"center", padding:10, borderBottomWidth:1, borderBottomColor:"#eee" },
  pickerAvatar: { width:32, height:32, borderRadius:16 },
});
