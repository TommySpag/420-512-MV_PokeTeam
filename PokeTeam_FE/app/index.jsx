import { Text, View, StyleSheet, Image} from 'react-native'
import React, { useState, useEffect} from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { TouchableOpacity } from 'react-native'
import { Link, useFocusEffect, useRouter} from 'expo-router'
import { colorsPalette } from '../assets/colorsPalette'
import { getIdFromJwt } from '../lib/axios'
import Redirect from '../lib/redirect'
const index = () => {
    const { theme } = useTheme()
    const router = useRouter()
    const colors = colorsPalette[theme]
    const text = "Pokémon";
    //return <Redirect href="./1/profile" />;
    useFocusEffect(() => {
        try{
            const getId = async () => {
                
                const id = await getIdFromJwt()
                if(!id){
                    console.log("no jwt")
                    return null
                }
                router.push(`/${id}/profile`)
                
            }
            getId()
            
        }catch(error){
            console.log(error)
        }
        
    })
    return (
        <View className={`flex-1 justify-evenly items-center`} style={{backgroundColor:colors.background_c1}} >
            <Image style={styles.image} 
                source={require('../assets/images/poketeamlogo.jpg')} 
            />
    
  
            

            <TouchableOpacity className={`rounded p-6`} style={{backgroundColor:colors.primary}} onPress={() => { router.push("./auth/signin")}}>
                <Text className={`text-4xl`} style={{color:colors.text2}} >Sign in</Text>
            </TouchableOpacity>
            <Text className="font-bold" style={{color:colors.primary}}>If you don't already have an account <Link style={{color:colors.descriptionText}} className="underline" href="./auth/signup">Sign up</Link></Text>
        </View>

        
        
    )
}

const styles = StyleSheet.create({
    image: {
        width: 300, 
        height: 150, 
        resizeMode: 'contain', 
        marginBottom: 30, 
    }
  });
export default index