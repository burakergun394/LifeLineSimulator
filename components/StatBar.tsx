import React from 'react';
import { View, Text } from 'react-native';

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
}

const StatBar: React.FC<StatBarProps> = ({ 
  label, 
  value, 
  maxValue, 
  color = '#3B82F6' 
}) => {
  const percentage = (value / maxValue) * 100;

  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-sm font-medium text-gray-700">{label}</Text>
        <Text className="text-sm text-gray-600">{value}/{maxValue}</Text>
      </View>
      <View className="w-full bg-gray-200 rounded-full h-3">
        <View 
          className="h-3 rounded-full"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color 
          }}
        />
      </View>
    </View>
  );
};

export default StatBar;