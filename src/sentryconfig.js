//import * as Sentry from '@sentry/react';
//
//export function initializeSentry() {
// Sentry.init({
//   dsn: 'https://87a59aa4ae0431c819dade251df65b01@o4506577736564736.ingest.sentry.io/4506577737809920',
//   integrations: [
//     new Sentry.BrowserTracing({
//      tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/]
//    }),
//    new Sentry.Replay({
//      maskAllText: false,
//       blockAllMedia: false
//     })
//   ],
// Performance Monitoring
//    tracesSampleRate: 1.0, //  Capture 100% of the transactions
// Session Replay
//    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//    replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
//  });
//}
