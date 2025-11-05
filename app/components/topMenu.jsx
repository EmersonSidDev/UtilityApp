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
          title="⚙️ Conversor de Velocidade"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/conversorPesoListView');
          }}
          title="⚖️ Conversor de Peso"
          titleStyle={{ color: 'white' }}
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
          titleStyle={{ color: 'white' }}
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/cronometroView');
          }}
          title="⏱️ Cronômetro"
          titleStyle={{ color: 'white' }}
        />

      </Menu>
        
    </Appbar.Header>
  );
}
