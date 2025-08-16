import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Button } from '../components';

const MainMenu: React.FC = () => {
  const handleNewGame = () => {
    // Navigate to character creation
    console.log('Starting new game...');
  };

  const handleContinue = () => {
    // Continue existing game
    console.log('Continuing game...');
  };

  const handleSettings = () => {
    // Open settings
    console.log('Opening settings...');
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-blue-900 mb-2">
            Hayat Çizgisi
          </Text>
          <Text className="text-lg text-blue-700 text-center">
            Yaşam Simülasyon Oyunu
          </Text>
        </View>

        <View className="w-full max-w-sm space-y-4">
          <Button
            title="Yeni Oyun"
            onPress={handleNewGame}
            variant="primary"
            size="large"
            className="w-full"
          />
          
          <Button
            title="Devam Et"
            onPress={handleContinue}
            variant="secondary"
            size="large"
            className="w-full"
          />
          
          <Button
            title="Ayarlar"
            onPress={handleSettings}
            variant="secondary"
            size="medium"
            className="w-full"
          />
        </View>

        <View className="absolute bottom-8">
          <Text className="text-gray-500 text-sm">
            v1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MainMenu;