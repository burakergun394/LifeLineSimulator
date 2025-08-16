import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { Button, StatBar } from '../components';

const GameScreen: React.FC = () => {
  const [character, setCharacter] = useState({
    name: 'Örnek Karakter',
    age: 18,
    stats: {
      health: 75,
      happiness: 60,
      intelligence: 70,
      wealth: 30,
      social: 55
    }
  });

  const [currentEvent, setCurrentEvent] = useState({
    title: 'Üniversite Seçimi',
    description: 'Liseyi bitirdin ve şimdi gelecek planların için karar verme zamanı. Hangi yolu seçmek istiyorsun?',
    choices: [
      { text: 'Prestijli bir üniversiteye git', effect: { intelligence: +10, wealth: -5 } },
      { text: 'Çalışmaya başla', effect: { wealth: +15, intelligence: -5 } },
      { text: 'Boş bir yıl geçir', effect: { happiness: +5, social: +5 } }
    ]
  });

  const handleChoice = (choiceIndex: number) => {
    const choice = currentEvent.choices[choiceIndex];
    console.log('Choice selected:', choice);
    
    // Update character stats based on choice effect
    setCharacter(prev => {
      const newStats = { ...prev.stats };
      Object.entries(choice.effect).forEach(([stat, change]) => {
        if (stat in newStats) {
          newStats[stat as keyof typeof newStats] = Math.max(0, 
            Math.min(100, newStats[stat as keyof typeof newStats] + change)
          );
        }
      });
      return {
        ...prev,
        age: prev.age + 1,
        stats: newStats
      };
    });
  };

  const handleMenu = () => {
    console.log('Opening menu...');
  };

  const handleSave = () => {
    console.log('Saving game...');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="bg-white shadow-sm">
        <View className="flex-row justify-between items-center px-6 py-4">
          <View>
            <Text className="text-lg font-bold text-gray-800">
              {character.name}
            </Text>
            <Text className="text-sm text-gray-600">
              Yaş: {character.age}
            </Text>
          </View>
          <View className="flex-row space-x-2">
            <Button
              title="Kaydet"
              onPress={handleSave}
              variant="secondary"
              size="small"
            />
            <Button
              title="Menü"
              onPress={handleMenu}
              variant="secondary"
              size="small"
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Character Stats */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Karakter Durumu
          </Text>
          <View className="space-y-3">
            <StatBar
              label="Sağlık"
              value={character.stats.health}
              maxValue={100}
              color="#EF4444"
            />
            <StatBar
              label="Mutluluk"
              value={character.stats.happiness}
              maxValue={100}
              color="#F59E0B"
            />
            <StatBar
              label="Zeka"
              value={character.stats.intelligence}
              maxValue={100}
              color="#8B5CF6"
            />
            <StatBar
              label="Zenginlik"
              value={character.stats.wealth}
              maxValue={100}
              color="#10B981"
            />
            <StatBar
              label="Sosyal"
              value={character.stats.social}
              maxValue={100}
              color="#3B82F6"
            />
          </View>
        </View>

        {/* Current Event */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-2">
            {currentEvent.title}
          </Text>
          <Text className="text-base text-gray-700 mb-6 leading-6">
            {currentEvent.description}
          </Text>

          <View className="space-y-3">
            {currentEvent.choices.map((choice, index) => (
              <Button
                key={index}
                title={choice.text}
                onPress={() => handleChoice(index)}
                variant="primary"
                className="w-full"
              />
            ))}
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GameScreen;