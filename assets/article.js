// Shared behaviour for project articles: EN/PT toggle, theme toggle, reading progress.
// Each page sets window.ARTICLE_PT (pt strings keyed by data-i18n) and
// window.ARTICLE_META_PT ({ title, desc }) before loading this file.
(function () {
  var PT = window.ARTICLE_PT || {};
  var nodes = document.querySelectorAll('[data-i18n]');
  var EN = {};
  nodes.forEach(function (el) { EN[el.dataset.i18n] = el.innerHTML; });
  // Translated attributes, declared as data-i18n-attr="attr:key" (e.g. "alt:img.matrix").
  var attrNodes = [];
  document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
    var parts = el.dataset.i18nAttr.split(':');
    attrNodes.push({ el: el, attr: parts[0], key: parts[1], en: el.getAttribute(parts[0]) });
  });
  var descEl = document.querySelector('meta[name=description]');
  var META = {
    en: { title: document.title, desc: descEl ? descEl.content : '' },
    pt: window.ARTICLE_META_PT || { title: document.title, desc: descEl ? descEl.content : '' }
  };

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function detectLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'pt' || q === 'en') return q;
    var saved = read('lang');
    if (saved === 'pt' || saved === 'en') return saved;
    var prefs = navigator.languages || [navigator.language || 'en'];
    return /^pt\b/i.test(prefs[0] || '') ? 'pt' : 'en';
  }

  var langBtn = document.getElementById('lang-toggle');
  function setLang(lang) {
    var dict = lang === 'pt' ? PT : EN;
    nodes.forEach(function (el) {
      var v = dict[el.dataset.i18n];
      if (v != null) el.innerHTML = v;
    });
    attrNodes.forEach(function (item) {
      var v = lang === 'pt' && PT[item.key] != null ? PT[item.key] : item.en;
      item.el.setAttribute(item.attr, v);
    });
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = META[lang].title;
    if (descEl) descEl.content = META[lang].desc;
    langBtn.querySelectorAll('[data-lang]').forEach(function (s) { s.classList.toggle('on', s.dataset.lang === lang); });
    langBtn.setAttribute('aria-label', lang === 'pt' ? 'Switch to English' : 'Mudar para português');
    langBtn.dataset.current = lang;
  }
  langBtn.addEventListener('click', function () {
    var next = langBtn.dataset.current === 'pt' ? 'en' : 'pt';
    store('lang', next);
    setLang(next);
  });
  setLang(detectLang());

  var root = document.documentElement;
  document.getElementById('theme-toggle').addEventListener('click', function () {
    var current = root.dataset.theme ||
      (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var next = current === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    store('theme', next);
  });

  var bar = document.querySelector('.progress');
  var article = document.querySelector('.article');
  if (bar && article) {
    var onScroll = function () {
      var r = article.getBoundingClientRect();
      var total = r.height - innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.style.width = (p * 100).toFixed(1) + '%';
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
