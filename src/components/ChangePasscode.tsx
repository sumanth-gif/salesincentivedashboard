
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { passcodeStore } from "@/store/passcodeStore";

interface ChangePasscodeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasscode = ({ isOpen, onClose }: ChangePasscodeProps) => {
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [showConfirmPasscode, setShowConfirmPasscode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPasscode.trim()) {
      toast({
        title: "Error",
        description: "Passcode cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (newPasscode !== confirmPasscode) {
      toast({
        title: "Error",
        description: "Passcodes do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    passcodeStore.changePasscode(newPasscode);
    toast({
      title: "Passcode changed successfully",
      description: "Your admin passcode has been updated.",
    });
    
    setNewPasscode("");
    setConfirmPasscode("");
    onClose();
  };

  const handleClose = () => {
    setNewPasscode("");
    setConfirmPasscode("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Admin Passcode</DialogTitle>
          <DialogDescription>
            Enter a new passcode for admin access
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-passcode">New Passcode</Label>
            <div className="relative">
              <Input
                id="new-passcode"
                type={showNewPasscode ? "text" : "password"}
                placeholder="Enter new passcode"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPasscode(!showNewPasscode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-passcode">Confirm Passcode</Label>
            <div className="relative">
              <Input
                id="confirm-passcode"
                type={showConfirmPasscode ? "text" : "password"}
                placeholder="Confirm new passcode"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPasscode(!showConfirmPasscode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Change Passcode
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
