
import React, { useEffect, useState } from 'react';
import { QRCode } from '../types';

interface QRCodeDisplayProps {
  qrCode: QRCode;
  size?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCode, size = 200 }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  
  useEffect(() => {
    // In a real implementation, we would use a library like qrcode.react
    // For now, we'll use a placeholder QR code image
    import('qrcode')
      .then(QRCode => {
        const feedbackUrl = `${window.location.origin}/feedback/${qrCode.id}`;
        QRCode.toDataURL(feedbackUrl, { width: size, margin: 2 })
          .then(url => {
            setQrDataUrl(url);
          })
          .catch(err => {
            console.error('QR Code generation error:', err);
          });
      })
      .catch(err => {
        console.error('Failed to load QRCode module:', err);
      });
  }, [qrCode, size]);

  return (
    <div className="flex flex-col items-center">
      {qrDataUrl ? (
        <img 
          src={qrDataUrl} 
          alt={`QR Code for ${qrCode.context}`} 
          width={size} 
          height={size} 
          className="rounded-lg shadow-md"
        />
      ) : (
        <div 
          className="animate-pulse bg-gray-200 rounded-lg"
          style={{ width: size, height: size }}
        />
      )}
      <div className="mt-3 text-center">
        <p className="font-semibold text-blue-800">{qrCode.context}</p>
        <p className="text-sm text-gray-500">
          Expires: {qrCode.expiryTime.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          Scans: {qrCode.scansUsed}/{qrCode.maxScans}
        </p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
