const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { CODES_DIR, OUTPUTS_DIR } = require('./generateFile');

/**
 * Cleans ALL files in both directories (codes & outputs)
 */
const performFullCleanup = async () => {
  console.log(`[${new Date().toISOString()}] Starting full cleanup...`);
  
  try {
    // Clean codes directory
    const codeFiles = await fs.promises.readdir(CODES_DIR);
    await Promise.all(codeFiles.map(file => 
      fs.promises.unlink(path.join(CODES_DIR, file)).catch(() => {})
    ));

    // Clean outputs directory
    const outputFiles = await fs.promises.readdir(OUTPUTS_DIR);
    await Promise.all(outputFiles.map(file => 
      fs.promises.unlink(path.join(OUTPUTS_DIR, file)).catch(() => {})
    ));

    console.log(`[${new Date().toISOString()}] Full cleanup completed. Removed ${codeFiles.length + outputFiles.length} files.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Cleanup error:`, err);
  }
};

/**
 * Starts the cleanup scheduler:
 * 1. Cleans ALL files immediately on startup
 * 2. Then runs every 10 minutes
 */
const startCleanupSchedule = () => {
  // 1. Immediately clean everything on startup
  performFullCleanup();

  // 2. Schedule cleanup every 10 minutes (runs at :00, :10, :20, etc.)
  cron.schedule('*/10 * * * *', performFullCleanup);

  console.log('Scheduled cleanup: Runs immediately, then every 10 minutes.');
};

module.exports = { startCleanupSchedule, performFullCleanup };