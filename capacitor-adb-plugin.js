import { registerPlugin } from '@capacitor/core';

const AdbExecutor = registerPlugin('AdbExecutor', {
  web: () => import('./web').then(m => new m.AdbExecutorWeb()),
  android: () => import('./android').then(m => new m.AdbExecutorAndroid())
});

export default AdbExecutor;