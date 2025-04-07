
import React, { useState, useEffect } from 'react';
import { Feedback, SentimentType } from '../types';
import { feedbackService } from '../services/feedbackService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckIcon, ClockIcon, Search, Settings, Trash } from 'lucide-react';
import SentimentChart from './SentimentChart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const AdminDashboard: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [filteredData, setFilteredData] = useState<Feedback[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timeFrame, setTimeFrame] = useState<string>('week');
  
  useEffect(() => {
    // Get all feedback data
    const allFeedback = feedbackService.getAllFeedback();
    setFeedbackData(allFeedback);
    setFilteredData(allFeedback);
  }, []);
  
  useEffect(() => {
    let filtered = [...feedbackData];
    
    // Filter by sentiment
    if (selectedSentiment !== 'all') {
      filtered = filtered.filter(item => item.sentiment === selectedSentiment);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.comment.toLowerCase().includes(term) || 
        item.qrId.toLowerCase().includes(term)
      );
    }
    
    // Filter by time frame
    const now = new Date();
    if (timeFrame === 'day') {
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filtered = filtered.filter(item => new Date(item.createdAt) >= oneDayAgo);
    } else if (timeFrame === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(item => new Date(item.createdAt) >= oneWeekAgo);
    } else if (timeFrame === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(item => new Date(item.createdAt) >= oneMonthAgo);
    }
    
    setFilteredData(filtered);
  }, [feedbackData, selectedSentiment, searchTerm, timeFrame]);
  
  const sentimentColorMap: Record<SentimentType, string> = {
    POSITIVE: 'bg-green-100 text-green-800',
    NEUTRAL: 'bg-yellow-100 text-yellow-800',
    NEGATIVE: 'bg-red-100 text-red-800'
  };
  
  const getPositivePercentage = () => {
    if (filteredData.length === 0) return 0;
    const positiveCount = filteredData.filter(item => item.sentiment === 'POSITIVE').length;
    return ((positiveCount / filteredData.length) * 100).toFixed(0);
  };
  
  const getNegativePercentage = () => {
    if (filteredData.length === 0) return 0;
    const negativeCount = filteredData.filter(item => item.sentiment === 'NEGATIVE').length;
    return ((negativeCount / filteredData.length) * 100).toFixed(0);
  };
  
  const getAverageRating = () => {
    if (filteredData.length === 0) return 0;
    const sum = filteredData.reduce((acc, item) => acc + item.rating, 0);
    return (sum / filteredData.length).toFixed(1);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-blue-800">Feedback Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search feedback..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last Day</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Positive Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getPositivePercentage()}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{getAverageRating()}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SentimentChart feedbackData={filteredData} chartType="pie" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <SentimentChart feedbackData={filteredData} chartType="line" />
          </CardContent>
        </Card>
      </div>
      
      {/* Feedback List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Feedback</CardTitle>
            <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="POSITIVE">Positive</SelectItem>
                <SelectItem value="NEUTRAL">Neutral</SelectItem>
                <SelectItem value="NEGATIVE">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Sentiment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Comment</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No feedback data available
                    </td>
                  </tr>
                ) : (
                  filteredData
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10)
                    .map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <ClockIcon size={16} className="text-gray-400" />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <span
                                key={index}
                                className={`text-lg ${
                                  index < item.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={sentimentColorMap[item.sentiment]}>
                            {item.sentiment.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">{item.comment}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
