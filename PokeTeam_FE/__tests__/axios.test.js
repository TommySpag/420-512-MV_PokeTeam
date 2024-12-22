import axios from 'axios';
import { api, setToken, signIn, signUp, fetchProfileData, updateProfileData, deleteUserById, updateProfileAddPoke, deletePokemon, updateTeamData, getIdFromJwt, getPokemonByType, getPokemonInfoByName, getPokemonSpriteByName, getNbGenerations, getStartersForGeneration, getPokemonsForGeneration, getPokemonDescriptionByName, getAllPokeTeamsAndRatings, updateTeamRating, uploadImageToGitHub } from './yourFile'; // replace with your actual file paths
import MockAdapter from 'axios-mock-adapter';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mocking the required functions and modules
jest.mock('@react-native-async-storage/async-storage');

const mock = new MockAdapter(axios);

describe('API functions', () => {

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  it('should sign in successfully and store the token', async () => {
    mock.onPost('/pokeusers/signin').reply(200, { token: 'test-token' });

    await expect(signIn('testUser', 'testPassword')).resolves.toEqual({ token: 'test-token' });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('jwt', 'test-token');
  });

  it('should throw error if sign-in fails', async () => {
    mock.onPost('/pokeusers/signin').reply(500);

    await expect(signIn('testUser', 'wrongPassword')).rejects.toThrow();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('should sign up successfully and store the token', async () => {
    mock.onPost('/pokeusers').reply(201, { token: 'test-signup-token' });

    await expect(signUp('testUser', 'test@example.com', 'testPassword')).resolves.toEqual({ token: 'test-signup-token' });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('jwt', 'test-signup-token');
  });

  it('should throw error if sign-up fails', async () => {
    mock.onPost('/pokeusers').reply(500);

    await expect(signUp('testUser', 'test@example.com', 'testPassword')).rejects.toThrow();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('should fetch profile data successfully', async () => {
    mock.onGet('/pokeusers/1').reply(200, { id: 1, username: 'testUser' });

    await expect(fetchProfileData(1)).resolves.toEqual({ id: 1, username: 'testUser' });
  });

  it('should throw error if fetch profile fails', async () => {
    mock.onGet('/pokeusers/1').reply(500);

    await expect(fetchProfileData(1)).rejects.toThrow();
  });

  it('should update profile data successfully', async () => {
    const userData = { id: 1, username: 'updatedUser' };
    mock.onPut('/pokeusers/1').reply(200, userData);

    await expect(updateProfileData(userData)).resolves.toEqual(userData);
  });

  it('should throw error if update profile fails', async () => {
    const userData = { id: 1, username: 'updatedUser' };
    mock.onPut('/pokeusers/1').reply(500);

    await expect(updateProfileData(userData)).rejects.toThrow();
  });

  it('should delete user by ID successfully', async () => {
    mock.onDelete('/pokeusers/1').reply(200);

    await expect(deleteUserById(1)).resolves.toBeUndefined();
  });

  it('should throw error if delete user fails', async () => {
    mock.onDelete('/pokeusers/1').reply(500);

    await expect(deleteUserById(1)).rejects.toThrow();
  });

  it('should update profile and add poke successfully', async () => {
    const userData = { id: 1, pokeid: 25 };
    mock.onPut('/pokeusers/addpoke/:1/:25').reply(200, userData);

    await expect(updateProfileAddPoke(userData)).resolves.toEqual(userData);
  });

  it('should throw error if add poke fails', async () => {
    const userData = { id: 1, pokeid: 25 };
    mock.onPut('/pokeusers/addpoke/:1/:25').reply(500);

    await expect(updateProfileAddPoke(userData)).rejects.toThrow();
  });

  it('should delete pokemon successfully', async () => {
    mock.onDelete('/pokeusers/removepoke/1/25').reply(200);

    await expect(deletePokemon(1, 25)).resolves.toBeUndefined();
  });

  it('should throw error if delete pokemon fails', async () => {
    mock.onDelete('/pokeusers/removepoke/1/25').reply(500);

    await expect(deletePokemon(1, 25)).rejects.toThrow();
  });

  it('should update team data successfully', async () => {
    const userData = { id: 1 };
    mock.onPut('/pokeusers/modifypoke/:1').reply(200, userData);

    await expect(updateTeamData(userData)).resolves.toEqual(userData);
  });

  it('should throw error if update team data fails', async () => {
    const userData = { id: 1 };
    mock.onPut('/pokeusers/modifypoke/:1').reply(500);

    await expect(updateTeamData(userData)).rejects.toThrow();
  });

  it('should get id from JWT successfully', async () => {
    mock.onPost('/pokeusers/authenticate').reply(200, { id: 1 });

    await expect(getIdFromJwt()).resolves.toEqual(1);
  });

  it('should throw error if get id from JWT fails', async () => {
    mock.onPost('/pokeusers/authenticate').reply(500);

    await expect(getIdFromJwt()).rejects.toThrow();
  });

  it('should get pokemon by type successfully', async () => {
    mock.onGet('https://pokeapi.co/api/v2/type/fire').reply(200, { pokemon: [] });

    await expect(getPokemonByType('fire')).resolves.toEqual([]);
  });

  it('should throw error if get pokemon by type fails', async () => {
    mock.onGet('https://pokeapi.co/api/v2/type/fire').reply(500);

    await expect(getPokemonByType('fire')).rejects.toThrow();
  });

  it('should get pokemon info by name successfully', async () => {
    mock.onGet('https://pokeapi.co/api/v2/pokemon/test').reply(200, { id: 1, name: 'test' });

    await expect(getPokemonInfoByName('test')).resolves.toEqual({ id: 1, name: 'test' });
  });

  it('should throw error if get pokemon info by name fails', async () => {
    mock.onGet('https://pokeapi.co/api/v2/pokemon/test').reply(500);

    await expect(getPokemonInfoByName('test')).rejects.toThrow();
  });

  it('should upload image to GitHub successfully', async () => {
    mock.onPut('https://api.github.com/repos/aliterallamb/ReactAppImg/contents/test.jpg').reply(200, { content: { download_url: 'https://example.com' } });

    await expect(uploadImageToGitHub('file://test.jpg', 'test.jpg')).resolves.toEqual('https://example.com');
  });

  it('should throw error if image upload fails', async () => {
    mock.onPut('https://api.github.com/repos/aliterallamb/ReactAppImg/contents/test.jpg').reply(500);

    await expect(uploadImageToGitHub('file://test.jpg', 'test.jpg')).rejects.toThrow();
  });

});
