import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'rahee.in',
  appName: 'Rahee',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['://github.com', 'github.com']
  }
};

export default config;

