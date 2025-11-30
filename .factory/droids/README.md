# KitaNime Droid Orchestrator

Orchestrator system untuk mengelola specialist droids dalam pengembangan KitaNime anime streaming platform.

## 📋 Overview

Droid Orchestrator adalah sistem otomasi yang mengkoordinasikan berbagai specialist droids untuk menangani berbagai aspek pengembangan proyek:

- **Backend Security Coder**: Keamanan API dan optimasi backend
- **UI Visual Validator**: Validasi UI/UX dan responsive design
- **Mobile Security Coder**: Keamanan mobile dan aksesibilitas
- **Database Optimizer**: Optimasi database dan query
- **DevOps Specialist**: Deployment dan CI/CD
- **Docs Architect**: Dokumentasi dan API docs

## 🎯 Droid Assignments

### 1. Backend Security Coder
**Tanggung Jawab**:
- Audit keamanan kode
- Optimasi API endpoint
- Perbaikan middleware
- Input validation
- Error handling

**Trigger**:
- Perubahan middleware
- Modifikasi route
- Update keamanan

### 2. UI Visual Validator
**Tanggung Jawab**:
- Validasi desain visual
- Cek responsive design
- Testing UI component
- Verifikasi dark mode
- Performance animasi

**Trigger**:
- Perubahan CSS
- Update template Pug
- Modifikasi desain
- Perubahan layout

### 3. Mobile Security Coder
**Tanggung Jawab**:
- Cek keamanan mobile
- Validasi touch target
- WCAG compliance
- Input validation mobile
- Performance device low-end

**Trigger**:
- Kode mobile-specific
- Input validation
- Perubahan aksesibilitas

### 4. Database Optimizer
**Tanggung Jawab**:
- Optimasi query
- Pembuatan index
- Perbaikan schema
- Performance tuning
- Connection pooling

**Trigger**:
- Perubahan database schema
- Modifikasi query
- Masalah performance

### 5. DevOps Specialist
**Tanggung Jawab**:
- Deployment Vercel
- Pipeline CI/CD
- Setup infrastruktur
- Build optimization
- Konfigurasi environment

**Trigger**:
- Deployment issues
- Build failures
- Perubahan infrastruktur

### 6. Docs Architect
**Tanggung Jawab**:
- Dokumentasi API
- Dokumentasi arsitektur
- Code examples
- Setup guides
- Troubleshooting guides

**Trigger**:
- Perubahan API
- Update arsitektur
- Dokumentasi diperlukan

## 🔄 Task Patterns

### 1. Responsive Design Implementation
```
ui-visual-validator → mobile-security-coder
- Analisis design saat ini
- Implementasi responsive layout
- Test aksesibilitas
```

### 2. Backend Optimization
```
backend-security-coder → database-optimizer
- Profile aplikasi
- Optimasi queries
- Implementasi caching
```

### 3. Security Hardening
```
backend-security-coder → mobile-security-coder
- Audit keamanan
- Fix vulnerabilities
- Verify mobile security
- Test security
```

### 4. CSP Configuration
```
backend-security-coder
- Audit current CSP
- Update CSP directives
- Test implementation
```

### 5. Deployment Pipeline
```
devops-specialist
- Konfigurasi Vercel
- Setup CI/CD
- Test deployment
```

### 6. API Documentation
```
docs-architect
- Analisis API
- Generate dokumentasi
- Tambah examples
```

### 7. Bug Investigation
```
backend-security-coder → ui-visual-validator
- Reproduce bug
- Cari root cause
- Implementasi fix
- Test visually
```

### 8. Feature Implementation
```
backend-security-coder → ui-visual-validator → database-optimizer → docs-architect
- Design feature
- Implementasi backend
- Implementasi frontend
- Optimasi database
- Test thoroughly
- Dokumentasi feature
```

## 🚀 Cara Menggunakan

### Untuk Backend Issues
```bash
# Invoke backend security droid
droid invoke backend-security-coder --task "Audit middleware security"
```

### Untuk Frontend Issues
```bash
# Invoke UI validator droid
droid invoke ui-visual-validator --task "Check responsive design"
```

### Untuk Mobile Issues
```bash
# Invoke mobile security droid
droid invoke mobile-security-coder --task "Check touch targets"
```

### Untuk Database Issues
```bash
# Invoke database optimizer droid
droid invoke database-optimizer --task "Optimize slow queries"
```

### Untuk Deployment Issues
```bash
# Invoke DevOps specialist droid
droid invoke devops-specialist --task "Fix deployment failure"
```

### Untuk Documentation
```bash
# Invoke docs architect droid
droid invoke docs-architect --task "Generate API documentation"
```

## 📁 Struktur File

```
.factory/
├── droids/
│   ├── orchestrator.json      # Konfigurasi orchestrator utama
│   ├── task-patterns.json     # Pola-pola task yang sudah didefine
│   ├── droid-config.json      # Konfigurasi individual droids
│   └── README.md              # File ini
```

