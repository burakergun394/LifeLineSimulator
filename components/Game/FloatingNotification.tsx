import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

interface FloatingNotificationProps {
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const FloatingNotification: React.FC<FloatingNotificationProps> = ({
  message,
  type,
  visible,
  onHide,
  duration = 3000
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const getNotificationConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✨',
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          shadowColor: 'shadow-green-200'
        };
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'bg-yellow-500',
          textColor: 'text-white',
          shadowColor: 'shadow-yellow-200'
        };
      case 'error':
        return {
          icon: '❌',
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          shadowColor: 'shadow-red-200'
        };
      default:
        return {
          icon: 'ℹ️',
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          shadowColor: 'shadow-blue-200'
        };
    }
  };

  const config = getNotificationConfig();

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideNotification();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideNotification();
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible && slideAnim._value === -100) {
    return null;
  }

  return (
    <View className="absolute top-0 left-0 right-0 z-50" style={{ paddingTop: 60 }}>
      <View className="px-4">
        <Animated.View
          style={{
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ],
            opacity: opacityAnim,
          }}
        >
          <View className={`${config.bgColor} rounded-2xl p-4 ${config.shadowColor} shadow-lg`}>
            <View className="flex-row items-center">
              
              {/* Icon */}
              <View className="w-10 h-10 bg-white/20 rounded-full justify-center items-center mr-3">
                <Text className="text-lg">{config.icon}</Text>
              </View>

              {/* Message */}
              <View className="flex-1">
                <Text className={`${config.textColor} font-semibold text-base`}>
                  {message}
                </Text>
              </View>

              {/* Pulse Animation */}
              <View className="w-2 h-2 bg-white/40 rounded-full ml-2">
                <Animated.View
                  style={{
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                  }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
              <Animated.View
                style={{
                  width: slideAnim.interpolate({
                    inputRange: [-100, 0],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                }}
                className="h-full bg-white/50 rounded-full"
              />
            </View>
          </View>

          {/* Glow Effect */}
          <View className={`absolute inset-0 ${config.bgColor} rounded-2xl blur-md opacity-30 -z-10`} />
        </Animated.View>
      </View>
    </View>
  );
};

// Notification Manager Hook
export const useNotification = () => {
  const [notification, setNotification] = React.useState<{
    message: string;
    type: 'success' | 'warning' | 'info' | 'error';
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false
  });

  const showNotification = (
    message: string, 
    type: 'success' | 'warning' | 'info' | 'error' = 'info'
  ) => {
    setNotification({
      message,
      type,
      visible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      visible: false
    }));
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
};

export default FloatingNotification;