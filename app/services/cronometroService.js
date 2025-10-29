import { CronometroEntity } from "../entities/CronometroEntity";

class CronometroService {
constructor() {
this.cronometro = new CronometroEntity();
this.intervalo = null;
this.callback = null;
}

iniciar(callback) {
this.callback = callback;
this.cronometro.iniciar();

this.intervalo = setInterval(() => {
  const tempo = this.cronometro.getTempoAtual();
  if (this.callback) this.callback(tempo);
}, 50);


}

parar() {
this.cronometro.parar();
if (this.intervalo) clearInterval(this.intervalo);
this.intervalo = null;
}

resetar() {
this.parar();
this.cronometro.resetar();
if (this.callback) this.callback(0);
}

getTempoAtual() {
return this.cronometro.getTempoAtual();
}
}

export const cronometroService = new CronometroService();