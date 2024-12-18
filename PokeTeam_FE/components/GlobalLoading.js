//Lamb

import React, { useEffect, useState } from 'react';
import { View, FlatList, Animated, Image } from 'react-native';
import { useLoading } from '../contexts/loadingContext';
//Sprites imports
import fire from '../assets/images/loading/fire.bmp';
import water from '../assets/images/loading/water.bmp';
import grass from '../assets/images/loading/grass.bmp';
import bug from '../assets/images/loading/bug.bmp';
import dark from '../assets/images/loading/dark.bmp';
import dragon from '../assets/images/loading/dragon.bmp';
import electric from '../assets/images/loading/electric.bmp';
import fairy from '../assets/images/loading/fairy.bmp';
import fight from '../assets/images/loading/fight.bmp';
import flying from '../assets/images/loading/flying.bmp';
import ghost from '../assets/images/loading/ghost.bmp';
import ground from '../assets/images/loading/ground.bmp';
import ice from '../assets/images/loading/ice.bmp';
import normal from '../assets/images/loading/normal.bmp';
import poison from '../assets/images/loading/poison.bmp';
import psychc from '../assets/images/loading/psychc.bmp';
import rock from '../assets/images/loading/rock.bmp';
import steel from '../assets/images/loading/steel.bmp';

const sprites = [
  { id: 1, sprite: fire },
  { id: 2, sprite: water },
  { id: 3, sprite: grass },
  { id: 4, sprite: bug },
  { id: 5, sprite: dark },
  { id: 6, sprite: dragon },
  { id: 7, sprite: electric },
  { id: 8, sprite: fairy },
  { id: 9, sprite: fight },
  { id: 10, sprite: flying },
  { id: 11, sprite: ghost },
  { id: 12, sprite: ground },
  { id: 13, sprite: ice },
  { id: 14, sprite: normal },
  { id: 15, sprite: poison },
  { id: 16, sprite: psychc },
  { id: 17, sprite: rock },
  { id: 18, sprite: steel },
];

const GlobalLoading = () => {
  const { loading } = useLoading();
  const [animations, setAnimations] = useState([]);
  const [randomSprites, setRandomSprites] = useState([]);

  useEffect(() => {
    if (!loading) {
      return; 
    }


    const shuffledSprites = [...sprites].sort(() => Math.random() - 0.5).slice(0, 6);
    setRandomSprites(shuffledSprites);

    const animatedValues = shuffledSprites.map(() => new Animated.Value(0));
    setAnimations(animatedValues);

    const sequenceAnimations = shuffledSprites.map((_, index) =>
      Animated.sequence([
        Animated.timing(animatedValues[index], {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(25),
        Animated.timing(animatedValues[index], {
          toValue: 0, 
          duration: 150, 
          useNativeDriver: true,
        }),
        Animated.delay(20),
      ])
    );
    const loopAnimation = Animated.loop(
      Animated.sequence(sequenceAnimations)
    );
    loopAnimation.start();
  }, [loading]);

  if (!loading) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <FlatList
        data={randomSprites}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <View style={styles.spriteContainer}>
            <Animated.View
              style={{
                transform: [{ translateY: animations[index] }],
              }}
            >
              <Image source={item.sprite} style={styles.spriteImage} />
            </Animated.View>
          </View>
        )}
      />
    </View>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spriteContainer: {
    marginRight: 12,
    alignItems: 'center',
  },
  spriteImage: {
    width: 30,
    height: 10,
  },
};

export default GlobalLoading;
