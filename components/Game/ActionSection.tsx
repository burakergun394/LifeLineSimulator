import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';

interface ActionSectionProps {
  onNextYear: () => void;
  onActionSelect: (category: string, action: string) => void;
  isProcessing?: boolean;
}

interface ActionTab {
  id: string;
  name: string;
  icon: string;
  color: string;
  actions: Array<{
    id: string;
    title: string;
    description: string;
    cost?: number;
    effects: string[];
  }>;
}

const ActionSection: React.FC<ActionSectionProps> = ({ 
  onNextYear, 
  onActionSelect, 
  isProcessing = false 
}) => {
  const [selectedTab, setSelectedTab] = useState('education');
  const scaleAnim = new Animated.Value(1);

  const actionTabs: ActionTab[] = [
    {
      id: 'education',
      name: 'Eğitim',
      icon: '📚',
      color: 'blue',
      actions: [
        {
          id: 'study_hard',
          title: 'Sıkı Çalış',
          description: 'Ders çalışarak zeka geliştir',
          effects: ['+5 Zeka', '-2 Sosyal']
        },
        {
          id: 'online_course',
          title: 'Online Kurs',
          description: 'Yeni beceriler öğren',
          cost: 500,
          effects: ['+3 Zeka', '+1 Mutluluk']
        }
      ]
    },
    {
      id: 'career',
      name: 'Kariyer',
      icon: '💼',
      color: 'emerald',
      actions: [
        {
          id: 'work_overtime',
          title: 'Fazla Mesai',
          description: 'Daha fazla para kazan',
          effects: ['+200₺', '-3 Sağlık', '-2 Mutluluk']
        },
        {
          id: 'networking',
          title: 'Networking',
          description: 'İş bağlantıları kur',
          effects: ['+4 Sosyal', '+2 Kariyer']
        }
      ]
    },
    {
      id: 'social',
      name: 'Sosyal',
      icon: '👥',
      color: 'pink',
      actions: [
        {
          id: 'party',
          title: 'Parti',
          description: 'Arkadaşlarla eğlen',
          cost: 300,
          effects: ['+5 Mutluluk', '+3 Sosyal', '-1 Sağlık']
        },
        {
          id: 'volunteer',
          title: 'Gönüllülük',
          description: 'Hayır işlerine katıl',
          effects: ['+4 Mutluluk', '+3 Sosyal']
        }
      ]
    },
    {
      id: 'hobbies',
      name: 'Hobi',
      icon: '🎨',
      color: 'purple',
      actions: [
        {
          id: 'sports',
          title: 'Spor Yap',
          description: 'Sağlığını geliştir',
          effects: ['+4 Sağlık', '+2 Mutluluk', '-1 Sosyal']
        },
        {
          id: 'art',
          title: 'Sanat',
          description: 'Yaratıcılığını geliştir',
          effects: ['+3 Mutluluk', '+2 Zeka']
        }
      ]
    },
    {
      id: 'other',
      name: 'Diğer',
      icon: '⚡',
      color: 'orange',
      actions: [
        {
          id: 'travel',
          title: 'Seyahat',
          description: 'Yeni yerler keşfet',
          cost: 1000,
          effects: ['+6 Mutluluk', '+3 Sosyal', '+2 Zeka']
        },
        {
          id: 'meditation',
          title: 'Meditasyon',
          description: 'İç huzuru bul',
          effects: ['+3 Mutluluk', '+2 Sağlık']
        }
      ]
    }
  ];

  const getTabColors = (color: string, isSelected: boolean) => {
    const colors = {
      blue: isSelected ? 'bg-blue-500' : 'bg-blue-100',
      emerald: isSelected ? 'bg-emerald-500' : 'bg-emerald-100',
      pink: isSelected ? 'bg-pink-500' : 'bg-pink-100',
      purple: isSelected ? 'bg-purple-500' : 'bg-purple-100',
      orange: isSelected ? 'bg-orange-500' : 'bg-orange-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTextColors = (color: string, isSelected: boolean) => {
    const colors = {
      blue: isSelected ? 'text-white' : 'text-blue-700',
      emerald: isSelected ? 'text-white' : 'text-emerald-700',
      pink: isSelected ? 'text-white' : 'text-pink-700',
      purple: isSelected ? 'text-white' : 'text-purple-700',
      orange: isSelected ? 'text-white' : 'text-orange-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const selectedTabData = actionTabs.find(tab => tab.id === selectedTab);

  const handleNextYearPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onNextYear();
  };

  return (
    <View className="bg-gradient-to-b from-green-50 to-emerald-50 px-4 py-6">
      
      {/* Main Action Button */}
      <View className="mb-6">
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={handleNextYearPress}
            disabled={isProcessing}
            className={`bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 shadow-xl ${
              isProcessing ? 'opacity-70' : ''
            }`}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-3xl mr-3">🚀</Text>
              <View>
                <Text className="text-white text-xl font-bold">
                  {isProcessing ? 'İşleniyor...' : 'Sonraki Yıla Geç'}
                </Text>
                <Text className="text-white/80 text-sm">
                  Yeni maceralara hazır ol!
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Action Tabs */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          ⚡ Bu Yıl Ne Yapmak İstiyorsun?
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {actionTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setSelectedTab(tab.id)}
              className={`mr-3 px-4 py-3 rounded-xl ${getTabColors(tab.color, selectedTab === tab.id)}`}
            >
              <View className="flex-row items-center">
                <Text className="text-lg mr-2">{tab.icon}</Text>
                <Text className={`font-semibold ${getTextColors(tab.color, selectedTab === tab.id)}`}>
                  {tab.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Action Cards */}
      {selectedTabData && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {selectedTabData.actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => onActionSelect(selectedTab, action.id)}
              className="bg-white rounded-2xl p-4 mr-4 w-64 shadow-lg border border-gray-100"
              activeOpacity={0.8}
            >
              {/* Action Header */}
              <View className="mb-3">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {action.title}
                </Text>
                {action.cost && (
                  <View className="bg-red-50 self-start px-2 py-1 rounded-full">
                    <Text className="text-red-600 text-xs font-medium">
                      Maliyet: ₺{action.cost}
                    </Text>
                  </View>
                )}
              </View>

              {/* Description */}
              <Text className="text-gray-600 text-sm mb-4">
                {action.description}
              </Text>

              {/* Effects */}
              <View className="flex-row flex-wrap">
                {action.effects.map((effect, index) => (
                  <View 
                    key={index}
                    className={`mr-2 mb-2 px-2 py-1 rounded-full ${
                      effect.startsWith('+') 
                        ? 'bg-green-100 border border-green-200' 
                        : 'bg-red-100 border border-red-200'
                    }`}
                  >
                    <Text className={`text-xs font-medium ${
                      effect.startsWith('+') 
                        ? 'text-green-700' 
                        : 'text-red-700'
                    }`}>
                      {effect}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ActionSection;