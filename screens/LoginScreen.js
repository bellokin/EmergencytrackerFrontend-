import {
	StyleSheet,
	Text,
	View,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	ActivityIndicator,
	Image,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { LinearGradient } from "expo-linear-gradient";
  import TextInputBox from "../components/TextinputBox";
  import colors from "../constants/Stylings";
  import AppIcon from "../assets/images/Appicon.png";
  import axios from "axios";
  import { SafeAreaView } from "react-native-safe-area-context";
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const LoginScreen = ({ navigation }) => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
  
	// Validate functions
	const validateEmail = (email) => {
	  if (email === "") {
		return "Invalid Email";
	  }
	  if (email.length < 5) {
		return "Email must be at least 5 characters long";
	  }
	  return "";
	};
  
	const validatePassword = (password) => {
	  if (password === "") {
		return "Invalid Password";
	  }
	  if (password.length < 5) {
		return "Password must be at least 5 characters long";
	  }
	  return "";
	};
  
	const validateCredentials = (email, password) => {
	  const emailError = validateEmail(email);
	  if (emailError) {
		setError(emailError);
		setLoading(false);
		return false;
	  }
  
	  const passwordError = validatePassword(password);
	  if (passwordError) {
		setError(passwordError);
		setLoading(false);
		return false;
	  }
  
	  setError("");
	  return true;
	};
  
	const handleLogin = async () => {
	  Keyboard.dismiss();
	  if (validateCredentials(email, password)) {
		const req = {
		  username: email.trim(),
		  password: password.trim(),
		};
		setLoading(true);
		try {
		  const response = await axios.post("https://emergencytracker-rm8r.onrender.com/login/", req);
		  console.log(response?.data);
  
		  // Store the token in AsyncStorage
		  await AsyncStorage.setItem('access_token', response.data.access_token);
  
		  // Navigate to the main page
		  navigation.navigate("Gps");
		} catch (error) {
		  console.log(error.response?.data);
		  setLoading(false);
		  setError("Login failed. Please check your credentials.");
		}
	  }
	};
  
	useEffect(() => {
	  const unSubscribe = navigation.addListener("focus", () => {
		Keyboard.dismiss();
		setEmail("");
		setPassword("");
		setError("");
		setLoading(false);
	  });
	  return unSubscribe;
	}, [navigation]);
  
	return (
	  <View style={styles.container}>
		<SafeAreaView>
		  <KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		  >
			<View style={styles.content}>
			  <View style={styles.signup}>
				<Image style={styles.image} source={AppIcon} />
			  </View>
			  <TextInputBox
				editable={!loading}
				placeholder={"Email"}
				onChangeText={(text) => setEmail(text)}
			  />
			  <TextInputBox
				editable={!loading}
				password
				placeholder={"Password (min. 5 characters)"}
				onChangeText={(text) => setPassword(text)}
			  />
			  {error ? <Text style={styles.error}>{error}</Text> : null}
			</View>
			<View style={styles.buttonContainer}>
			  <LinearGradient
				colors={[colors.primaryColor, "#007bfc"]}
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 0 }}
				style={{ borderRadius: 15 }}
			  >
				<TouchableOpacity
				  style={styles.button}
				  onPress={handleLogin}
				  disabled={loading}
				>
				  {loading ? (
					<ActivityIndicator size={"large"} color={"white"} />
				  ) : (
					<Text style={styles.buttonText}>Log in</Text>
				  )}
				</TouchableOpacity>
			  </LinearGradient>
			  <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
				<View style={styles.text}>
				  <Text style={{ color: "grey" }}>Don't have an account? </Text>
				  <Text style={styles.signupText}>Sign up</Text>
				</View>
			  </TouchableOpacity>
			  <View style={{ height: 20 }} />
			 
			</View>
		  </KeyboardAvoidingView>
		</SafeAreaView>
	  </View>
	);
  };
  
  const styles = StyleSheet.create({
	image: {
	  width: 145,
	  height: 145,
	},
	container: {
	  flex: 1,
	  alignItems: "center",
	  backgroundColor: "white",
	},
	content: {
	  alignItems: "center",
	  justifyContent: "center",
	  flex: 1,
	},
	signup: {
	  alignItems: "center",
	  marginBottom: 30,
	},
	buttonContainer: {
	  alignItems: "center",
	  flex: 0.33,
	},
	button: {
	  justifyContent: "center",
	  alignItems: "center",
	  width: 350,
	  height: 60,
	  borderRadius: 15,
	},
	buttonText: {
	  color: "white",
	},
	text: {
	  marginTop: 20,
	  flexDirection: "row",
	  borderColor: colors.primaryColor,
	  borderBottomWidth: 0.5,
	},
	signupText: {
	  color: colors.primaryColor,
	  fontWeight: "600",
	},
	forgotPasswordText: {
	  color: colors.primaryColor,
	  alignSelf: "center",
	},
	error: {
	  color: "red",
	  fontSize: 12,
	  alignSelf: "center",
	},
  });
  
  export default LoginScreen;
  