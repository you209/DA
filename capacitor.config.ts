import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.helphub.app',
  appName: 'HelpHub AU',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
