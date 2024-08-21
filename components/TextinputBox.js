import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react'
import colors from '../constants/Stylings';
const {width,height}=Dimensions.get("screen")

const TextInputBox = ({ editable,placeholder,value,keyboardType,onChangeText,mail, password,...props}) => {
    const [hidePassword,setHidePassword]=useState(!password)

    const Visible=()=>{
        setHidePassword(!hidePassword)
    }

  return (
    <View style={{marginVertical:10}}>
    <View style={styles.textBox}>
      <TextInput 
      editable={editable}
      placeholder={placeholder}
      value={value}
      cursorColor={"#002"}
      password={password}
      secureTextEntry={!hidePassword}
      placeholderTextColor={"#6A6A6A"}
      style={{width:width-100}}
      mail={mail}
      keyboardType={keyboardType}
      onChangeText={onChangeText}
       {...props}/>
       {mail && (<MaterialIcons name="mail" size={24} color={colors.primaryColor} />)}
           {password &&(<TouchableOpacity onPress={Visible}>{hidePassword? (<Fontisto name="locked" size={24} color={colors.primaryColor} />):(<Fontisto name="unlocked" size={24} color={colors.primaryColor} />)}</TouchableOpacity>)}

    </View>
    </View>
  )
}


const styles = StyleSheet.create({
    textBox:{
        backgroundColor:"white",
        alignItems:"center",
        height:45,
        width:width-30,
        borderColor:colors.primaryColor,
        borderWidth:0.5,
        marginBottom:5,
        borderRadius:10,
        justifyContent:"space-between",
        flexDirection:"row",
        paddingHorizontal:15
    }
})
export default TextInputBox

