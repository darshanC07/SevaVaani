import { string } from '@tensorflow/tfjs';
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

import QRCode from "react-native-qrcode-svg";


interface CompletionQRModalProps {
  isVisible: boolean;
  onClose: () => void;
  workerId: string;
  workerName: string;
  jobId: string;
  clientName: string;
  clientId: string
}

const { width } = Dimensions.get('window');

const CompletionQRModal: React.FC<CompletionQRModalProps> = ({
  isVisible,
  onClose,
  workerId,
  workerName,
  jobId,
  clientName,
  clientId
}) => {
  console.log("Generating QR for:", { workerId, workerName, jobId, clientName, clientId });
  const qrData = JSON.stringify({
    workerId: workerId,
    workerName: workerName,
    jobId: jobId,
    clientName: clientName,
    clientId: clientId
  });
  const icon = require('../assets/favicon.png');
  const base64Logo = Image.resolveAssetSource(icon).uri;
  // const qrData = `${workerId};${workerName};${jobId};${clientName};${clientId}`;

  // Use a reliable QR Code API to avoid native dependency issues
  // const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}&color=4560F4`;

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
              {/* <Image
                source={{ uri: qrImageUrl }}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              /> */}
              <QRCode
                value={qrData}
                size={200}
                color="#4560F4"
                backgroundColor="white"
                logo={{ uri: base64Logo }}
                logoSize={30}
                logoBackgroundColor='transparent'
              />
            </View>

            <Text style={styles.instructionText}>
              Show this QR to client in order to complete the job.
            </Text>

            {/* <Text style={styles.workerInfo}>
              {workerName} (ID: {workerId.substring(0, 8)}...)
            </Text> */}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CompletionQRModal;

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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
