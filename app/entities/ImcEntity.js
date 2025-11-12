function normalizeId(raw) {
  if (raw === null || raw === undefined) return null;
  return String(raw);
}

function newId() {
  return `imc_${Date.now()}`;
}

/**
 * Entidade que representa um cálculo de IMC
 * Campos:
 *  - id: string
 *  - peso: number (em kg)
 *  - altura: number (em metros)
 *  - imc: number (resultado do cálculo)
 *  - data: string 'YYYY-MM-DD'
 */
export default class ImcEntity {
  constructor({
    id = null,
    peso = 0,
    altura = 0,
    imc = 0,
    data = null,
  } = {}) {
    this.id = normalizeId(id) ?? newId();
    this.peso = Number(peso) || 0;
    this.altura = Number(altura) || 0;
    this.imc = Number(imc) || 0;
    // garantir formato YYYY-MM-DD
    this.data = data ? String(data) : new Date().toISOString().slice(0, 10);
  }

  static fromDto(d) {
    return d ? new ImcEntity(d) : null;
  }

  get key() {
    return String(this.id);
  }
}
