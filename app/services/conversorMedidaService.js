import ConversaoMedida from "../entities/ConversaoMedidaEntity.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'conversoes_medida';
let mem = []; // armazenamento em memória (array de objetos simples)

export default class ConversorMedidaService {
    // --- HELPERS DE STORAGE ---
    static async _readStorage() {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            mem = raw ? JSON.parse(raw) : [];
        } catch (err) {
            // em caso de erro, manter mem como está e lançar para chamar quem precisar
            throw new Error('Erro ao ler storage: ' + String(err?.message ?? err));
        }
    }

    static async _writeStorage() {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mem || []));
        } catch (err) {
            throw new Error('Erro ao gravar storage: ' + String(err?.message ?? err));
        }
    }

    // --- CONVERSÕES ---
    static toMetros(v, from) {
        const n = Number(v);
        if (Number.isNaN(n)) throw new Error('Valor inválido');
        switch (from) {
            case 'km':
                return n * 1000;
            case 'cm':
                return n / 100;
            case 'mm':
                return n / 1000;
            default:
                return n; // m
        }
    }

    static fromMetros(v, to) {
        const n = Number(v);
        if (Number.isNaN(n)) throw new Error('Valor inválido');
        switch (to) {
            case 'km':
                return n / 1000;
            case 'cm':
                return n * 100;
            case 'mm':
                return n * 1000;
            default:
                return n; // m
        }
    }

    static calcular(entity) {
        // aceita tanto entidade quanto objeto dto
        const e = entity instanceof ConversaoMedida ? entity : new ConversaoMedida(entity);
        const v = Number(e.valor);
        if (Number.isNaN(v)) throw new Error('Valor inválido');
        if (e.unidadeOrigem === e.unidadeDestino) throw new Error('Unidades devem ser diferentes');
        const m = this.toMetros(v, e.unidadeOrigem);
        const res = this.fromMetros(m, e.unidadeDestino);
        return Number(res);
    }

    // utilitário para mapear dto -> entidade
    static toEntity(d) {
        return ConversaoMedida.fromDto(d);
    }

    // LISTAGEM com carregamento do storage
    static async listar() {
        await this._readStorage();
        return (mem || []).map(this.toEntity);
    }

    // validação
    static validar(dto) {
        const erros = [];
        if (dto === null || dto === undefined) erros.push('Dados inválidos');
        if (dto.valor === undefined || dto.valor === null || Number.isNaN(Number(dto.valor))) {
            erros.push('Valor deve ser um número');
        } else if (Number(dto.valor) < 0) {
            erros.push('Valor não pode ser negativo');
        }
        if (!dto.unidadeOrigem) erros.push('Unidade de origem é obrigatória');
        if (!dto.unidadeDestino) erros.push('Unidade de destino é obrigatória');
        if (dto.unidadeOrigem === dto.unidadeDestino) erros.push('Unidades devem ser diferentes');
        if (erros.length) throw new Error(erros.join('\n'));
    }

    static async criar(dto) {
        this.validar(dto);
        const entity = this.toEntity({
            ...dto,
            id: dto.id ?? `cm_${Date.now()}`,
            resultado: dto.resultado ?? 0,
            data: dto.data ?? new Date().toISOString().slice(0, 10),
        });
        // garantir mem carregado
        await this._readStorage();
        mem.push({
            id: entity.id,
            valor: entity.valor,
            unidadeOrigem: entity.unidadeOrigem,
            unidadeDestino: entity.unidadeDestino,
            resultado: entity.resultado,
            data: entity.data,
        });
        await this._writeStorage();
        return { ok: true, conversao: entity };
    }

    static async atualizar(dto) {
        this.validar(dto);
        await this._readStorage();
        const idx = mem.findIndex((x) => String(x.id) === String(dto.id));
        if (idx === -1) throw new Error('Conversão não encontrada');
        mem[idx] = {
            id: String(dto.id),
            valor: Number(dto.valor),
            unidadeOrigem: dto.unidadeOrigem,
            unidadeDestino: dto.unidadeDestino,
            resultado: Number(dto.resultado),
            data: dto.data ?? new Date().toISOString().slice(0, 10),
        };
        await this._writeStorage();
        return { ok: true, conversao: this.toEntity(mem[idx]) };
    }

    static async excluir(id) {
        await this._readStorage();
        const idx = mem.findIndex((x) => String(x.id) === String(id));
        if (idx === -1) return { ok: false };
        mem.splice(idx, 1);
        await this._writeStorage();
        return { ok: true };
    }
}