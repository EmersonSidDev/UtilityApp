function normalizeId(raw) {
    if (raw === null || raw === undefined) return null;
    if (typeof raw === 'string' && raw.trim() !== '') return String(raw);
    return null;
}

function newId() {
    return `cm_${Date.now()}`;
}

    /**
     * Entidade que representa uma conversão de medida
     * Campos:
     *  - id: string
     *  - valor: number (valor original)
     * - unidadeOrigem: string ('m' | 'cm' | 'mm' | 'km' | 'in' | 'ft' | 'yd' | 'mi')
     * - unidadeDestino: string ('m' | 'cm' | 'mm' | 'km' | 'in' | 'ft' | 'yd' | 'mi')
     * - resultado: number (valor convertido)
     * - data: string 'YYYY-MM-DD'
     */
     
    export default class ConversaoMedidaEntity {
    constructor({
        id = null,
        valor = 0,
        unidadeOrigem = 'm',
        unidadeDestino = 'cm',
        resultado = 0,
        data = null,
    } = {}) {
        this.id = normalizeId(id) ?? newId();
        this.valor = Number(valor) || 0;
        this.unidadeOrigem = unidadeOrigem;
        this.unidadeDestino = unidadeDestino;
        this.resultado = Number(resultado) || 0;
        // garantir formato YYYY-MM-DD
        this.data = data ? String(data) : new Date().toISOString().slice(0, 10);
    }

    static fromDto(d) {
    return d ? new ConversaoMedidaEntity(d) : null;
    }

    get key() {
    return String(this.id);
    } 
}