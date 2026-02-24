import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

interface CompletionQRModalProps {
  isVisible: boolean;
  onClose: () => void;
  workerId: string;
  workerName: string;
}

const { width } = Dimensions.get('window');

const CompletionQRModal: React.FC<CompletionQRModalProps> = ({
  isVisible,
  onClose,
  workerId,
  workerName,
}) => {
  const qrData = JSON.stringify({
    workerId,
    workerName,
  });

  // Use a reliable QR Code API to avoid native dependency issues
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}&color=4560F4`;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.centeredView}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Job Completion</Text>

            <View style={styles.qrContainer}>
              <Image
                source={{ uri: qrImageUrl }}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.instructionText}>
              Scan this QR to verify and complete the job.
            </Text>

            <Text style={styles.workerInfo}>
              {workerName} (ID: {workerId.substring(0, 8)}...)
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CompletionQRModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent dark overlay
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: width * 0.85,
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  instructionText: {
    fontSize: 14,
    color: '#4560F4', // Theme secondary/primary
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  workerInfo: {
    fontSize: 12,
    color: '#888',
    marginTop: 12,
    textAlign: 'center',
  },
});
