import React from 'react';
import { View, Text, Animated } from 'react-native';
import { CharacterStats } from '../../types/character';

interface StatisticsSectionProps {
  stats: CharacterStats;
}

interface StatConfig {
  key: keyof CharacterStats;
  name: string;
  icon: string;
  color: string;
  gradient: string;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ stats }) => {
  const statConfigs: StatConfig[] = [
    {
      key: 'happiness',
      name: 'Mutluluk',
      icon: '😊',
      color: '#F59E0B',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      key: 'health',
      name: 'Sağlık',
      icon: '❤️',
      color: '#EF4444',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      key: 'intelligence',
      name: 'Zeka',
      icon: '🧠',
      color: '#8B5CF6',
      gradient: 'from-purple-400 to-indigo-500'
    },
    {
      key: 'social',
      name: 'Sosyal',
      icon: '👥',
      color: '#3B82F6',
      gradient: 'from-blue-400 to-cyan-500'
    }
  ];

  const AnimatedProgressBar: React.FC<{ 
    value: number; 
    color: string; 
    gradient: string;
  }> = ({ value, color, gradient }) => {
    const animatedWidth = new Animated.Value(0);

    React.useEffect(() => {
      Animated.timing(animatedWidth, {
        toValue: value,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }, [value]);

    const widthInterpolation = animatedWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp',
    });

    return (
      <View className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <Animated.View
          style={{ width: widthInterpolation }}
          className={`h-full bg-gradient-to-r ${gradient} rounded-full shadow-sm`}
        />
        
        {/* Glow Effect */}
        <Animated.View
          style={{ width: widthInterpolation }}
          className={`absolute top-0 h-full bg-white/30 rounded-full`}
        />
      </View>
    );
  };

  const getStatLevel = (value: number) => {
    if (value >= 80) return { level: 'Mükemmel', color: 'text-green-600' };
    if (value >= 60) return { level: 'İyi', color: 'text-blue-600' };
    if (value >= 40) return { level: 'Orta', color: 'text-yellow-600' };
    if (value >= 20) return { level: 'Düşük', color: 'text-orange-600' };
    return { level: 'Kritik', color: 'text-red-600' };
  };

  return (
    <View className="bg-white mx-4 rounded-3xl p-6 shadow-xl border border-gray-100">
      {/* Section Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          📊 Kişisel Özellikler
        </Text>
        <Text className="text-gray-600 text-base">
          Mevcut durumun ve gelişim alanların
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="space-y-6">
        {statConfigs.map((config) => {
          const value = stats[config.key];
          const statLevel = getStatLevel(value);
          
          return (
            <View key={config.key} className="space-y-3">
              {/* Stat Header */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-gray-50 rounded-xl justify-center items-center mr-3 shadow-sm">
                    <Text className="text-lg">{config.icon}</Text>
                  </View>
                  <View>
                    <Text className="text-lg font-semibold text-gray-800">
                      {config.name}
                    </Text>
                    <Text className={`text-sm font-medium ${statLevel.color}`}>
                      {statLevel.level}
                    </Text>
                  </View>
                </View>
                
                <View className="items-end">
                  <Text className="text-2xl font-bold text-gray-800">
                    {value}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    / 100
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <AnimatedProgressBar
                value={value}
                color={config.color}
                gradient={config.gradient}
              />

              {/* Progress Indicators */}
              <View className="flex-row justify-between text-xs text-gray-400">
                <Text>0</Text>
                <Text>25</Text>
                <Text>50</Text>
                <Text>75</Text>
                <Text>100</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Overall Score */}
      <View className="mt-8 pt-6 border-t border-gray-100">
        <View className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-600 text-sm mb-1">
                Genel Yaşam Skoru
              </Text>
              <Text className="text-2xl font-bold text-emerald-600">
                {Math.round((stats.happiness + stats.health + stats.intelligence + stats.social) / 4)}
              </Text>
            </View>
            
            <View className="w-16 h-16 bg-emerald-100 rounded-full justify-center items-center">
              <Text className="text-2xl">🏆</Text>
            </View>
          </View>
          
          <Text className="text-emerald-700 text-sm mt-2">
            {Math.round((stats.happiness + stats.health + stats.intelligence + stats.social) / 4) >= 70
              ? "Harika gidiyorsun! 🌟"
              : Math.round((stats.happiness + stats.health + stats.intelligence + stats.social) / 4) >= 50
              ? "İyi durumdasın 👍"
              : "Gelişim için alan var 💪"
            }
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StatisticsSection;