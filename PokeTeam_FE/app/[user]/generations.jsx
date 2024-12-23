
//Done mostly by Lamb
import { Image, Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLoading } from '../../contexts/loadingContext';
import { colorsPalette } from '../../assets/colorsPalette';
import { getNbGenerations, getStartersForGeneration, getPokemonInfoByName} from '../../lib/axios';
import { useGenerationsTheme } from '../../contexts/generationContext';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useColorTypeTheme } from '../../contexts/colorTypeContext';

const WIDTH = Dimensions.get('window').width;

const generations = () => {
  const { theme } = useTheme();
  const { type } = useColorTypeTheme();
  const colors = colorsPalette[theme];
  const glob = useGlobalSearchParams();
  const {setGeneration} = useGenerationsTheme();
  const route = useRouter();
  const [nbOfGens, setNbOfGens] = useState(0);
  const [viewsPerGen, setViewsPerGen] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);

  const { setLoading } = useLoading();

  const goToPokemons = (generation) => {
    setGeneration(generation);
    route.push(`/${glob.user}/pokemons`);
  }

  const goToProfile = () => {
    route.push(`/${glob.user}/profile`);
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
              className="my-3 py-2 px-4 rounded-lg items-center justify-center m-4"
              style={{backgroundColor:colors.btnColor}}
              onPress={() => goToPokemons(i + 1)}
            >
              <Text className="text-xl font-bold text-gray-800" style={{color:colors.generationsText}}>Génération {i + 1}</Text>
              <View className="flex-row flex-wrap justify-center items-center mt-2">
                {startersData && startersData.map((pokemon, idx) => (
                  pokemon ? (
                    <View key={idx} className="items-center mx-1 my-1">
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
      <View style={{ height: 4, backgroundColor: colorsPalette.type[type]}} />
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
      <TouchableOpacity
            style={{ backgroundColor: colors.btnBorderAndTextColor, borderColor: colors.primary}}
            className="py-4 px-6 rounded-md border my-2 self-center w-3/4"
            onPress={goToProfile}
        >
            <Text className="text-center text-2xl font-bold font-sans" style={{ color: colors.primary }}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  text: {
    flexDirection: 'row',
  },
 
});

export default generations;
