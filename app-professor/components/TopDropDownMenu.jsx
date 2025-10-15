import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { router, useRouter } from 'expo-router';

export default function TopDropDownMenu() {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" color="black" onPress={openMenu} />}
      >
        <Menu.Item onPress={() => router.push('/view/contatoListView')} title="Contatos" />
        <Menu.Item onPress={() => router.push('/view/usuarioListView')} title="Usuarios" />
        <Menu.Item onPress={() => router.push('/view/compromissoListView')} title="Compromissos" />
        <Menu.Item onPress={() => router.push('/view/TarefaListView')} title="Tarefas" />
        <Menu.Item onPress={() => router.push('/view/dataImportanteListView')} title="Datas importantes" />
      </Menu>
      <Appbar.Content title="Meu App" />
    </Appbar.Header>
  );
}
