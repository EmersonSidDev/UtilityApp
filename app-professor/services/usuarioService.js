// app/services/usuarioService.js
import UsuarioEntity from "../entities/UsuarioEntity";

const mem = [
  {
    id: "u1",
    nome: "Alice Souza",
    login: "alice",
    senha: "alice@123",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "u2",
    nome: "Bruno Lima",
    login: "bruno",
    senha: "bruno@123",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "u3",
    nome: "Carla Dias",
    login: "carla",
    senha: "carla@123",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

export default class UsuarioService {
  /** DTO -> Entity */
  static toEntity(d) {
    return UsuarioEntity.fromDto(d) ?? new UsuarioEntity(d.id, d.nome, d.login, d.senha, d.avatar);
  }

  /** Listar todos */
  static async buscarTodos() {
    return mem.map((d) => this.toEntity(d));
  }

  /** Buscar por id (nome padrão novo) */
  static async buscaPorId(id) {
    if (id == null) return null;
    const d = mem.find((x) => String(x.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  /** Alias de compatibilidade */
  static async buscarPorId(id) {
    return this.buscaPorId(id);
  }

  /** Regras básicas (didático) */
  static validar(dto, { isUpdate = false, currentId = null } = {}) {
    const erros = [];
    if (!dto.nome || !dto.nome.trim()) erros.push("Nome é obrigatório.");
    if (!dto.login || !dto.login.trim()) erros.push("Login é obrigatório.");

    // Em criação, senha é obrigatória. Em edição, só valida se enviada (não obrigatória).
    if (!isUpdate) {
      if (!dto.senha || !dto.senha.trim()) erros.push("Senha é obrigatória na criação.");
    } else if (dto.senha != null && dto.senha.trim() === "") {
      // se veio string vazia explicitamente, considere inválida
      erros.push("Senha não pode ser vazia.");
    }

    // login único
    const duplicado = mem.find(
      (u) => u.login?.toLowerCase() === dto.login?.toLowerCase() && String(u.id) !== String(currentId ?? "")
    );
    if (duplicado) erros.push("Login já existe. Escolha outro.");

    return erros;
  }

  /** Criar usuário */
  static async salvarUsuario(dados) {
    const erros = this.validar(dados, { isUpdate: false });
    if (erros.length) throw new Error(erros.join("\n"));

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const novo = {
      id,
      nome: dados.nome ?? "",
      login: dados.login ?? "",
      senha: dados.senha ?? "",
      avatar: dados.avatar ?? `https://i.pravatar.cc/150?u=${dados.login || id}`,
    };
    mem.push(novo);
    return { sucesso: true, usuario: this.toEntity(novo) };
  }

  /** Atualizar usuário */
  static async atualizarUsuario(id, dados) {
    const idx = mem.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) return { ok: false };

    // Se senha vier vazia/undefined, mantenha a antiga
    const merged = {
      ...mem[idx],
      ...dados,
      id: mem[idx].id, // preserva id
    };
    if (!dados?.senha) merged.senha = mem[idx].senha;

    const erros = this.validar(merged, { isUpdate: true, currentId: id });
    if (erros.length) throw new Error(erros.join("\n"));

    mem[idx] = merged;
    return { ok: true, usuario: this.toEntity(merged) };
  }

  /** Remover */
  static async removerUsuario(id) {
    const idx = mem.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) return false;
    mem.splice(idx, 1);
    return true;
  }
}
