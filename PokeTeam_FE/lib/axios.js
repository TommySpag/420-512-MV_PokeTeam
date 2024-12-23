import axios from 'axios';
import { IP_BACKEND } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const api = axios.create({
    baseURL:IP_BACKEND
})

// Function to set the JWT in AsyncStorage
export async function setToken(token) {
    try {
        await AsyncStorage.setItem('jwt', token);
    } catch (error) {
        console.error('Error setting token:', error);
    }
}

// Function to get the JWT from AsyncStorage
export async function getToken() {
    try {
        return await AsyncStorage.getItem('jwt');
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
}

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    async (config) => {
        const token = await getToken(); // Retrieve the token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export async function signIn(usernameOrEmail, password){
    try {
        console.log(`Trying to signIn with username: ${usernameOrEmail} and password: ${password}`);

        const signInData = {
            usernameOrEmail: usernameOrEmail,
            password: password
        };

        const userAuth = await api.post(`/pokeusers/signin`, signInData,{
            header:{
                Authorization: 'none',
            },
        });
        if(!(userAuth.status == 200)) throw Error;
        
        // Store the token on successful sign-in
        await setToken(userAuth.data.token);
        console.log(userAuth.data.token)
        return userAuth.data
    } catch (error){
        throw new Error(error)
    }
}

export async function signUp(username, email , password){
    try {
        console.log(`Trying to signUp with email: ${email}, username: ${username} and password: ${password}`);

        const signUpData = {
            email:email,
            username: username,
            password: password
        };

        const userAuth = await api.post(`/pokeusers`, signUpData,{
            header:{
                Authorization: 'none',
            },
        });
        if(!(userAuth.status == 201)) throw Error;
        
        // Store the token on successful sign-in
        await setToken(userAuth.data.token);

        return userAuth.data
    } catch (error){
        throw new Error(error)
    }
}

export async function fetchProfileData(id){
    try {
        console.log(`Trying to fetch profileData with id: ${id}`);
        
        const profileData = await api.get(`/pokeusers/${id}`);
        if(!(profileData.status == 200)) throw Error('Failed to fetch profile');
        return profileData.data
    } catch (error){
        console.error('Error fetching profile data:', error);
        throw new Error(error)
    }
}
export async function updateProfileData(userData){
    try {
        console.log(`Trying to update profileData with userData: ${userData}`);
        const updateData = await api.put(`/pokeusers/${userData.id}`,userData,{
            header:{
                Authorization: 'none',
            },
            
        });
        if(!(updateData.status == 200)) throw Error;
        
        return updateData.data
    } catch (error){
        throw new Error(error)
    }
} 

export async function deleteUserById(id){
    try{
        console.log(`axios.js : delete user with id : ${id}`)
        const deleteUser = await api.delete(`/pokeusers/${id}`)
        if(deleteUser.status != 200){
            throw new Error('axios.js : Failed to delete user')
        }
    }catch(error){
        console.log("Error deleting user : ",error)
        throw new Error(error)
    }
}
export async function updateProfileAddPoke(userId, pokeId) {
    try {
      console.log(`Trying to updateProfileAddPoke with userId: ${userId} and pokeId: ${pokeId}`);
      const updateData = await axios.put(`/pokeusers/addpoke/${userId}/${pokeId}`);
  
      if (updateData.status !== 200) throw new Error('Failed to add Pokémon.');
  
      return updateData.data;
    } catch (error) {
      console.error('Error occurred while adding Pokémon:', error);
      throw new Error(error);
    }
  }

export async function deletePokemon(userId, pokeId) {
    try{
    console.log(`axios.js : delete poke: ${pokeId} from user with id : ${userId}`)
    const deletePokemon = await api.delete(`/pokeusers/removepoke/${userId}/${pokeId}`);    
    if(deletePokemon.status != 200){
        throw new Error('axios.js : Failed to delete pokemon')
    }
    }catch (error){
        console.log("Error deleting pokemon : ",error)
        throw new Error(error)
    }
}
 

export async function updateTeamData(userData){
    try {
        console.log(`Trying to updateTeamData with userData: ${userData}`);
        const updateData = await api.put(`/pokeusers/modifypoke/${userData.userId}`,userData,{
            header:{
                Authorization: 'none',
            },
            
        });
        if(!(updateData.status == 200)) throw Error;
        
        return updateData.data
    } catch (error){
        throw new Error(error)
    }
} 
export async function getIdFromJwt(){
    try{
        console.log("Trying to get the id from jwt")
        const id = await api.post('/pokeusers/authenticate')

        if(!id ){
            throw new Error('no response : 404')
        }
        if( id.status != 200) throw new Error('responded with error')
        return id.data.id
    }
    catch(error){
        console.log(`axios.js : ${error}`)
    }
}

export async function getPokemonByType(pokeType){
    try {
        console.log("Trying to getPokemonByType with type : " + pokeType)
        const type = await fetch(`https://pokeapi.co/api/v2/type/${pokeType}`)

        if(!(type.status == 200)) throw Error;

        if(!type ){
            throw new Error('no response : 404')
        }
        return type.pokemon
    } catch (error) {
        console.log(`axios.js : ${error}`)
    }
}

export async function getPokemonInfoByName(pokeName) {
    if (pokeName === "") {
        console.log("Invalid Pokémon name provided.");
        return "";
    }

    try {
        console.log("Trying to getPokemonInfoByName with name: " + pokeName);

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);

        if (!response.ok) {
            throw new Error(`Error fetching data for ${pokeName}: ${response.status}`);
        }

        const pokemon = await response.json();

        return {
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types,
            abilities: pokemon.abilities,
            weight: pokemon.weight,
            sprite: pokemon.sprites.front_default, 
        };
    } catch (error) {
        console.log(`Error in getPokemonInfoByName: ${error.message}`);
        return ""; 
    }
}

