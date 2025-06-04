
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
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    console.log('DataStore: Notifying listeners, data length:', this.salesData.length, 'published:', this.isPublished);
    this.listeners.forEach(listener => listener());
  }

  setSalesData(data: SalesData[]) {
    console.log('DataStore: Setting sales data:', data.length, 'records');
    this.salesData = [...data]; // Create a new array to ensure reactivity
    this.notify();
  }

  getSalesData(): SalesData[] {
    console.log('DataStore: Getting sales data, published:', this.isPublished, 'data length:', this.salesData.length);
    return this.isPublished ? this.salesData : [];
  }

  getAllSalesData(): SalesData[] {
    // This method returns data regardless of publish status (for admin view)
    return this.salesData;
  }

  publish() {
    console.log('DataStore: Publishing data, records:', this.salesData.length);
    this.isPublished = true;
    this.notify();
  }

  isDataPublished(): boolean {
    return this.isPublished;
  }

  hasRequiredFiles(): boolean {
    return this.salesData.length > 0;
  }
}

export const dataStore = new DataStore();
