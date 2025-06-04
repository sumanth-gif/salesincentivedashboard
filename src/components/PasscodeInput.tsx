
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>Enter your passcode to access the admin portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPasscode ? "text" : "password"}
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Access Admin Portal
            </Button>
          </form>
          <Button variant="outline" onClick={onBack} className="w-full">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
