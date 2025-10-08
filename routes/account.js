const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getUserById, updateUserProfile, updateUserPassword, setUserAvatar, getBookmarksByUser, getWatchHistory } = require('../models/database');

const router = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/auth/login?next=/account');
  next();
}

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'avatars');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = `u${req.session.userId}_${Date.now()}${ext}`;
    cb(null, safe);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

router.get('/', requireLogin, async (req, res) => {
  try {
    const tab = req.query.tab || 'profile';
    const user = await getUserById(req.session.userId);
    const { success, error } = req.query;

    let data = {};
    if (tab === 'bookmarks') {
      const bookmarks = await getBookmarksByUser(req.session.userId);
      data = { bookmarks };
    } else if (tab === 'history') {
      const page = parseInt(req.query.page) || 1;
      const limit = 20;
      const offset = (page - 1) * limit;
      const watchHistory = await getWatchHistory(req.session.userId, limit, offset);
      data = {
        watchHistory,
        pagination: {
          page,
          limit,
          hasMore: watchHistory.length === limit,
          baseUrl: '/account?tab=history' // for pagination links
        }
      };
    }

    res.render('account/profile', {
      title: 'Akun Saya - KitaNime',
      description: 'Kelola akun, bookmark, dan riwayat tonton Anda',
      userProfile: user,
      activeTab: tab,
      success,
      error,
      ...data
    });

  } catch (e) {
    console.error('Account page error:', e);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan',
      error: { status: 500, message: 'Gagal memuat halaman akun.' }
    });
  }
});

router.post('/profile', requireLogin, async (req, res) => {
  const { name, email } = req.body;
  try {
    await updateUserProfile(req.session.userId, name, email);
    req.session.userName = name;
    req.session.userEmail = email;
    res.redirect('/account?success=profile_updated');
  } catch (e) {
    res.redirect('/account?error=profile_failed');
  }
});

router.post('/password', requireLogin, async (req, res) => {
  const { old_password, new_password } = req.body;
  try {
    await updateUserPassword(req.session.userId, old_password, new_password);
    res.redirect('/account?success=password_updated');
  } catch (e) {
    const code = e && e.message === 'INVALID_OLD_PASSWORD' ? 'invalid_old_password' : 'password_failed';
    res.redirect(`/account?error=${code}`);
  }
});

router.post('/avatar', requireLogin, upload.single('avatar'), async (req, res) => {
  try {
    const relPath = `/uploads/avatars/${req.file.filename}`;
    await setUserAvatar(req.session.userId, relPath);
    res.redirect('/account?success=avatar_updated');
  } catch (e) {
    res.redirect('/account?error=avatar_failed');
  }
});

router.get('/test', (req, res) => {
  res.send('Account test route is working');
});

module.exports = router;


