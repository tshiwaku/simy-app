/**
 * SIMY Mobile Navigation — v2.0
 * Bottom navigation bar for mobile devices
 * Design: aligned with SIMY Action Intelligence design system
 */

(function () {
  'use strict';

  var MOBILE_BREAKPOINT = 768;

  // SVG icons — stroke-based, 20×20
  var ICONS = {
    twin: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-1 3-4 5-7 5 0 5.25 3 9.5 7 11 4-1.5 7-5.75 7-11-3 0-6-2-7-5z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
    actions: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    meetings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    team: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    more: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
    chevron: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  };

  var BOTTOM_NAV_ITEMS = [
    { id: 'twin',     label: 'Twin'    },
    { id: 'actions',  label: 'Actions' },
    { id: 'meetings', label: 'Meetings'},
    { id: 'team',     label: 'Team'    },
    { id: 'more',     label: 'More'    }
  ];

  var MORE_MENU_ITEMS = [
    { id: 'issue',      label: 'マイイシュー',     labelEn: 'My Issues'     },
    { id: 'requests',   label: 'マイエージェント', labelEn: 'My Agents'     },
    { id: 'dashboard',  label: '成長ダッシュボード', labelEn: 'Dashboard'    },
    { id: 'leaderboard',label: 'HVP ランキング',   labelEn: 'Leaderboard'   },
    { id: 'agentslist', label: 'エージェント一覧', labelEn: 'Agents List'   },
    { id: 'activity',   label: 'アクティビティ',   labelEn: 'Activity'      },
    { id: 'admin',      label: 'Admin',             labelEn: 'Admin Settings'},
    { id: 'settings',   label: '設定',              labelEn: 'Settings'      }
  ];

  // Section ID → sidebar button text mapping
  var SECTION_KEYWORDS = {
    twin:        ['デジタルツイン', 'digital twin'],
    issue:       ['マイイシュー', 'issue'],
    actions:     ['マイアクション', 'actions'],
    requests:    ['マイエージェント', 'agents'],
    team:        ['チームメンバー', 'team'],
    meetings:    ['ミーティング', 'meetings'],
    dashboard:   ['成長ダッシュボード', 'dashboard'],
    leaderboard: ['hvp', 'leaderboard', 'ランキング'],
    agentslist:  ['エージェント一覧', 'agents list'],
    activity:    ['アクティビティ', 'activity'],
    admin:       ['admin settings'],
    settings:    ['設定', 'settings']
  };

  var TEXT_TO_ID = {
    'デジタルツイン':   'twin',
    'マイイシュー':     'issue',
    'マイアクション':   'actions',
    'マイエージェント': 'requests',
    'チームメンバー':   'team',
    'ミーティング':     'meetings',
    '成長ダッシュボード': 'dashboard',
    'HVP ランキング':   'leaderboard',
    'エージェント一覧': 'agentslist',
    'アクティビティ':   'activity',
    'Admin Settings':   'admin',
    '設定':             'settings'
  };

  var currentSection = 'twin';
  var moreMenuOpen = false;
  var bottomNav = null;
  var moreMenuEl = null;

  // ---- Helpers ----

  function isMobile() {
    if (new URLSearchParams(window.location.search).get('mobile') === '1') return true;
    return window.innerWidth < MOBILE_BREAKPOINT;
  }

  function navigateTo(sectionId) {
    if (sectionId === 'more') {
      toggleMoreMenu();
      return;
    }

    currentSection = sectionId;
    closeMoreMenu();

    var sidebar = document.querySelector('[data-loc="client/src/components/Sidebar.tsx:265"]');
    if (!sidebar) return;

    var keywords = SECTION_KEYWORDS[sectionId] || [];
    var buttons = sidebar.querySelectorAll('button');

    buttons.forEach(function (btn) {
      var text = btn.textContent.trim().toLowerCase();
      var matched = keywords.some(function (kw) {
        return text.indexOf(kw.toLowerCase()) !== -1;
      });
      if (matched) btn.click();
    });

    updateActiveState();
  }

  function toggleMoreMenu() {
    moreMenuOpen = !moreMenuOpen;
    if (moreMenuEl) {
      moreMenuEl.style.display = moreMenuOpen ? 'block' : 'none';
    }
    updateActiveState();
  }

  function closeMoreMenu() {
    moreMenuOpen = false;
    if (moreMenuEl) moreMenuEl.style.display = 'none';
  }

  function updateActiveState() {
    if (!bottomNav) return;
    bottomNav.querySelectorAll('.simy-bnav-item').forEach(function (item) {
      var id = item.getAttribute('data-section');
      var active = (id === currentSection) || (id === 'more' && moreMenuOpen);
      if (active) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // ---- Build DOM ----

  function buildBottomNav() {
    if (bottomNav) return;

    bottomNav = document.createElement('nav');
    bottomNav.id = 'simy-bottom-nav';
    bottomNav.className = 'simy-bottom-nav';
    bottomNav.setAttribute('aria-label', 'Navigation');

    BOTTOM_NAV_ITEMS.forEach(function (item) {
      var btn = document.createElement('button');
      btn.className = 'simy-bnav-item';
      btn.setAttribute('data-section', item.id);
      btn.setAttribute('aria-label', item.label);
      btn.innerHTML = ICONS[item.id] + '<span>' + item.label + '</span>';
      btn.addEventListener('click', function () { navigateTo(item.id); });
      bottomNav.appendChild(btn);
    });

    document.body.appendChild(bottomNav);

    // ---- More Menu ----
    moreMenuEl = document.createElement('div');
    moreMenuEl.id = 'simy-more-menu';
    moreMenuEl.style.display = 'none';

    var backdrop = document.createElement('div');
    backdrop.className = 'simy-more-menu-backdrop';
    backdrop.addEventListener('click', closeMoreMenu);

    var panel = document.createElement('div');
    panel.className = 'simy-more-menu-panel';

    // Header
    var header = document.createElement('div');
    header.className = 'simy-more-menu-header';
    header.innerHTML = '<span>MENU</span>';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'simy-more-menu-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = ICONS.close;
    closeBtn.addEventListener('click', closeMoreMenu);
    header.appendChild(closeBtn);

    // List
    var list = document.createElement('div');
    list.className = 'simy-more-menu-list';

    MORE_MENU_ITEMS.forEach(function (item) {
      var row = document.createElement('button');
      row.className = 'simy-more-menu-item';
      row.setAttribute('data-section', item.id);
      row.innerHTML =
        '<span>' + item.label + '<small style="display:block;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#444;margin-top:1px;">' + item.labelEn + '</small></span>' +
        ICONS.chevron;
      row.addEventListener('click', function () {
        currentSection = item.id;
        closeMoreMenu();
        navigateTo(item.id);
        updateActiveState();
      });
      list.appendChild(row);
    });

    panel.appendChild(header);
    panel.appendChild(list);
    moreMenuEl.appendChild(backdrop);
    moreMenuEl.appendChild(panel);
    document.body.appendChild(moreMenuEl);
  }

  function removeBottomNav() {
    if (bottomNav) { bottomNav.remove(); bottomNav = null; }
    if (moreMenuEl) { moreMenuEl.remove(); moreMenuEl = null; }
  }

  // ---- Resize handler ----

  function handleResize() {
    if (isMobile()) {
      buildBottomNav();
      updateActiveState();
    } else {
      removeBottomNav();
    }
  }

  // ---- MutationObserver: sync active state with React ----

  function startObserver() {
    var root = document.getElementById('root');
    if (!root) return;

    var observer = new MutationObserver(function () {
      if (!isMobile()) return;

      var sidebar = document.querySelector('[data-loc="client/src/components/Sidebar.tsx:265"]');
      if (!sidebar) return;

      var activeBtn = sidebar.querySelector('button[class*="bg-primary"]');
      if (!activeBtn) return;

      var text = activeBtn.textContent.trim();
      for (var label in TEXT_TO_ID) {
        if (text.indexOf(label) !== -1) {
          var id = TEXT_TO_ID[label];
          if (currentSection !== id) {
            currentSection = id;
            updateActiveState();
          }
          break;
        }
      }
    });

    observer.observe(root, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  // ---- Init ----

  function init() {
    // Apply force-mobile class for ?mobile=1
    if (new URLSearchParams(window.location.search).get('mobile') === '1') {
      document.body.classList.add('simy-mobile-force');
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    setTimeout(startObserver, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }

})();
