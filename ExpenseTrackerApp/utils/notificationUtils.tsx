import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const initializeNotifications = async (): Promise<void> => {
  try {
    console.log("Initializing notifications...");

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    console.log("Notifications initialized successfully");
  } catch (error) {
    console.error("Notification initialization error:", error);
  }
};

// Simplified bill reminder function


// Cancel and schedule monthly report functions remain the same