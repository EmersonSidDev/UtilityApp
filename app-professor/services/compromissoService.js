// app/services/compromissoService.js
import CompromissoEntity from "../entities/CompromissoEntity";

const compromissosEmMemoria = [
  // exemplos atrelando a contatos existentes (1 e 2)
  { id: "c1", descricao: "Reunião de kickoff", data: "2025-10-10", horario: "09:00", contatoId: "1" },
  { id: "c2", descricao: "Almoço de alinhamento", data: "2025-10-11", horario: "12:30", contatoId: "2" },
];

export default class CompromissoService {
  /** mapeia DTO -> entidade */
  static toEntity(d) { return CompromissoEntity.fromDto(d); }

  /** Listar todos */
  static async buscarCompromissos() {
    return compromissosEmMemoria.map((d) => this.toEntity(d));
  }

  /** Buscar por id (nome preferido) */
  static async buscaPorId(id) {
    if (id == null) return null;
    const d = compromissosEmMemoria.find(c => String(c.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  /** Alias de compatibilidade */
  static async buscarPorId(id) { return this.buscaPorId(id); }

  /** Criar (valida campos mínimos) */
  static async salvarCompromisso(dados) {
    const descricao = (dados?.descricao ?? "").trim();
    const data      = (dados?.data ?? "").trim();
    const horario   = (dados?.horario ?? "").trim();
    const contatoId = (dados?.contatoId ?? "").trim();

    if (!descricao || !data || !horario || !contatoId) {
      throw new Error("Descrição, data, horário e contato são obrigatórios.");
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const novo = { id, descricao, data, horario, contatoId };
    compromissosEmMemoria.push(novo);
    return { sucesso: true, compromisso: this.toEntity(novo) };
  }

  /** Atualizar */
  static async atualizarCompromisso(id, dados) {
    if (id == null) return { ok: false };
    const idx = compromissosEmMemoria.findIndex(c => String(c.id) === String(id));
    if (idx === -1) return { ok: false };

    const anterior  = compromissosEmMemoria[idx];
    const atualizado = {
      ...anterior,
      ...dados,
      id: anterior.id, // preserva id
    };
    compromissosEmMemoria[idx] = atualizado;
    return { ok: true, compromisso: this.toEntity(atualizado) };
  }

  /** Remover */
  static async removerCompromisso(id) {
    if (id == null) return false;
    const idx = compromissosEmMemoria.findIndex(c => String(c.id) === String(id));
    if (idx === -1) return false;
    compromissosEmMemoria.splice(idx, 1);
    return true;
  }
}
