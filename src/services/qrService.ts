
import { QRCode, QRGeneratorParams } from "../types";
import { v4 as uuidv4 } from 'uuid';

// Mock service to simulate backend API interactions
class QRService {
  private qrCodes: QRCode[] = [];

  generateQRCode(params: QRGeneratorParams): QRCode {
    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setHours(expiryDate.getHours() + params.expiryHours);
    
    const newQRCode: QRCode = {
      id: uuidv4(),
      context: params.context,
      createdAt: now,
      expiryTime: expiryDate,
      maxScans: params.maxScans,
      scansUsed: 0
    };
    
    this.qrCodes.push(newQRCode);
    return newQRCode;
  }

  getQRCodeById(id: string): QRCode | undefined {
    return this.qrCodes.find(qr => qr.id === id);
  }

  checkQRCodeValidity(id: string): boolean {
    const qrCode = this.getQRCodeById(id);
    if (!qrCode) return false;
    
    const now = new Date();
    if (now > qrCode.expiryTime) return false;
    if (qrCode.scansUsed >= qrCode.maxScans) return false;
    
    // Increment scans used
    qrCode.scansUsed += 1;
    return true;
  }

  getAllQRCodes(): QRCode[] {
    return [...this.qrCodes];
  }
}

export const qrService = new QRService();
