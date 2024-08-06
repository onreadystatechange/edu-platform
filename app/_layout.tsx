import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { BackHandler, Alert } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { RootSiblingParent } from "react-native-root-siblings";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const backAction = (): boolean => {
      if (router.canGoBack()) return false;
      Alert.alert(
        "退出应用",
        "你确定要退出应用吗？",
        [
          {
            text: "取消",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "确定",
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: false }
      );

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <RootSiblingParent>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack
              screenOptions={{
                statusBarColor: "#000",
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="(index)" options={{ headerShown: false }} />
              <Stack.Screen name="(audio)" options={{ headerShown: false }} />
              <Stack.Screen name="(camera)" options={{ headerShown: false }} />
              <Stack.Screen name="(webView)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </RootSiblingParent>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export const unstable_settings = {
  initialRouteName: "(index)/index",
};
