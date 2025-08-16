import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/Layout';
import { 
  GameHeader, 
  LifeEvents, 
  StatisticsSection, 
  ActionSection, 
  FloatingNotification,
  useNotification 
} from '../components/Game';
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

  const [isProcessing, setIsProcessing] = useState(false);
  const { notification, showNotification, hideNotification } = useNotification();

  // Sample life events data
  const [lifeEvents] = useState([
    {
      age: 18,
      title: 'Üniversite Başlangıcı',
      description: 'Hayalindeki üniversiteye kabul edildin!',
      impact: {
        type: 'positive' as const,
        stats: ['+10 Zeka', '+5 Sosyal', '+15 Mutluluk']
      }
    },
    {
      age: 22,
      title: 'İlk İş Deneyimi',
      description: 'Part-time işe başladın ve para kazanmaya başladın.',
      impact: {
        type: 'positive' as const,
        stats: ['+500₺', '+3 Deneyim', '-2 Boş Zaman']
      }
    },
    {
      age: 25,
      title: 'Mezuniyet',
      description: 'Üniversiteden başarıyla mezun oldun!',
      impact: {
        type: 'positive' as const,
        stats: ['+20 Zeka', '+10 Kariyer', '+20 Mutluluk']
      }
    }
  ]);

  useEffect(() => {
    if (!character) {
      NavigationHelper.toMainMenu();
      return;
    }
  }, [character]);

  const handleNextYear = () => {
    if (!character || isProcessing) return;
    
    setIsProcessing(true);
    
    // Simulate year progression
    setTimeout(() => {
      ageCharacter();
      showNotification(`🎉 ${character.age + 1} yaşına geldin!`, 'success');
      setIsProcessing(false);
    }, 1000);
  };

  const handleActionSelect = (category: string, actionId: string) => {
    showNotification(`📚 ${category} kategorisinden bir eylem seçtin!`, 'info');
  };

  if (!character) {
    return (
      <ScreenWrapper loading={true} />
    );
  }

  return (
    <ScreenWrapper className="bg-gray-50">
      {/* Game Header */}
      <GameHeader 
        character={character}
        money={5000}
        profession="Üniversite Öğrencisi"
      />

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Life Events Section */}
        <LifeEvents 
          events={lifeEvents}
          currentAge={character.age}
        />

        {/* Statistics Section */}
        <View className="mt-6">
          <StatisticsSection stats={character.stats} />
        </View>

        {/* Action Section */}
        <View className="mt-6">
          <ActionSection
            onNextYear={handleNextYear}
            onActionSelect={handleActionSelect}
            isProcessing={isProcessing}
          />
        </View>
      </ScrollView>

      {/* Floating Notification */}
      <FloatingNotification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onHide={hideNotification}
      />
    </ScreenWrapper>
  );
}