
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Store, Target, TrendingUp, Award, CheckCircle, XCircle, AlertCircle, Download, Clock } from "lucide-react";
import { dataStore } from "@/store/dataStore";
import { toast } from "@/hooks/use-toast";

interface UserPortalProps {
  onBack: () => void;
}

interface StoreData {
  storeCode: string;
  storeName: string;
  city: string;
  region: string;
  totalTarget: number;
  totalAchievement: number;
  qualified: boolean;
  totalPointsEarned: number;
}

export const UserPortal = ({ onBack }: UserPortalProps) => {
  const [storeCode, setStoreCode] = useState<string>("");
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [isDataPublished, setIsDataPublished] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = dataStore.subscribe(() => {
      const published = dataStore.isDataPublished();
      setIsDataPublished(published);
      setLastUpdateTime(dataStore.getLastUpdateTime());
      
      // If data becomes unpublished, clear the store data
      if (!published) {
        setStoreData(null);
        setStoreCode("");
      }
    });

    // Initialize with existing data
    setIsDataPublished(dataStore.isDataPublished());
    setLastUpdateTime(dataStore.getLastUpdateTime());

    return unsubscribe;
  }, []);

  const handleStoreCodeSearch = () => {
    if (!storeCode.trim()) {
      setStoreData(null);
      return;
    }

    setIsSearching(true);
    const foundStore = dataStore.getStoreData(storeCode.trim());
    setStoreData(foundStore || null);
    setIsSearching(false);
  };

  const handleDownloadConstruct = () => {
    const construct = dataStore.getIncentiveConstruct();
    if (!construct) {
      toast({
        title: "No construct available",
        description: "Points construct has not been uploaded yet.",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(construct);
    const link = document.createElement('a');
    link.href = url;
    link.download = construct.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Points construct is downloading...",
    });
  };

  const achievementPercentage = storeData 
    ? Math.round((storeData.totalAchievement / storeData.totalTarget) * 100)
    : 0;

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'Never';
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
  };

  if (!isDataPublished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Portal</h1>
              <p className="text-gray-600">View your sales points and performance</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Data Available</h3>
            <p className="text-gray-500">
              Sales points data has not been published yet. Please contact your administrator or check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Portal</h1>
            <p className="text-gray-600">View your sales points and performance</p>
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
              onClick={handleDownloadConstruct}
            >
              <Download className="h-4 w-4 mr-2" />
              Points Construct
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Store Code Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-blue-600" />
              Enter Your Store Code
            </CardTitle>
            <CardDescription>
              Enter your unique store code to view your points details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter store code (e.g., ST001)"
                value={storeCode}
                onChange={(e) => setStoreCode(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleStoreCodeSearch}
                disabled={!storeCode.trim() || isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
            {storeCode && !storeData && !isSearching && (
              <p className="text-sm text-red-600 mt-2">
                Store code not found. Please check your store code and try again.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Store Details */}
        {storeData ? (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Sales Target</p>
                      <p className="text-2xl font-bold">₹{storeData.totalTarget.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Achievement</p>
                      <p className="text-2xl font-bold">₹{storeData.totalAchievement.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    {storeData.qualified ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge 
                        variant={storeData.qualified ? "default" : "secondary"}
                        className={storeData.qualified ? "bg-green-100 text-green-800" : ""}
                      >
                        {storeData.qualified ? "Qualified" : "Not Qualified"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Points Earned</p>
                      <p className="text-2xl font-bold text-orange-600">{storeData.totalPointsEarned.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Details
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of your sales performance and points
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Achievement Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Achievement Progress</h4>
                    <Badge variant={achievementPercentage >= 100 ? "default" : "outline"}>
                      {achievementPercentage}%
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(achievementPercentage, 100)} 
                    className="h-3"
                  />
                </div>

                {/* Store Information */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="font-medium mb-3">Store Information</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-600">Store Code:</div>
                    <div className="font-medium">{storeData.storeCode}</div>
                    <div className="text-gray-600">Store Name:</div>
                    <div className="font-medium">{storeData.storeName}</div>
                    <div className="text-gray-600">City:</div>
                    <div className="font-medium">{storeData.city}</div>
                    <div className="text-gray-600">Region:</div>
                    <div className="font-medium">{storeData.region}</div>
                  </div>
                </div>

                {/* Points Calculation */}
                <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                  <h4 className="font-medium mb-3">Points Calculation</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Sales Target:</span>
                      <span className="font-medium">₹{storeData.totalTarget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Achievement:</span>
                      <span className="font-medium">₹{storeData.totalAchievement.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Achievement %:</span>
                      <span className="font-medium">{achievementPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Qualification Status:</span>
                      <Badge variant={storeData.qualified ? "default" : "secondary"} className={storeData.qualified ? "bg-green-100 text-green-800" : ""}>
                        {storeData.qualified ? "Qualified" : "Not Qualified"}
                      </Badge>
                    </div>
                    <div className="border-t border-green-200 pt-3 flex justify-between font-bold">
                      <span>Total Points Earned:</span>
                      <span className="text-xl text-green-700">{storeData.totalPointsEarned.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      * 1 Point = ₹100
                    </div>
                  </div>
                </div>

                {/* Note */}
                {!storeData.qualified && (
                  <div className="border-l-4 border-orange-400 bg-orange-50 p-4 text-orange-800 text-sm">
                    <div className="flex items-start">
                      <div className="ml-3">
                        <h3 className="font-medium mb-2">Information</h3>
                        <p className="leading-relaxed">
                          Your store has not qualified for points this cycle. To qualify, stores must achieve at least 95% of their sales target. Please contact your regional manager for more details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Placeholder when no store is selected
          <div className="text-center py-16">
            <div className="mb-4">
              <Store className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Enter your store code</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter your unique store code in the field above to view your sales points details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
