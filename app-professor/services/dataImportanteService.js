// app/services/dataImportanteService.js
import DataImportanteEntity from "../entities/DataImportanteEntity";

const mem = [
  { id: "d1", descricao: "Início do semestre", data: "2025-02-10" },
  { id: "d2", descricao: "Prova 1",            data: "2025-03-15" },
  { id: "d3", descricao: "Entrega do projeto",  data: "2025-06-20" },
];

export default class DataImportanteService {
  /** DTO -> Entity */
  static toEntity(d) {
    return DataImportanteEntity.fromDto(d) ?? new DataImportanteEntity(d.id, d.descricao, d.data);
  }

  /** Lista todas (em memória) */
  static async buscarTodos() {
    return mem.map((d) => this.toEntity(d));
  }

  /** Buscar por ID (padrão novo) */
  static async buscaPorId(id) {
    if (id == null) return null;
    const d = mem.find((x) => String(x.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  /** Alias de compatibilidade */
  static async buscarPorId(id) {
    return this.buscaPorId(id);
  }

  /** Validações simples */
  static validar(dto) {
    const erros = [];
    if (!dto.descricao || !dto.descricao.trim()) erros.push("Descrição é obrigatória.");
    if (!dto.data || !/^\d{4}-\d{2}-\d{2}$/.test(dto.data)) erros.push("Data é obrigatória no formato YYYY-MM-DD.");
    return erros;
  }

  /** Criar */
  static async salvarDataImportante(dados) {
    const erros = this.validar(dados);
    if (erros.length) throw new Error(erros.join("\n"));

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const novo = {
      id,
      descricao: dados.descricao ?? "",
      data: dados.data ?? "",
    };
    mem.push(novo);
    return { sucesso: true, dataImportante: this.toEntity(novo) };
  }

  /** Atualizar */
  static async atualizarDataImportante(id, dados) {
    const idx = mem.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) return { ok: false };

    const merged = { ...mem[idx], ...dados, id: mem[idx].id };
    const erros = this.validar(merged);
    if (erros.length) throw new Error(erros.join("\n"));

    mem[idx] = merged;
    return { ok: true, dataImportante: this.toEntity(merged) };
  }

  /** Remover */
  static async removerDataImportante(id) {
    const idx = mem.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) return false;
    mem.splice(idx, 1);
    return true;
  }
}
