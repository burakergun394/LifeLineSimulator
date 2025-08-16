import React from 'react';
import { View, Text, Animated } from 'react-native';
import { Character } from '../../types/character';

interface GameHeaderProps {
  character: Character;
  money?: number;
  profession?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  character, 
  money = 1000, 
  profession = "Öğrenci" 
}) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const glowScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const glowOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  return (
    <View className="relative">
      {/* Green Gradient Background */}
      <View className="bg-gradient-to-r from-emerald-400 via-teal-500 to-lime-400 px-6 py-8 rounded-b-3xl shadow-xl">
        <View className="flex-row items-center justify-between">
          
          {/* Avatar Section - Sol */}
          <View className="relative">
            <Animated.View 
              style={{
                transform: [{ scale: glowScale }],
                opacity: glowOpacity,
              }}
              className="absolute inset-0 bg-white/30 rounded-full blur-lg"
            />
            <View className="w-16 h-16 bg-white/20 rounded-full justify-center items-center backdrop-blur-sm border border-white/30">
              <Text className="text-3xl">👤</Text>
            </View>
            {/* Floating animation glow effect */}
            <Animated.View 
              style={{
                opacity: glowOpacity,
              }}
              className="absolute -inset-2 bg-white/20 rounded-full blur-md"
            />
          </View>

          {/* Character Info - Orta */}
          <View className="flex-1 mx-4">
            <Text className="text-white text-xl font-bold text-center">
              {character.name}
            </Text>
            <Text className="text-white/90 text-lg text-center">
              {character.age} yaşında
            </Text>
            <Text className="text-white/80 text-sm text-center">
              {profession}
            </Text>
          </View>

          {/* Money Card - Sağ */}
          <View className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
            <Text className="text-white/80 text-xs text-center mb-1">
              Para
            </Text>
            <Text className="text-white text-lg font-bold text-center">
              ₺{formatMoney(money)}
            </Text>
          </View>
        </View>

        {/* Status Indicators */}
        <View className="flex-row justify-center mt-4 space-x-4">
          <View className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <Text className="text-white text-xs">🎯 Level {Math.floor(character.age / 5) + 1}</Text>
          </View>
          <View className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <Text className="text-white text-xs">⭐ Başarı: {character.completedEvents?.length || 0}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Shadow Effect */}
      <View className="absolute -bottom-6 left-4 right-4 h-6 bg-emerald-400/20 rounded-full blur-xl" />
    </View>
  );
};

export default GameHeader;