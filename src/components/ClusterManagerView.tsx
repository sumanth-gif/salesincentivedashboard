
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Building2, Users } from "lucide-react";
import { dataStore } from "@/store/dataStore";
import { Badge } from "@/components/ui/badge";

interface ClusterManagerViewProps {
  onBack: () => void;
}

export const ClusterManagerView = ({ onBack }: ClusterManagerViewProps) => {
  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [clusterNames, setClusterNames] = useState<string[]>([]);
  const [clusterData, setClusterData] = useState<any[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  
  useEffect(() => {
    // Subscribe to data store
    const unsubscribe = dataStore.subscribe(() => {
      const availableClusters = dataStore.getClusterNames();
      setClusterNames(availableClusters);
      setLastUpdateTime(dataStore.getLastUpdateTime());
      
      if (selectedCluster && availableClusters.includes(selectedCluster)) {
        setClusterData(dataStore.getClusterData(selectedCluster));
      }
    });
    
    // Initialize
    const availableClusters = dataStore.getClusterNames();
    setClusterNames(availableClusters);
    setLastUpdateTime(dataStore.getLastUpdateTime());
    
    if (availableClusters.length > 0) {
      setSelectedCluster(availableClusters[0]);
      setClusterData(dataStore.getClusterData(availableClusters[0]));
    }
    
    return unsubscribe;
  }, []);
  
  useEffect(() => {
    if (selectedCluster) {
      setClusterData(dataStore.getClusterData(selectedCluster));
    }
  }, [selectedCluster]);
  
  // Calculate cluster summary
  const summary = {
    storeCount: clusterData.length,
    totalTarget: clusterData.reduce((sum, store) => sum + (store.totalTarget || 0), 0),
    totalAchievement: clusterData.reduce((sum, store) => sum + (store.totalAchievement || 0), 0),
    totalQualified: clusterData.filter(store => store.qualified).length,
    totalPoints: clusterData.reduce((sum, store) => sum + (store.totalPointsEarned || 0), 0),
  };
  
  const achievementRate = summary.totalTarget > 0 
    ? Math.round((summary.totalAchievement / summary.totalTarget) * 100) 
    : 0;

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'Never';
    try {
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };
  
  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };
  
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cluster Manager</h1>
            <p className="text-gray-600">View cluster performance data</p>
          </div>
          {lastUpdateTime && (
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
              <span>Last Updated: {formatDateTime(lastUpdateTime)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        {clusterNames.length > 0 ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Cluster
              </label>
              <Select value={selectedCluster} onValueChange={setSelectedCluster}>
                <SelectTrigger className="w-full md:w-1/3">
                  <SelectValue placeholder="Select a cluster" />
                </SelectTrigger>
                <SelectContent>
                  {clusterNames.map(cluster => (
                    <SelectItem key={cluster} value={cluster}>
                      {cluster}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCluster && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Stores</p>
                          <p className="text-2xl font-bold">{formatNumber(summary.storeCount)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Qualified</p>
                          <p className="text-2xl font-bold">{formatNumber(summary.totalQualified)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div>
                        <p className="text-sm text-gray-600">Total Achievement</p>
                        <p className="text-2xl font-bold">{formatCurrency(summary.totalAchievement)}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div>
                        <p className="text-sm text-gray-600">Total Points</p>
                        <p className="text-2xl font-bold">{formatNumber(summary.totalPoints)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Target: {formatCurrency(summary.totalTarget)}</span>
                          <span className="text-sm font-medium">Achievement: {formatCurrency(summary.totalAchievement)} ({achievementRate}%)</span>
                        </div>
                        <Progress value={achievementRate} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Store List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clusterData.length > 0 ? (
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Store Code</TableHead>
                              <TableHead>Store Name</TableHead>
                              <TableHead>City</TableHead>
                              <TableHead>Target</TableHead>
                              <TableHead>Achievement</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Points</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {clusterData.map((store, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{store.storeCode}</TableCell>
                                <TableCell>{store.storeName}</TableCell>
                                <TableCell>{store.city}</TableCell>
                                <TableCell>{formatCurrency(store.totalTarget || 0)}</TableCell>
                                <TableCell>{formatCurrency(store.totalAchievement || 0)}</TableCell>
                                <TableCell>
                                  <Badge variant={store.qualified ? "default" : "secondary"}>
                                    {store.qualified ? "Qualified" : "Not Qualified"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{formatNumber(store.totalPointsEarned || 0)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No stores available in this cluster</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700 mb-4">No cluster data available</p>
            <p className="text-gray-500">Please check with admin for updated data</p>
          </div>
        )}
      </div>
    </div>
  );
};
