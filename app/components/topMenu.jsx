// app/components/topMenu.jsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';

export default function TopMenu() {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header>
      <Appbar.Content title="Início" />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" color="white" onPress={openMenu} />}
      >
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/');
          }}
          title="🏠 Início"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/conversorVelocidadeListView');
          }}
          title="🚀 Conversor de Velocidade"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/conversorPesoListView');
          }}
          title="⚖️ Conversor de Peso"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/conversorMedidaListView');
          }}
          title="📏 Conversor de Medida"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/conversorTempoListView');
          }}
          title="⏳ Conversor de Tempo"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/conversorTemperaturaListView');
          }}
          title="🌡️ Conversor de Temperatura"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/cronometroListView');
          }}
          title="⏱️ Cronômetro"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/ImcListView');
          }}
          title="💪 Calculadora de IMC"
        />

      </Menu>
        
    </Appbar.Header>
  );
}
