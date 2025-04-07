
import React, { useState } from 'react';
import { QRCode, QRGeneratorParams } from '../types';
import { qrService } from '../services/qrService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import QRCodeDisplay from './QRCodeDisplay';
import { useToast } from '@/components/ui/use-toast';

const QRGenerator: React.FC = () => {
  const [params, setParams] = useState<QRGeneratorParams>({
    context: 'Table 1',
    expiryHours: 24,
    maxScans: 10
  });
  const [generatedQR, setGeneratedQR] = useState<QRCode | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: name === 'context' ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQRCode = qrService.generateQRCode(params);
    setGeneratedQR(newQRCode);
    toast({
      title: "QR Code Generated",
      description: `Created QR code for ${params.context}`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">Generate QR Code</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="context">Context (e.g., Table Number, Room)</Label>
          <Input
            id="context"
            name="context"
            value={params.context}
            onChange={handleChange}
            placeholder="Table 1"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expiryHours">Expiry (hours)</Label>
          <Input
            id="expiryHours"
            name="expiryHours"
            type="number"
            min="1"
            max="72"
            value={params.expiryHours}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxScans">Maximum Scans</Label>
          <Input
            id="maxScans"
            name="maxScans"
            type="number"
            min="1"
            max="100"
            value={params.maxScans}
            onChange={handleChange}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-800 hover:bg-blue-700"
        >
          Generate QR Code
        </Button>
      </form>
      
      {generatedQR && (
        <div className="mt-6 pt-6 border-t">
          <QRCodeDisplay qrCode={generatedQR} />
          <p className="mt-4 text-sm text-center text-gray-500">
            Scan this QR code to access the feedback form
          </p>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
