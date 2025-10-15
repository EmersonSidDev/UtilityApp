// app/view/usuarioFormView.jsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import UsuarioService from "../services/usuarioService";

export default function UsuarioFormView() {
  const { id, mode } = useLocalSearchParams();
  const isNovo = mode === "new" || !id;

  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState({
    nome: "",
    login: "",
    senha: "",
    avatar: "",
  });

  useEffect(() => {
    (async () => {
      try {
        if (isNovo) { setCarregando(false); return; }
        const ent = await (UsuarioService.buscaPorId?.(String(id)) ?? UsuarioService.buscarPorId?.(String(id)));
        if (!ent) throw new Error("Usuário não encontrado");
        setForm({
          nome: ent.nome ?? "",
          login: ent.login ?? "",
          senha: "", // por segurança, não preenche senha existente
          avatar: ent.avatar ?? "",
        });
      } catch (e) {
        console.error(e);
        Alert.alert("Erro", "Não foi possível carregar o usuário.");
      } finally {
        setCarregando(false);
      }
    })();
  }, [id, mode]);

  const salvar = async () => {
    try {
      // validação rápida (o service também valida)
      if (!form.nome.trim()) return Alert.alert("Atenção", "Nome é obrigatório.");
      if (!form.login.trim()) return Alert.alert("Atenção", "Login é obrigatório.");
      if (isNovo && !form.senha.trim()) return Alert.alert("Atenção", "Senha é obrigatória na criação.");

      if (isNovo) {
        await UsuarioService.salvarUsuario(form);
      } else {
        // se senha estiver vazia, não manda (para manter a antiga)
        const payload = {
          nome: form.nome,
          login: form.login,
          avatar: form.avatar,
          ...(form.senha?.trim() ? { senha: form.senha } : {}),
        };
        await UsuarioService.atualizarUsuario(String(id), payload);
      }

      Alert.alert("OK", "Usuário salvo com sucesso!");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", e?.message ?? "Falha ao salvar o usuário.");
    }
  };

  if (carregando) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  const fotoUri = form.avatar || (form.login ? `https://i.pravatar.cc/150?u=${form.login}` : "");

  return (
    <View style={styles.container}>
      {/* Avatar no topo (se houver) */}
      {fotoUri ? (
        <View style={styles.avatarWrap}>
          <Image source={{ uri: fotoUri }} style={styles.avatar} />
        </View>
      ) : null}

      <Text style={styles.titulo}>{isNovo ? "Novo usuário" : `Editar usuário #${id}`}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={form.nome}
        onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Login"
        autoCapitalize="none"
        value={form.login}
        onChangeText={(v) => setForm((f) => ({ ...f, login: v }))}
      />

      <TextInput
        style={styles.input}
        placeholder={isNovo ? "Senha" : "Senha (deixe em branco para manter)"}
        secureTextEntry
        value={form.senha}
        onChangeText={(v) => setForm((f) => ({ ...f, senha: v }))}
      />

      <TextInput
        style={styles.input}
        placeholder="URL do Avatar (opcional)"
        autoCapitalize="none"
        value={form.avatar}
        onChangeText={(v) => setForm((f) => ({ ...f, avatar: v }))}
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
  avatarWrap: { alignItems: "center", marginBottom: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: "#ddd" },
});
