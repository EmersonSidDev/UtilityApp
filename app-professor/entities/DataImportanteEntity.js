// app/_entities/DataImportanteEntity.js

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

export default class DataImportanteEntity {
  // ordem: id, descricao, data
  constructor(id, descricao, data) {
    const idNorm = normalizeId(id);
    this.id = idNorm ?? newId();
    this.descricao = descricao ?? "";
    this.data = data ?? ""; // "YYYY-MM-DD"
  }

  static fromDto(d) {
    if (!d) return null;
    return new DataImportanteEntity(d.id, d.descricao, d.data);
  }

  get key() {
    return String(this.id);
  }
}
