import { Image, Text, View, StyleSheet, ScrollView, Dimensions} from 'react-native'
import OverlayMessage from '../../components/OverlayMessage'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { colorsPalette } from '../../assets/colorsPalette'
import { getNbGenerations } from '../../lib/axios'
import {useGlobalSearchParams, useRouter } from 'expo-router';

const WIDTH = Dimensions.get('window').width

const generations = () => {
  const {theme} = useTheme();
  const colors = colorsPalette[theme];
  const glob = useGlobalSearchParams();
  const route = useRouter();
  const [nbOfGens, setNbOfGens] = useState(0);
  const text = "Générations";
  const viewsPerGen = [];

  useEffect(() => {
    const loadData = async () => {
        setNbOfGens(getNbGenerations());

        for (let i = 0; i < nbOfGens; i++) {
            viewsPerGen.push(
            <View key={i}>
                <Text >Génération {i + 1}</Text>
            </View>
            );
        }
    }
    loadData();
  }, [])

  return (
        <View className="h-full pb-16" style={{backgroundColor:colors.background_c1}}>
            <View className="flex-1 justify-center items-center gap-8">
                <Text style={styles.text}>
                {text.split('').map((letter, index) => (
                    <View key={index}>
                        <Text style={styles.letter}>{letter}</Text>
                    </View>
                ))}
                </Text>
            </View>
            <ScrollView>
                {viewsPerGen}
            </ScrollView>
        </View>
  );
}

const styles = StyleSheet.create({
    image: {
      width: 300,
      height: 150,
      resizeMode: 'contain',
      marginBottom: 30,
    },
    text: {
      flexDirection: 'row', // Aligne les lettres horizontalement
    },
    letter: {
      color: '#ffdb4e', // Couleur du texte (jaune)
      fontSize: 32, // Taille de la police
      fontWeight: 'bold', // Poids de la police
      textShadowColor: 'blue', // Couleur du contour
      textShadowOffset: { width: 3, height: 3 }, // Décale l'ombre pour simuler un contour
      textShadowRadius: 3, // Fait en sorte que l'ombre soit un peu floue pour un effet plus doux
    },
    
  });

export default generations;