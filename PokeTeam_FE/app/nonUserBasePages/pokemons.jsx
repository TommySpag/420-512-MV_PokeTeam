import { Image, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLoading } from '../../contexts/loadingContext';
import { useGenerationsTheme } from '../../contexts/generationContext';
import { usePokemonTheme } from '../../contexts/pokemonContext';
import { colorsPalette } from '../../assets/colorsPalette';
import { getPokemonsForGeneration} from '../../lib/axios';
import { useRouter } from 'expo-router';

const PokemonsByGeneration = () => {
  const { theme } = useTheme();
  const { generation } = useGenerationsTheme();
  const { setPokemonName } = usePokemonTheme();
  const colors = colorsPalette[theme];
  const router = useRouter();
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
  };

  return (
    <ScrollView className="h-full pb-16" style={{ backgroundColor: colors.background_c1 }}>
      {pokemonsList.map((pokemon, index) => (
        <TouchableOpacity
          key={index}
          className="flex-row items-center p-4 border-b border-gray-300"
          onPress={() => goToDescription(pokemon)}
        >
          <Text className="text-lg font-bold">{pokemon}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default PokemonsByGeneration;
