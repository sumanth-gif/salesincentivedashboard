
// Simple data store for sharing data between portals
interface SalesData {
  storeCode: string;
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

  constructor() {
    // Load persisted data on initialization
    this.loadPersistedData();
  }

  private loadPersistedData() {
    try {
      const savedData = localStorage.getItem('sales_data');
      const savedPublishStatus = localStorage.getItem('data_published');
      
      if (savedData) {
        this.salesData = JSON.parse(savedData);
        console.log('DataStore: Loaded persisted data:', this.salesData.length, 'records');
      }
      
      if (savedPublishStatus) {
        this.isPublished = JSON.parse(savedPublishStatus);
        console.log('DataStore: Loaded publish status:', this.isPublished);
      }
    } catch (error) {
      console.error('DataStore: Error loading persisted data:', error);
      // Reset to defaults if loading fails
      this.salesData = [];
      this.isPublished = false;
    }
  }

  private persistData() {
    try {
      localStorage.setItem('sales_data', JSON.stringify(this.salesData));
      localStorage.setItem('data_published', JSON.stringify(this.isPublished));
      console.log('DataStore: Data persisted to localStorage');
    } catch (error) {
      console.error('DataStore: Error persisting data:', error);
    }
  }

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
    this.persistData(); // Persist the new data
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

  getStoreData(storeCode: string): SalesData | undefined {
    return this.isPublished ? this.salesData.find(store => store.storeCode === storeCode) : undefined;
  }

  publish() {
    console.log('DataStore: Publishing data, records:', this.salesData.length);
    this.isPublished = true;
    this.persistData(); // Persist the publish status
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
