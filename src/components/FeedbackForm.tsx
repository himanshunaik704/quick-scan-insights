
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { feedbackService } from '../services/feedbackService';
import { qrService } from '../services/qrService';

interface FeedbackFormProps {
  qrId: string;
  onSubmitSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ qrId, onSubmitSuccess }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [context, setContext] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if QR code is valid
    const isValidQR = qrService.checkQRCodeValidity(qrId);
    setIsValid(isValidQR);
    
    // Get context for this QR code
    const qrCode = qrService.getQRCodeById(qrId);
    if (qrCode) {
      setContext(qrCode.context);
    }
  }, [qrId]);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast({
        title: "QR Code Expired",
        description: "This QR code has expired or reached its maximum scans.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await feedbackService.submitFeedback(qrId, rating, comment);
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      
      // Reset form
      setRating(0);
      setComment('');
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive"
      });
      console.error('Feedback submission error:', error);
    }
    
    setIsSubmitting(false);
  };

  if (!isValid) {
    return (
      <div className="flex flex-col items-center p-6 text-center animate-fade-in">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-4">
          <h2 className="text-xl font-semibold text-red-700">QR Code Expired</h2>
          <p className="text-red-600 mt-2">
            This QR code has expired or reached its maximum scans.
          </p>
        </div>
      </div>
    );
  }

  // Adaptive form based on context
  const contextSpecificQuestion = context.toLowerCase().includes('restaurant') || context.toLowerCase().includes('table')
    ? "How was your dining experience?"
    : context.toLowerCase().includes('classroom') || context.toLowerCase().includes('room')
    ? "How was your classroom experience?"
    : "How was your experience?";

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        {contextSpecificQuestion}
      </h2>
      <p className="text-gray-500 mb-6">
        For: {context}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingClick(value)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                  rating >= value
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comments
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Share your thoughts..."
            rows={4}
            className="resize-none"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700"
          disabled={isSubmitting || rating === 0}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
    </div>
  );
};

export default FeedbackForm;
