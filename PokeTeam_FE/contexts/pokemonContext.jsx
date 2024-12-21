import React, { createContext, useContext, useState } from 'react';
const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [pokemonName, setPokemonName] = useState('pikachu');

  return (
    <PokemonContext.Provider value={{ pokemonName, setPokemonName }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemonTheme = () => useContext(PokemonContext);