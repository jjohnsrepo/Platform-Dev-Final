import { Ionicons } from '@expo/vector-icons';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

export default function Scanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  function scanBarcode(result: BarcodeScanningResult) {
    if (scannedRef.current) return;
    scannedRef.current = true;
    setFlashMessage(`ISBN: ${result.data}`);
    setTimeout(() => {
      router.replace({ pathname: '/library', params: { result: result.data } });
    }, 600);
  }

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={Colors.textMuted} />
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          We need camera access to scan book barcodes
        </Text>
        <Pressable
          style={({ pressed }) => [styles.grantButton, pressed && styles.grantPressed]}
          onPress={requestPermission}
        >
          <Text style={styles.grantButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanBarcode}
        barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
      />

      {/* Dark overlay with cutout */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.scanWindow}>
            {/* Corner markers */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom}>
          {flashMessage ? (
            <View style={styles.flashBadge}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.flashText}>{flashMessage}</Text>
            </View>
          ) : (
            <Text style={styles.instruction}>
              Point camera at book barcode
            </Text>
          )}
        </View>
      </View>

      {/* Back button */}
      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const SCAN_SIZE = 280;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCAN_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanWindow: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: Colors.primary,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  instruction: {
    ...Typography.body,
    color: '#fff',
    opacity: 0.9,
  },
  flashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  flashText: {
    ...Typography.body,
    color: '#fff',
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  permissionTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  permissionText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  grantButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  grantPressed: {
    opacity: 0.85,
  },
  grantButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
});
