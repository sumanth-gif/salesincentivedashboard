
class PasscodeStore {
  private passcode: string = "Admin";
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

  validatePasscode(inputPasscode: string): boolean {
    return this.passcode === inputPasscode;
  }

  changePasscode(newPasscode: string) {
    this.passcode = newPasscode;
    this.notify();
  }
}

export const passcodeStore = new PasscodeStore();
