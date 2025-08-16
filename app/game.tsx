import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/Layout';
import { Button, StatBar } from '../components';
import { NavigationHelper } from '../utils';
import { useGameStore } from '../store';
import { GameEvent, EventResult } from '../types';
import eventsData from '../data/events.json';

export default function GameScreen() {
  const { 
    character, 
    currentEventId, 
    completedEvents,
    updateCharacterStats,
    ageCharacter,
    setCurrentEvent,
    completeEvent,
    saveGame,
    resetGame
  } = useGameStore();

  const [currentEvent, setCurrentEventState] = useState<GameEvent | null>(null);
  const [isProcessingChoice, setIsProcessingChoice] = useState(false);

  useEffect(() => {
    if (!character) {
      NavigationHelper.toMainMenu();
      return;
    }

    // Load or generate new event
    loadNextEvent();
  }, [character]);

  const loadNextEvent = () => {
    if (!character) return;

    // For demo, use the first event from our data
    const event = eventsData.events.find(e => e.id === 'university_choice');
    if (event) {
      setCurrentEventState(event as GameEvent);
      setCurrentEvent(event.id);
    }
  };

  const handleChoice = async (choiceIndex: number) => {
    if (!currentEvent || !character || isProcessingChoice) return;

    setIsProcessingChoice(true);

    try {
      const choice = currentEvent.choices[choiceIndex];
      
      // Apply stat changes
      const statChanges: any = {};
      Object.entries(choice.effect).forEach(([stat, change]) => {
        if (stat in character.stats) {
          statChanges[stat] = change;
        }
      });

      updateCharacterStats(statChanges);
      ageCharacter();
      completeEvent(currentEvent.id);

      // Show result message
      const positiveChanges: string[] = [];
      const negativeChanges: string[] = [];

      Object.entries(choice.effect).forEach(([stat, change]) => {
        const statName = getStatDisplayName(stat);
        if (change > 0) {
          positiveChanges.push(`${statName} +${change}`);
        } else if (change < 0) {
          negativeChanges.push(`${statName} ${change}`);
        }
      });

      let message = `"${choice.text}" seçeneğini seçtin.\n\n`;
      if (positiveChanges.length > 0) {
        message += `📈 Artanlar: ${positiveChanges.join(', ')}\n`;
      }
      if (negativeChanges.length > 0) {
        message += `📉 Azalanlar: ${negativeChanges.join(', ')}\n`;
      }

      Alert.alert('Seçim Sonucu', message, [
        { text: 'Devam Et', onPress: () => loadNextEvent() }
      ]);

    } catch (error) {
      console.error('Error processing choice:', error);
      Alert.alert('Hata', 'Seçim işlenirken bir hata oluştu.');
    } finally {
      setIsProcessingChoice(false);
    }
  };

  const getStatDisplayName = (stat: string): string => {
    const names: Record<string, string> = {
      health: 'Sağlık',
      happiness: 'Mutluluk',
      intelligence: 'Zeka',
      wealth: 'Zenginlik',
      social: 'Sosyal'
    };
    return names[stat] || stat;
  };

  const handleMenu = () => {
    Alert.alert(
      'Oyun Menüsü',
      'Ne yapmak istiyorsun?',
      [
        { text: 'Oyuna Devam', style: 'cancel' },
        { text: 'Kaydet', onPress: handleSave },
        { text: 'Ana Menü', onPress: handleExitGame, style: 'destructive' }
      ]
    );
  };

  const handleSave = () => {
    saveGame();
    Alert.alert('Başarılı', 'Oyun kaydedildi!');
  };

  const handleExitGame = () => {
    Alert.alert(
      'Oyundan Çık',
      'Oyundan çıkmak istediğinize emin misiniz? Kaydedilmemiş değişiklikler kaybolacak.',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çık', onPress: () => NavigationHelper.exitGame(), style: 'destructive' }
      ]
    );
  };

  if (!character) {
    return (
      <ScreenWrapper loading={true} />
    );
  }

  return (
    <ScreenWrapper className="bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-bold text-gray-800 dark:text-white">
              {character.name}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Yaş: {character.age} • Tamamlanan Olay: {completedEvents.length}
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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Character Stats */}
        <View className="bg-white dark:bg-gray-800 mx-4 mt-4 p-6 rounded-xl shadow-sm">
          <Text className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Karakter Durumu
          </Text>
          <View className="space-y-4">
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
        {currentEvent ? (
          <View className="bg-white dark:bg-gray-800 mx-4 mt-4 p-6 rounded-xl shadow-sm">
            <Text className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              {currentEvent.title}
            </Text>
            <Text className="text-base text-gray-700 dark:text-gray-300 mb-6 leading-6">
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
                  disabled={isProcessingChoice}
                />
              ))}
            </View>

            {isProcessingChoice && (
              <View className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Text className="text-center text-blue-700 dark:text-blue-300">
                  Seçim işleniyor...
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="bg-white dark:bg-gray-800 mx-4 mt-4 p-6 rounded-xl shadow-sm">
            <Text className="text-center text-gray-500 dark:text-gray-400">
              Yeni olay yükleniyor...
            </Text>
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </ScreenWrapper>
  );
}