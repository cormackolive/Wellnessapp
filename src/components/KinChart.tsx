import { View } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Point = { x: string; y: number };

type Props = {
  data: Point[];
  height?: number;
  color?: string;
  formatValue?: (value: number) => string;
};

export function KinChart({ data, height = 140, color = colors.moss, formatValue }: Props) {
  if (data.length === 0) return null;

  const width = 320;
  const paddingX = 16;
  const paddingY = 16;
  const values = data.map((d) => d.y);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(data.length - 1, 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.y - min) / range) * (height - paddingY * 2);
    return { x, y };
  });

  const linePath = points.reduce((acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), '');

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke={colors.stone} strokeWidth={1} />
        <Path d={linePath} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        ))}
      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <KinText variant="caption" color={colors.sage}>
          {formatValue ? formatValue(min) : min}
        </KinText>
        <KinText variant="caption" color={colors.sage}>
          {formatValue ? formatValue(max) : max}
        </KinText>
      </View>
    </View>
  );
}
