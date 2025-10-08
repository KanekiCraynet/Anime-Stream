const { getAdSlotsByPosition, getSetting } = require('../models/database');

async function adSlots(req, res, next) {
  try {
    // Wait a bit for database to be ready if it's not initialized yet
    let retries = 0;
    const maxRetries = 10;
    
    while (retries < maxRetries) {
      try {
        const adsenseEnabled = await getSetting('adsense_enabled');

        const [headerAds, sidebarTopAds, sidebarBottomAds, contentBottomAds, playerBottomAds] = await Promise.all([
          getAdSlotsByPosition('header'),
          getAdSlotsByPosition('sidebar-top'),
          getAdSlotsByPosition('sidebar-bottom'),
          getAdSlotsByPosition('content-bottom'),
          getAdSlotsByPosition('player-bottom')
        ]);

        res.locals.adSlots = {
          header: headerAds || [],
          sidebarTop: sidebarTopAds || [],
          sidebarBottom: sidebarBottomAds || [],
          contentBottom: contentBottomAds || [],
          playerBottom: playerBottomAds || []
        };
        
        res.locals.adsenseEnabled = adsenseEnabled === '1';

        next();
        return;
      } catch (dbError) {
        if (dbError.code === 'SQLITE_ERROR' && dbError.message.includes('no such table')) {
          // Database not ready yet, wait and retry
          retries++;
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }
        throw dbError;
      }
    }
    
    // If we get here, database is still not ready, use defaults
    res.locals.adSlots = {
      header: [],
      sidebarTop: [],
      sidebarBottom: [],
      contentBottom: [],
      playerBottom: []
    };
    res.locals.adsenseEnabled = false;
    next();
    
  } catch (error) {
    console.error('Ad slots middleware error:', error);
    res.locals.adSlots = {
      header: [],
      sidebarTop: [],
      sidebarBottom: [],
      contentBottom: [],
      playerBottom: []
    };
    res.locals.adsenseEnabled = false;
    next();
  }
}

module.exports = adSlots;
