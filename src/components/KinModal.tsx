import { Modal, Pressable, View, type ModalProps } from 'react-native';
import { colors } from '@/theme';

type Props = ModalProps & {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function KinModal({ visible, onClose, children, ...rest }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} {...rest}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(32,34,30,0.4)', justifyContent: 'center', padding: 24 }}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 20,
              padding: 24,
              shadowColor: colors.ink,
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.11,
              shadowRadius: 50,
            }}
          >
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
