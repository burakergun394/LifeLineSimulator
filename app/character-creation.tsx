import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { ScreenWrapper } from '../components/Layout';
import { Button, StatBar } from '../components';
import { NavigationHelper } from '../utils';
import { useGameStore } from '../store';
import { Character, CharacterStats } from '../types';

export default function CharacterCreation() {
  const { startNewGame } = useGameStore();
  
  const [characterName, setCharacterName] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [stats, setStats] = useState<CharacterStats>({
    health: 50,
    happiness: 50,
    intelligence: 50,
    wealth: 50,
    social: 50
  });
  const [remainingPoints, setRemainingPoints] = useState(50);

  const statNames = {
    health: 'Sağlık',
    happiness: 'Mutluluk', 
    intelligence: 'Zeka',
    wealth: 'Zenginlik',
    social: 'Sosyal'
  };

  const statColors = {
    health: '#EF4444',
    happiness: '#F59E0B',
    intelligence: '#8B5CF6',
    wealth: '#10B981',
    social: '#3B82F6'
  };

  const handleStatChange = (statName: keyof CharacterStats, change: number) => {
    const newValue = stats[statName] + change;
    const clampedValue = Math.min(Math.max(newValue, 10), 90);
    const actualChange = clampedValue - stats[statName];
    
    if (remainingPoints >= actualChange) {
      setStats(prev => ({
        ...prev,
        [statName]: clampedValue
      }));
      setRemainingPoints(prev => prev - actualChange);
    }
  };

  const handleRandomize = () => {
    const newStats: CharacterStats = {
      health: Math.floor(Math.random() * 40) + 30,
      happiness: Math.floor(Math.random() * 40) + 30,
      intelligence: Math.floor(Math.random() * 40) + 30,
      wealth: Math.floor(Math.random() * 40) + 30,
      social: Math.floor(Math.random() * 40) + 30
    };
    
    const totalUsed = Object.values(newStats).reduce((sum, val) => sum + val, 0) - 250;
    const newRemainingPoints = Math.max(0, 50 - totalUsed);
    
    setStats(newStats);
    setRemainingPoints(newRemainingPoints);
  };

  const handleCreateCharacter = () => {
    if (!characterName.trim()) {
      Alert.alert('Hata', 'Lütfen karakter adı girin.');
      return;
    }

    if (remainingPoints > 0) {
      Alert.alert('Uyarı', 'Henüz dağıtılmamış puan var. Devam etmek istiyor musunuz?', [
        { text: 'İptal', style: 'cancel' },
        { text: 'Devam Et', onPress: () => createCharacter() }
      ]);
      return;
    }

    createCharacter();
  };

  const createCharacter = () => {
    const character: Character = {
      name: characterName.trim(),
      age: 18,
      stats: stats,
      createdAt: new Date(),
      lastPlayedAt: new Date()
    };

    startNewGame(character);
    NavigationHelper.startGame(character);
  };

  const handleBack = () => {
    NavigationHelper.goBack();
  };

  const renderNameStep = () => (
    <View className="flex-1 justify-center px-6">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Karakter Adı
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center">
          Karakterinizin adını belirleyin
        </Text>
      </View>

      <View className="mb-8">
        <TextInput
          value={characterName}
          onChangeText={setCharacterName}
          placeholder="Karakterinizin adını girin..."
          placeholderTextColor="#9CA3AF"
          className="border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-4 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          maxLength={20}
          autoFocus
        />
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {characterName.length}/20 karakter
        </Text>
      </View>

      <View className="space-y-3">
        <Button
          title="Devam Et"
          onPress={() => setCurrentStep(1)}
          variant="primary"
          size="large"
          className="w-full"
          disabled={!characterName.trim()}
        />
        <Button
          title="Geri"
          onPress={handleBack}
          variant="secondary"
          size="medium"
          className="w-full"
        />
      </View>
    </View>
  );

  const renderStatsStep = () => (
    <View className="flex-1 px-6 py-4">
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Özellikler
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center mb-4">
          Özellik puanlarını dağıtın
        </Text>
        <View className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg">
          <Text className="text-blue-800 dark:text-blue-200 font-semibold">
            Kalan Puan: {remainingPoints}
          </Text>
        </View>
      </View>

      <View className="flex-1">
        {Object.entries(stats).map(([key, value]) => (
          <View key={key} className="bg-white dark:bg-gray-800 p-4 rounded-xl mb-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                {statNames[key as keyof CharacterStats]}
              </Text>
              <View className="flex-row space-x-2">
                <Button
                  title="−"
                  onPress={() => handleStatChange(key as keyof CharacterStats, -5)}
                  size="small"
                  variant="secondary"
                  disabled={value <= 10}
                  className="w-10 h-10"
                />
                <View className="justify-center min-w-[50px]">
                  <Text className="text-center text-lg font-bold text-gray-800 dark:text-white">
                    {value}
                  </Text>
                </View>
                <Button
                  title="+"
                  onPress={() => handleStatChange(key as keyof CharacterStats, 5)}
                  size="small"
                  variant="primary"
                  disabled={value >= 90 || remainingPoints < 5}
                  className="w-10 h-10"
                />
              </View>
            </View>
            <StatBar
              label=""
              value={value}
              maxValue={100}
              color={statColors[key as keyof CharacterStats]}
            />
          </View>
        ))}
      </View>

      <View className="space-y-3 mt-4">
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
          disabled={!characterName.trim()}
        />
        <Button
          title="Geri"
          onPress={() => setCurrentStep(0)}
          variant="secondary"
          size="medium"
          className="w-full"
        />
      </View>
    </View>
  );

  return (
    <ScreenWrapper 
      scrollable={currentStep === 1}
      className="bg-gray-50 dark:bg-gray-900"
    >
      {currentStep === 0 ? renderNameStep() : renderStatsStep()}
    </ScreenWrapper>
  );
}