const { getSetting } = require('../models/database');

async function cookieConsent(req, res, next) {
  try {
    // Wait a bit for database to be ready if it's not initialized yet
    let retries = 0;
    const maxRetries = 10;
    
    while (retries < maxRetries) {
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
