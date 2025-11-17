// app/services/imcService.js
import ImcEntity from "../entities/ImcEntity";

const mem = []; // armazenamento em memória

export default class ImcService {
  static toEntity(d) {
    return ImcEntity.fromDto(d);
  }

  static async listar() {
    // retorna cópias mapeadas como entidades
    return mem.map(this.toEntity);
  }

  static async buscarPorId(id) {
    const d = mem.find(x => String(x.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  static validar(dto) {
    const erros = [];
    if (dto === null || dto === undefined) erros.push("Dados inválidos");

    if (dto.peso === undefined || dto.peso === null || Number.isNaN(Number(dto.peso))) {
      erros.push("Peso deve ser um número");
    } else if (Number(dto.peso) <= 0) {
      erros.push("Peso deve ser maior que zero");
    }

    if (dto.altura === undefined || dto.altura === null || Number.isNaN(Number(dto.altura))) {
      erros.push("Altura deve ser um número");
    } else if (Number(dto.altura) <= 0) {
      erros.push("Altura deve ser maior que zero");
    }

    if (erros.length) throw new Error(erros.join("\n"));
  }

  static async criar(dto) {
    this.validar(dto);
    const entity = this.toEntity({
      ...dto,
      id: dto.id ?? `imc_${Date.now()}`,
      imc: dto.imc ?? 0,
      data: dto.data ?? new Date().toISOString().slice(0, 10),
    });
    mem.push({
      id: entity.id,
      peso: entity.peso,
      altura: entity.altura,
      imc: entity.imc,
      data: entity.data,
    });
    return { ok: true, imc: entity };
  }

  static async atualizar(dto) {
    this.validar(dto);
    const idx = mem.findIndex(x => String(x.id) === String(dto.id));
    if (idx === -1) throw new Error("Registro de IMC não encontrado");

    mem[idx] = {
      id: String(dto.id),
      peso: Number(dto.peso),
      altura: Number(dto.altura),
      imc: Number(dto.imc),
      data: dto.data ?? new Date().toISOString().slice(0, 10),
    };
    return { ok: true, imc: this.toEntity(mem[idx]) };
  }

  static async remover(id) {
    const idx = mem.findIndex(x => String(x.id) === String(id));
    if (idx === -1) return false;
    mem.splice(idx, 1);
    return true;
  }
}
