import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Props = {
  title: string;
  price: string;
  billingNote?: string;
  badge?: string;
  features: string[];
  selected: boolean;
  onPress: () => void;
};

export function KinPaywallCard({ title, price, billingNote, badge, features, selected, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          borderRadius: 20,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? colors.moss : colors.stone,
          backgroundColor: selected ? colors.moss : colors.white,
          padding: 20,
          marginBottom: 12,
        }}
      >
        {badge ? (
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: selected ? colors.butter : colors.oat,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
              marginBottom: 10,
            }}
          >
            <KinText variant="caption" color={colors.ink}>
              {badge}
            </KinText>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <KinText variant="h3" color={selected ? colors.white : colors.ink}>
            {title}
          </KinText>
          <KinText variant="h3" color={selected ? colors.white : colors.ink}>
            {price}
          </KinText>
        </View>
        {billingNote ? (
          <KinText variant="small" color={selected ? colors.celadon : colors.forest} style={{ marginTop: 2 }}>
            {billingNote}
          </KinText>
        ) : null}
        <View style={{ marginTop: 12 }}>
          {features.map((feature) => (
            <View key={feature} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Check size={14} color={selected ? colors.celadon : colors.moss} strokeWidth={2} />
              <KinText variant="small" color={selected ? colors.white : colors.forest} style={{ marginLeft: 8 }}>
                {feature}
              </KinText>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}
