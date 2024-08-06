import React from "react";
import { Button, StyleSheet, View, Image } from "react-native";
import { useSelectPhoto } from "./use-select-photo";

const App = () => {
  const { pickImage, image, takeImage } = useSelectPhoto();
  return (
    <View style={styles.container}>
      <Button
        color={"#000"}
        title={"Select From Photo Album"}
        onPress={() => {
          pickImage();
        }}
      />
      <Button
        color={"#000"}
        title={"Take Photo"}
        onPress={() => {
          takeImage();
        }}
      />

      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
    gap: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default App;
