(() => {
  const PRODUCTS = [
    {
      id: 'wb-101',
      title: 'Беспроводные наушники Studio ANC Pro',
      brand: 'SoundCore X',
      category: 'electronics',
      price: 6490,
      oldPrice: 11990,
      rating: 4.9,
      reviews: 1842,
      tag: 'WB Хит',
      delivery: 'Завтра в ПВЗ',
      image: 'assets/headphones.jpg',
      variants: ['Матовый чёрный', 'Графит', 'Лаванда'],
      desc: 'Активное шумоподавление до 45 дБ, до 50 часов автономной работы, пространственное аудио и мгновенное переключение между двумя устройствами.'
    },
    {
      id: 'wb-102',
      title: 'Кроссовки беговые AeroPulse Violet Edition',
      brand: 'VeloRun',
      category: 'shoes',
      price: 5890,
      oldPrice: 9490,
      rating: 4.8,
      reviews: 934,
      tag: 'AI Выбор',
      delivery: 'Завтра в ПВЗ',
      image: 'assets/sneakers.jpg',
      variants: ['40 RU', '41 RU', '42 RU', '43 RU'],
      desc: 'Ультралёгкая амортизирующая подошва с карбоновой пластиной и дышащей 3D-сеткой для ежедневных пробежек и города.'
    },
    {
      id: 'wb-103',
      title: 'Умные часы Titan Horizon 44mm',
      brand: 'ChronoTech',
      category: 'electronics',
      price: 12990,
      oldPrice: 18990,
      rating: 4.9,
      reviews: 612,
      tag: 'Новинка',
      delivery: 'Завтра в ПВЗ',
      image: 'assets/watch.jpg',
      variants: ['Фиолетовый ремешок', 'Чёрный титан'],
      desc: 'Титановый корпус, сапфировое стекло, ЭКГ-датчик, GPS-трекинг и до 10 дней работы без подзарядки.'
    },
    {
      id: 'wb-104',
      title: 'Сыворотка с гиалуроновой кислотой и пептидами',
      brand: 'PureLab Skin',
      category: 'beauty',
      price: 1690,
      oldPrice: 2890,
      rating: 4.9,
      reviews: 3210,
      tag: 'Бестселлер',
      delivery: 'Послезавтра',
      image: 'assets/serum.jpg',
      variants: ['30 мл', '50 мл'],
      desc: 'Глубокое увлажнение на 48 часов, выравнивание тона и укрепление защитного барьера кожи без отдушек.'
    },
    {
      id: 'wb-105',
      title: 'Умная колонка Aura Home 360°',
      brand: 'Aura Acoustics',
      category: 'home',
      price: 7490,
      oldPrice: 10990,
      rating: 4.7,
      reviews: 540,
      tag: 'Умный дом',
      delivery: 'Завтра в ПВЗ',
      image: 'assets/speaker.jpg',
      variants: ['Белый матовый', 'Серый алюминий'],
      desc: 'Объёмный звук 360°, встроенный Zigbee-хаб для управления светом и климатом, распознавание голоса в шумной комнате.'
    },
    {
      id: 'wb-106',
      title: 'Подарочный набор гаджетов NextGen Box',
      brand: 'WB Select',
      category: 'electronics',
      price: 14990,
      oldPrice: 24990,
      rating: 5.0,
      reviews: 218,
      tag: '−40% Лимитка',
      delivery: 'Завтра в ПВЗ',
      image: 'assets/hero.jpg',
      variants: ['Базовый бокс', 'Премиум бокс'],
      desc: 'Лимитированная подборка аксессуаров и носимой электроники в фирменной подарочной упаковке с расширенной гарантией.'
    }
  ];

  const PVZ_POINTS = [
    { id: 'pvz-1', address: 'Москва, ул. Тверская, 18', eta: 'Завтра с 10:00', rating: '4.98 ★ • Примерочные + проверка техники' },
    { id: 'pvz-2', address: 'Москва, Пресненская наб., 12', eta: 'Сегодня за 2 часа', rating: '4.99 ★ • Экспресс-пункт' },
    { id: 'pvz-3', address: 'Санкт-Петербург, Невский пр., 84', eta: 'Завтра с 12:00', rating: '4.95 ★ • Круглосуточная выдача' }
  ];

  const state = {
    category: 'all',
    search: '',
    sort: 'popular',
    discountOnly: false,
    favOnly: false,
    walletActive: true,
    theme: 'light',
    pvzId: 'pvz-1',
    promoCode: '',
    favorites: new Set(['wb-101']),
    cart: {}, // { productId: { qty, variant } }
    activeModalProductId: null,
    selectedVariant: null
  };

  // Safe storage restore
  try {
    const savedTheme = localStorage.getItem('wb_nextgen_theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      state.theme = savedTheme;
    }
  } catch (_) {}

  const $ = (id) => document.getElementById(id);

  function formatPrice(num) {
    return `${Math.round(num).toLocaleString('ru-RU')} ₽`;
  }

  function getEffectivePrice(product) {
    return state.walletActive ? Math.round(product.price * 0.95) : product.price;
  }

  function getDiscountPct(product) {
    const current = getEffectivePrice(product);
    return Math.round((1 - current / product.oldPrice) * 100);
  }

  function showToast(message) {
    const container = $('toastContainer');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 2600);
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    $('themeIconSun').classList.toggle('hidden', state.theme === 'dark');
    $('themeIconMoon').classList.toggle('hidden', state.theme === 'light');
    try {
      localStorage.setItem('wb_nextgen_theme', state.theme);
    } catch (_) {}
  }

  function updateWalletUI() {
    const btn = $('walletToggleBtn');
    const status = $('walletStatusText');
    btn.classList.toggle('active', state.walletActive);
    status.textContent = state.walletActive ? 'Вкл' : 'Выкл';
  }

  function getFilteredProducts() {
    const q = state.search.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (state.category !== 'all' && p.category !== state.category) return false;
      if (state.favOnly && !state.favorites.has(p.id)) return false;
      if (state.discountOnly && getDiscountPct(p) < 30) return false;
      if (q) {
        const hay = `${p.title} ${p.brand} ${p.desc} ${p.tag}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list];
    if (state.sort === 'price-asc') list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    if (state.sort === 'price-desc') list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (state.sort === 'discount') list.sort((a, b) => getDiscountPct(b) - getDiscountPct(a));
    if (state.sort === 'popular') list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }

  function renderProducts() {
    const grid = $('productGrid');
    const empty = $('emptyState');
    const list = getFilteredProducts();

    $('resultsCount').textContent = `${list.length} ${list.length === 1 ? 'товар' : list.length < 5 ? 'товара' : 'товаров'}`;
    $('catalogHeading').textContent = state.favOnly ? 'Избранное' : state.search ? `Результаты по запросу «${state.search}»` : 'Рекомендации для вас';

    if (list.length === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    grid.innerHTML = list.map((p) => {
      const price = getEffectivePrice(p);
      const disc = getDiscountPct(p);
      const isFav = state.favorites.has(p.id);
      const cartItem = state.cart[p.id];

      const footerHTML = cartItem
        ? `<div class="qty-stepper" data-id="${p.id}">
             <button type="button" data-action="dec" data-id="${p.id}" aria-label="Уменьшить">−</button>
             <span>${cartItem.qty} шт</span>
             <button type="button" data-action="inc" data-id="${p.id}" aria-label="Увеличить">+</button>
           </div>`
        : `<button class="btn btn--magenta btn--full" type="button" data-action="add" data-id="${p.id}">В корзину</button>`;

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-card__media" data-action="open" data-id="${p.id}">
            <img src="${p.image}" alt="${p.title}" loading="lazy">
            <span class="tag-badge">${p.tag}</span>
            <span class="discount-badge">−${disc}%</span>
            <button class="fav-btn ${isFav ? 'active' : ''}" type="button" data-action="fav" data-id="${p.id}" aria-label="Добавить в избранное">${isFav ? '♥' : '♡'}</button>
          </div>
          <div class="product-card__body">
            <div class="price-row">
              <span class="price-now">${formatPrice(price)}</span>
              <span class="price-old">${formatPrice(p.oldPrice)}</span>
            </div>
            <div class="wallet-note">${state.walletActive ? 'Цена с WB Кошельком −5%' : 'Обычная цена без кошелька'}</div>
            <h3 class="product-card__title" data-action="open" data-id="${p.id}">${p.title}</h3>
            <div class="product-card__meta">
              <span class="rating-pill">★ ${p.rating.toFixed(1)} (${p.reviews})</span>
              <span>${p.delivery}</span>
            </div>
            <div class="product-card__footer">${footerHTML}</div>
          </div>
        </article>
      `;
    }).join('');
  }

  function updateBadges() {
    const favCount = state.favorites.size;
    const favBadge = $('favCountBadge');
    favBadge.textContent = favCount;
    favBadge.classList.toggle('hidden', favCount === 0);

    const totalQty = Object.values(state.cart).reduce((acc, item) => acc + item.qty, 0);
    const cartBadge = $('cartCountBadge');
    cartBadge.textContent = totalQty;
    cartBadge.classList.toggle('hidden', totalQty === 0);
  }

  function renderCart() {
    const container = $('cartItemsContainer');
    const footer = $('cartFooter');
    const entries = Object.entries(state.cart);

    const totalQty = entries.reduce((sum, [, item]) => sum + item.qty, 0);
    $('cartSubtitle').textContent = `${totalQty} ${totalQty === 1 ? 'товар' : totalQty < 5 && totalQty > 0 ? 'товара' : 'товаров'}`;

    if (entries.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🛍️</div>
          <h3>Корзина пока пуста</h3>
          <p>Добавьте товары из каталога — доставка в ПВЗ бесплатная.</p>
        </div>
      `;
      footer.classList.add('hidden');
      return;
    }

    footer.classList.remove('hidden');
    let subtotal = 0;

    container.innerHTML = entries.map(([id, item]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      if (!p) return '';
      const unitPrice = getEffectivePrice(p);
      subtotal += unitPrice * item.qty;

      return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.title}">
          <div class="cart-item__info">
            <div class="cart-item__title">${p.title}</div>
            <div class="cart-item__variant">${item.variant}</div>
            <div class="cart-item__bottom">
              <span class="cart-item__price">${formatPrice(unitPrice * item.qty)}</span>
              <div class="cart-mini-qty">
                <button type="button" data-cart-action="dec" data-id="${p.id}">−</button>
                <span>${item.qty}</span>
                <button type="button" data-cart-action="inc" data-id="${p.id}">+</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    let promoDiscount = 0;
    if (state.promoCode === 'NEXTGEN10') {
      promoDiscount = Math.round(subtotal * 0.1);
      $('summaryPromoRow').style.display = 'flex';
      $('summaryPromoVal').textContent = `−${formatPrice(promoDiscount)}`;
    } else {
      $('summaryPromoRow').style.display = 'none';
    }

    $('summarySubtotal').textContent = formatPrice(subtotal);
    $('summaryTotal').textContent = formatPrice(subtotal - promoDiscount);
  }

  function addToCart(id, variant) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    if (state.cart[id]) {
      state.cart[id].qty += 1;
    } else {
      state.cart[id] = { qty: 1, variant: variant || p.variants[0] };
    }
    updateBadges();
    renderProducts();
    renderCart();
    showToast(`Добавлено в корзину: ${p.title}`);
  }

  function changeCartQty(id, delta) {
    if (!state.cart[id]) return;
    state.cart[id].qty += delta;
    if (state.cart[id].qty <= 0) {
      delete state.cart[id];
    }
    updateBadges();
    renderProducts();
    renderCart();
  }

  function toggleFavorite(id) {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      showToast('Удалено из избранного');
    } else {
      state.favorites.add(id);
      showToast('Добавлено в избранное');
    }
    updateBadges();
    renderProducts();
    if (state.activeModalProductId === id) {
      $('modalFavBtn').textContent = state.favorites.has(id) ? '♥' : '♡';
    }
  }

  function openProductModal(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    state.activeModalProductId = id;
    state.selectedVariant = p.variants[0];

    $('modalImg').src = p.image;
    $('modalImg').alt = p.title;
    $('modalDiscount').textContent = `−${getDiscountPct(p)}%`;
    $('modalBrand').textContent = p.brand;
    $('modalTitle').textContent = p.title;
    $('modalRating').textContent = `★ ${p.rating.toFixed(1)}`;
    $('modalReviews').textContent = `${p.reviews} отзывов`;
    $('modalDesc').textContent = p.desc;
    $('modalPrice').textContent = formatPrice(getEffectivePrice(p));
    $('modalOldPrice').textContent = formatPrice(p.oldPrice);
    $('modalWalletHint').textContent = state.walletActive
      ? 'С учётом скидки WB Кошелька −5%'
      : 'Включите WB Кошелёк в шапке для скидки −5%';
    $('modalFavBtn').textContent = state.favorites.has(id) ? '♥' : '♡';

    $('modalVariantChips').innerHTML = p.variants
      .map((v, i) => `<button type="button" class="variant-chip ${i === 0 ? 'active' : ''}" data-variant="${v}">${v}</button>`)
      .join('');

    $('productModal').classList.remove('hidden');
  }

  function renderPvzList() {
    $('pvzList').innerHTML = PVZ_POINTS.map((pt) => `
      <button type="button" class="pvz-item ${pt.id === state.pvzId ? 'active' : ''}" data-pvz="${pt.id}">
        <div>
          <div class="pvz-item__title">${pt.address}</div>
          <div class="pvz-item__meta">${pt.rating}</div>
        </div>
        <span class="text-green">${pt.eta}</span>
      </button>
    `).join('');
  }

  function openModal(id) {
    if (id === 'pvzModal') renderPvzList();
    $(id).classList.remove('hidden');
  }

  function closeModal(id) {
    $(id).classList.add('hidden');
  }

  // Countdown timer
  function startCountdown() {
    let seconds = 4 * 3600 + 18 * 60 + 45;
    setInterval(() => {
      seconds = seconds > 0 ? seconds - 1 : 4 * 3600;
      const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      const el = $('countdownTimer');
      if (el) el.textContent = `${h}:${m}:${s}`;
    }, 1000);
  }

  // Event Listeners
  function bindEvents() {
    $('themeToggleBtn').addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme();
    });

    const toggleWallet = () => {
      state.walletActive = !state.walletActive;
      updateWalletUI();
      renderProducts();
      renderCart();
      showToast(state.walletActive ? 'Скидка WB Кошелька −5% активирована' : 'Скидка WB Кошелька отключена');
    };

    $('walletToggleBtn').addEventListener('click', toggleWallet);
    $('bentoWalletBtn').addEventListener('click', toggleWallet);

    $('searchInput').addEventListener('input', (e) => {
      state.search = e.target.value;
      $('clearSearchBtn').classList.toggle('hidden', !state.search);
      renderProducts();
    });

    $('clearSearchBtn').addEventListener('click', () => {
      state.search = '';
      $('searchInput').value = '';
      $('clearSearchBtn').classList.add('hidden');
      renderProducts();
    });

    document.querySelectorAll('.ai-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const q = chip.dataset.query || '';
        state.search = q;
        $('searchInput').value = q;
        $('clearSearchBtn').classList.remove('hidden');
        renderProducts();
        $('catalog').scrollIntoView({ behavior: 'smooth' });
      });
    });

    $('categoryTabs').addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-pill');
      if (!btn) return;
      document.querySelectorAll('.cat-pill').forEach((el) => el.classList.remove('active'));
      btn.classList.add('active');
      state.category = btn.dataset.category;
      state.favOnly = false;
      $('favFilterBtn').classList.remove('active');
      renderProducts();
    });

    $('discountOnlyCheck').addEventListener('change', (e) => {
      state.discountOnly = e.target.checked;
      renderProducts();
    });

    $('sortSelect').addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderProducts();
    });

    $('favFilterBtn').addEventListener('click', () => {
      state.favOnly = !state.favOnly;
      $('favFilterBtn').classList.toggle('active', state.favOnly);
      renderProducts();
    });

    $('resetFiltersBtn').addEventListener('click', () => {
      state.category = 'all';
      state.search = '';
      state.discountOnly = false;
      state.favOnly = false;
      $('searchInput').value = '';
      $('clearSearchBtn').classList.add('hidden');
      $('discountOnlyCheck').checked = false;
      $('favFilterBtn').classList.remove('active');
      document.querySelectorAll('.cat-pill').forEach((el) => el.classList.toggle('active', el.dataset.category === 'all'));
      renderProducts();
    });

    $('logoReset').addEventListener('click', () => {
      $('resetFiltersBtn').click();
    });

    $('productGrid').addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const { action, id } = target.dataset;
      if (action === 'add') addToCart(id);
      if (action === 'inc') changeCartQty(id, 1);
      if (action === 'dec') changeCartQty(id, -1);
      if (action === 'fav') toggleFavorite(id);
      if (action === 'open') openProductModal(id);
    });

    $('modalVariantChips').addEventListener('click', (e) => {
      const btn = e.target.closest('.variant-chip');
      if (!btn) return;
      document.querySelectorAll('.variant-chip').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      state.selectedVariant = btn.dataset.variant;
    });

    $('modalAddCartBtn').addEventListener('click', () => {
      if (!state.activeModalProductId) return;
      addToCart(state.activeModalProductId, state.selectedVariant);
      closeModal('productModal');
    });

    $('modalFavBtn').addEventListener('click', () => {
      if (state.activeModalProductId) toggleFavorite(state.activeModalProductId);
    });

    $('pvzBtn').addEventListener('click', () => openModal('pvzModal'));
    $('bentoPvzBtn').addEventListener('click', () => openModal('pvzModal'));
    $('footerPvzBtn').addEventListener('click', () => openModal('pvzModal'));

    $('pvzList').addEventListener('click', (e) => {
      const item = e.target.closest('[data-pvz]');
      if (!item) return;
      state.pvzId = item.dataset.pvz;
      const selected = PVZ_POINTS.find((x) => x.id === state.pvzId);
      if (selected) {
        $('pvzLabel').textContent = `${selected.address} (ПВЗ)`;
        showToast(`Выбран ПВЗ: ${selected.address}`);
      }
      closeModal('pvzModal');
    });

    $('cartOpenBtn').addEventListener('click', () => {
      renderCart();
      openModal('cartDrawer');
    });
    $('footerCartBtn').addEventListener('click', () => {
      renderCart();
      openModal('cartDrawer');
    });

    $('cartItemsContainer').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cart-action]');
      if (!btn) return;
      const { cartAction, id } = btn.dataset;
      changeCartQty(id, cartAction === 'inc' ? 1 : -1);
    });

    $('applyPromoBtn').addEventListener('click', () => {
      const val = $('promoInput').value.trim().toUpperCase();
      if (val === 'NEXTGEN10') {
        state.promoCode = 'NEXTGEN10';
        renderCart();
        showToast('Промокод NEXTGEN10 применён (−10%)');
      } else {
        showToast('Промокод не найден. Попробуйте NEXTGEN10');
      }
    });

    $('promoCopyBtn').addEventListener('click', () => {
      state.promoCode = 'NEXTGEN10';
      $('promoInput').value = 'NEXTGEN10';
      renderCart();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('NEXTGEN10').catch(() => {});
      }
      showToast('Промокод NEXTGEN10 активирован!');
    });

    $('checkoutBtn').addEventListener('click', () => {
      const total = $('summaryTotal').textContent;
      state.cart = {};
      updateBadges();
      renderProducts();
      renderCart();
      closeModal('cartDrawer');
      showToast(`Заказ на ${total} оформлен! Ждём вас в ПВЗ.`);
    });

    document.addEventListener('click', (e) => {
      const closer = e.target.closest('[data-close]');
      if (closer) closeModal(closer.dataset.close);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal('productModal');
        closeModal('pvzModal');
        closeModal('cartDrawer');
      }
    });
  }

  // Init
  applyTheme();
  updateWalletUI();
  updateBadges();
  renderProducts();
  renderCart();
  bindEvents();
  startCountdown();
})();