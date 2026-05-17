import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('ts-node/esm', pathToFileURL('./'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
});

// Import the TypeScript entrypoint and log errors
import('./server.ts').catch((err) => {
  console.error('Failed to import server.ts:', err);
  process.exit(1);
});
