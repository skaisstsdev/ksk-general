// ═══════════════════════════════════════
// KSK Farmos GmbH & Co. KG — main.js v3.0
// Fully calibrated: lang, FAQ, i18n icons
// ═══════════════════════════════════════

// ── i18n Translation Engine ─────────────────────────────
const I18N = {
  current: localStorage.getItem('ksk-lang') || 'de',
  cache: {},
  codes: ['de','en','ru','tr','pl','ro','bg','ua','ar','bs'],
  labels: {de:'Deutsch',en:'English',ru:'Русский',tr:'Türkçe',pl:'Polski',ro:'Română',bg:'Български',ua:'Українська',ar:'العربية',bs:'Bosanski'},

  async load(lang) {
    if (this.cache[lang]) return this.cache[lang];
    try {
      const r = await fetch(`i18n/${lang}.json`);
      if (!r.ok) return null;
      const data = await r.json();
      this.cache[lang] = data;
      return data;
    } catch(e) { return null; }
  },

  apply(data) {
    if (!data) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (data[key] === undefined) return;
      // INPUT → placeholder
      if (el.tagName === 'INPUT' && el.type !== 'checkbox') {
        el.placeholder = data[key];
        return;
      }
      // OPTION → just textContent
      if (el.tagName === 'OPTION') {
        el.textContent = data[key];
        return;
      }
      // Collect ALL child element nodes to preserve (icons, checkboxes, chevrons)
      // excluding children that themselves have data-i18n (they get translated separately)
      const children = Array.from(el.childNodes);
      const preserved = [];
      const positions = []; // 'before' or 'after' relative to first text node
      let foundText = false;
      children.forEach(n => {
        if (n.nodeType === Node.ELEMENT_NODE && !n.hasAttribute('data-i18n')) {
          preserved.push(n);
          positions.push(foundText ? 'after' : 'before');
        } else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
          foundText = true;
        }
      });
      // Replace content
      const hasTags = data[key].includes('<') && data[key].includes('>');
      if (hasTags) {
        el.innerHTML = data[key];
      } else {
        el.textContent = data[key];
        // Restore preserved elements in correct positions
        if (preserved.length > 0) {
          const beforeEls = [];
          const afterEls = [];
          preserved.forEach((child, i) => {
            if (positions[i] === 'before') beforeEls.push(child);
            else afterEls.push(child);
          });
          // Prepend 'before' elements (e.g., checkbox, icon before text)
          for (let i = beforeEls.length - 1; i >= 0; i--) {
            el.prepend(' ');
            el.prepend(beforeEls[i]);
          }
          // Append 'after' elements (e.g., arrow-right icon after text)
          afterEls.forEach(child => {
            el.append(' ');
            el.appendChild(child);
          });
        }
      }
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (data[key] !== undefined) el.placeholder = data[key];
    });
  },

  // Helper: grab first and last icon from the float button (works for both <i> and <svg>)
  _getFloatIcons(floatBtn) {
    const allIcons = floatBtn.querySelectorAll('i, svg');
    if (allIcons.length === 0) return { icon1: null, icon2: null };
    return {
      icon1: allIcons[0] || null,
      icon2: allIcons.length > 1 ? allIcons[allIcons.length - 1] : null
    };
  },

  async switchTo(lang) {
    const data = await this.load(lang);
    if (!data) return;
    this.current = lang;
    localStorage.setItem('ksk-lang', lang);
    this.apply(data);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.documentElement.lang = lang === 'ua' ? 'uk' : lang;
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    const floatBtn = document.getElementById('langFloatBtn');
    if (floatBtn) {
      const { icon1, icon2 } = this._getFloatIcons(floatBtn);
      floatBtn.textContent = '';
      if (icon1) floatBtn.appendChild(icon1);
      floatBtn.append(` ${lang.toUpperCase()} `);
      if (icon2) floatBtn.appendChild(icon2);
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    document.querySelectorAll('#langDropdown a[data-lang]').forEach(a => {
      a.classList.remove('active');
      if (a.dataset.lang === lang) a.classList.add('active');
    });
  },

  async init() {
    if (this.current !== 'de') {
      const data = await this.load(this.current);
      if (data) {
        this.apply(data);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        // Update direction for RTL
        if (this.current === 'ar') document.documentElement.dir = 'rtl';
        document.documentElement.lang = this.current === 'ua' ? 'uk' : this.current;
      }
    }
    // Always sync floating button and lang-grid
    const floatBtn = document.getElementById('langFloatBtn');
    if (floatBtn) {
      const { icon1, icon2 } = this._getFloatIcons(floatBtn);
      floatBtn.textContent = '';
      if (icon1) floatBtn.appendChild(icon1);
      floatBtn.append(` ${this.current.toUpperCase()} `);
      if (icon2) floatBtn.appendChild(icon2);
    }
    document.querySelectorAll('#langDropdown a[data-lang]').forEach(a => {
      a.classList.remove('active');
      if (a.dataset.lang === this.current) a.classList.add('active');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {

  // ── COOKIE BANNER ──────────────────────────────────────────────
  if (!localStorage.getItem('ksk-cookies')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-content">
        <h3 data-i18n="cookie.title">Wir verwenden Cookies</h3>
        <p><span data-i18n="cookie.desc">Wir nutzen Cookies, um unsere Dienste bereitzustellen und Ihre Erfahrungen zu verbessern. Mit Klick auf "Alle akzeptieren" stimmen Sie der Nutzung zu. Weitere Informationen finden Sie in unserer </span><a href="datenschutz.html" data-i18n="footer.datenschutz">Datenschutzerklärung</a>.</p>
      </div>
      <div class="cookie-actions">
        <button class="btn btn-outline" id="cookieReject" data-i18n="cookie.reject">Nur Notwendige</button>
        <button class="btn btn-primary" id="cookieAccept" data-i18n="cookie.accept">Alle akzeptieren</button>
      </div>
    `;
    document.body.appendChild(banner);
    
    // Translate if needed right away
    if (I18N.current !== 'de') {
      I18N.load(I18N.current).then(data => I18N.apply(data));
    }

    const closeBanner = (val) => {
      localStorage.setItem('ksk-cookies', val);
      banner.classList.add('hidden');
      setTimeout(() => banner.remove(), 400);
    };

    document.getElementById('cookieAccept').addEventListener('click', () => closeBanner('all'));
    document.getElementById('cookieReject').addEventListener('click', () => closeBanner('essential'));
  }

  // ── 1. Header scroll behavior ──────────────────────────
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      if (header) header.classList.add('scrolled');
    } else {
      if (header) header.classList.remove('scrolled');
    }
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── 2. Scroll reveal (IntersectionObserver) ───────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(el => revealObserver.observe(el));

  // ── 3. Counter animation ───────────────────────────────
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const duration = 1800;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = isDecimal
        ? current.toFixed(1).replace('.', ',')
        : Math.round(current);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.dataset.count) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]')
    .forEach(el => counterObserver.observe(el));

  // ── 4. Mobile menu ─────────────────────────────────────
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      if (header) header.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        if (mobileToggle) mobileToggle.classList.remove('open');
        if (header) header.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── 5. Mega menu hover (desktop) ───────────────────────
  document.querySelectorAll('.nav-mega').forEach(mega => {
    let timeout;
    mega.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      mega.classList.add('open');
    });
    mega.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => mega.classList.remove('open'), 200);
    });
  });

  // ── 6. (Removed — replaced by floating lang pill in §15) ──

  // ── 7. FAQ accordion ───────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const item = btn.closest('.faq-item');
      if (!item) return;
      const answer = item.querySelector('.faq-answer');
      if (!answer) return;
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const openAnswer = openItem.querySelector('.faq-answer');
        if (openAnswer) openAnswer.style.maxHeight = '0';
      });

      // Open clicked
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ── 8. Back to top button ──────────────────────────────
  const backToTop = document.getElementById('backToTop');
  const toggleBackToTop = () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 9. Smooth scroll для якорей ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      // Skip language switcher links
      if (link.closest('.lang-float')) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── 10. Form handling ──────────────────────────────────
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Wird gesendet...';
      await new Promise(resolve => setTimeout(resolve, 1200));
      btn.textContent = '✓ Gesendet';
      btn.style.background = '#22c55e';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.background = '';
        form.reset();
      }, 2500);
    });
  });

  // ── 11. Initialize Lucide icons ────────────────────────
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ── 12. Wizard form (karriere.html) ───────────────────
  window.wizardNext = function(step) {
    document.querySelectorAll('.wizard-panel').forEach(p => {
      p.classList.remove('active');
    });
    const target = document.querySelector(`[data-panel="${step}"]`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.wizard-dot').forEach(d => {
      const s = parseInt(d.dataset.step);
      d.classList.remove('done', 'active', 'pending');
      if (s < step) d.classList.add('done');
      else if (s === step) d.classList.add('active');
      else d.classList.add('pending');
    });
    document.querySelectorAll('.wizard-line').forEach((line, i) => {
      line.classList.toggle('done', i < step - 1);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  // ── 13. FAQ Search ────────────────────────────────────
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        const span = item.querySelector('.faq-question span');
        const text = span ? span.textContent.toLowerCase() : '';
        item.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // ── 14. FAQ Category Filter ───────────────────────────
  document.querySelectorAll('.faq-cat').forEach(cat => {
    cat.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.faq-cat').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const category = this.dataset.cat;
      document.querySelectorAll('.faq-item').forEach(item => {
        if (category === 'alle') {
          item.style.display = '';
        } else {
          item.style.display = item.dataset.category === category ? '' : 'none';
        }
      });
    });
  });

  // ── 15. Floating Lang Dropdown ──────────────────────────
  const langBtn = document.getElementById('langFloatBtn');
  const langDropdown = document.getElementById('langDropdown');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });
    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('open');
      }
    });
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') langDropdown.classList.remove('open');
    });
    langDropdown.querySelectorAll('a[data-lang]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        I18N.switchTo(a.dataset.lang);
        langDropdown.classList.remove('open');
      });
    });
  }

  // ── 16. Anchor Nav Scroll Spy (leistungen.html) ───────
  const anchorPills = document.querySelectorAll('.anchor-pill');
  if (anchorPills.length > 0) {
    const sections = [];
    anchorPills.forEach(pill => {
      const href = pill.getAttribute('href');
      if (href && href.startsWith('#')) {
        const el = document.getElementById(href.slice(1));
        if (el) sections.push({ el, pill });
      }
    });
    if (sections.length > 0) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;
        let current = sections[0];
        sections.forEach(s => {
          if (s.el.offsetTop <= scrollY) current = s;
        });
        anchorPills.forEach(p => p.classList.remove('active'));
        current.pill.classList.add('active');
      });
    }
  }

  // ── 17. i18n Init ─────────────────────────────────────
  I18N.init();

  // ── 18. Initialize all icons ──────────────────────────
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

});

/* ── AI ASSISTANT LOGIC ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const aiBtn = document.getElementById('aiBtn');
  const aiWindow = document.getElementById('aiWindow');
  const aiContent = document.getElementById('aiContent');
  const aiOptions = document.querySelectorAll('.ai-option-btn');

  if (aiBtn && aiWindow) {
    aiBtn.addEventListener('click', () => {
      aiWindow.classList.toggle('open');
      const icon = aiBtn.querySelector('i');
      if (aiWindow.classList.contains('open')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'message-square');
      }
      lucide.createIcons();
    });

    const aiClose = document.getElementById('aiClose');
    if (aiClose) {
      aiClose.addEventListener('click', (e) => {
        e.stopPropagation();
        aiWindow.classList.remove('open');
        const icon = aiBtn.querySelector('i');
        icon.setAttribute('data-lucide', 'message-square');
        lucide.createIcons();
      });
    }

    const responses = {
      leistungen: "Wir bieten häusliche Intensivpflege, ein spezielles Aufenthaltskonzept in Kassel sowie Fortbildungen an. Schauen Sie gerne auf unserer Leistungsseite vorbei!",
      kosten: "Die Kosten werden in der Regel vollständig von der Krankenkasse und Pflegekasse übernommen. Wir beraten Sie dazu gerne kostenlos!",
      kontakt: "Sie erreichen uns telefonisch unter 05693 / 9189907 oder per E-Mail an pflege@ksk-farmos.de.",
      karriere: "Ja, wir suchen immer examinierte Pflegefachkräfte! Schauen Sie auf unserer Karriere-Seite vorbei."
    };

    aiOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const qKey = btn.getAttribute('data-q');
        const questionText = btn.innerText;
        const answerText = responses[qKey];

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message user';
        userMsg.innerText = questionText;
        aiContent.appendChild(userMsg);

        // Hide options temporarily
        document.getElementById('aiOptions').style.display = 'none';

        // Add bot typing (simple delay)
        setTimeout(() => {
          const botMsg = document.createElement('div');
          botMsg.className = 'ai-message bot';
          botMsg.innerText = answerText;
          aiContent.appendChild(botMsg);
          
          aiContent.scrollTop = aiContent.scrollHeight;

          // Show options again after a delay
          setTimeout(() => {
            document.getElementById('aiOptions').style.display = 'flex';
          }, 1000);
        }, 600);

        aiContent.scrollTop = aiContent.scrollHeight;
      });
    });
  }
});
