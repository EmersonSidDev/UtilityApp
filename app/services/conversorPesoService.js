import ConversaoPesoEntity from "../entities/ConversaoPesoEntity";

const STORAGE_KEY = "conversoes_peso";

export default class ConversorPesoService {
  static toEntity(d) {
    return ConversaoPesoEntity.fromDto(d);
  }

  static _load() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  static _save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  static async listar() {
    const mem = this._load();
    return mem.map(this.toEntity);
  }

  static async buscarPorId(id) {
    const mem = this._load();
    const d = mem.find(x => String(x.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  static validar(dto) {
    const erros = [];
    if (!dto.valor || Number.isNaN(Number(dto.valor))) erros.push("Valor deve ser um número válido");
    if (Number(dto.valor) < 0) erros.push("Valor não pode ser negativo");
    if (!dto.unidadeOrigem) erros.push("Unidade de origem é obrigatória");
    if (!dto.unidadeDestino) erros.push("Unidade de destino é obrigatória");
    if (dto.unidadeOrigem === dto.unidadeDestino) erros.push("Unidades devem ser diferentes");
    if (erros.length) throw new Error(erros.join("\n"));
  }

  static async criar(dto) {
    this.validar(dto);
    const mem = this._load();
    const entity = this.toEntity({
      ...dto,
      id: dto.id ?? `cp_${Date.now()}`,
      resultado: dto.resultado ?? 0,
      data: dto.data ?? new Date().toISOString().slice(0, 10),
    });
    mem.push(entity);
    this._save(mem);
    return { ok: true, conversao: entity };
  }

  static async atualizar(dto) {
    this.validar(dto);
    const mem = this._load();
    const idx = mem.findIndex(x => String(x.id) === String(dto.id));
    if (idx === -1) throw new Error("Conversão não encontrada");

    const entity = {
      id: String(dto.id),
      valor: Number(dto.valor),
      unidadeOrigem: dto.unidadeOrigem,
      unidadeDestino: dto.unidadeDestino,
      resultado: Number(dto.resultado),
      data: dto.data ?? new Date().toISOString().slice(0, 10),
    };

    mem[idx] = entity;
    this._save(mem);
    return { ok: true, conversao: this.toEntity(entity) };
  }

  static async remover(id) {
    const mem = this._load();
    const idx = mem.findIndex(x => String(x.id) === String(id));
    if (idx === -1) return false;
    mem.splice(idx, 1);
    this._save(mem);
    return true;
  }
}
