import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLoading } from '../../contexts/loadingContext';
import { colorsPalette } from '../../assets/colorsPalette';
import { getPokemonInfoByName, getAllPokeTeamsAndRatings, updateTeamRating } from '../../lib/axios'; // Updated import to include getAllPokeTeamsAndRatings
import { Ionicons } from '@expo/vector-icons';

const TeamsPage = () => {
    const { theme } = useTheme();
    const { setLoading } = useLoading();
    const [teams, setTeams] = useState([]);
    const [pokemonData, setPokemonData] = useState([]);
    const colors = colorsPalette[theme];

    // Mock team data when backend is down
    const mockTeams = [{
        id: 1,
        pokemon1_id: 25,
        pokemon2_id: 3,
        pokemon3_id: 6,
        pokemon4_id: 9,
        pokemon5_id: 143,
        pokemon6_id: 131,
        rating: 0,
        nbT_Rated: 0
    },
    {
        id: 2,
        pokemon1_id: 36,
        pokemon2_id: 94,
        pokemon3_id: 115,
        pokemon4_id: 71,
        pokemon5_id: 38,
        pokemon6_id: 9,
        rating: 0,
        nbT_Rated: 0
    },
    {
        id: 3,
        pokemon1_id: 103,
        pokemon2_id: 65,
        pokemon3_id: 59,
        pokemon4_id: 112,
        pokemon5_id: 130,
        pokemon6_id: 18,
        rating: 0,
        nbT_Rated: 0
    }
];

    // Fetch the Pokémon data for each team
    const fetchPokemonData = async (pokeIds) => {
        const pokemonPromises = pokeIds.map(async (pokeId) => {
            const pokemon = await getPokemonInfoByName(pokeId);
            return pokemon;
        });

        const results = await Promise.all(pokemonPromises);
        return results;
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
                            <Text className="text-base font-bold text-white">{pokemon.name}</Text>
                        </View>
                    ) : null;
                })}
            </View>
        ));
    };

    const handleRatingChange = async (teamId, newRating) => {
        // Update rating locally
        setTeams((prevTeams) => {
            return prevTeams.map((team) => {
                if (team.id === teamId) {
                    // Calculate new average rating
                    const updatedRating = ((team.rating * team.nbT_Rated) + newRating) / (team.nbT_Rated + 1);
                    const updatedNbRated = team.nbT_Rated + 1;

                    return {
                        ...team,
                        rating: updatedRating,
                        nbT_Rated: updatedNbRated
                    };
                }
                return team;
            });
        });

        // Update the rating on the backend
        try {
            const userData = {
                id: teamId,
                rating: ((newRating + newRating) / 2),  // Make sure to handle the proper data formatting
                nbT_Rated: 1
            };
            await updateTeamRating(userData);
            console.log('Rating updated successfully!');
        } catch (error) {
            console.log('Error updating team rating:', error);
        }
    };

    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true);
            try {
                // Try to fetch the teams and ratings from the backend
                const teamsData = await getAllPokeTeamsAndRatings();
                setTeams(teamsData); // Set the teams in state

                // Fetch Pokémon data for the teams
                const updatedPokemonData = [];
                for (let team of teamsData) {
                    const pokeIds = [
                        team.pokemon1_id,
                        team.pokemon2_id,
                        team.pokemon3_id,
                        team.pokemon4_id,
                        team.pokemon5_id,
                        team.pokemon6_id
                    ];
                    const teamPokemonData = await fetchPokemonData(pokeIds);
                    updatedPokemonData.push({ teamId: team.id, data: teamPokemonData });
                }

                const newPokemonData = {};
                updatedPokemonData.forEach((data) => {
                    newPokemonData[data.teamId] = data.data;
                });

                setPokemonData(newPokemonData);
            } catch (error) {
                console.log('Error fetching teams or Pokémon data:', error);
                // Fallback to mock team data if the backend is down
                setTeams(mockTeams);
                // Still fetch Pokémon data from PokéAPI
                const updatedPokemonData = [];
                for (let team of mockTeams) {
                    const pokeIds = [
                        team.pokemon1_id,
                        team.pokemon2_id,
                        team.pokemon3_id,
                        team.pokemon4_id,
                        team.pokemon5_id,
                        team.pokemon6_id
                    ];
                    const teamPokemonData = await fetchPokemonData(pokeIds);
                    updatedPokemonData.push({ teamId: team.id, data: teamPokemonData });
                }

                const newPokemonData = {};
                updatedPokemonData.forEach((data) => {
                    newPokemonData[data.teamId] = data.data;
                });

                setPokemonData(newPokemonData);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    return (
        <ScrollView className="h-full pb-16" style={{ backgroundColor: colors.background_c1 }}>
            <View className="justify-center items-center p-10">
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
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ color: colors.text, marginTop: 16 }}>Loading teams...</Text>
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

                            <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'center', alignItems: 'center' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => handleRatingChange(item.id, star)}
                                        className="m-3"
                                    >
                                        <Ionicons
                                            size={24}
                                            name={star <= item.rating ? 'star' : 'star-outline'}
                                            color={star <= item.rating ? '#FACC15' : '#D1D5DB'}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    text: {
        flexDirection: 'row',
    },
});

export default TeamsPage;
