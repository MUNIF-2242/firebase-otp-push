import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { auth } from "@react-native-firebase/auth";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(null);
  const navigation = useNavigation();

  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {}
  };
  const confirmCode = async () => {
    try {
      const userCredientials = await confirm.confirm(code);
      const user = userCredientials.user;

      //Check if the user is new or existing
      const userDocument = await firestore()
        .collection("user")
        .doc(user.uid)
        .get();

      if (userDocument.exists) {
        //User is existing, navigate to Dashboard
        navigation.navigate("Dashboard");
      } else {
        //USer is new, navigate to Details
        navigation.navigate("Detail", { uid: user.uid });
      }
    } catch (error) {
      console.log("Invalid code.", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>
        Phone Number Authentication using firebase
      </Text>

      {!confirm ? (
        <>
          <Text style={{ marginBottom: 20, fontSize: 18 }}>
            Enter your phone number
          </Text>
          <TextInput
            style={{
              height: 50,
              width: "100%",
              borderColor: "black",
              borderWidth: 1,
              marginBottom: 30,
              paddingHorizontal: 10,
            }}
            placeholder="e.g., +8801708382862"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TouchableOpacity
            onPress={signInWithPhoneNumber}
            style={{
              backgroundColor: "#841584",
              padding: 10,
              borderRadius: 5,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
              Send Code
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 20, fontSize: 18 }}>
            Enter the code sent to your phonr number
          </Text>
          <TextInput
            style={{
              height: 50,
              width: "100%",
              borderColor: "black",
              borderWidth: 1,
              marginBottom: 30,
              paddingHorizontal: 10,
            }}
            placeholder="Enter code"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity
            onPress={confirmCode}
            style={{
              backgroundColor: "#841584",
              padding: 10,
              borderRadius: 5,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
              COnfirm Code
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#BEBEBE",
  },
  textStyle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: 150,
  },
});
