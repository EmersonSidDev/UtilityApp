function normalizeId(raw) {
  if (raw === null || raw === undefined) return null;
  return String(raw);
}
function newId() {
  return `cp_${Date.now()}`;
}

/**
 * Entidade que representa uma conversão de peso
 * Campos:
 *  - id: string
 *  - valor: number
 *  - unidadeOrigem: string ('kg' | 'g' | 'lb' | 'oz')
 *  - unidadeDestino: string ('kg' | 'g' | 'lb' | 'oz')
 *  - resultado: number
 *  - data: string 'YYYY-MM-DD'
 */
export default class ConversaoPesoEntity {
  constructor({
    id = null,
    valor = 0,
    unidadeOrigem = 'kg',
    unidadeDestino = 'g',
    resultado = 0,
    data = null,
  } = {}) {
    this.id = normalizeId(id) ?? newId();
    this.valor = Number(valor) || 0;
    this.unidadeOrigem = unidadeOrigem;
    this.unidadeDestino = unidadeDestino;
    this.resultado = Number(resultado) || 0;
    this.data = data ? String(data) : new Date().toISOString().slice(0, 10);
  }

  static fromDto(d) {
    return d ? new ConversaoPesoEntity(d) : null;
  }

  get key() {
    return String(this.id);
  }
}