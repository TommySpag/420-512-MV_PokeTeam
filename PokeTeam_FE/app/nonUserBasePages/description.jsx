import React, { useEffect, useState } from 'react';
import { Image, Text, View, Dimensions, ScrollView } from 'react-native';
import { useLoading } from '../../contexts/loadingContext';
import { getPokemonInfoById, getPokemonInfoByName, getPokemonDescriptionByName } from '../../lib/axios';
import { useGlobalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { colorsPalette } from '../../assets/colorsPalette';

// images imports
import fire from '../../assets/images/loading/fire.bmp';
import water from '../../assets/images/loading/water.bmp';
import grass from '../../assets/images/loading/grass.bmp';
import bug from '../../assets/images/loading/bug.bmp';
import dark from '../../assets/images/loading/dark.bmp';
import dragon from '../../assets/images/loading/dragon.bmp';
import electric from '../../assets/images/loading/electric.bmp';
import fairy from '../../assets/images/loading/fairy.bmp';
import fight from '../../assets/images/loading/fight.bmp';
import flying from '../../assets/images/loading/flying.bmp';
import ghost from '../../assets/images/loading/ghost.bmp';
import ground from '../../assets/images/loading/ground.bmp';
import ice from '../../assets/images/loading/ice.bmp';
import normal from '../../assets/images/loading/normal.bmp';
import poison from '../../assets/images/loading/poison.bmp';
import psychc from '../../assets/images/loading/psychc.bmp';
import rock from '../../assets/images/loading/rock.bmp';
import steel from '../../assets/images/loading/steel.bmp';

const sprites = [
    { id: 'fire', sprite: fire },
    { id: 'water', sprite: water },
    { id: 'grass', sprite: grass },
    { id: 'bug', sprite: bug },
    { id: 'dark', sprite: dark },
    { id: 'dragon', sprite: dragon },
    { id: 'electric', sprite: electric },
    { id: 'fairy', sprite: fairy },
    { id: 'fight', sprite: fight },
    { id: 'flying', sprite: flying },
    { id: 'ghost', sprite: ghost },
    { id: 'ground', sprite: ground },
    { id: 'ice', sprite: ice },
    { id: 'normal', sprite: normal },
    { id: 'poison', sprite: poison },
    { id: 'psychic', sprite: psychc },
    { id: 'rock', sprite: rock },
    { id: 'steel', sprite: steel },
];

const WIDTH = Dimensions.get('window').width;

const PokemonDetails = () => {

    const { theme } = useTheme();
    const colors = colorsPalette[theme];
    const glob = useGlobalSearchParams();
    const [pokemon, setPokemon] = useState(null);
    const [description, setDescription] = useState(null);
    const { setLoading } = useLoading();

    const pokeName = "gengar"; 

    useEffect(() => {
        setLoading(true);
        const loadPokemonData = async () => {
            try {
                // Fetch Pokémon data
                const data = await getPokemonInfoByName(pokeName);
                const desc = await getPokemonDescriptionByName(pokeName);
                setPokemon(data);
                setDescription(desc);
            } catch (error) {
                console.log("Erreur 404");
            } finally {
                setLoading(false);
            }
        };
        loadPokemonData();
    }, [pokeName, setLoading]);

    if (!pokemon) {
        return <View><Text>Chargement des détails...</Text></View>;
    }

    return (
        <ScrollView className="flex-1 bg-gray-100 p-4">
            <View className="flex-1 justify-center items-center bg-white rounded-lg shadow-lg p-4">
                <Image style={{ width: 300, height: 300 }} source={{ uri: pokemon.sprite }} className="rounded-lg mx-auto mb-4" />
                <Text className="text-3xl font-semibold text-center text-gray-800 mb-2">{pokemon.name}</Text>
                <Text className="text-xl text-gray-600 mb-1">Pokedex: <Text className="font-semibold">#{pokemon.id}</Text></Text>
                <Text className="text-xl text-gray-600 mb-1">Weight: <Text className="font-semibold">{pokemon.weight} kg</Text></Text>

                <Text className="text-xl font-semibold text-gray-700 mt-4 mb-2">Types:</Text>
                <View className="flex-row mb-4">
                    {pokemon.types.map((type) => {
                        // Find the sprite for the type based on the `type.name` value
                        const typeSprite = sprites.find((sprite) => sprite.id === type.type.name)?.sprite;

                        return (
                            typeSprite ? (
                                <Image
                                    key={type.type.name}
                                    source={typeSprite}  // Use the imported sprite directly
                                    style={{ width: 60, height: 25, marginRight: 10 }}
                                />
                            ) : null
                        );
                    })}
                </View>

                <Text className="text-xl font-semibold text-gray-700 mt-4">Abilities:</Text>
                {pokemon.abilities.map((ability) => (
                    <Text key={ability.ability.name} className="text-lg text-gray-500 ml-4">{ability.ability.name}</Text>
                ))}
                <Text className="text-xl font-semibold text-gray-700 mt-4">Descrition:</Text>
                <Text className="mt-2 text-gray-700 text-lg italic">{description}</Text>
            </View>
        </ScrollView>
    );
};

export default PokemonDetails;