
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Award } from "lucide-react";
import { AdminPortal } from "@/components/AdminPortal";
import { UserPortal } from "@/components/UserPortal";

const Index = () => {
  const [activePortal, setActivePortal] = useState<"landing" | "admin" | "user">("landing");

  if (activePortal === "admin") {
    return <AdminPortal onBack={() => setActivePortal("landing")} />;
  }

  if (activePortal === "user") {
    return <UserPortal onBack={() => setActivePortal("landing")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sales Incentive Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your sales incentive management with our comprehensive platform designed for administrators and sales teams.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Store Management</h3>
              <p className="text-sm text-gray-600">Manage multiple stores across regions</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Sales Teams</h3>
              <p className="text-sm text-gray-600">Track sales team performance</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Comprehensive reporting and insights</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Award className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Incentives</h3>
              <p className="text-sm text-gray-600">Automated incentive calculations</p>
            </CardContent>
          </Card>
        </div>

        {/* Portal Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Portal */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Building2 className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900">Admin Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Manage schemes, upload data, and publish incentives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">PDF</Badge>
                  <span className="text-sm text-gray-700">Upload scheme constructs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">Excel</Badge>
                  <span className="text-sm text-gray-700">Import sales data and incentives</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">Analytics</Badge>
                  <span className="text-sm text-gray-700">View regional summaries</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">Publish</Badge>
                  <span className="text-sm text-gray-700">Release data to user portal</span>
                </div>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setActivePortal("admin")}
              >
                Access Admin Portal
              </Button>
            </CardContent>
          </Card>

          {/* User Portal */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900">User Portal</CardTitle>
              <CardDescription className="text-gray-600">
                View your sales targets and earned incentives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700">Region</Badge>
                  <span className="text-sm text-gray-700">Select your region and store</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700">Targets</Badge>
                  <span className="text-sm text-gray-700">View sales targets and achievements</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700">Status</Badge>
                  <span className="text-sm text-gray-700">Check qualification status</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700">Incentives</Badge>
                  <span className="text-sm text-gray-700">View earned incentives</span>
                </div>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setActivePortal("user")}
              >
                Access User Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Streamline your sales incentive management with real-time data synchronization
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
