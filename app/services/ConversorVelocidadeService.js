// app/services/ConversorVelocidadeService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConversaoVelocidadeEntity from '../entities/ConversaoVelocidadeEntity';

const STORAGE_KEY = 'conversoes_velocidade';
let mem = [];

export default class ConversorVelocidadeService {
  // --- FUNÇÕES DE CONVERSÃO ---
  static toMs(v, from) {
    const n = Number(v);
    if (Number.isNaN(n)) throw new Error('Valor inválido');
    switch (from) {
      case 'km/h': return n / 3.6;
      case 'mph': return n * 0.44704;
      default: return n;
    }
  }

  static fromMs(v, to) {
    const n = Number(v);
    if (Number.isNaN(n)) throw new Error('Valor inválido');
    switch (to) {
      case 'km/h': return n * 3.6;
      case 'mph': return n / 0.44704;
      default: return n;
    }
  }

  /**
   * Calcula o resultado com base em uma entidade
   * @param {ConversaoVelocidadeEntity} entity
   * @returns {number} resultado calculado
   */
  static calcular(entity) {
    if (!(entity instanceof ConversaoVelocidadeEntity)) {
      throw new Error('Entidade inválida');
    }

    const v = Number(entity.valor);
    if (isNaN(v)) throw new Error('Valor inválido');
    if (entity.unidadeOrigem === entity.unidadeDestino) {
      throw new Error('Unidades devem ser diferentes');
    }

    const ms = this.toMs(v, entity.unidadeOrigem);
    const res = this.fromMs(ms, entity.unidadeDestino);
    return Number(res.toFixed(2));
  }

  // Carrega dados persistidos (mantém mem atualizada)
  static async carregar() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      mem = json ? JSON.parse(json) : [];
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      mem = [];
    }
  }

  // Salva dados; relança erro para permitir que a UI trate
  static async salvar() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mem));
    } catch (err) {
      console.error('Erro ao salvar dados:', err);
      throw err;
    }
  }

  static toEntity(d) {
    return ConversaoVelocidadeEntity.fromDto(d);
  }

  static async listar() {
    await this.carregar();
    return mem.map(this.toEntity);
  }

  static async buscarPorId(id) {
    if (!mem.length) await this.carregar();
    const d = mem.find((x) => String(x.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  // Validação correta para conversão de velocidade
  static validar(dto) {
    const erros = [];
    if (dto === null || dto === undefined) erros.push('Dados inválidos');
    const valor = Number(dto.valor);
    if (dto.valor === undefined || dto.valor === null || Number.isNaN(valor)) {
      erros.push('Valor deve ser um número');
    } else if (valor < 0) {
      erros.push('Valor não pode ser negativo');
    }

    if (!dto.unidadeOrigem) erros.push('Unidade de origem é obrigatória');
    if (!dto.unidadeDestino) erros.push('Unidade de destino é obrigatória');
    if (dto.unidadeOrigem && dto.unidadeDestino && dto.unidadeOrigem === dto.unidadeDestino) {
      erros.push('Unidades devem ser diferentes');
    }

    if (erros.length) throw new Error(erros.join('\n'));
  }

  static async criar(dto) {
    await this.carregar();
    this.validar(dto);

    // normaliza/garante tipos
    const novoRaw = {
      ...dto,
      id: dto.id ?? `cv_${Date.now()}`,
      valor: Number(dto.valor),
      resultado: Number(dto.resultado ?? 0),
      unidadeOrigem: dto.unidadeOrigem,
      unidadeDestino: dto.unidadeDestino,
      data: dto.data ?? new Date().toISOString().slice(0, 10),
    };

    const entity = new ConversaoVelocidadeEntity(novoRaw);
    // armazena o objeto "raw" (serializável)
    mem.push({
      id: entity.id,
      valor: entity.valor,
      unidadeOrigem: entity.unidadeOrigem,
      unidadeDestino: entity.unidadeDestino,
      resultado: entity.resultado,
      data: entity.data,
    });

    await this.salvar();
    return { ok: true, conversao: this.toEntity(mem[mem.length - 1]) };
  }

  static async atualizar(dto) {
    await this.carregar();
    this.validar(dto);
    const idx = mem.findIndex((x) => String(x.id) === String(dto.id));
    if (idx === -1) throw new Error('Conversão não encontrada');

    const atualizadoRaw = {
      ...mem[idx],
      ...dto,
      valor: Number(dto.valor),
      resultado: Number(dto.resultado ?? mem[idx].resultado ?? 0),
      data: dto.data ?? mem[idx].data ?? new Date().toISOString().slice(0, 10),
    };

    const entity = new ConversaoVelocidadeEntity(atualizadoRaw);
    mem[idx] = {
      id: entity.id,
      valor: entity.valor,
      unidadeOrigem: entity.unidadeOrigem,
      unidadeDestino: entity.unidadeDestino,
      resultado: entity.resultado,
      data: entity.data,
    };

    await this.salvar();
    return { ok: true, conversao: this.toEntity(mem[idx]) };
  }

  static async remover(id) {
    await this.carregar();
    const idx = mem.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) return false;
    mem.splice(idx, 1);
    await this.salvar();
    return true;
  }

  static async limparTudo() {
    mem = [];
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}
