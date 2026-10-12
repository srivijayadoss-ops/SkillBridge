import app from './app.js';
import config from './config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`SkillSwap API running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  if (config.demoMode) {
    console.log('Demo mode: enabled');
  }
});
