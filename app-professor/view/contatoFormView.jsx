import React, { useEffect, useState } from "react";
import { Image,View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ContatoService from "../services/contatoService";

export default function ContatoFormView() {
  const { id } = useLocalSearchParams(); // vem como string
  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState({
    nome: "", telefone: "", email: "", categoria: "", sexo: "", favorito: false
  ,avatar:""});

  useEffect(() => {
    (async () => {
      try {
        const c = await ContatoService.buscarPorId(String(id));
        if (!c) throw new Error("Contato não encontrado");
        setForm({
          nome: c.nome ?? "",
          telefone: c.telefone ?? "",
          email: c.email ?? "",
          categoria: c.categoria ?? "",
          sexo: c.sexo ?? "",
          favorito: !!c.favorito,
          avatar: c.avatar??""
        });
      } catch (e) {
        console.error(e);
        Alert.alert("Erro", "Não foi possível carregar o contato.");
      } finally {
        setCarregando(false);
      }
    })();
  }, [id]);

const salvar = async () => {
  try {
    if (id) await ContatoService.atualizarContato(String(id), form);
    else await ContatoService.salvarContato(form);
    Alert.alert("OK", "Contato salvo com sucesso!");
    router.back();
  } catch (e) {
    console.error(e);
    Alert.alert("Erro", "Falha ao salvar o contato.");
  }
}
  if (carregando) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
        {/* Avatar no início, somente se houver */}
  {form?.avatar ? (
    <View style={styles.avatarWrap}>
      <Image source={{ uri: form.avatar }} style={styles.avatar} />
    </View>
  ) : null}

      <Text style={styles.titulo}>Editar contato #{id}</Text>

      <TextInput style={styles.input} placeholder="Nome" value={form.nome}
        onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))} />

      <TextInput style={styles.input} placeholder="Telefone" value={form.telefone}
        onChangeText={(v) => setForm((f) => ({ ...f, telefone: v }))} />

      <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" value={form.email}
        onChangeText={(v) => setForm((f) => ({ ...f, email: v }))} />

      <TextInput style={styles.input} placeholder="Categoria" value={form.categoria}
        onChangeText={(v) => setForm((f) => ({ ...f, categoria: v }))} />

      <TextInput style={styles.input} placeholder="Sexo" value={form.sexo}
        onChangeText={(v) => setForm((f) => ({ ...f, sexo: v }))} />

      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:"#F0F8FF" },
  titulo: { fontSize:22, fontWeight:"bold", marginBottom:12 },
  input: { backgroundColor:"#fff", borderRadius:8, padding:12, marginBottom:10, borderWidth:1, borderColor:"#ddd" },
  avatarWrap: {
  alignItems: "center",
  marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#ddd",
  },
});
