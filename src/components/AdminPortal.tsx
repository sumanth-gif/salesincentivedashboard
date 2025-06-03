
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, FileText, Spreadsheet, Eye, Send, CheckCircle, Building2, TrendingUp, Target, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AdminPortalProps {
  onBack: () => void;
}

interface SalesData {
  storeName: string;
  city: string;
  region: string;
  totalTarget: number;
  totalAchievement: number;
  qualified: boolean;
  totalIncentiveEarned: number;
}

export const AdminPortal = ({ onBack }: AdminPortalProps) => {
  const [uploadedScheme, setUploadedScheme] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<File | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  // Sample data for demonstration
  const sampleData: SalesData[] = [
    { storeName: "Store Alpha", city: "Mumbai", region: "West", totalTarget: 1000000, totalAchievement: 1200000, qualified: true, totalIncentiveEarned: 50000 },
    { storeName: "Store Beta", city: "Delhi", region: "North", totalTarget: 800000, totalAchievement: 750000, qualified: false, totalIncentiveEarned: 0 },
    { storeName: "Store Gamma", city: "Bangalore", region: "South", totalTarget: 1200000, totalAchievement: 1400000, qualified: true, totalIncentiveEarned: 75000 },
    { storeName: "Store Delta", city: "Chennai", region: "South", totalTarget: 900000, totalAchievement: 950000, qualified: true, totalIncentiveEarned: 40000 },
    { storeName: "Store Epsilon", city: "Pune", region: "West", totalTarget: 700000, totalAchievement: 650000, qualified: false, totalIncentiveEarned: 0 },
  ];

  const handleSchemeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedScheme(file);
      toast({
        title: "Scheme uploaded successfully!",
        description: `${file.name} has been uploaded.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleDataUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setUploadedData(file);
      setSalesData(sampleData); // In real app, parse the Excel file
      toast({
        title: "Sales data uploaded successfully!",
        description: `${file.name} has been processed and ${sampleData.length} records loaded.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls).",
        variant: "destructive",
      });
    }
  };

  const handlePublish = () => {
    if (!uploadedScheme || !uploadedData) {
      toast({
        title: "Missing files",
        description: "Please upload both scheme PDF and sales data Excel file before publishing.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPublished(true);
    toast({
      title: "Data published successfully!",
      description: "Sales incentive data is now available in the user portal.",
    });
  };

  const downloadTemplate = () => {
    toast({
      title: "Template downloaded",
      description: "Excel template has been downloaded to your device.",
    });
  };

  // Calculate regional summaries
  const regionalSummary = salesData.reduce((acc, store) => {
    if (!acc[store.region]) {
      acc[store.region] = {
        storeCount: 0,
        totalTarget: 0,
        totalAchievement: 0,
        totalQualified: 0,
        totalIncentive: 0,
      };
    }
    
    acc[store.region].storeCount++;
    acc[store.region].totalTarget += store.totalTarget;
    acc[store.region].totalAchievement += store.totalAchievement;
    if (store.qualified) acc[store.region].totalQualified++;
    acc[store.region].totalIncentive += store.totalIncentiveEarned;
    
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-600">Manage sales incentive schemes and data</p>
          </div>
          {isPublished && (
            <Badge className="ml-auto bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Published
            </Badge>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload & Manage</TabsTrigger>
            <TabsTrigger value="data">View Data</TabsTrigger>
            <TabsTrigger value="analytics">Regional Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Scheme Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Upload Scheme PDF
                  </CardTitle>
                  <CardDescription>
                    Upload the sales incentive scheme document
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <label htmlFor="scheme-upload" className="cursor-pointer">
                      <span className="text-sm text-gray-600">Click to upload PDF scheme</span>
                      <input
                        id="scheme-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleSchemeUpload}
                      />
                    </label>
                  </div>
                  {uploadedScheme && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">{uploadedScheme.name}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Data Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Spreadsheet className="h-5 w-5 text-green-600" />
                    Upload Sales Data
                  </CardTitle>
                  <CardDescription>
                    Upload Excel file with sales and incentive data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" size="sm" onClick={downloadTemplate} className="w-full">
                    <Spreadsheet className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <Spreadsheet className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <label htmlFor="data-upload" className="cursor-pointer">
                      <span className="text-sm text-gray-600">Click to upload Excel file</span>
                      <input
                        id="data-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={handleDataUpload}
                      />
                    </label>
                  </div>
                  {uploadedData && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">{uploadedData.name}</span>
                      <Badge variant="secondary" className="ml-auto">{salesData.length} records</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Publish Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-purple-600" />
                  Publish Data
                </CardTitle>
                <CardDescription>
                  Make the incentive data available to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Ready to publish? This will make the data visible in the user portal.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant={uploadedScheme ? "default" : "secondary"}>
                        PDF {uploadedScheme ? "✓" : "✗"}
                      </Badge>
                      <Badge variant={uploadedData ? "default" : "secondary"}>
                        Excel {uploadedData ? "✓" : "✗"}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={handlePublish}
                    disabled={!uploadedScheme || !uploadedData || isPublished}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isPublished ? "Published" : "Publish Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Sales Data Overview
                </CardTitle>
                <CardDescription>
                  View all uploaded sales and incentive data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {salesData.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Store Name</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Region</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Achievement</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Incentive</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salesData.map((store, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{store.storeName}</TableCell>
                            <TableCell>{store.city}</TableCell>
                            <TableCell>{store.region}</TableCell>
                            <TableCell>₹{store.totalTarget.toLocaleString()}</TableCell>
                            <TableCell>₹{store.totalAchievement.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={store.qualified ? "default" : "secondary"}>
                                {store.qualified ? "Qualified" : "Not Qualified"}
                              </Badge>
                            </TableCell>
                            <TableCell>₹{store.totalIncentiveEarned.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Spreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No sales data uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Stores</p>
                      <p className="text-2xl font-bold">{salesData.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Target</p>
                      <p className="text-2xl font-bold">₹{salesData.reduce((sum, store) => sum + store.totalTarget, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Achievement</p>
                      <p className="text-2xl font-bold">₹{salesData.reduce((sum, store) => sum + store.totalAchievement, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Incentives</p>
                      <p className="text-2xl font-bold">₹{salesData.reduce((sum, store) => sum + store.totalIncentiveEarned, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {Object.keys(regionalSummary).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regional Summary</CardTitle>
                  <CardDescription>Performance breakdown by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(regionalSummary).map(([region, data]) => (
                      <div key={region} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-4">{region} Region</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Stores</p>
                            <p className="text-xl font-bold">{data.storeCount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Target</p>
                            <p className="text-xl font-bold">₹{data.totalTarget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Achievement</p>
                            <p className="text-xl font-bold">₹{data.totalAchievement.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Qualified</p>
                            <p className="text-xl font-bold">{data.totalQualified}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Incentives</p>
                            <p className="text-xl font-bold">₹{data.totalIncentive.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Achievement Rate</span>
                            <span>{Math.round((data.totalAchievement / data.totalTarget) * 100)}%</span>
                          </div>
                          <Progress value={(data.totalAchievement / data.totalTarget) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
