import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@conversoes_tempo';
// Serviço para conversão de tempo e gerenciamento de dados
const ConversorTempoService = {
    //FUNÇÕES DE CONVERSÃO
  async calcular(entity) {
    const { valor, unidadeOrigem, unidadeDestino } = entity;
    let segundos = 0;

    if (unidadeOrigem === 's') segundos = valor;
    if (unidadeOrigem === 'm') segundos = valor * 60;
    if (unidadeOrigem === 'h') segundos = valor * 3600;

    let resultado = 0;
    if (unidadeDestino === 's') resultado = segundos;
    if (unidadeDestino === 'm') resultado = segundos / 60;
    if (unidadeDestino === 'h') resultado = segundos / 3600;

    return resultado;
  },
// Listar todas as conversões armazenadas
  async listar() {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
// Buscar uma conversão por ID
  async buscarPorId(id) {
    const todos = await this.listar();
    return todos.find(i => i.id === id);
  },
// Validar os dados da conversão
  async criar(dto) {
    const todos = await this.listar();
    const novo = { ...dto, id: String(Date.now()) };
    todos.push(novo);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return { conversao: novo };
  },
// Atualizar uma conversão existente
  async atualizar(dto) {
    const todos = await this.listar();
    const idx = todos.findIndex(i => i.id === dto.id);
    if (idx >= 0) todos[idx] = dto;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return { conversao: dto };
  },
// Remover uma conversão por ID
  async remover(id) {
    const todos = await this.listar();
    const filtrados = todos.filter(i => i.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
    return true;
  },
};

export default ConversorTempoService;
