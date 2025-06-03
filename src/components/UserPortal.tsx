
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Store, Target, TrendingUp, Award, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { dataStore } from "@/store/dataStore";

interface UserPortalProps {
  onBack: () => void;
}

interface StoreData {
  storeName: string;
  city: string;
  region: string;
  totalTarget: number;
  totalAchievement: number;
  qualified: boolean;
  totalIncentiveEarned: number;
}

export const UserPortal = ({ onBack }: UserPortalProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [storeData, setStoreData] = useState<StoreData[]>([]);
  const [isDataPublished, setIsDataPublished] = useState(false);

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = dataStore.subscribe(() => {
      const data = dataStore.getSalesData();
      const published = dataStore.isDataPublished();
      
      setStoreData(data);
      setIsDataPublished(published);
      
      // Reset selections if data changes
      if (data.length === 0) {
        setSelectedRegion("");
        setSelectedStore("");
      }
    });

    // Initialize with existing data
    const data = dataStore.getSalesData();
    const published = dataStore.isDataPublished();
    setStoreData(data);
    setIsDataPublished(published);

    return unsubscribe;
  }, []);

  const regions = [...new Set(storeData.map(store => store.region))];
  const storesInRegion = storeData.filter(store => store.region === selectedRegion);
  const selectedStoreData = storeData.find(store => store.storeName === selectedStore);

  const achievementPercentage = selectedStoreData 
    ? Math.round((selectedStoreData.totalAchievement / selectedStoreData.totalTarget) * 100)
    : 0;

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
              <p className="text-gray-600">View your sales incentives and performance</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Data Available</h3>
            <p className="text-gray-500">
              Sales incentive data has not been published yet. Please contact your administrator or check back later.
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
            <p className="text-gray-600">View your sales incentives and performance</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Selection Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-blue-600" />
              Select Your Store
            </CardTitle>
            <CardDescription>
              Choose your region and store to view incentive details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <Select value={selectedRegion} onValueChange={(value) => {
                  setSelectedRegion(value);
                  setSelectedStore(""); // Reset store selection when region changes
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
                <Select 
                  value={selectedStore} 
                  onValueChange={setSelectedStore}
                  disabled={!selectedRegion}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {storesInRegion.map((store) => (
                      <SelectItem key={store.storeName} value={store.storeName}>
                        {store.storeName} - {store.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Details */}
        {selectedStoreData ? (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Sales Target</p>
                      <p className="text-2xl font-bold">₹{selectedStoreData.totalTarget.toLocaleString()}</p>
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
                      <p className="text-2xl font-bold">₹{selectedStoreData.totalAchievement.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    {selectedStoreData.qualified ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge 
                        variant={selectedStoreData.qualified ? "default" : "secondary"}
                        className={selectedStoreData.qualified ? "bg-green-100 text-green-800" : ""}
                      >
                        {selectedStoreData.qualified ? "Qualified" : "Not Qualified"}
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
                      <p className="text-sm text-gray-600">Incentive Earned</p>
                      <p className="text-2xl font-bold text-orange-600">₹{selectedStoreData.totalIncentiveEarned.toLocaleString()}</p>
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
                  Detailed breakdown of your sales performance and incentives
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
                    <div className="text-gray-600">Store Name:</div>
                    <div className="font-medium">{selectedStoreData.storeName}</div>
                    <div className="text-gray-600">City:</div>
                    <div className="font-medium">{selectedStoreData.city}</div>
                    <div className="text-gray-600">Region:</div>
                    <div className="font-medium">{selectedStoreData.region}</div>
                  </div>
                </div>

                {/* Incentive Calculation */}
                <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                  <h4 className="font-medium mb-3">Incentive Calculation</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Sales Target:</span>
                      <span className="font-medium">₹{selectedStoreData.totalTarget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Achievement:</span>
                      <span className="font-medium">₹{selectedStoreData.totalAchievement.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Achievement %:</span>
                      <span className="font-medium">{achievementPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Qualification Status:</span>
                      <Badge variant={selectedStoreData.qualified ? "default" : "secondary"} className={selectedStoreData.qualified ? "bg-green-100 text-green-800" : ""}>
                        {selectedStoreData.qualified ? "Qualified" : "Not Qualified"}
                      </Badge>
                    </div>
                    <div className="border-t border-green-200 pt-3 flex justify-between font-bold">
                      <span>Total Incentive Earned:</span>
                      <span className="text-xl text-green-700">₹{selectedStoreData.totalIncentiveEarned.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Note */}
                {!selectedStoreData.qualified && (
                  <div className="border-l-4 border-orange-400 bg-orange-50 p-4 text-orange-800 text-sm">
                    <div className="flex items-start">
                      <div className="ml-3">
                        <h3 className="font-medium mb-2">Information</h3>
                        <p className="leading-relaxed">
                          Your store has not qualified for incentives this cycle. To qualify, stores must achieve at least 95% of their sales target. Please contact your regional manager for more details.
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
            <h3 className="text-xl font-medium text-gray-600 mb-2">Select your region and store</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Choose your region and store from the dropdown menus above to view your sales incentive details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
