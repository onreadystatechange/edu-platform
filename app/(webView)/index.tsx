import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const App = () => {
  const handleMessage = (event: any) => {
    Alert.alert("Message from WebView", event.nativeEvent.data);
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://dev.golingo.cn/edu/learn?isApp=1" }}
        style={styles.webview}
        onMessage={handleMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default App;
