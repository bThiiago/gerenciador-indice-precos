import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.ipjr',
  appName: 'IPJR',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    iosScheme: 'http',
  }
};

export default config;
