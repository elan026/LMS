import { connectDB } from './config/db.js';
import { config, validateConfig } from './config/env.js';
import app from './app.js';

validateConfig();

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`LMS Backend running on http://localhost:${config.port}`);
  });
});
