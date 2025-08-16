import React from 'react';
import { View, Text, Image } from 'react-native';
import { ScreenWrapper } from '../components/Layout';
import { Button } from '../components';
import { NavigationHelper } from '../utils';
import { useGameStore } from '../store';

export default function MainMenu() {
  const { isGameStarted, character, loadGame } = useGameStore();

  const handleNewGame = () => {
    NavigationHelper.toCharacterCreation();
  };

  const handleContinueGame = () => {
    if (character) {
      NavigationHelper.toGame();
    } else {
      loadGame();
      if (character) {
        NavigationHelper.toGame();
      }
    }
  };

  const handleSettings = () => {
    // TODO: Navigate to settings screen when implemented
    console.log('Settings screen not implemented yet');
  };

  return (
    <ScreenWrapper 
      className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      statusBarPadding={true}
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Game Logo/Title */}
        <View className="items-center mb-16">
          <View className="w-24 h-24 bg-blue-500 rounded-full justify-center items-center mb-6 shadow-lg">
            <Text className="text-4xl">🎮</Text>
          </View>
          <Text className="text-5xl font-bold text-blue-900 dark:text-blue-100 mb-3 text-center">
            Hayat Çizgisi
          </Text>
          <Text className="text-lg text-blue-700 dark:text-blue-300 text-center max-w-sm">
            Yaşam Simülasyon Oyunu
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            Kararların geleceğini şekillendirir
          </Text>
        </View>

        {/* Menu Buttons */}
        <View className="w-full max-w-sm space-y-4">
          <Button
            title="Yeni Oyun Başlat"
            onPress={handleNewGame}
            variant="primary"
            size="large"
            className="w-full shadow-md"
          />
          
          {(isGameStarted || character) && (
            <Button
              title="Oyuna Devam Et"
              onPress={handleContinueGame}
              variant="secondary"
              size="large"
              className="w-full"
            />
          )}
          
          <Button
            title="Ayarlar"
            onPress={handleSettings}
            variant="secondary"
            size="medium"
            className="w-full"
          />
        </View>

        {/* Character Info Preview */}
        {character && (
          <View className="mt-8 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Text className="text-center text-gray-700 dark:text-gray-300 text-sm mb-2">
              Son Karakter
            </Text>
            <Text className="text-center font-semibold text-gray-900 dark:text-white">
              {character.name} - Yaş {character.age}
            </Text>
          </View>
        )}

        {/* Version Info */}
        <View className="absolute bottom-8">
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            v1.0.0 • Beta
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}