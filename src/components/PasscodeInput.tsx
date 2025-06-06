
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { passcodeStore } from "@/store/passcodeStore";

interface PasscodeInputProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const PasscodeInput = ({ onSuccess, onBack }: PasscodeInputProps) => {
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passcodeStore.validatePasscode(passcode)) {
      onSuccess();
      toast({
        title: "Access granted",
        description: "Welcome to the admin portal.",
      });
    } else {
      toast({
        title: "Access denied",
        description: "Incorrect passcode. Please try again.",
        variant: "destructive",
      });
      setPasscode("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-blue-50 flex items-center justify-center">
      <Card className="w-full max-w-md border-2 border-green-200 shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800">Admin Access</CardTitle>
          <CardDescription className="text-green-700">Enter your passcode to access the admin portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPasscode ? "text" : "password"}
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="pr-10 border-green-200 focus:border-green-400"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
              >
                {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg">
              Access Admin Portal
            </Button>
          </form>
          <Button variant="outline" onClick={onBack} className="w-full border-green-200 text-green-700 hover:bg-green-50">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
