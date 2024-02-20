import { StatusBar } from "expo-status-bar";
import { Alert, Linking, StyleSheet, Text, View } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import Details from "./screens/Details";
import Dashboard from "./screens/Dashboard";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function App() {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };
  const getInitialURL = async () => {
    const url = await Linking.getInitialURL();
    if (typeof url === "string") {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    await messaging().getInitialNotification();
  };

  useEffect(() => {
    if (requestUserPermission()) {
      //return fcm token for the device
      messaging()
        .getToken()
        .then((token) => {
          console.log(token);
        });
    } else {
      console.log("failed token status", authStatus);
    }

    //getInitialNotification: When the application is opened from a quit state.
    getInitialURL();

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(remoteMessage.notification);
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
