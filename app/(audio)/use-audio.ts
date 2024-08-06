import { useState, useRef, useEffect } from "react";
import { Audio } from "expo-av";

export function useAudio() {
  const [recording, setRecording] = useState<Audio.Recording>();
  const [recordedURI, setRecordedURI] = useState<string>("");
  const [isPLaying, setIsPLaying] = useState<boolean>(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const audioPlayer = useRef(new Audio.Sound());

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    setRecordedURI(uri || "");
    console.log("Recording stopped and stored at", uri);
  }

  // Function to play the recorded audio
  async function playRecordedAudio() {
    try {
      // Load the Recorded URI
      await audioPlayer.current.loadAsync({ uri: recordedURI }, {}, true);

      // Get Player Status
      const playerStatus = await audioPlayer.current.getStatusAsync();
      console.log("Player status", playerStatus);
      // Play if song is loaded successfully
      if (playerStatus.isLoaded) {
        if (playerStatus.isPlaying === false) {
          audioPlayer.current.playAsync();
          setIsPLaying(true);
        }
      }
    } catch (error) {
      console.error("Failed to play audio", error);
    }
  }

  // Function to stop the playing audio
  async function stopPlaying() {
    try {
      //Get Player Status
      const playerStatus = await audioPlayer.current.getStatusAsync();

      // If song is playing then stop it
      if (playerStatus.isLoaded === true)
        await audioPlayer.current.unloadAsync();

      setIsPLaying(false);
    } catch (error) {}
  }

  return {
    startRecording,
    stopRecording,
    playRecordedAudio,
    stopPlaying,
    isPLaying,
    recordedURI,
    permissionResponse,
  };
}
