// app/entities/UsuarioEntity.js
function normalizeId(raw) {
  if (raw == null) return null;
  const t = typeof raw;
  if (t === "string" || t === "number" || t === "bigint") return String(raw);
  if (t === "object") {
    if ("$oid" in raw) return String(raw.$oid);
    if ("value" in raw) return String(raw.value);
    if ("id" in raw) return String(raw.id);
  }
  return null;
}
function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default class UsuarioEntity {
  // ordem: id, nome, login, senha, avatar
  constructor(id, nome, login, senha, avatar) {
    const idNorm = normalizeId(id);
    this.id = idNorm ?? newId();
    this.nome = nome ?? "";
    this.login = login ?? "";
    this.senha = senha ?? ""; // didático: em produção, nunca guarde senha em texto puro
    this.avatar = avatar ?? `https://i.pravatar.cc/150?u=${this.login || this.id}`;
  }

  static fromDto(d) {
    if (!d) return null;
    return new UsuarioEntity(d.id, d.nome, d.login, d.senha, d.avatar);
  }

  get key() {
    return String(this.id);
  }
}
