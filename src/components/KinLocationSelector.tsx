import { Pressable, View } from 'react-native';
import { Navigation, MapPin, Search } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Props = {
  currentLabel?: string;
  onUseCurrentLocation: () => void;
  onChooseArea: () => void;
  onUseApproximate: () => void;
};

function Row({
  icon: Icon,
  label,
  onPress,
}: {
  icon: typeof Navigation;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon size={18} color={colors.moss} strokeWidth={1.75} />
      <KinText variant="body" color={colors.ink} style={{ marginLeft: 12 }}>
        {label}
      </KinText>
    </Pressable>
  );
}

export function KinLocationSelector({ currentLabel, onUseCurrentLocation, onChooseArea, onUseApproximate }: Props) {
  return (
    <View>
      {currentLabel ? (
        <KinText variant="caption" color={colors.sage} style={{ marginBottom: 4 }}>
          CURRENT AREA: {currentLabel.toUpperCase()}
        </KinText>
      ) : null}
      <Row icon={Navigation} label="Use my current location" onPress={onUseCurrentLocation} />
      <Row icon={Search} label="Choose another area" onPress={onChooseArea} />
      <Row icon={MapPin} label="Use approximate location" onPress={onUseApproximate} />
    </View>
  );
}
