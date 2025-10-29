export class CronometroEntity {
constructor() {
this.tempoDecorrido = 0; // milissegundos
this.estaRodando = false;
this.inicio = 0;
this.acumulado = 0;
}

iniciar() {
if (this.estaRodando) return;
this.estaRodando = true;
this.inicio = Date.now();
}

parar() {
if (!this.estaRodando) return;
this.estaRodando = false;
const agora = Date.now();
this.acumulado += agora - this.inicio;
this.tempoDecorrido = this.acumulado;
}

resetar() {
this.tempoDecorrido = 0;
this.estaRodando = false;
this.inicio = 0;
this.acumulado = 0;
}

getTempoAtual() {
if (this.estaRodando) {
const agora = Date.now();
return this.acumulado + (agora - this.inicio);
}
return this.tempoDecorrido;
}
}