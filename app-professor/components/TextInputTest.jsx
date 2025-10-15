import { View, Text, TextInput } from "react-native";
import React, { useEffect, useState } from 'react';



export default function TextInputTest() {
  const [nome, setNome] = useState("");
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />    
  </View>
  );
}

