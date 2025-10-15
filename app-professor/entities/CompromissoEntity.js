// app/entities/CompromissoEntity.js
export default class CompromissoEntity {
  /**
   * @param {string} id
   * @param {string} descricao
   * @param {string} data    // yyyy-mm-dd
   * @param {string} horario // HH:mm
   * @param {string} contatoId
   */
  constructor(id, descricao, data, horario, contatoId) {
    this.id        = id != null ? String(id) : `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    this.descricao = descricao ?? "";
    this.data      = data ?? "";
    this.horario   = horario ?? "";
    this.contatoId = contatoId ?? "";
  }

  static fromDto(d) {
    if (!d) return null;
    return new CompromissoEntity(
      d.id, d.descricao, d.data, d.horario, d.contatoId
    );
  }

  get key() { return String(this.id); }
}
