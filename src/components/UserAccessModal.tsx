
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Users } from "lucide-react";
import { UserPortal } from "./UserPortal";
import { ClusterManagerView } from "./ClusterManagerView";

interface UserAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export const UserAccessModal = ({ isOpen, onClose, onBack }: UserAccessModalProps) => {
  const [selectedView, setSelectedView] = useState<"selection" | "store" | "cluster">("selection");

  const handleBack = () => {
    if (selectedView === "selection") {
      onBack();
    } else {
      setSelectedView("selection");
    }
  };

  if (selectedView === "store") {
    return <UserPortal onBack={handleBack} />;
  }

  if (selectedView === "cluster") {
    return <ClusterManagerView onBack={handleBack} />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select User Access Type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button 
            onClick={() => setSelectedView("store")}
            variant="outline" 
            className="flex items-center justify-start gap-4 p-6"
          >
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Store</h3>
              <p className="text-sm text-gray-600">Access individual store data</p>
            </div>
          </Button>
          
          <Button 
            onClick={() => setSelectedView("cluster")}
            variant="outline"
            className="flex items-center justify-start gap-4 p-6"
          >
            <Users className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Cluster Manager</h3>
              <p className="text-sm text-gray-600">View cluster performance summary</p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
