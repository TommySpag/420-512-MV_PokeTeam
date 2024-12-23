import { Image, Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLoading } from '../../contexts/loadingContext';
import { useGenerationsTheme } from '../../contexts/generationContext';
import { usePokemonTheme } from '../../contexts/pokemonContext';
import { colorsPalette } from '../../assets/colorsPalette';
import { getPokemonsForGeneration} from '../../lib/axios';
import { useColorTypeTheme } from '../../contexts/colorTypeContext';
import { useRouter, useGlobalSearchParams } from 'expo-router';

const PokemonsByGeneration = () => {
  const { theme } = useTheme();
  const { type } = useColorTypeTheme();
  const { generation } = useGenerationsTheme();
  const { setPokemonName } = usePokemonTheme();
  const glob = useGlobalSearchParams();
  const colors = colorsPalette[theme];
  const route = useRouter();
  const [pokemonsList, setPokemonsList] = useState([]);

  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
        try {
            const data = await getPokemonsForGeneration(generation);
            setPokemonsList(data);
        } catch (error) {
            console.log("Erreur loading pokemon from generation");
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [generation, setLoading]);

  const goToDescription = (pokeName) => {
    setPokemonName(pokeName);
    route.push(`/${glob.user}/description`);
  };

  const goToGenerations = () => {
    route.push(`/${glob.user}/generations`);
  };

  return (
    <>
      <View className="h-full pb-16" style={{ backgroundColor: colors.background_c1 }}>
        <View style={{ height: 5, backgroundColor: colorsPalette.type[type]}} />
            <View className="justify-center gap-8 p-5">
              <Text className="flex-row">
                {'Pokémons'.split('').map((letter, index) => (
                  <View key={index}>
                    <Text style={colors.letter}>{letter}</Text>
                  </View>
                ))}
              </Text>
            </View>
            <ScrollView className="h-full pb-16" style={{ backgroundColor: colors.background_c1 }}>
              {pokemonsList.map((pokemon, index) => (
                <TouchableOpacity
                  key={index}
                  className="py-4 px-6 rounded-md border my-2 self-center w-3/4"
                  style={{ backgroundColor: colors.primary, borderColor: colors.btnBorderAndTextColor}}
                  onPress={() => goToDescription(pokemon)}
                >
                  <Text className="text-center text-2xl font-bold font-sans" style={{ color: colors.btnBorderAndTextColor }}>
                    {pokemon}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
                  style={{ backgroundColor: colors.btnBorderAndTextColor, borderColor: colors.primary}}
                  className="py-4 px-6 rounded-md border my-2 self-center w-3/4"
                  onPress={goToGenerations}
              >
                  <Text className="text-center text-2xl font-bold font-sans" style={{ color: colors.primary }}>Go back</Text>
            </TouchableOpacity>
      </View>
    </>
  );
};

export default PokemonsByGeneration;