## 🎯 Quality Gates

Orchestrator akan mengecek:

### Code Quality
- ✅ Linting (threshold: 80%)
- ✅ Type checking
- ✅ Complexity analysis

### Security
- ✅ Vulnerability scan
- ✅ OWASP compliance
- ✅ CSP validation

### Performance
- ✅ Core Web Vitals
- ✅ Load time
- ✅ Memory usage

### Accessibility
- ✅ Color contrast
- ✅ Keyboard navigation
- ✅ Screen reader support (WCAG 2.1 AA)

## 📊 Monitoring

Orchestrator memonitor:

- **Vercel Analytics**: Tracking deployment dan performa
- **Error Tracking**: Monitoring error rate dan jenis error
- **Performance Metrics**: Core Web Vitals dan metrics lainnya

### Alerts

| Alert | Priority |
|-------|----------|
| Deployment failure | 🔴 Critical |
| Security vulnerability | 🔴 Critical |
| Performance degradation | 🟠 High |
| High error rate | 🟠 High |

## 📚 Documentation

File dokumentasi yang dikelola oleh orchestrator:

- `README.md` - Overview proyek
- `IMPROVEMENTS.md` - Daftar improvement
- `DESIGN_SYSTEM.md` - Design system reference
- `IMPLEMENTATION_GUIDE.md` - Developer guide
- `CSP_FIXES.md` - CSP configuration
- `DEPLOYMENT_INSTRUCTIONS.md` - Deployment guide

## 🔐 Security

Orchestrator mengutamakan keamanan:

- Semua external scripts whitelisted dalam CSP
- Validasi input di semua levels
- No exposure of sensitive data
- Regular security audits
- WCAG 2.1 AA compliance

## 🚦 Workflow

```
1. Developer commits code
   ↓
2. Orchestrator detects changes
   ↓
3. Assign appropriate droids berdasarkan file changes
   ↓
4. Droids run checks (security, performance, accessibility)
   ↓
5. Generate reports dan recommendations
   ↓
6. Deployment verification
   ↓
7. Update documentation
```

## 💡 Best Practices

1. **Always run through orchestrator**: Jangan skip quality checks
2. **Follow task patterns**: Gunakan pre-defined patterns untuk consistency
3. **Document everything**: Orchestrator akan auto-generate docs
4. **Test on all devices**: Mobile, tablet, desktop
5. **Verify CSP**: Pastikan semua scripts whitelisted
6. **Monitor performance**: Check Core Web Vitals regularly
7. **Keep security updated**: Regular security audits

## 📞 Troubleshooting

### Jika droid tidak responsive
```bash
# Check droid status
droid status backend-security-coder

# Restart orchestrator
droid orchestrator restart
```

### Jika ada failed checks
```bash
# View detailed logs
droid logs --level debug

# Run specific check manually
droid check security --verbose
```

### Jika deployment fails
```bash
# Check deployment logs
droid devops-specialist --task "Check Vercel logs"

# Trigger manual redeploy
droid devops-specialist --task "Redeploy to Vercel"
```

## 🎓 Contoh Penggunaan

### Scenario 1: Fix Bug di Backend
```
1. Developer menemukan bug di API
2. Invoke: backend-security-coder
3. Droid akan:
   - Reproduce bug
   - Find root cause
   - Implement fix
   - Run security checks
4. Invoke: ui-visual-validator (untuk cek UI impact)
5. Redeploy via devops-specialist
```

### Scenario 2: Tambah Feature Baru
```
1. Planning phase
2. Invoke: backend-security-coder
   - Design API endpoints
   - Implement backend logic
3. Invoke: ui-visual-validator
   - Design UI components
   - Implement frontend
4. Invoke: database-optimizer
   - Optimize database schema
   - Create indexes
5. Invoke: docs-architect
   - Generate API docs
   - Create feature guide
6. Test thoroughly
7. Deploy via devops-specialist
```

### Scenario 3: Performance Issues
```
1. Orchestrator detects slow performance
2. Invoke: database-optimizer
   - Analyze queries
   - Create indexes
   - Optimize schema
3. Invoke: ui-visual-validator
   - Check animations
   - Optimize assets
4. Invoke: devops-specialist
   - Check deployment config
   - Optimize build
5. Verify improvements
```

## 📈 Metrics

Orchestrator tracks:

- ✅ Build success rate
- ✅ Average deployment time
- ✅ Security issues found/fixed
- ✅ Performance improvement percentage
- ✅ Code quality trend
- ✅ Test coverage

## 🔄 Updates

Last Updated: November 30, 2025  
Version: 1.0.0  
Status: ✅ Active and Monitoring

---

**KitaNime Droid Orchestrator** - Intelligent automation for consistent, secure, performant development.
