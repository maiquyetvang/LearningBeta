import { Eye, EyeClosed } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Input } from '../ui/input';

type InputWithIconProps = Omit<React.ComponentProps<typeof Input>, 'style'> & {
  leftIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  style?: React.ComponentProps<typeof Input>['style'];
};

export const InputWithIcon = React.forwardRef<any, InputWithIconProps>(
  ({ leftIcon, containerStyle, style, secureTextEntry, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = !!secureTextEntry;

    return (
      <View style={[styles.container, containerStyle]}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <Input
          ref={ref}
          style={[
            styles.input,
            leftIcon ? { paddingLeft: 40 } : null,
            isPassword ? { paddingRight: 40 } : null,
            style,
          ]}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={10}
          >
            {!showPassword ? <EyeClosed size={20} color="#888" /> : <Eye size={20} color="#888" />}
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: '100%',
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: '100%',
  },
  input: {
    flex: 1,
  },
});

InputWithIcon.displayName = 'InputWithIcon';
