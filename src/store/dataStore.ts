
// Simple data store for sharing data between portals
interface SalesData {
  storeName: string;
  city: string;
  region: string;
  totalTarget: number;
  totalAchievement: number;
  qualified: boolean;
  totalIncentiveEarned: number;
}

class DataStore {
  private salesData: SalesData[] = [];
  private isPublished: boolean = false;
  private schemeFile: File | null = null;
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  setSalesData(data: SalesData[]) {
    this.salesData = data;
    this.notify();
  }

  getSalesData(): SalesData[] {
    return this.isPublished ? this.salesData : [];
  }

  setSchemeFile(file: File) {
    this.schemeFile = file;
    this.notify();
  }

  getSchemeFile(): File | null {
    return this.schemeFile;
  }

  publish() {
    this.isPublished = true;
    this.notify();
  }

  isDataPublished(): boolean {
    return this.isPublished;
  }

  hasRequiredFiles(): boolean {
    return this.schemeFile !== null && this.salesData.length > 0;
  }
}

export const dataStore = new DataStore();
