import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, PenLine, Droplets, Dumbbell, Scale, Smile, Moon } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Action = { icon: LucideIcon; label: string; href: string; visible?: boolean };

function Row({ icon: Icon, label, onPress }: { icon: LucideIcon; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.oat,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 14,
        }}
      >
        <Icon size={18} color={colors.moss} strokeWidth={1.75} />
      </View>
      <KinText variant="body" color={colors.ink}>
        {label}
      </KinText>
    </Pressable>
  );
}

export function AddSheetContent({
  onNavigate,
  trackWater = true,
  trackWorkouts = true,
  trackMood = true,
  trackSleep = true,
}: {
  onNavigate: () => void;
  trackWater?: boolean;
  trackWorkouts?: boolean;
  trackMood?: boolean;
  trackSleep?: boolean;
}) {
  const router = useRouter();

  const actions: Action[] = [
    { icon: Camera, label: 'Take a meal photo', href: '/meal/camera' },
    { icon: PenLine, label: 'Add meal manually', href: '/meal/manual-entry' },
    { icon: Droplets, label: 'Add water', href: '/log/water', visible: trackWater },
    { icon: Dumbbell, label: 'Add workout', href: '/log/workout', visible: trackWorkouts },
    { icon: Scale, label: 'Add weight', href: '/log/weight' },
    { icon: Smile, label: 'Add mood', href: '/log/mood', visible: trackMood },
    { icon: Moon, label: 'Add sleep', href: '/log/sleep', visible: trackSleep },
  ];

  return (
    <View>
      <KinText variant="eyebrow" color={colors.sage} style={{ marginBottom: 4 }}>
        ADD TO TODAY
      </KinText>
      {actions
        .filter((a) => a.visible !== false)
        .map((action) => (
          <Row
            key={action.href}
            icon={action.icon}
            label={action.label}
            onPress={() => {
              onNavigate();
              router.push(action.href as any);
            }}
          />
        ))}
    </View>
  );
}
