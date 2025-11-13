import { router } from 'expo-router';
import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';

export default function TopMenu() {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header style={{ backgroundColor: 'black' }}>
      <Appbar.Content title="Início" color="white" />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon="menu"
            color="white"
            onPress={openMenu}
          />
        }
        contentStyle={{ backgroundColor: '#1a1a1a' }}
      >
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/');
          }}
          title="🏠 Início"
          titleStyle={{ color: 'white' }}
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/conversorVelocidadeListView');
          }}
          title="🚗 Conversor de Velocidade"
          titleStyle={{ color: 'white' }}
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push('/view/cronometroFormView');
          }}
          title="⏱️ Cronômetro"
          titleStyle={{ color: 'white' }}
        />
      <Menu.Item
  onPress={() => {
    closeMenu();
    router.push('/view/conversorPesoListView');
  }}
  title="⚖️ Conversor de Peso"
  titleStyle={{ color: 'white' }}
  
/>      </Menu>
    </Appbar.Header>
  );
}