/*
  Entidade que representa uma conversão de tempo
  Campos:
   - valor: number
   - unidadeOrigem: segundos
   - unidadeDestino: minutos
   - resultado: number
   - data em que a operação foi registrada: string 'YYYY-MM-DD'
 */

export default class ConversorTempoEntity {
  constructor({ id, valor, unidadeOrigem, unidadeDestino, resultado, data }) {
    this.id = id || null;
    this.valor = Number(valor) || 0;
    this.unidadeOrigem = unidadeOrigem || 's'; // segundos
    this.unidadeDestino = unidadeDestino || 'm'; // minutos
    this.resultado = resultado || null;
    this.data = data || new Date().toISOString().slice(0, 10);
  }
}
