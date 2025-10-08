const { getAdSlotsByPosition, getSetting, waitForDatabase } = require('../models/database');

async function adSlots(req, res, next) {
  try {
    // Wait for database to be fully ready
    const dbReady = await waitForDatabase(3000);
    
    if (dbReady) {
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
        console.error('Database error in ad slots middleware:', dbError);
        // Fall through to defaults
      }
    }
    
    // Use defaults if database is not ready or there's an error
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
