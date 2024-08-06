import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export function useSelectPhoto() {
  const [image, setImage] = useState(null);

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const [cameraStatus, requestCameraStatusPermission] =
    ImagePicker.useCameraPermissions();

  const pickImage = async () => {
    if (!status?.granted) {
      await requestPermission();
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri as any);
    }
  };

  const takeImage = async () => {
    if (!cameraStatus?.granted) {
      await requestCameraStatusPermission();
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri as any);
    }
  };

  return {
    pickImage,
    image,
    takeImage,
  };
}
