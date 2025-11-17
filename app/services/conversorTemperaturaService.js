import ConversaoTemperaturaEntity from "../entities/ConversaoTemperaturaEntity";

const mem = []; 

export default class conversorTemperaturaService {
  static toEntity(d) {
    return ConversaoTemperaturaEntity.fromDto(d);
  }

  static async listar() {
    return mem.map(this.toEntity);
  }

  static async buscarPorId(id) {
    const d = mem.find(x => String(x.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  static validar(dto) {
    const erros = [];
    if (dto === null || dto === undefined) erros.push("Dados inválidos");
    if (dto.valor === undefined || dto.valor === null || Number.isNaN(Number(dto.valor))) {
      erros.push("Valor deve ser um número");
    } else if (Number(dto.valor) < 0) {
      erros.push("Valor não pode ser negativo");
    }
    if (!dto.unidadeOrigem) erros.push("Unidade de origem é obrigatória");
    if (!dto.unidadeDestino) erros.push("Unidade de destino é obrigatória");
    if (dto.unidadeOrigem === dto.unidadeDestino) erros.push("Unidades devem ser diferentes");
    if (erros.length) throw new Error(erros.join("\n"));
  }

  static async criar(dto) {
    this.validar(dto);
    const entity = this.toEntity({
      ...dto,
      id: dto.id ?? `cv_${Date.now()}`,
      resultado: dto.resultado ?? 0,
      data: dto.data ?? new Date().toISOString().slice(0, 10),
    });
    mem.push({
      id: entity.id,
      valor: entity.valor,
      unidadeOrigem: entity.unidadeOrigem,
      unidadeDestino: entity.unidadeDestino,
      resultado: entity.resultado,
      data: entity.data,
    });
    return { ok: true, conversao: entity };
  }

  static async atualizar(dto) {
    this.validar(dto);
    const idx = mem.findIndex(x => String(x.id) === String(dto.id));
    if (idx === -1) throw new Error("Conversão não encontrada");
    mem[idx] = {
      id: String(dto.id),
      valor: Number(dto.valor),
      unidadeOrigem: dto.unidadeOrigem,
      unidadeDestino: dto.unidadeDestino,
      resultado: Number(dto.resultado),
      data: dto.data ?? new Date().toISOString().slice(0, 10),
    };
    return { ok: true, conversao: this.toEntity(mem[idx]) };
  }

  static async remover(id) {
    const idx = mem.findIndex(x => String(x.id) === String(id));
    if (idx === -1) return false;
    mem.splice(idx, 1);
    return true;
  }
}
