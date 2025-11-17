# Utility App

O **Utility App** é um aplicativo mobile desenvolvido em **React Native com Expo** voltado para facilitar o dia a dia do usuário oferecendo diversas ferramentas úteis em um só lugar. O projeto foi desenvolvido como trabalho da disciplina **Programação para Dispositivos Móveis**.

## 📱 Objetivo do Aplicativo

O objetivo do Utility App é reunir funcionalidades essenciais que auxiliam o usuário em cálculos e conversões rápidas, como:

* Conversão de velocidade
* Conversão de metragem
* Conversão de peso
* Conversão de temperatura
* Conversão de tempo
* Cronômetro
* Calculadora de IMC

O aplicativo continua em expansão e pode receber novas funcionalidades futuramente.

---

## 🗂️ Estrutura do Projeto

O projeto segue uma estrutura modular, separando componentes, serviços, entidades e telas:

```
app/
  _layout.jsx
  index.jsx
  components/
    bottomMenu.jsx
    topMenu.jsx
  entities/
    xxxEntity.js
  services/
    xxxService.js
  view/
    xxxFormView.jsx
    xxxListView.jsx
```

Cada funcionalidade é organizada em uma View própria e, quando necessário, possui uma Entity e um Service responsável pela lógica de processamento e persistência.

---

## 💾 Persistência de Dados

O Utility App utiliza armazenamento interno para salvar conversões e informações relevantes. Cada módulo possui seu próprio service responsável pela leitura e escrita dos dados.

---

## 👥 Integrantes e suas Responsabilidades

O projeto foi desenvolvido de forma colaborativa, com cada integrante responsável por uma funcionalidade específica:

### **Arthur Fernandes Silva Araújo**

* Conversor de Peso

### **Daniel Silva De Oliveira**

* Cronômetro

### **David Silva Ferreira**

* Conversor de Temperatura

### **Douglas Coimbra Laass**

* Conversor de Tempo

### **Emerson Carlos de Araújo Junior**

* Base do aplicativo (estrutura geral)
* Conversor de Velocidade
* Mesclagem das 'Branchs' no Git

### **Thiago Deones Jesus Dutra Alves**

* Conversor de Metragem

### **Thomas Cesar Felicissimo Mendes**

* Calculadora de IMC

---

## 🚀 Tecnologias Utilizadas

* **React Native** (Expo)
* **Expo Router** para navegação
* **AsyncStorage** para persistência local
* **React Native Paper** e componentes estilizados
* **Linguagens** JavaScript; JSX; JSON
* **ChatGPT** como ferramenta de suporte para auxílio na elaboração, organização de código e apoio técnico durante o desenvolvimento.

---

## 🧩 Funcionalidades Implementadas

* Interface inicial com apresentação do aplicativo
* Menu superior e inferior para navegação
* Conversores completos
* Salvar histórico de conversões
* Edição e exclusão de registros
* Layout responsivo e intuitivo

---

## 📦 Como Executar o Projeto

1. Instale as dependências:

```
npm install
```

2. Execute o app:

```
npx expo start
```

3. Escaneie o QR Code no Expo Go ou rode em um emulador.

---

## 📌 Considerações Finais

O Utility App foi desenvolvido com foco em organização, boas práticas e modularização. O projeto pode ser expandido com novas ferramentas e melhorias visuais.

Sinta-se livre para contribuir ou adaptar o código!
