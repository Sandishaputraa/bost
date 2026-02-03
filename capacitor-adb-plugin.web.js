export class AdbExecutorWeb {
  async execute(options) {
    console.log('ADB Execute (Web):', options.command);
    // Di web, hanya simulasi
    return {
      output: `Web version - Command simulated: ${options.command}\n\nNote: Real ADB execution only available in APK version.`
    };
  }
  
  async checkPermission() {
    return { granted: false };
  }
  
  async requestPermission() {
    return { granted: false };
  }
}