import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { router } from "expo-router";

const App = () => {
  const demoArr = [
    {
      title: "WebView Demo",
      path: "/(webView)",
    },
    {
      title: "Audio Demo",
      path: "/(audio)",
    },
    {
      title: "Camera Demo",
      path: "/(camera)",
    },
    {
      title: "Push Notification Demo",
      path: "/(notification)",
    },
    {
      title: "UI Demo",
      path: "/(ui)",
    },
  ];
  return (
    <View style={styles.container}>
      {demoArr.map(({ title, onPress, path }: any) => (
        <Button
          color={"#000"}
          key={title}
          title={title}
          onPress={() => router.navigate(path)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
    gap: 20,
  },
});

export default App;
