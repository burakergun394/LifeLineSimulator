import React, { ReactNode } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: ReactNode;
  loading?: boolean;
  scrollable?: boolean;
  backgroundColor?: string;
  statusBarPadding?: boolean;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  className?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  loading = false,
  scrollable = false,
  backgroundColor = 'bg-white dark:bg-gray-900',
  statusBarPadding = true,
  edges = ['top', 'bottom', 'left', 'right'],
  className = '',
}) => {
  const containerClass = `flex-1 ${backgroundColor} ${className}`;

  if (loading) {
    return (
      <SafeAreaView className={containerClass} edges={edges}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  if (scrollable) {
    return (
      <SafeAreaView className={containerClass} edges={edges}>
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={containerClass} edges={edges}>
      <View className="flex-1">
        {children}
      </View>
    </SafeAreaView>
  );
};

export default ScreenWrapper;