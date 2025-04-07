
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import QRGenerator from '@/components/QRGenerator';

const Index = () => {
  const { toast } = useToast();
  const [adminAccessKey, setAdminAccessKey] = useState<string | null>(null);

  const generateAdminAccess = () => {
    // In a real app, this would generate a secure token
    // For demo purposes, we'll just use a random string
    const key = Math.random().toString(36).substring(2, 15);
    setAdminAccessKey(key);
    
    // Store in localStorage for persistence
    localStorage.setItem('adminAccessKey', key);
    
    toast({
      title: "Admin Access Generated",
      description: "You can now access the admin dashboard."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">QR Feedback System</h1>
              <p className="text-gray-600 mt-1">Generate QR codes and collect anonymous feedback</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/admin">
                <Button variant="outline" className="border-blue-800 text-blue-800 hover:bg-blue-50">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
            <TabsTrigger value="generate">Generate QR Code</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <QRGenerator />
              
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Create dynamic QR codes for collecting anonymous feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-medium">Generate QR Code</h3>
                      <p className="text-sm text-gray-500">
                        Create a QR code for a specific context (e.g., restaurant table)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-medium">Display QR Code</h3>
                      <p className="text-sm text-gray-500">
                        Place the QR code where customers can scan it
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-medium">Collect Feedback</h3>
                      <p className="text-sm text-gray-500">
                        Users scan the QR code and submit anonymous feedback
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</div>
                    <div>
                      <h3 className="font-medium">View Insights</h3>
                      <p className="text-sm text-gray-500">
                        Check the admin dashboard to view feedback trends
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>About This Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    This demo application showcases a QR code-based anonymous feedback system
                    with sentiment analysis and real-time dashboard.
                  </p>
                  <p>
                    In a production environment, this would be backed by a Spring Boot backend
                    with Stanford CoreNLP for sentiment analysis.
                  </p>
                  <p>
                    The QR codes are dynamic, expiring after a set time or number of scans,
                    making them perfect for gathering contextual feedback.
                  </p>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Get Admin Access</h3>
                    
                    {adminAccessKey ? (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800 font-medium mb-2">
                          Your admin access key:
                        </p>
                        <div className="bg-white p-2 rounded border border-blue-200 text-center font-mono text-sm break-all">
                          {adminAccessKey}
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          Keep this key safe! You'll need it to access the admin dashboard.
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={generateAdminAccess}
                        className="w-full bg-blue-800 hover:bg-blue-700"
                      >
                        Generate Admin Access
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">✓</div>
                      <div>
                        <span className="font-medium">Dynamic QR Codes</span>
                        <p className="text-sm text-gray-500">
                          QR codes that expire after a set time or number of scans
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start space-x-2">
                      <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">✓</div>
                      <div>
                        <span className="font-medium">Anonymous Feedback</span>
                        <p className="text-sm text-gray-500">
                          No user accounts or personal information required
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start space-x-2">
                      <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">✓</div>
                      <div>
                        <span className="font-medium">Sentiment Analysis</span>
                        <p className="text-sm text-gray-500">
                          Automatically categorize feedback as positive, neutral, or negative
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start space-x-2">
                      <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">✓</div>
                      <div>
                        <span className="font-medium">Real-time Dashboard</span>
                        <p className="text-sm text-gray-500">
                          Visual charts and trends of collected feedback
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start space-x-2">
                      <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">✓</div>
                      <div>
                        <span className="font-medium">Contextual Forms</span>
                        <p className="text-sm text-gray-500">
                          Feedback forms that adapt based on context
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>QR Code Feedback System &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
