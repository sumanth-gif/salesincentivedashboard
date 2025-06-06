import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Sheet, Eye, Send, CheckCircle, Building2, TrendingUp, Target, Award, Settings, FileText, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { parseExcelFile, ExcelRowData } from "@/lib/excelParser";
import { dataStore } from "@/store/dataStore";
import { FileUpload } from "./FileUpload";
import { ChangePasscode } from "./ChangePasscode";

interface AdminPortalProps {
  onBack: () => void;
}

export const AdminPortal = ({ onBack }: AdminPortalProps) => {
  const [uploadedData, setUploadedData] = useState<File | null>(null);
  const [salesData, setSalesData] = useState<ExcelRowData[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChangePasscode, setShowChangePasscode] = useState(false);
  const [uploadedPDF, setUploadedPDF] = useState<File | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = dataStore.subscribe(() => {
      setIsPublished(dataStore.isDataPublished());
      setSalesData(dataStore.getAllSalesData()); // Use getAllSalesData for admin view
      setLastUpdateTime(dataStore.getLastUpdateTime());
    });

    // Initialize with existing data
    setIsPublished(dataStore.isDataPublished());
    setSalesData(dataStore.getAllSalesData());
    setLastUpdateTime(dataStore.getLastUpdateTime());

    return unsubscribe;
  }, []);

  const handleDataUpload = async (file: File) => {
    console.log('Uploading file:', file.name, 'Type:', file.type);
    
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    const isValidType = validTypes.includes(file.type) || 
                       file.name.endsWith('.xlsx') || 
                       file.name.endsWith('.xls') || 
                       file.name.endsWith('.csv');

    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx, .xls) or CSV file.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const parsedData = await parseExcelFile(file);
      console.log('File parsed successfully:', parsedData.length, 'records');
      
      if (parsedData.length === 0) {
        throw new Error('No valid data found in the file');
      }

      setUploadedData(file);
      setSalesData(parsedData);
      dataStore.setSalesData(parsedData);
      
      toast({
        title: "Sales data uploaded successfully!",
        description: `${file.name} has been processed and ${parsedData.length} records loaded.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "Failed to process the uploaded file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePDFUpload = (file: File) => {
    if (!file.type.includes('pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setUploadedPDF(file);
    dataStore.setIncentiveConstruct(file);
    
    toast({
      title: "Points construct uploaded successfully!",
      description: `${file.name} has been uploaded and is now available for download.`,
    });
  };

  const handlePublish = () => {
    if (salesData.length === 0) {
      toast({
        title: "Missing data",
        description: "Please upload sales data file before publishing.",
        variant: "destructive",
      });
      return;
    }
    
    dataStore.publish();
    toast({
      title: "Data published successfully!",
      description: "Sales points data is now available in the user portal.",
    });
  };

  const downloadTemplate = () => {
    // Create CSV content for the template
    const headers = [
      "Store Code",
      "Store Name",
      "City", 
      "Region",
      "Cluster Name", // Added this column
      "Total Target",
      "Total Achievement",
      "Qualified/Not Qualified",
      "Total Points Earned"
    ];
    
    // Add sample data row for reference
    const sampleRow = [
      "ST001",
      "Sample Store",
      "Sample City",
      "Sample Region",
      "Cluster A", // Added this value
      "1000000",
      "1200000",
      "Qualified",
      "500"
    ];
    
    const csvContent = [
      headers.join(","),
      sampleRow.join(",")
    ].join("\n");
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sales_data_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template downloaded",
      description: "Sales data template (CSV format) has been downloaded to your device.",
    });
  };

  // Calculate regional summaries with proper null checks
  const regionalSummary = salesData.reduce((acc, store) => {
    if (!acc[store.region]) {
      acc[store.region] = {
        storeCount: 0,
        totalTarget: 0,
        totalAchievement: 0,
        totalQualified: 0,
        totalPoints: 0,
      };
    }
    
    acc[store.region].storeCount++;
    acc[store.region].totalTarget += store.totalTarget || 0;
    acc[store.region].totalAchievement += store.totalAchievement || 0;
    if (store.qualified) acc[store.region].totalQualified++;
    acc[store.region].totalPoints += store.totalPointsEarned || 0;
    
    return acc;
  }, {} as Record<string, any>);

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'Never';
    try {
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // Safe number formatting function
  const formatNumber = (value: number | undefined | null) => {
    if (value === null || value === undefined || isNaN(value)) return '0';
    return value.toLocaleString();
  };

  // Safe currency formatting function
  const formatCurrency = (value: number | undefined | null) => {
    if (value === null || value === undefined || isNaN(value)) return '₹0';
    return `₹${value.toLocaleString()}`;
  };

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
            <p className="text-gray-600">Manage sales points data</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {lastUpdateTime && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Last Updated: {formatDateTime(lastUpdateTime)}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowChangePasscode(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Change Passcode
            </Button>
            {isPublished && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Published
              </Badge>
            )}
          </div>
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
            <div className="grid gap-6">
              {/* PDF Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-600" />
                    Upload Points Construct
                  </CardTitle>
                  <CardDescription>
                    Upload PDF file with points construct details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FileUpload
                    accept=".pdf"
                    onFileSelect={handlePDFUpload}
                    disabled={false}
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload PDF file
                      </span>
                    </div>
                  </FileUpload>
                  {uploadedPDF && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800">{uploadedPDF.name}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Data Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sheet className="h-5 w-5 text-green-600" />
                    Upload Sales Data
                  </CardTitle>
                  <CardDescription>
                    Upload Excel or CSV file with sales and points data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" size="sm" onClick={downloadTemplate} className="w-full">
                    <Sheet className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <FileUpload
                    accept=".xlsx,.xls,.csv"
                    onFileSelect={handleDataUpload}
                    disabled={isProcessing}
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <Sheet className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">
                        {isProcessing ? "Processing..." : "Click to upload Excel/CSV file"}
                      </span>
                    </div>
                  </FileUpload>
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
                  Make the points data available to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Ready to publish? This will make the data visible in the user portal.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant={uploadedData ? "default" : "secondary"}>
                        Data {uploadedData ? "✓" : "✗"}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={handlePublish}
                    disabled={salesData.length === 0 || isPublished}
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
                  View all uploaded sales and points data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {salesData.length > 0 ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Store Code</TableHead>
                          <TableHead>Store Name</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Region</TableHead>
                          <TableHead>Cluster Name</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Achievement</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Points Earned</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salesData.map((store, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{store.storeCode}</TableCell>
                            <TableCell className="font-medium">{store.storeName}</TableCell>
                            <TableCell>{store.city}</TableCell>
                            <TableCell>{store.region}</TableCell>
                            <TableCell>{store.clusterName || '-'}</TableCell>
                            <TableCell>{formatCurrency(store.totalTarget)}</TableCell>
                            <TableCell>{formatCurrency(store.totalAchievement)}</TableCell>
                            <TableCell>
                              <Badge variant={store.qualified ? "default" : "secondary"}>
                                {store.qualified ? "Qualified" : "Not Qualified"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatNumber(store.totalPointsEarned)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Sheet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
                      <p className="text-2xl font-bold">{formatNumber(salesData.length)}</p>
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
                      <p className="text-2xl font-bold">₹{formatNumber(salesData.reduce((sum, store) => sum + (store.totalTarget || 0), 0))}</p>
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
                      <p className="text-2xl font-bold">₹{formatNumber(salesData.reduce((sum, store) => sum + (store.totalAchievement || 0), 0))}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Points</p>
                      <p className="text-2xl font-bold">{formatNumber(salesData.reduce((sum, store) => sum + (store.totalPointsEarned || 0), 0))}</p>
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
                            <p className="text-xl font-bold">{formatNumber(data.storeCount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Target</p>
                            <p className="text-xl font-bold">₹{formatNumber(data.totalTarget)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Achievement</p>
                            <p className="text-xl font-bold">₹{formatNumber(data.totalAchievement)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Qualified</p>
                            <p className="text-xl font-bold">{formatNumber(data.totalQualified)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Points</p>
                            <p className="text-xl font-bold">{formatNumber(data.totalPoints)}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Achievement Rate</span>
                            <span>{data.totalTarget > 0 ? Math.round((data.totalAchievement / data.totalTarget) * 100) : 0}%</span>
                          </div>
                          <Progress value={data.totalTarget > 0 ? (data.totalAchievement / data.totalTarget) * 100 : 0} className="h-2" />
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

      <ChangePasscode 
        isOpen={showChangePasscode} 
        onClose={() => setShowChangePasscode(false)} 
      />
    </div>
  );
};
