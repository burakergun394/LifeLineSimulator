import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface LifeEvent {
  age: number;
  title: string;
  description: string;
  impact: {
    type: 'positive' | 'negative' | 'neutral';
    stats: string[];
  };
}

interface LifeEventsProps {
  events: LifeEvent[];
  currentAge: number;
}

const LifeEvents: React.FC<LifeEventsProps> = ({ events, currentAge }) => {
  const getImpactColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIcon = (age: number) => {
    if (age <= 12) return '🎈';
    if (age <= 18) return '🎓';
    if (age <= 25) return '🎯';
    if (age <= 35) return '💼';
    if (age <= 50) return '🏠';
    if (age <= 65) return '👨‍🎓';
    return '🌅';
  };

  return (
    <View className="bg-gradient-to-b from-green-50 to-emerald-50 px-6 py-6">
      {/* Section Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          📚 Yaşam Yolculuğu
        </Text>
        <Text className="text-gray-600 text-base">
          Hayatındaki önemli anları keşfet
        </Text>
      </View>

      {/* Timeline Container */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingRight: 20 }}
      >
        <View className="flex-row items-center">
          {/* Timeline Line */}
          <View className="absolute top-16 left-8 right-0 h-1 bg-gradient-to-r from-emerald-300 to-green-400 rounded-full" />
          
          {events.map((event, index) => (
            <View key={index} className="relative mr-6">
              
              {/* Age Bubble */}
              <View className={`w-16 h-16 rounded-full justify-center items-center mb-4 shadow-lg ${
                event.age === currentAge 
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-emerald-200' 
                  : event.age < currentAge
                  ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                  : 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200'
              }`}>
                <Text className={`text-sm font-bold ${
                  event.age === currentAge 
                    ? 'text-white' 
                    : event.age < currentAge
                    ? 'text-white'
                    : 'text-green-700'
                }`}>
                  {event.age}
                </Text>
              </View>

              {/* Event Card */}
              <View className="w-72 bg-white rounded-2xl p-4 shadow-lg border border-green-100">
                {/* Event Header */}
                <View className="flex-row items-center mb-3">
                  <Text className="text-2xl mr-2">{getEventIcon(event.age)}</Text>
                  <Text className="text-lg font-semibold text-gray-800 flex-1">
                    {event.title}
                  </Text>
                </View>

                {/* Event Description */}
                <Text className="text-gray-600 text-sm mb-4 leading-5">
                  {event.description}
                </Text>

                {/* Impact Tags */}
                <View className="flex-row flex-wrap">
                  {event.impact.stats.map((stat, statIndex) => (
                    <View 
                      key={statIndex}
                      className={`mr-2 mb-2 px-3 py-1 rounded-full border ${getImpactColor(event.impact.type)}`}
                    >
                      <Text className="text-xs font-medium">
                        {stat}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Connection Line to Next Event */}
              {index < events.length - 1 && (
                <View className="absolute top-16 -right-6 w-6 h-1 bg-gradient-to-r from-emerald-300 to-green-400" />
              )}
            </View>
          ))}

          {/* Future Events Placeholder */}
          <View className="relative ml-6">
            <View className="w-16 h-16 rounded-full justify-center items-center mb-4 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300">
              <Text className="text-gray-400 text-xl">?</Text>
            </View>
            
            <View className="w-72 bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200">
              <View className="flex-row items-center mb-3">
                <Text className="text-2xl mr-2">✨</Text>
                <Text className="text-lg font-semibold text-gray-500">
                  Gelecek Maceralar
                </Text>
              </View>
              
              <Text className="text-gray-400 text-sm">
                Hayatında daha nice güzel anlar seni bekliyor...
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LifeEvents;