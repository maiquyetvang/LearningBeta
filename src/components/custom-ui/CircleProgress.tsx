import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '../ui/text';

const CircleProgress = ({
  value,
  total,
  size = 32,
  strokeWidth = 4,
  color = '#22c55e',
  bgColor = '#e5f9ee',
  textColor = '#22c55e',
}: {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  textColor?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? value / total : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
        }}
      >
        <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 10 }}>
          {Math.round((value * 100) / total)}
          <Text style={{ fontSize: 6, color: textColor }}>%</Text>
        </Text>
      </View>
    </View>
  );
};
export default CircleProgress;
