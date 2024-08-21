import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Image,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { LinearGradient } from "expo-linear-gradient";
  import TextInputBox from "../components/TextinputBox";
  import colors from "../constants/Stylings";
  import axios from "axios";
  import AppIcon from "../assets/images/Appicon.png";
  import { SafeAreaView } from "react-native-safe-area-context";
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const SignupScreen = ({ navigation }) => {
	const [loading, setLoading] = useState(false);
	const [Email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
  
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
  
	const validateUsername = (username) => {
	  if (username === "") {
		return "Invalid Username";
	  }
	  if (username.length < 3) {
		return "Username must be at least 3 characters long";
	  }
	  return "";
	};
  
	const PasswordValidation = (emailPass, passCode, userName) => {
	  const usernameError = validateUsername(userName);
	  if (usernameError) {
		setPasswordError(usernameError);
		setLoading(false);
		return false;
	  }
	  const emailError = validateEmail(emailPass);
	  if (emailError) {
		setPasswordError(emailError);
		setLoading(false);
		return false;
	  }
  
	  const passwordError = validatePassword(passCode);
	  if (passwordError) {
		setPasswordError(passwordError);
		setLoading(false);
		return false;
	  }
  
	  setPasswordError("");
	  return true;
	};
  
	const NavigateToLogin = async () => {
	  Keyboard.dismiss();
	  if (PasswordValidation(Email, password, username) === true) {
		const req = {
		  email: Email.trim(),
		  username: username.trim(),
		  password: password.trim(),
		};
		setLoading(true);
		try {
		  const response = await axios.post("https://emergencytracker-rm8r.onrender.com/signup/", req);
		  console.log(response?.data);
  
		  // Store the token in AsyncStorage
		  await AsyncStorage.setItem('access_token', response.data.access_token);
	  
		  // Navigate to the main page
		  navigation.navigate("Gps");
		} catch (error) {
		  console.log(error.response.data);
		  setLoading(false);
		  setPasswordError("Error");
		}
	  }
	};
  
	useEffect(() => {
	  const checkAuth = async () => {
		const token = await AsyncStorage.getItem('access_token');
		if (token) {
		  navigation.navigate('Gps');
		}
	  };
  
	  checkAuth();
	}, [navigation]);
  
	useEffect(() => {
	  const unSubscribe = navigation.addListener("focus", () => {
		Keyboard.dismiss();
		setEmail("");
		setUsername("");
		setPassword("");
		setPasswordError("");
		setLoading(false);
	  });
	  return unSubscribe;
	}, [navigation]);
  
	return (
	  <SafeAreaView style={styles.container}>
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
			  value={username.trim()}
			  placeholder={"Username eg-@example"}
			  onChangeText={setUsername}
			/>
			<TextInputBox
			  editable={!loading}
			  value={Email}
			  mail
			  placeholder={"Email (e.g., example@domain.com)"}
			  onChangeText={setEmail}
			/>
			<TextInputBox
			  editable={!loading}
			  value={password}
			  password
			  placeholder={"Password (min. 5 characters)"}
			  onChangeText={setPassword}
			/>
			<Text style={styles.error}>{passwordError}</Text>
		  </View>
		  <View style={{ alignItems: "center", flex: 0.28 }}>
			<LinearGradient
			  colors={[colors.primaryColor, "#007bfc"]}
			  start={{ x: 1, y: 0 }}
			  end={{ x: 0, y: 0 }}
			  style={{ borderRadius: 15 }}
			>
			  <TouchableOpacity
				style={styles.button}
				onPress={NavigateToLogin}
				disabled={loading}
			  >
				{loading ? (
				  <ActivityIndicator size={"large"} color={"white"} />
				) : (
				  <Text style={{ color: "white" }}>Sign up</Text>
				)}
			  </TouchableOpacity>
			</LinearGradient>
			<TouchableOpacity
			  onPress={() => navigation.navigate("Login")}
			>
			  <View style={styles.text}>
				<Text style={{ color: "grey" }}>Already have an account? </Text>
				<Text
				  style={{
					color: colors.primaryColor,
					fontWeight: "600",
				  }}
				>
				  Log In
				</Text>
			  </View>
			</TouchableOpacity>
		  </View>
		</KeyboardAvoidingView>
	  </SafeAreaView>
	);
  };
  
  const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: "white",
	  justifyContent: "center",
	  alignItems: "center",
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
	image: {
	  width: 145,
	  height: 145,
	},
	button: {
	  justifyContent: "center",
	  alignItems: "center",
	  width: 350,
	  height: 60,
	  borderRadius: 15,
	},
	text: {
	  marginTop: 20,
	  flexDirection: "row",
	  borderColor: colors.primaryColor,
	  borderBottomWidth: 0.5,
	},
	error: {
	  color: "red",
	  fontSize: 12,
	  justifyContent: "flex-start",
	},
  });
  
  export default SignupScreen;
  