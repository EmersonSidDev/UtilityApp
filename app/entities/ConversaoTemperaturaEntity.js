// app/entities/ConversaoVelocidadeEntity.js
function normalizeId(raw) {
  if (raw === null || raw === undefined) return null;
  return String(raw);
}
function newId() {
  return `cv_${Date.now()}`;
}

export default class ConversaoTemperaturaEntity {
  constructor({
    id = null,
    valor = 0,
    unidadeOrigem = 'Celsius',
    unidadeDestino = 'Fahrenheit',
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
    return d ? new ConversaoTemperaturaEntity(d) : null;
  }

  get key() {
    return String(this.id);
  }
}
