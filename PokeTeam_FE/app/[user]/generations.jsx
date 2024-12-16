
//Done mostly by Lamb
import { Image, Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colorsPalette } from '../../assets/colorsPalette';
import { getNbGenerations, getStartersForGeneration, getPokemonInfoByName} from '../../lib/axios';
import { useGlobalSearchParams, useRouter } from 'expo-router';

const WIDTH = Dimensions.get('window').width;

const generations = () => {
  const { theme } = useTheme();
  const colors = colorsPalette[theme];
  const glob = useGlobalSearchParams();
  const route = useRouter();
  const [nbOfGens, setNbOfGens] = useState(0);
  const [viewsPerGen, setViewsPerGen] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const nbGenerations = await getNbGenerations();
      setNbOfGens(nbGenerations);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (nbOfGens !== 0) {
      const newViews = [];

      const fetchStarters = async (generationId) => {
        try {
          const startersNames = await getStartersForGeneration(generationId);
          return startersNames;
        } catch (error) {
          console.error('Error fetching starters:', error);
          return [];
        }
      };

      const fetchPokemonDataByName = async (pokeName) => {
        const pokemon = await getPokemonInfoByName(pokeName);
        return pokemon;
      };

      const generateButtons = async () => {
        for (let i = 0; i < nbOfGens; i++) {
          const starters = await fetchStarters(i + 1);
          const startersData = await Promise.all(
            starters.map(async (starterName) => await fetchPokemonDataByName(starterName))
          );

          setPokemonData((prevData) => [...prevData, ...startersData]);

          newViews.push(
            <TouchableOpacity
              key={i}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Génération {i + 1}</Text>
              <View style={styles.startersContainer}>
              {startersData && startersData.map((pokemon, idx) => (
                pokemon ? (
                  <View key={idx} style={styles.pokemonInfo}>
                    <Image source={{ uri: pokemon.sprite }} style={styles.image} />
                  </View>
                ) : null
              ))}
              </View>
            </TouchableOpacity>
          );
        }

        setViewsPerGen(newViews);
      };

      generateButtons();
    }
  }, [nbOfGens]);

  return (
    <View className="h-full pb-16" style={{ backgroundColor: colors.background_c1 }}>
      <View className="flex-1 justify-center items-center gap-8 p-10">
        <Text style={styles.text}>
          {'Générations'.split('').map((letter, index) => (
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
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffdb4e',
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starterText: {
    fontSize: 14,
    color: '#555555',
  },
  startersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pokemonInfo: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  pokemonInfo: {
    alignItems: 'center',
    marginVertical: 5,
  },
  pokemonName: {
    fontSize: 16,
    color: '#333',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    flexDirection: 'row',
  },
  letter: {
    color: '#ffdb4e',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'blue',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3,
  },
});

export default generations;
