import { Image, Text, View, TextInput, TouchableOpacity, Modal, FlatList, Dimensions, ScrollView } from 'react-native'
import OverlayMessage from '../../components/OverlayMessage'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { colorsPalette } from '../../assets/colorsPalette'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { fetchProfileData, setToken, updateProfileData, deleteUserById, getPokemonInfoByName, updateTeamData, uploadImageToGitHub } from '../../lib/axios'
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLoading } from '../../contexts/loadingContext';
import * as ImagePicker from 'expo-image-picker';

const WIDTH = Dimensions.get('window').width



const profile = () => {
  const { theme } = useTheme()
  const colors = colorsPalette[theme]
  const glob = useGlobalSearchParams();
  const route = useRouter()
  const { setLoading } = useLoading();

  //Default Data

  const [username, setUsername] = useState("Default")
  const [email, setEmail] = useState('Default@abc.ca')
  const [profilePic, setProfilePic] = useState('');
  const [pokeTeam, setPokeTeam] = useState([25, 3, 6, 9, 143, 131]);
  const [teamRating, setTeamRating] = useState(0);
  const [motDePasse, setMotDePasse] = useState('*****');
  const [pokemonData, setPokemonData] = useState([]);
  const [selectedPokemonIndex, setSelectedPokemonIndex] = useState(null);

  //use pokedate pour display les pokemon (map) pokedata[0] = premier (pokemon pokemonData[0].pokename.sprite)

  //States
  const [isEditing, setIsEditing] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [messageVisible, setMessageVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditSuccess, setIsEditSuccess] = useState(false)

  //On mount

  //Lam
  //Retrieves data from database about the user
  useEffect(() => {
    // Fetch profile data

    const loadProfileData = async () => {
      try {
        setLoading(true);
        const profileData = await fetchProfileData(glob.user);
        if (!profileData) throw new Error('Failed fetching data -> no Data')
        setUsername(profileData.username);
        setEmail(profileData.email);
        if (profileData.profilePic) {
          setProfilePic(profileData.profilePic);
        }
        const tempList = [];
        for (let i; i < 6; i++) {
          let key = `pokemon${i}_id`
          tempList.push(profileData[key])
        }
        // setPokeTeam(tempList);

        setTeamRating(Math.round(profileData.team_grade));

      } catch (error) {
        console.log('Profile : Failed Loading profileData : ', error)
        // route.push("/auth/signin")
      }
      setLoading(false);
    };

    loadProfileData();

    setIsMounted(true);

    return () => {
      setIsMounted(false); // Clean up on unmount
    };
  }, []);

  //Function to retrieve the data of a pokemon from pokeApi
  const fetchPokemonDataByName = async (pokeName) => {
    const pokemon = await getPokemonInfoByName(pokeName);
    return pokemon;
  };
  //Fetches data from pokeApi and set the data in a list
  useEffect(() => {
    const fetchPokemonInfo = async () => {
      const pokemonInfoPromises = pokeTeam.map(async (pokeId) => {
        const pokemonData = await fetchPokemonDataByName(pokeId);
        return pokemonData;
      });
      const results = await Promise.all(pokemonInfoPromises);
      setPokemonData(results);
    };
    fetchPokemonInfo();
  }, [pokeTeam])

  //Lam

  // Saves and gives a feedback to user
  const handleSave = async () => {

    let isSaved = false
    const saveProfileData = async () => {

      const userData = {
        username,
        email,
        profilePic,
        id: glob.user
      }
      try {
        isSaved = await updateProfileData(userData)
      } catch (error) {
        console.log("Saving Error : ", error)
        isSaved = false
      }
      return isSaved
    }
    setIsEditSuccess(await saveProfileData())
    setMessageVisible(true);
    setTimeout(() => {
      setMessageVisible(false);
    }, 2000);

  };

  // Handle changes in editing/non-editing mode
  useEffect(() => {
    if (!isMounted) return
    if (!isEditing) {
      handleSave()
    }
  }, [isEditing, theme])


  const supprimerUser = async () => {
    try {
      const deleteUser = await deleteUserById(glob.user)
      logOut()
    } catch (error) {
      console.log(error)
    }
  }
  const logOut = () => {
    setToken('')
    route.push('/')
  }
  const goToGens = () => {
    route.push('./generations')
  }

  const swapPokemon = (index) => {
    if (isEditing) {
      if (selectedPokemonIndex === null) {
        setSelectedPokemonIndex(index);
      } else {
        let updatedTeam = [...pokeTeam];
        const temp = updatedTeam[selectedPokemonIndex];
        updatedTeam[selectedPokemonIndex] = updatedTeam[index];
        updatedTeam[index] = temp;
  
        setPokeTeam(updatedTeam);
        saveNewPokemonOrder(updatedTeam);
  
        setSelectedPokemonIndex(null);
      }
    } else {
      route.push(`/nonUserBasePages/description`);
    }
  };
  
  const Item = ({ item, index }) => (
    <View className="flex items-center justify-center w-30 mt-8">
      <TouchableOpacity
        onPress={() => {
          if (isEditing) {
            swapPokemon(index);  // Swap the Pokémon if editing
          } else {
            route.push(`/nonUserBasePages/description`);  // Navigate to description page when not editing
          }
        }}
        className={`mx-2 py-4 px-2 rounded-lg items-center justify-center w-[100px] h-[120px] flex-shrink-0 flex-grow-0`}
        style={{ backgroundColor: colors.btnColor }}
      >
        <Image source={{ uri: item.sprite }} className="w-12 h-12 object-contain" />
        <Text className="text-center font-bold w-full text-center overflow-hidden">{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  const saveNewPokemonOrder = async (newOrder) => {
    try {
      await updateTeamData(newOrder);
      console.log('Pokemon order updated successfully');
    } catch (error) {
      console.error('Error updating Pokemon order:', error);
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera access is required to upload profile pictures.');
      return false;
    }
    return true;
  };

  const handleProfilePicPress = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      if (!fileUri.startsWith('file://')) {
        console.error('Invalid file URI:', fileUri);
        return;
      }
  
      try {
        const uploadedImageUrl = await uploadImageToGitHub(fileUri, 'profile_pictures/myProfilePic.png');
        setProfilePic(uploadedImageUrl); 
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  return (
    <>
      <ScrollView className="h-full pb-16" style={{ backgroundColor: colors.background_c1 }}>
        <View className="w-full" >
          <View className="justify-center items-center py-5">
            <TouchableOpacity
              onPress={handleProfilePicPress}
              className="rounded-full "
              disabled={!isEditing}
              style={isEditing ? { borderWidth: 4, borderColor: colors.lightAlert } : {}}
            >
              <Image
                style={{ width: 150, height: 150, borderRadius: 9999 }}
                source={
                  profilePic
                    ? { uri: profilePic }
                    : require('../../assets/images/profile/red.jpg')
                }
              />
            </TouchableOpacity>
            <View className="">
              {!isEditing ?
                <Text className="text-4xl font-medium px-16" style={{ color: colors.primary }}>{username}</Text>
                :
                <TextInput
                  className="justify-center text-center text-4xl font-medium px-16"
                  style={[{ color: colors.primary, backgroundColor: colors.background_c1 }]}
                  onChangeText={(item) => { setUsername(item) }}
                  placeholder="Entrez l'identifiant"
                  placeholderTextColor={colors.secondary}
                  value={username}
                />
              }

            </View>
          </View>
          <View className="items-center">
            <View className="items-center border rounded-md w-2/4" style={{ borderColor: isEditing ? colors.lightAlert : colors.primary }}>
              <Text className="absolute z-10 -top-2.5 left-3 px-1" style={{ backgroundColor: colors.background_c1, color: colors.text }}>email</Text>
              {!isEditing ?
                <Text className="py-3 px-2" style={{ color: colors.text }}>{email}</Text>
                :
                <TextInput
                  className="justify-center z-0 py-5 rounded-lg text-center w-full py-5 rounded-lg text-center focus:border-2"
                  style={[{ color: colors.text2, backgroundColor: colors.background }]}
                  onChangeText={(item) => { setEmail(item) }}
                  placeholder="Entrez l'identifiant"
                  placeholderTextColor={colors.text2}
                  value={email}
                />
              }
            </View>
          </View>

          <View className="items-center mt-8">
            <View className="items-center border rounded-md w-2/4" style={{ borderColor: isEditing ? colors.lightAlert : colors.primary }}>
              <Text className="absolute z-10 -top-2.5 left-3 px-1" style={{ backgroundColor: colors.background_c1, color: colors.text }}>mot de passe</Text>
              {!isEditing ?
                <Text className="py-3 px-2" style={{ color: colors.background }}>{motDePasse}</Text>
                :
                <TextInput
                  className="justify-center z-0 py-5 rounded-lg text-center w-full"
                  style={[{ color: colors.text, backgroundColor: colors.background }]}
                  onChangeText={(item) => { setMotDePasse(item) }}
                  placeholder="Entrez l'identifiant"
                  placeholderTextColor={colors.secondary}
                  value={email}
                />
              }
            </View>
          </View>

          <View className="items-center mt-8">
            <FlatList
              scrollEnabled={false}
              numColumns={3}
              data={pokemonData}
              renderItem={Item}
              keyExtractor={item => item.id}
            />
          </View>


          <View className="items-center mt-8">
            <Text className="text-lg mb-4 font-semibold text-gray-700">
              Note de l'équipe
            </Text>

            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= teamRating ? 'star' : 'star-outline'}
                  size={32}
                  color={star <= teamRating ? '#FACC15' : '#D1D5DB'}
                />
              ))}
            </View>

            <Text className="mt-3 text-gray-600"> Note : {teamRating} sur 5</Text>
          </View>

        </View>



        <View className="w-full items-center">
          <View className="flex-row justify-center items-center py-10 gap-5">
            <TouchableOpacity onPress={logOut} className="flex-row items-center justify-center w-1/3 p-2 rounded-md" style={{ backgroundColor: colors.lightAlert }}>
              <Text className="pr-1" style={{ color: colors.lightText }}>Déconnextion </Text>
              <Icon name="sign-out-alt" size={30} color={colors.lightText} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setIsEditing((prev) => { return !prev }) }} className="flex-row items-center justify-center w-1/3 p-2 rounded-md" style={{ backgroundColor: colors.lightAlert }}>
              <Text className="pr-1" style={{ color: colors.lightText }}>Modifier </Text>
              <Icon name="edit" size={30} color={colors.lightText} />
            </TouchableOpacity>
          </View>
          <View className="" />
          <TouchableOpacity onPress={supprimerUser} className="flex-row items-center justify-center w-1/3 p-2 rounded-md" style={{ backgroundColor: colors.alert }}>
            <Text className="pr-1" style={{ color: colors.lightText }}>Supprimer </Text>
            <Icon name="trash-alt" size={30} color={colors.lightText} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <OverlayMessage
        message={isEditSuccess ? "Changes saved successfully!" : "Error changes did not save"}
        styles={isEditSuccess ? { backgroundColor: "#bbf7d0", borderColor: "#22c55e" } : { backgroundColor: "#fecaca", borderColor: "#dc2626" }}
        visible={messageVisible}
        onDismiss={() => { setMessageVisible(false) }}
      />
    </>
  )
}

export default profile