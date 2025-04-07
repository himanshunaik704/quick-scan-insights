
import { Feedback, SentimentType } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { sentimentService } from "./sentimentService";

// Mock service to simulate backend API interactions
class FeedbackService {
  private feedbackEntries: Feedback[] = [];

  async submitFeedback(qrId: string, rating: number, comment: string): Promise<Feedback> {
    // Analyze sentiment using our sentiment service
    const sentimentResult = await sentimentService.analyzeSentiment(comment);
    
    const newFeedback: Feedback = {
      id: uuidv4(),
      qrId,
      rating,
      comment,
      sentiment: sentimentResult.sentiment,
      createdAt: new Date()
    };
    
    this.feedbackEntries.push(newFeedback);
    return newFeedback;
  }

  getFeedbackByQRId(qrId: string): Feedback[] {
    return this.feedbackEntries.filter(feedback => feedback.qrId === qrId);
  }

  getAllFeedback(): Feedback[] {
    return [...this.feedbackEntries];
  }

  getRecentFeedback(count: number): Feedback[] {
    return [...this.feedbackEntries]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, count);
  }

  getFeedbackBySentiment(sentiment: SentimentType): Feedback[] {
    return this.feedbackEntries.filter(feedback => feedback.sentiment === sentiment);
  }

  // Mock some sample data for testing
  initSampleData() {
    const sentiments: SentimentType[] = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];
    const comments = [
      "Great service, very satisfied!",
      "Food was good, but the wait was a bit long.",
      "Terrible experience, will not return.",
      "Average experience, nothing special.",
      "Loved the atmosphere, but the food was just okay."
    ];
    
    for (let i = 0; i < 15; i++) {
      const randomQrId = uuidv4();
      const randomRating = Math.floor(Math.random() * 5) + 1;
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      const randomComment = comments[Math.floor(Math.random() * comments.length)];
      
      this.feedbackEntries.push({
        id: uuidv4(),
        qrId: randomQrId,
        rating: randomRating,
        comment: randomComment,
        sentiment: randomSentiment,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 604800000)) // Random date within the last week
      });
    }
  }
}

export const feedbackService = new FeedbackService();
// Initialize with sample data
feedbackService.initSampleData();
