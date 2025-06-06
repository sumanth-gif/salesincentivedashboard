
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Award, UsersRound, Store, Smartphone, Target, Gift, Trophy } from "lucide-react";
import { AdminPortal } from "@/components/AdminPortal";
import { UserPortal } from "@/components/UserPortal";
import { PasscodeInput } from "@/components/PasscodeInput";
import { UserAccessModal } from "@/components/UserAccessModal"; 

const Index = () => {
  const [activePortal, setActivePortal] = useState<"landing" | "admin" | "user" | "admin-login" | "user-access">("landing");
  const [showUserAccessModal, setShowUserAccessModal] = useState(false);

  if (activePortal === "admin-login") {
    return (
      <PasscodeInput 
        onSuccess={() => setActivePortal("admin")} 
        onBack={() => setActivePortal("landing")} 
      />
    );
  }

  if (activePortal === "admin") {
    return <AdminPortal onBack={() => setActivePortal("landing")} />;
  }

  if (activePortal === "user") {
    return <UserPortal onBack={() => setActivePortal("landing")} />;
  }

  if (activePortal === "user-access") {
    return (
      <UserAccessModal 
        isOpen={showUserAccessModal} 
        onClose={() => {
          setShowUserAccessModal(false);
          setActivePortal("landing");
        }}
        onBack={() => setActivePortal("landing")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-green-600 to-orange-500 rounded-full shadow-lg">
              <Smartphone className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-orange-500 to-blue-600 bg-clip-text text-transparent mb-4">
            Android Premier League Dashboard <span className="text-lg font-normal text-gray-600">(Jun to Oct)</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Join the ultimate Android sales championship where performance meets rewards!
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-200">
            <CardContent className="p-6">
              <Smartphone className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Sell Android Smartphones</h3>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-orange-200">
            <CardContent className="p-6">
              <Target className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Achieve Monthly Target</h3>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-blue-200">
            <CardContent className="p-6">
              <Gift className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Earn Points, Redeem for Incentives</h3>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-purple-200">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Monthly Bonanza</h3>
            </CardContent>
          </Card>
        </div>

        {/* Portal Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Portal */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-green-200 hover:border-green-400">
            <CardHeader className="text-center pb-4 bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-800">Admin Portal</CardTitle>
              <CardDescription className="text-green-700">
                Manage schemes, upload data, and publish points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">PDF</Badge>
                  <span className="text-sm text-gray-700">Upload scheme constructs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Excel</Badge>
                  <span className="text-sm text-gray-700">Import sales data and points</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Analytics</Badge>
                  <span className="text-sm text-gray-700">View regional summaries</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">Publish</Badge>
                  <span className="text-sm text-gray-700">Release data to user portal</span>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                onClick={() => setActivePortal("admin-login")}
              >
                Access Admin Portal
              </Button>
            </CardContent>
          </Card>
          
          {/* User Access Portal */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-orange-200 hover:border-orange-400">
            <CardHeader className="text-center pb-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg">
                  <Store className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-orange-800">User Access</CardTitle>
              <CardDescription className="text-orange-700">
                Access for stores and cluster managers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 bg-orange-50">Store</Badge>
                  <span className="text-sm text-gray-700">Individual store access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50">Cluster</Badge>
                  <span className="text-sm text-gray-700">Cluster manager view</span>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg"
                onClick={() => {
                  setActivePortal("user-access");
                  setShowUserAccessModal(true);
                }}
              >
                Access Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Beta version. Developed for internal purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
