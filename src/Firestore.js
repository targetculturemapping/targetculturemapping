import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCbAWGRBrilt6lc3l2fcYzCXqeE9sC9Qok',
  authDomain: 'target-culture-managemen-58bfb.firebaseapp.com',
  projectId: 'target-culture-managemen-58bfb',
  storageBucket: 'target-culture-managemen-58bfb.appspot.com',
  messagingSenderId: '224679060356',
  appId: '1:224679060356:web:2ee4a7bc2e76d11b36f3d1',
  measurementId: 'G-D3HDBFDXWD'
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
