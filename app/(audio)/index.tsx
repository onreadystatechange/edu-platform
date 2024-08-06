import React, { useRef, useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useAudio } from "./use-audio";
import { MessageType } from "./type";

const HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <meta
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"
      name="viewport"
    />

    <title>audio</title>
    <style>
   
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 80vh;
        overflow: hidden;
      }
        h1 {
          text-align: center;
          margin:0;
        }
        button {
          background-color: #000;
          color: white;
          padding: 12px 10px;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          display: block;
          margin: 0 auto;
          margin-top: 16px;
        }
        
        button:disabled,
        button[disabled]{
          background-color: #cccccc;
          color: #666666;
        }
    </style>
  </head>
  <body>
    <h1>Audio Recording</h1>  
    <button onclick="startRecordAudio()" id="start_record_audio">Start Record Audio</button>
    <button onclick="stopRecordAudio()" id="stop_record_audio" disabled>Stop Record Audio</button>

    <button onclick="startPlayAudio()" id="start_play_audio" disabled>Start Play Audio</button>
    <button onclick="stopPlayAudio()" id="stop_play_audio" disabled>Stop Play Audio</button>
    <script>
    const start_record_audio_button = document.querySelector('#start_record_audio');
    const stop_record_audio_button = document.querySelector('#stop_record_audio');
    const start_play_audio_button = document.querySelector('#start_play_audio');
    const stop_play_audio_button = document.querySelector('#stop_play_audio');
    // 监听来自 React Native 的消息
    document.addEventListener('message', function(event) {
      alert('Received message from React Native: ' + event.data);
      const message = event.data;
      switch (message) {
        case 'RN_START_RECORD_AUDIO_SUCCESS':
          start_record_audio_button.disabled = true;
          stop_record_audio_button.disabled = false;
          break;
        case 'RN_STOP_RECORD_AUDIO_SUCCESS':
          start_record_audio_button.disabled = false;
          stop_record_audio_button.disabled = true;
          start_play_audio_button.disabled = false;
          break;
        case 'RN_PLAY_AUDIO_SUCCESS':
          start_play_audio_button.disabled = true;
          stop_play_audio_button.disabled = false;
          break;
        case 'RN_PAUSE_AUDIO_SUCCESS':
          start_play_audio_button.disabled = false;
          stop_play_audio_button.disabled = true;
          break;
        default:
          break;
      }
    });

    // 发送消息给 React Native
    function sendMessageToReactNative(message) {
      window.ReactNativeWebView.postMessage(message);
    }

    function startRecordAudio() {
      const message = 'BROWSER_START_RECORD_AUDIO';
      sendMessageToReactNative(message);
    }

    function stopRecordAudio() {
      const message = 'BROWSER_STOP_RECORD_AUDIO';
      sendMessageToReactNative(message);
    }

    function startPlayAudio() {
      const message = 'BROWSER_PLAY_AUDIO';
      sendMessageToReactNative(message);
    }

    function stopPlayAudio() {
      const message = 'BROWSER_PAUSE_AUDIO';
      sendMessageToReactNative(message);
    }
    </script>
  </body>
</html>`;

const App = () => {
  const webviewRef = useRef({} as any);
  const {
    startRecording,
    stopRecording,
    playRecordedAudio,
    stopPlaying,
    isPLaying,
    recordedURI,
    permissionResponse,
  } = useAudio();

  const onMessage = async (event: any) => {
    //Alert.alert("Message received from JS: ", event.nativeEvent.data);
    const message = event.nativeEvent.data;

    switch (message) {
      case MessageType.BROWSER_START_RECORD_AUDIO:
        try {
          await startRecording();
          sendMessageToWeb(MessageType.RN_START_RECORD_AUDIO_SUCCESS);
        } catch (error) {
          console.log(error);
        }
        break;
      case MessageType.BROWSER_STOP_RECORD_AUDIO:
        try {
          await stopRecording();
          sendMessageToWeb(MessageType.RN_STOP_RECORD_AUDIO_SUCCESS);
        } catch (error) {}
        break;

      case MessageType.BROWSER_PLAY_AUDIO:
        if (recordedURI) {
          try {
            await playRecordedAudio();
            sendMessageToWeb(MessageType.RN_PLAY_AUDIO_SUCCESS);
          } catch (error) {
            console.log(error);
          }
        } else {
          Alert.alert("No audio recorded yet.");
        }
        break;

      case MessageType.BROWSER_PAUSE_AUDIO:
        try {
          await stopPlaying();
          sendMessageToWeb(MessageType.RN_PAUSE_AUDIO_SUCCESS);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  };

  const sendMessageToWeb = (message: any) => {
    webviewRef.current.postMessage(message);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        onMessage={onMessage}
        automaticallyAdjustContentInsets={false}
        useWebView2
        source={{
          html: HTML,
        }}
        style={styles.webview}
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
