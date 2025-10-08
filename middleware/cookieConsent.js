const { getSetting, waitForDatabase } = require('../models/database');

async function cookieConsent(req, res, next) {
  try {
    // Wait for database to be fully ready
    const dbReady = await waitForDatabase(3000);
    
    if (dbReady) {
      try {
        const consentEnabled = await getSetting('cookie_consent_enabled');
        
        if (consentEnabled === '1') {
          const hasConsent = req.cookies.cookie_consent;
          res.locals.showCookieConsent = !hasConsent;
          res.locals.cookieConsentGiven = !!hasConsent;
        } else {
          res.locals.showCookieConsent = false;
          res.locals.cookieConsentGiven = true;
        }
        
        next();
        return;
      } catch (dbError) {
        console.error('Database error in cookie consent middleware:', dbError);
        // Fall through to defaults
      }
    }
    
    // Use defaults if database is not ready or there's an error
    res.locals.showCookieConsent = false;
    res.locals.cookieConsentGiven = true;
    next();
    
  } catch (error) {
    console.error('Cookie consent middleware error:', error);
    res.locals.showCookieConsent = false;
    res.locals.cookieConsentGiven = true;
    next();
  }
}

module.exports = cookieConsent;
