// app/entities/TarefaEntity.js
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

export const TAREFA_STATUS = {
  ABERTO: "aberto",
  EM_ANDAMENTO: "em_andamento",
  CONCLUIDO: "concluido",
};
const STATUS_LIST = Object.values(TAREFA_STATUS);

export default class TarefaEntity {
  // ordem dos parâmetros: id, descricao, dataInicio, dataFim, status
  constructor(id, descricao, dataInicio, dataFim, status) {
    const idNorm = normalizeId(id);
    this.id = idNorm ?? newId();
    this.descricao = descricao ?? "";
    this.dataInicio = dataInicio ?? ""; // "YYYY-MM-DD"
    this.dataFim = dataFim ?? "";       // "YYYY-MM-DD"
    this.status = STATUS_LIST.includes(status) ? status : TAREFA_STATUS.ABERTO;
  }

  static fromDto(d) {
    if (!d) return null;
    return new TarefaEntity(
      d.id,
      d.descricao,
      d.dataInicio ?? d.data_inicio,
      d.dataFim ?? d.data_fim,
      d.status
    );
  }

  get key() {
    return String(this.id);
  }
}
