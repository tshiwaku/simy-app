/**
 * SIMY Mobile Navigation
 * Injects a bottom navigation bar for mobile devices
 * and handles responsive layout adjustments
 */

(function() {
  'use strict';

  // Only run on mobile
  const MOBILE_BREAKPOINT = 768;

  // Navigation items to show in bottom nav (subset of full nav)
  const BOTTOM_NAV_ITEMS = [
    {
      id: 'twin',
      label: 'Twin',
      svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z',
      svgViewBox: '0 0 24 24',
      // Sparkles / AI icon
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-1 3-4 5-7 5 0 5.25 3 9.5 7 11 4-1.5 7-5.75 7-11-3 0-6-2-7-5z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`
    },
    {
      id: 'actions',
      label: 'アクション',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`
    },
    {
      id: 'meetings',
      label: 'ミーティング',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
    },
    {
      id: 'team',
      label: 'チーム',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
      id: 'more',
      label: 'その他',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`
    }
  ];

  // More menu items
  const MORE_MENU_ITEMS = [
    { id: 'issue', label: 'マイイシュー' },
    { id: 'requests', label: 'マイエージェント' },
    { id: 'dashboard', label: '成長ダッシュボード' },
    { id: 'leaderboard', label: 'HVP ランキング' },
    { id: 'agentslist', label: 'エージェント一覧' },
    { id: 'activity', label: 'アクティビティ' },
    { id: 'admin', label: 'Admin Settings' },
    { id: 'settings', label: '設定' },
  ];

  let currentSection = 'twin';
  let moreMenuOpen = false;
  let bottomNav = null;
  let moreMenu = null;

  function isMobile() {
    // Allow forcing mobile mode via URL parameter ?mobile=1 for testing
    if (new URLSearchParams(window.location.search).get('mobile') === '1') return true;
    return window.innerWidth < MOBILE_BREAKPOINT;
  }

  function getActiveSection() {
    // Try to detect active section from DOM
    const activeBtn = document.querySelector('[data-loc="client/src/components/Sidebar.tsx:265"] button[class*="bg-primary"]');
    if (activeBtn) {
      return activeBtn.textContent.trim();
    }
    return currentSection;
  }

  function navigateTo(sectionId) {
    if (sectionId === 'more') {
      toggleMoreMenu();
      return;
    }

    currentSection = sectionId;
    closeMoreMenu();

    // Find and click the corresponding sidebar button
    // The sidebar buttons have onClick handlers that change the active section
    // We need to trigger the React state change

    // Look for sidebar nav buttons by their data-loc attributes
    const navButtons = document.querySelectorAll('[data-loc^="client/src/components/Sidebar.tsx:26"] button, [data-loc^="client/src/components/Sidebar.tsx:28"] button');

    // Alternative: find buttons in the sidebar nav area
    const sidebarNav = document.querySelector('[data-loc="client/src/components/Sidebar.tsx:265"]');
    if (sidebarNav) {
      const buttons = sidebarNav.querySelectorAll('button');
      buttons.forEach(btn => {
        // Check if this button corresponds to our section
        const btnText = btn.textContent.trim().toLowerCase();
        const sectionMap = {
          'twin': ['デジタルツイン', 'digital twin'],
          'issue': ['マイイシュー', 'issue'],
          'actions': ['マイアクション', 'actions'],
          'requests': ['マイエージェント', 'agents'],
          'team': ['チームメンバー', 'team'],
          'meetings': ['ミーティング', 'meetings'],
          'dashboard': ['成長ダッシュボード', 'dashboard'],
          'leaderboard': ['hvp', 'leaderboard', 'ランキング'],
          'agentslist': ['エージェント一覧', 'agents list'],
          'activity': ['アクティビティ', 'activity'],
          'admin': ['admin settings'],
          'settings': ['設定', 'settings'],
        };

        const keywords = sectionMap[sectionId] || [];
        const matches = keywords.some(kw => btnText.toLowerCase().includes(kw.toLowerCase()));
        if (matches) {
          btn.click();
        }
      });
    }

    updateBottomNavActive();
  }

  function toggleMoreMenu() {
    moreMenuOpen = !moreMenuOpen;
    if (moreMenu) {
      moreMenu.style.display = moreMenuOpen ? 'block' : 'none';
    }
    updateBottomNavActive();
  }

  function closeMoreMenu() {
    moreMenuOpen = false;
    if (moreMenu) {
      moreMenu.style.display = 'none';
    }
  }

  function updateBottomNavActive() {
    if (!bottomNav) return;
    const items = bottomNav.querySelectorAll('.simy-bnav-item');
    items.forEach(item => {
      const id = item.dataset.section;
      const isActive = id === currentSection || (id === 'more' && moreMenuOpen);
      item.classList.toggle('active', isActive);
    });
  }

  function createBottomNav() {
    if (bottomNav) return;

    // Create bottom nav
    bottomNav = document.createElement('nav');
    bottomNav.className = 'simy-bottom-nav';
    bottomNav.id = 'simy-bottom-nav';
    bottomNav.setAttribute('aria-label', 'モバイルナビゲーション');

    BOTTOM_NAV_ITEMS.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'simy-bnav-item';
      btn.dataset.section = item.id;
      btn.setAttribute('aria-label', item.label);
      btn.innerHTML = `${item.svg}<span>${item.label}</span>`;
      btn.addEventListener('click', () => navigateTo(item.id));
      bottomNav.appendChild(btn);
    });

    document.body.appendChild(bottomNav);

    // Create more menu
    moreMenu = document.createElement('div');
    moreMenu.id = 'simy-more-menu';
    moreMenu.style.display = 'none';
    moreMenu.innerHTML = `
      <div class="simy-more-menu-backdrop"></div>
      <div class="simy-more-menu-panel">
        <div class="simy-more-menu-header">
          <span>メニュー</span>
          <button class="simy-more-menu-close" aria-label="閉じる">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="simy-more-menu-list">
          ${MORE_MENU_ITEMS.map(item => `
            <button class="simy-more-menu-item" data-section="${item.id}">
              <span>${item.label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Add event listeners to more menu items
    moreMenu.querySelector('.simy-more-menu-backdrop').addEventListener('click', closeMoreMenu);
    moreMenu.querySelector('.simy-more-menu-close').addEventListener('click', closeMoreMenu);
    moreMenu.querySelectorAll('.simy-more-menu-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const sectionId = btn.dataset.section;
        currentSection = sectionId;
        closeMoreMenu();
        navigateTo(sectionId);
        updateBottomNavActive();
      });
    });

    document.body.appendChild(moreMenu);
  }

  function removeBottomNav() {
    if (bottomNav) {
      bottomNav.remove();
      bottomNav = null;
    }
    if (moreMenu) {
      moreMenu.remove();
      moreMenu = null;
    }
  }

  function handleResize() {
    if (isMobile()) {
      createBottomNav();
      updateBottomNavActive();
    } else {
      removeBottomNav();
    }
  }

  // Initialize
  function init() {
    // Apply mobile-force class to body if ?mobile=1 is in URL
    if (new URLSearchParams(window.location.search).get('mobile') === '1') {
      document.body.classList.add('simy-mobile-force');
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    // Watch for React navigation changes to update active state
    // Use MutationObserver to detect when active section changes in sidebar
    const observer = new MutationObserver(() => {
      if (!isMobile()) return;

      // Try to detect current active section from sidebar
      const sidebar = document.querySelector('[data-loc="client/src/components/Sidebar.tsx:265"]');
      if (!sidebar) return;

      const activeBtn = sidebar.querySelector('button[class*="bg-primary"]');
      if (activeBtn) {
        // Try to map button text to section ID
        const text = activeBtn.textContent.trim();
        const textToId = {
          'デジタルツイン': 'twin',
          'マイイシュー': 'issue',
          'マイアクション': 'actions',
          'マイエージェント': 'requests',
          'チームメンバー': 'team',
          'ミーティング': 'meetings',
          '成長ダッシュボード': 'dashboard',
          'HVP ランキング': 'leaderboard',
          'エージェント一覧': 'agentslist',
          'アクティビティ': 'activity',
          'Admin Settings': 'admin',
          '設定': 'settings',
        };

        // Find matching section
        for (const [label, id] of Object.entries(textToId)) {
          if (text.includes(label)) {
            if (currentSection !== id) {
              currentSection = id;
              updateBottomNavActive();
            }
            break;
          }
        }
      }
    });

    // Start observing after React renders
    setTimeout(() => {
      const root = document.getElementById('root');
      if (root) {
        observer.observe(root, { subtree: true, attributes: true, attributeFilter: ['class'] });
      }
    }, 1000);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // React app needs time to render
    setTimeout(init, 500);
  }
})();
