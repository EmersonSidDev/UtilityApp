// app/services/tarefaService.js
import TarefaEntity, { TAREFA_STATUS } from "../entities/TarefaEntity";

const mem = [
  {
    id: "t1",
    descricao: "Planejar aula de arquitetura",
    dataInicio: "2025-10-08",
    dataFim: "2025-10-10",
    status: TAREFA_STATUS.EM_ANDAMENTO,
  },
  {
    id: "t2",
    descricao: "Enviar materiais para os alunos",
    dataInicio: "2025-10-09",
    dataFim: "2025-10-09",
    status: TAREFA_STATUS.ABERTO,
  },
  {
    id: "t3",
    descricao: "Revisar exercícios",
    dataInicio: "2025-10-05",
    dataFim: "2025-10-07",
    status: TAREFA_STATUS.CONCLUIDO,
  },
];

export default class TarefaService {
  /** Mapeia DTO simples -> Entity */
  static toEntity(d) {
    return TarefaEntity.fromDto(d) ?? new TarefaEntity(
      d.id, d.descricao, d.dataInicio, d.dataFim, d.status
    );
  }

  /** Lista todas as tarefas (em memória) */
  static async buscarTodos() {
    return mem.map((d) => this.toEntity(d));
  }

  /** Buscar por ID (nome padrão novo) */
  static async buscaPorId(id) {
    if (id == null) return null;
    const d = mem.find((x) => String(x.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  /** Alias de compatibilidade */
  static async buscarPorId(id) {
    return this.buscaPorId(id);
  }

  /** Valida regras básicas */
  static validar(dto) {
    const erros = [];
    if (!dto.descricao || !dto.descricao.trim()) erros.push("Descrição é obrigatória.");
    if (!dto.dataInicio) erros.push("Data de início é obrigatória.");
    // se houver fim, não pode ser antes do início (comparação lexicográfica ok em YYYY-MM-DD)
    if (dto.dataInicio && dto.dataFim && dto.dataFim < dto.dataInicio) {
      erros.push("Data de fim não pode ser anterior à data de início.");
    }
    const allowed = [TAREFA_STATUS.ABERTO, TAREFA_STATUS.EM_ANDAMENTO, TAREFA_STATUS.CONCLUIDO];
    if (dto.status && !allowed.includes(dto.status)) {
      erros.push("Status inválido.");
    }
    return erros;
  }

  /** Criar tarefa */
  static async salvarTarefa(dados) {
    const erros = this.validar(dados);
    if (erros.length) throw new Error(erros.join("\n"));

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const novo = {
      id,
      descricao: dados.descricao ?? "",
      dataInicio: dados.dataInicio ?? "",
      dataFim: dados.dataFim ?? "",
      status: dados.status ?? TAREFA_STATUS.ABERTO,
    };
    mem.push(novo);
    return { sucesso: true, tarefa: this.toEntity(novo) };
  }

  /** Atualizar tarefa existente */
  static async atualizarTarefa(id, dados) {
    const idx = mem.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) return { ok: false };

    const merged = { ...mem[idx], ...dados, id: mem[idx].id };
    const erros = this.validar(merged);
    if (erros.length) throw new Error(erros.join("\n"));

    mem[idx] = merged;
    return { ok: true, tarefa: this.toEntity(merged) };
  }

  /** Remover tarefa */
  static async removerTarefa(id) {
    const idx = mem.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) return false;
    mem.splice(idx, 1);
    return true;
  }
}
