
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedbackForm from '@/components/FeedbackForm';
import { qrService } from '@/services/qrService';
import { Button } from '@/components/ui/button';

const Feedback = () => {
  const { qrId } = useParams<{ qrId: string }>();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!qrId) return;
    
    // Check QR code validity
    const valid = qrService.checkQRCodeValidity(qrId);
    setIsValid(valid);
  }, [qrId]);

  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center animate-scale-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate your input!
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-800 hover:bg-blue-700"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!qrId || isValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center animate-fade-in">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Invalid QR Code</h2>
          <p className="text-gray-600 mb-6">
            This QR code is invalid, has expired, or has reached its maximum number of scans.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-800 hover:bg-blue-700"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto pt-8 pb-16">
        <FeedbackForm 
          qrId={qrId}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>
    </div>
  );
};

export default Feedback;
