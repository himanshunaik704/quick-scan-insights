
import { SentimentAnalysisResult } from "../types";

// Mock service to simulate Stanford CoreNLP integration
class SentimentService {
  async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    // In a real implementation, this would call the Stanford CoreNLP API
    // For now, we'll use a simple rule-based approach
    
    const positiveWords = ['great', 'good', 'excellent', 'amazing', 'love', 'happy', 'satisfied', 'best', 'awesome'];
    const negativeWords = ['bad', 'terrible', 'worst', 'hate', 'awful', 'poor', 'disappointing', 'angry', 'slow'];
    
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });
    
    let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL';
    let score = 0;
    
    if (positiveCount > negativeCount) {
      sentiment = 'POSITIVE';
      score = 0.5 + (0.5 * (positiveCount / (positiveCount + negativeCount)));
    } else if (negativeCount > positiveCount) {
      sentiment = 'NEGATIVE';
      score = 0.5 + (0.5 * (negativeCount / (positiveCount + negativeCount)));
    } else {
      score = 0.5;
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { sentiment, score };
  }
}

export const sentimentService = new SentimentService();
