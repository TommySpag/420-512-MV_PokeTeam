import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet, ScrollView, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLoading } from '../../contexts/loadingContext';
import { colorsPalette } from '../../assets/colorsPalette';
import { getPokemonInfoByName, getAllPokeTeamsAndRatings, updateTeamRating } from '../../lib/axios';
import { Ionicons } from '@expo/vector-icons';
import { useColorTypeTheme } from '../../contexts/colorTypeContext';
import { useGlobalSearchParams, useFocusEffect, useRouter } from "expo-router";

const TeamsPage = () => {
    const { theme } = useTheme();
    const { type } = useColorTypeTheme();
    const { setLoading } = useLoading();
    const [teams, setTeams] = useState([]);
    const route = useRouter();
    const [pokemonData, setPokemonData] = useState([]);
    const glob = useGlobalSearchParams();
    const colors = colorsPalette[theme];
    const [isLoaded, setIsLoaded] = useState(false);

    const [fade] = useState(new Animated.Value(0));
    const [scale] = useState(new Animated.Value(0));


    // Fetch the Pokémon data for each team
    const fetchPokemonData = async (pokeIds) => {
        const pokemonPromises = pokeIds.map(async (pokeId) => {
            const pokemon = await getPokemonInfoByName(pokeId);
            return pokemon;
        });

        const results = await Promise.all(pokemonPromises);
        return results;
    };

    const goToProfile = () => {
        route.push(`/${glob.user}/profile`);
    };

    const renderPokemon = (team) => {
        const pokeIds = [
            team.pokemon1_id,
            team.pokemon2_id,
            team.pokemon3_id,
            team.pokemon4_id,
            team.pokemon5_id,
            team.pokemon6_id
        ];

        const pokemonInRows = []; // Group Pokémon into rows of 3
        for (let i = 0; i < pokeIds.length; i += 3) {
            pokemonInRows.push(pokeIds.slice(i, i + 3));
        }

        return pokemonInRows.map((row, rowIndex) => (
            <View key={rowIndex} className="flex flex-row justify-center mb-2 mx-2">
                {row.map((pokeId) => {
                    const pokemon = pokemonData[team.id]?.find(poke => poke.id === pokeId);
                    return pokemon ? (
                        <View key={pokeId} className="items-center mx-2">
                            <Image
                                source={{ uri: pokemon.sprite }}
                                className="w-12 h-12 object-contain"
                            />
                            <Animated.Text style={[styles.pokemonName, { opacity: fade, transform: [{ scale: scale }] }]}>{pokemon.name}</Animated.Text>
                        </View>
                    ) : null;
                })}
            </View>
        ));
    };

    const handleRating = async (teamId, newRating) => {
        setTeams((prevTeams) =>
            prevTeams.map((team) => {
                if (team.id === teamId) {
                    const updatedSumOfRatings = team.rating + newRating;
                    const updatedNbRated = team.nbT_Rated + 1;
                    return {
                        ...team,
                        rating: updatedSumOfRatings,
                        nbT_Rated: updatedNbRated,
                        avgRating: (updatedSumOfRatings / updatedNbRated).toFixed(1),
                    };
                }
                return team;
            })
        );
    
        const updatedTeam = teams.find((team) => team.id === teamId);
        if (!updatedTeam) return;
    
        const payload = {
            ...updatedTeam,
            rating: updatedTeam.rating + newRating,
            nbT_Rated: updatedTeam.nbT_Rated + 1,
        };
    
        console.log('Payload being sent to the backend:', payload);
    
        try {
            // Send the update to the backend
            await updateTeamRating(teamId, payload);
            console.log(`Successfully updated rating for team ${teamId}`);
        } catch (error) {
            console.error(`Error updating rating for team ${teamId}:`, error);
        }
    };

    const calculateAverageRatings = (teams) => {
        return teams.map((team) => {
            const avgRating = team.nbT_Rated > 0 ? team.rating / team.nbT_Rated : 0; // Avoid division by zero
            return {
                ...team,
                avgRating: avgRating.toFixed(1), // Optional: Limit the decimal places to 1
            };
        });
    };

    const renderStars = (team) => {
        const avgRating = team.avgRating;

        return (
            <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'center', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => handleRating(team.id, star)} // Call handleRating when a star is clicked
                        style={{ marginHorizontal: 4}}
                    >
                        <Ionicons
                            size={24}
                            name={star <= avgRating ? 'star' : 'star-outline'}
                            color={star <= avgRating ? '#FACC15' : '#D1D5DB'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const fetchTeams = async () => {
        setLoading(true);
        try {
            // Fetch the teams and ratings from the backend
            const teamsData = await getAllPokeTeamsAndRatings(glob.user);
            const validTeamsData = teamsData.filter(team => team.pokemon1_id !== null);

            // Calculate average ratings for each team
            const teamsWithAvgRating = calculateAverageRatings(validTeamsData);

            setTeams(teamsWithAvgRating); // Set the updated teams in state

            // Fetch Pokémon data for the teams
            const updatedPokemonData = [];
            for (let team of teamsWithAvgRating) {
                const pokeIds = [
                    team.pokemon1_id,
                    team.pokemon2_id,
                    team.pokemon3_id,
                    team.pokemon4_id,
                    team.pokemon5_id,
                    team.pokemon6_id,
                ];
                const teamPokemonData = await fetchPokemonData(pokeIds);
                updatedPokemonData.push({ teamId: team.id, data: teamPokemonData });
            }

            const newPokemonData = {};
            updatedPokemonData.forEach((data) => {
                newPokemonData[data.teamId] = data.data;
            });

            setPokemonData(newPokemonData);
            setIsLoaded(true);
        } catch (error) {
            console.log('Error fetching teams or Pokémon data:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchTeams();
        }, [])
    )

    useEffect(() => {
        if (isLoaded) {
            Animated.timing(fade, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start();
            Animated.timing(scale, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoaded]);

    return (
        <View className="h-full pb-16" style={{ backgroundColor: colors.background_c1 }}>
            <View style={{ height: 5, backgroundColor: colorsPalette.type[type]}} />
                <View className="justify-center items-center p-5">
                    <Text style={styles.text}>
                        {'All Pokemon Teams'.split('').map((letter, index) => (
                            <View key={index}>
                                <Text style={colors.letter}>{letter}</Text>
                            </View>
                        ))}
                    </Text>
                </View>
                {teams.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <Text style={{ color: colors.text, marginTop: 16 }}>No teams currently available</Text>
                    </View>
                ) : (
                    <FlatList
                        data={teams}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    padding: 16,
                                    marginBottom: 16,
                                    backgroundColor: colors.background,
                                    borderRadius: 8,
                                    shadowColor: colors.shadow,
                                }}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                                    Team: {item.id}
                                </Text>
                                <View style={{ marginTop: 8 }}>
                                    {renderPokemon(item)}
                                </View>
                                {renderStars(item)}
                            </View>
                        )}
                    />
                )}
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
    pokemonName: {
        fontSize: 14,
        fontWeight: 'bold', 
        color: 'white', 
    }
});

export default TeamsPage;