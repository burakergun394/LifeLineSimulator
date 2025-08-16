import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false,
  size = 'medium',
  className = ''
}) => {
  const getBaseClasses = () => {
    let classes = 'rounded-lg justify-center items-center ';
    
    // Size classes
    switch (size) {
      case 'small':
        classes += 'px-3 py-2 ';
        break;
      case 'large':
        classes += 'px-6 py-4 ';
        break;
      default:
        classes += 'px-4 py-3 ';
    }
    
    // Variant classes
    switch (variant) {
      case 'secondary':
        classes += disabled ? 'bg-gray-200 ' : 'bg-gray-100 border border-gray-300 ';
        break;
      case 'danger':
        classes += disabled ? 'bg-red-200 ' : 'bg-red-500 ';
        break;
      default:
        classes += disabled ? 'bg-blue-200 ' : 'bg-blue-500 ';
    }
    
    return classes;
  };

  const getTextClasses = () => {
    let classes = 'font-semibold ';
    
    // Size classes
    switch (size) {
      case 'small':
        classes += 'text-sm ';
        break;
      case 'large':
        classes += 'text-lg ';
        break;
      default:
        classes += 'text-base ';
    }
    
    // Variant text color
    switch (variant) {
      case 'secondary':
        classes += disabled ? 'text-gray-400 ' : 'text-gray-700 ';
        break;
      default:
        classes += disabled ? 'text-white/70 ' : 'text-white ';
    }
    
    return classes;
  };

  return (
    <Pressable 
      onPress={onPress}
      disabled={disabled}
      className={`${getBaseClasses()} ${className}`}
      style={({ pressed }) => ({
        opacity: pressed && !disabled ? 0.8 : 1,
      })}
    >
      <Text className={getTextClasses()}>{title}</Text>
    </Pressable>
  );
};

export default Button;