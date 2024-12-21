import React, { createContext, useContext, useState } from 'react';
const ColorTypeContext = createContext();

export const ColorTypeProvider = ({ children }) => {
  const [type, setType] = useState('original');

  return (
    <ColorTypeContext.Provider value={{ type, setType}}>
      {children}
    </ColorTypeContext.Provider>
  );
};

export const useColorTypeTheme = () => useContext(ColorTypeContext);