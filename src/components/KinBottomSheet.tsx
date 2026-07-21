import { forwardRef, useMemo } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { colors } from '@/theme';

type Props = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onDismiss?: () => void;
};

export const KinBottomSheet = forwardRef<BottomSheet, Props>(function KinBottomSheet(
  { children, snapPoints, onDismiss },
  ref
) {
  const points = useMemo(() => snapPoints ?? ['50%'], [snapPoints]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={points}
      enablePanDownToClose
      onClose={onDismiss}
      backgroundStyle={{ backgroundColor: colors.ivory, borderRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: colors.stone, width: 40 }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
      )}
    >
      <BottomSheetView style={{ padding: 20, paddingBottom: 32 }}>{children}</BottomSheetView>
    </BottomSheet>
  );
});
