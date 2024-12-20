
//Done mostly by Lamb
import { Image, Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLoading } from '../../contexts/loadingContext';
import { colorsPalette } from '../../assets/colorsPalette';
import { getNbGenerations, getStartersForGeneration, getPokemonInfoByName} from '../../lib/axios';
import { useGenerationsTheme } from '../../contexts/generationContext';
import { useGlobalSearchParams, useRouter } from 'expo-router';

const WIDTH = Dimensions.get('window').width;

const generations = () => {
  const { theme } = useTheme();
  const colors = colorsPalette[theme];
  const {setGeneration} = useGenerationsTheme();
  const glob = useGlobalSearchParams();
  const route = useRouter();
  const [nbOfGens, setNbOfGens] = useState(0);
  const [viewsPerGen, setViewsPerGen] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);

  const { setLoading } = useLoading();

  const goToPokemons = (generation) => {
    setGeneration(generation);
}

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      const nbGenerations = await getNbGenerations();
      setNbOfGens(nbGenerations);
    };
    loadData().finally(() => setLoading(false));;
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
        setLoading(true);
        for (let i = 0; i < nbOfGens; i++) {
          const starters = await fetchStarters(i + 1);
          const startersData = await Promise.all(
            starters.map(async (starterName) => await fetchPokemonDataByName(starterName))
          );

          setPokemonData((prevData) => [...prevData, ...startersData]);

          newViews.push(
            <TouchableOpacity
              key={i}
              className="my-3 py-4 px-8 rounded-lg items-center justify-center"
              style={{backgroundColor:colors.btnColor}}
              onPress={goToPokemons(i + 1)}
            >
              <Text className="text-xl font-bold text-gray-800">Génération {i + 1}</Text>
              <View className="flex-row flex-wrap justify-center items-center mt-3">
                {startersData && startersData.map((pokemon, idx) => (
                  pokemon ? (
                    <View key={idx} className="items-center mx-2 my-2">
                      <Image source={{ uri: pokemon.sprite }} className="w-20 h-20 object-contain mb-2" />
                    </View>
                  ) : null
                ))}
              </View>
            </TouchableOpacity>
          );
        }

        setViewsPerGen(newViews);
        setLoading(false);
      };

      generateButtons();
    }
  }, [nbOfGens, theme]);

  return (
    <View className="h-full pb-16" style={{ backgroundColor: colors.background_c1 }}>
      <View className="justify-center items-center gap-8 p-10">
        <Text style={styles.text}>
          {'Générations'.split('').map((letter, index) => (
            <View key={index}>
              <Text style={colors.letter}>{letter}</Text>
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

  text: {
    flexDirection: 'row',
  },
 
});

export default generations;
