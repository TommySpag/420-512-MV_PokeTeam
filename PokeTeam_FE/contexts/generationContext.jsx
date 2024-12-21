import React, { createContext, useContext, useState } from 'react';
const GenerationsContext = createContext();

export const GenerationsProvider = ({ children }) => {
  const [generation, setGeneration] = useState(1);

  return (
    <GenerationsContext.Provider value={{ generation, setGeneration }}>
      {children}
    </GenerationsContext.Provider>
  );
};

export const useGenerationsTheme = () => useContext(GenerationsContext);