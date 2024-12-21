import React, { useEffect, useState } from 'react';
import { Image, Text, View, Dimensions, ScrollView, Animated,TouchableOpacity } from 'react-native';
import { useLoading } from '../../contexts/loadingContext';
import { getPokemonInfoByName, getPokemonDescriptionByName } from '../../lib/axios';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { usePokemonTheme } from '../../contexts/pokemonContext';
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
import { useGenerationsTheme } from '../../contexts/generationContext';

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
    const [fadeAnimation] = useState(new Animated.Value(0));
    const [currentText, setCurrentText] = useState('');
    const { pokemonName } = usePokemonTheme();
    const route = useRouter();
    


    const goToGenerations = () => {
        route.push('/nonUserBasePages/generations');
    }


    useEffect(() => {
        setLoading(true);
        const loadPokemonData = async () => {
            try {
                // Fetch Pokémon data
                const data = await getPokemonInfoByName(pokemonName);
                const desc = await getPokemonDescriptionByName(pokemonName);
                setPokemon(data);
                setDescription(desc);
            } catch (error) {
                console.log("Erreur 404");
            } finally {
                setLoading(false);
            }
        };
        loadPokemonData();
    }, [pokemonName, setLoading]);

    useEffect(() => {
        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnimation])

    useEffect(() => {
        if (description) {
            let i = 0;
            let animatedText = '';
            const interval = setInterval(() => {
                const char = description[i];
                animatedText += char;
                setCurrentText(animatedText);
                i++;
                if (i >= description.length) {
                    clearInterval(interval);
                }
            }, 50);
        }
    }, [description]);
    if (!pokemon) {
        return <View><Text>Chargement des détails...</Text></View>;
    }

    //style={[{ backgroundColor: colors.background_c1 }]}
    //style={[{ color: colors.black }]}
    return (
        <ScrollView className="flex-1 bg-gray-100 p-4">
            <View className="flex-1 justify-center items-center bg-white rounded-lg shadow-lg p-4" style={[{ backgroundColor: colors.background_c1 }]}>

                <View className = "rounded-lg shadow-lg w-3/4" style={[{ backgroundColor: colors.background }]} >
                    <View className="flex-1 justify-center items-center"><Animated.Image style={{ width: 250, height: 300, opacity: fadeAnimation }} source={{ uri: pokemon.sprite }} /></View>
                    <Text style={[{ color: colors.black }]} className="text-3xl font-semibold text-center mb-2">{pokemon.name}</Text>
                    <Text style={[{ color: colors.black }]}className="text-xl mb-2 text-center">Pokedex: <Text className="font-semibold">#{pokemon.id}</Text></Text>
                    <Text style={[{ color: colors.black }]}className="text-xl mb-8 text-center">Weight: <Text className="font-semibold">{pokemon.weight} kg</Text></Text>
                </View>

                <View className = "rounded-lg shadow-lg p-4 m-2 w-3/4" style={[{ backgroundColor: colors.background}]}>
                    <Text style={[{ color: colors.black }]}className="text-xl font-semibold  mt-4 mb-2 text-center">Types:</Text>
                    <View className="flex-row mb-4 justify-center items-center">
                        {pokemon.types.map((type) => {
                            const typeSprite = sprites.find((sprite) => sprite.id === type.type.name)?.sprite;
                            return (
                                typeSprite ? (
                                    <Image
                                        key={type.type.name}
                                        source={typeSprite}
                                        style={{ width: 60, height: 25, marginRight: 10 }}
                                    />
                                ) : null
                            );
                        })}
                    </View>
                </View>

                <View className = "rounded-lg shadow-lg p-4 m-2 w-3/4" style={[{ backgroundColor: colors.background }]}>
                    <Text style={[{ color: colors.black }]}className="text-xl font-semibold  mt-4 text-center">Abilities:</Text>
                    {pokemon.abilities.map((ability) => (
                        <Text style={[{ color: colors.black }]} key={ability.ability.name} className="text-lg  ml-4 text-center">{ability.ability.name}</Text>
                    ))}
                    <Text style={[{ color: colors.black }]}className="text-xl font-semibold mt-4 text-center">Descrition:</Text>
                    <Text style={[{ color: colors.black }]}className="mt-2 text-lg italic text-center">{currentText}</Text>
                </View>

                <View>
                <TouchableOpacity
                    style={[{ backgroundColor: colors.background }]}
                    className="rounded-lg shadow-lg p-4 m-2 flex-row items-center p-4 border-b border-gray-300"
                    onPress={() => goToGenerations()}
                >
                    <Text style={[{ color: colors.black }]} className="text-lg font-bold">go back</Text>
                </TouchableOpacity>
                </View>
            </View>

        </ScrollView>
    );
};

export default PokemonDetails;