export async function getPokemonInfoById(pokeId) {
    if (pokeId <= 0) {
        console.log("Invalid Pokémon id provided.");
        return "";
    }

    try {
        console.log("Trying to getPokemonInfoByNId with id: " + pokeId);

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);

        if (!response.ok) {
            throw new Error(`Error fetching data for ${pokeId}: ${response.status}`);
        }

        const pokemon = await response.json();

        return {
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types,
            abilities: pokemon.abilities,
            weight: pokemon.weight,
            sprite: pokemon.sprites.front_default, 
        };
    } catch (error) {
        console.log(`Error in getPokemonInfoById: ${error.message}`);
        return ""; 
    }
}

export async function getPokemonSpriteByName(pokeName) {
    try {
        console.log("Trying to getPokemonSpriteByName with name: " + pokeName);

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);

        if (!response.ok) {
            throw new Error(`Error fetching data for ${pokeName}: ${response.status}`);
        }

        const pokemon = await response.json();
        return pokemon.sprites.front_default;
        
    } catch (error) {
        console.log(`Error in getPokemonSpriteByName: ${error.message}`);
        return null; 
    }
}

export async function getNbGenerations(){
    try{
        console.log("Trying to getAllGenerations");
        const generationsResponseawait = await axios.get("https://pokeapi.co/api/v2/generation");
        if(generationsResponseawait.status != 200) throw new Error('responded with error');
        return generationsResponseawait.data.count;
    }
    catch(error){
        console.log(`axios.js : ${error}`)
    }
}

export async function getStartersForGeneration(generationId) {
    try {
        console.log(`Trying to get starters for Generation ${generationId}`);

        const response = await axios.get(`https://pokeapi.co/api/v2/generation/${generationId}/`);
        
        if (response.status !== 200) {
            throw new Error('PokeAPI responded with an error');
        }
        if(generationId == 9 || generationId == 5){
            const startersNames = response.data.pokemon_species.slice(1, 4).map(starter => starter.name);
            return startersNames;
        }else{
            const startersNames = response.data.pokemon_species.slice(0, 3).map(starter => starter.name);
            return startersNames;
    }
    } catch (error) {
        console.error(`Error in getStartersForGeneration: ${error.message}`);
        return [];
    }
}

export async function getPokemonsForGeneration(generationId) {
    try {
        console.log(`Trying to get pokemons for Generation ${generationId}`);

        const response = await axios.get(`https://pokeapi.co/api/v2/generation/${generationId}/`);
        
        if (response.status !== 200) {
            throw new Error('PokeAPI responded with an error');
        }

        const names = response.data.pokemon_species.map(pokemon => pokemon.name);
        return names;
    }
    catch (error) {
        console.error(`Error in getPokemonsForGeneration: ${error.message}`);
        return [];
    }
}

export async function getPokemonDescriptionByName(pokeName) {
    try {
      console.log(`Trying to get description for Pokemon: ${pokeName}`);
  
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokeName}/`);
    
      if (response.status !== 200) {
        throw new Error('PokeAPI responded with an error');
      }
  
      const flavorTextEntries = response.data.flavor_text_entries;

      
      const englishDescription = flavorTextEntries.find(entry => entry.language.name === 'en');
  
      if (englishDescription) {
        return englishDescription.flavor_text; 
      } else {
        return 'No french description available for this Pokémon.'; 
      }
    } catch (error) {
      console.error(`Error in getPokemonDescriptionByName: ${error.message}`);
      return 'Failed to load description.';
    }
  }

export async function getAllPokeTeamsAndRatings(userId) {
    try {
        console.log('Trying to get all Teams and Ratings')
        const response = await api.get(`/pokeusers/TeamAndRatings/${userId}`,{
            header:{
                Authorization: 'none',
            },
            
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching Pokémon teams and ratings:', error.message);
        throw new Error('Failed to fetch Pokémon teams and ratings.');
    }
}


export async function updateTeamRating(userData){
    try {
        console.log(`Trying to updateTeamData with userData: ${userData}`);
        const updateData = await api.put(`/pokeusers/modifyrating/:${userData.id}`,userData,{
            header:{
                Authorization: 'none',
            },
            
        });
        if(!(updateData.status == 200)) throw Error;
        
        return updateData.data
    } catch (error){
        throw new Error(error)
    }
}


const GITHUB_API = 'https://api.github.com';
const GITHUB_REPO_OWNER = 'aliterallamb'; 
const GITHUB_REPO_NAME = 'ReactAppImg'; 
const GITHUB_TOKEN = 'enter generated key'; 


export async function uploadImageToGitHub(fileUri, filePath) {
    try {
        console.log(`Uploading image to GitHub at path: ${filePath}`);

        // Ensure the file URI is correct (should start with file://)
        if (!fileUri.startsWith('file://')) {
            throw new Error('Invalid file URI. Make sure it starts with "file://".');
        }

        // Read the image from the URI and convert it to base64
        const base64Image = await getBase64(fileUri);

        const response = await axios.put(
            `${GITHUB_API}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`,
            {
                message: `Upload ${filePath}`,
                content: base64Image,
            },
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            }
        );

        console.log('Image uploaded successfully:', response.data.content.download_url);
        return response.data.content.download_url;
    } catch (error) {
        console.error('Error uploading image to GitHub:', error.response?.data || error.message);
        throw new Error('Failed to upload image to GitHub.');
    }
}

const getBase64 = async (fileUri) => {
    try {
        console.log(`Reading file from URI: ${fileUri}`);
        const base64Image = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return base64Image;
    } catch (error) {
        console.error('Error reading file:', error);
        throw new Error('Failed to read image file.');
    }
};