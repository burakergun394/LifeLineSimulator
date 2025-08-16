import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { Button, StatBar } from '../components';

const CharacterCreation: React.FC = () => {
  const [characterName, setCharacterName] = useState('');
  const [stats, setStats] = useState({
    health: 50,
    happiness: 50,
    intelligence: 50,
    wealth: 50,
    social: 50
  });
  const [remainingPoints, setRemainingPoints] = useState(50);

  const handleStatChange = (statName: keyof typeof stats, change: number) => {
    const newValue = stats[statName] + change;
    const actualChange = Math.min(Math.max(newValue, 10), 90) - stats[statName];
    
    if (remainingPoints - actualChange >= 0) {
      setStats(prev => ({
        ...prev,
        [statName]: prev[statName] + actualChange
      }));
      setRemainingPoints(prev => prev - actualChange);
    }
  };

  const handleCreateCharacter = () => {
    console.log('Creating character:', { characterName, stats });
  };

  const handleRandomize = () => {
    const newStats = {
      health: Math.floor(Math.random() * 40) + 30,
      happiness: Math.floor(Math.random() * 40) + 30,
      intelligence: Math.floor(Math.random() * 40) + 30,
      wealth: Math.floor(Math.random() * 40) + 30,
      social: Math.floor(Math.random() * 40) + 30
    };
    setStats(newStats);
    const totalUsed = Object.values(newStats).reduce((sum, val) => sum + val, 0) - 250;
    setRemainingPoints(50 - totalUsed);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
          Karakter Oluştur
        </Text>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Karakter Adı
          </Text>
          <TextInput
            value={characterName}
            onChangeText={setCharacterName}
            placeholder="Karakterinizin adını girin..."
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            maxLength={20}
          />
        </View>

        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-700">
              Özellikler
            </Text>
            <Text className="text-sm text-blue-600">
              Kalan Puan: {remainingPoints}
            </Text>
          </View>

          <View className="space-y-4">
            {Object.entries(stats).map(([key, value]) => (
              <View key={key} className="bg-gray-50 p-4 rounded-lg">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base font-medium text-gray-700 capitalize">
                    {key === 'health' ? 'Sağlık' :
                     key === 'happiness' ? 'Mutluluk' :
                     key === 'intelligence' ? 'Zeka' :
                     key === 'wealth' ? 'Zenginlik' : 'Sosyal'}
                  </Text>
                  <View className="flex-row space-x-2">
                    <Button
                      title="-"
                      onPress={() => handleStatChange(key as keyof typeof stats, -5)}
                      size="small"
                      variant="secondary"
                      disabled={value <= 10}
                    />
                    <Button
                      title="+"
                      onPress={() => handleStatChange(key as keyof typeof stats, 5)}
                      size="small"
                      variant="primary"
                      disabled={value >= 90 || remainingPoints < 5}
                    />
                  </View>
                </View>
                <StatBar
                  label=""
                  value={value}
                  maxValue={100}
                  color={
                    key === 'health' ? '#EF4444' :
                    key === 'happiness' ? '#F59E0B' :
                    key === 'intelligence' ? '#8B5CF6' :
                    key === 'wealth' ? '#10B981' : '#3B82F6'
                  }
                />
              </View>
            ))}
          </View>
        </View>

        <View className="space-y-3 mb-6">
          <Button
            title="Rastgele Dağıt"
            onPress={handleRandomize}
            variant="secondary"
            className="w-full"
          />
          
          <Button
            title="Karakteri Oluştur"
            onPress={handleCreateCharacter}
            variant="primary"
            size="large"
            className="w-full"
            disabled={!characterName.trim() || remainingPoints > 0}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CharacterCreation;