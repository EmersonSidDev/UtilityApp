import ContatoEntity from "../entities/ContatoEntity";

const contatosEmMemoria = [
  { id: "1", nome: "Alice",  email: "alice@email.com",  telefone: "11 99999-0001", avatar: "https://i.pravatar.cc/150?img=1", favorito: true,  categoria: "amigo",   sexo: "feminino" },
  { id: "2", nome: "Bruno",  email: "bruno@email.com",  telefone: "11 99999-0002", avatar: "https://i.pravatar.cc/150?img=2", favorito: false, categoria: "trabalho", sexo: "masculino" },
  { id: "3", nome: "Carla",  email: "carla@email.com",  telefone: "11 99999-0003", avatar: "https://i.pravatar.cc/150?img=3", favorito: true,  categoria: "familia", sexo: "feminino" },
  { id: "4", nome: "Diego",  email: "diego@email.com",  telefone: "11 99999-0004", avatar: "https://i.pravatar.cc/150?img=4", favorito: false, categoria: "trabalho", sexo: "masculino" },
  { id: "5", nome: "Elisa",  email: "elisa@email.com",  telefone: "11 99999-0005", avatar: "https://i.pravatar.cc/150?img=5", favorito: true,  categoria: "amigo",   sexo: "feminino" },
  { id: "6", nome: "Felipe", email: "felipe@email.com", telefone: "11 99999-0006", avatar: "https://i.pravatar.cc/150?img=6", favorito: false, categoria: "familia", sexo: "masculino" },
];

class ContatoService {
  /** Cria e devolve ContatoEntity a partir de um DTO plano */
  static toEntity(d) {
    return new ContatoEntity(
      d.id, d.nome, d.email, d.telefone,
      d.avatar, d.favorito, d.categoria, d.sexo
    );
  }

  /** Salvar em memória */
  static async salvarContato(contato) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = String(Date.now());
        const novo = {
          id: now,
          nome: contato.nome ?? "",
          email: contato.email ?? "",
          telefone: contato.telefone ?? "",
          avatar: contato.avatar ?? `https://i.pravatar.cc/150?u=${now}`,
          favorito: !!contato.favorito,
          categoria: contato.categoria ?? "",
          sexo: contato.sexo ?? "",
        };
        contatosEmMemoria.push(novo);
        resolve({ sucesso: true, contato: this.toEntity(novo) });
      }, 200);
    });
  }

  /** Listar todos */
  static async buscarContatos() {
    return contatosEmMemoria.map(this.toEntity);
  }

  /** 🔎 Buscar por ID (novo nome pedido) */
  static async buscaPorId(id) {
    const d = contatosEmMemoria.find(c => String(c.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  /** (compat) manter o nome antigo chamando o novo */
  static async buscarPorId(id) {
    return this.buscaPorId(id);
  }

  /** Atualizar */
  static async atualizarContato(id, dados) {
    const idx = contatosEmMemoria.findIndex(c => String(c.id) === String(id));
    if (idx === -1) return { ok: false };

    const anterior = contatosEmMemoria[idx];
    const atualizado = {
      ...anterior,
      ...dados,
      id: String(anterior.id), // preserva o id
    };
    contatosEmMemoria[idx] = atualizado;
    return { ok: true, contato: this.toEntity(atualizado) };
  }

  /** Remover */
  static async removerContato(id) {
    const idx = contatosEmMemoria.findIndex(c => String(c.id) === String(id));
    if (idx === -1) return false;
    contatosEmMemoria.splice(idx, 1);
    return true;
  }
}

export default ContatoService;
