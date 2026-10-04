// Sonali Furniture — Main Application & View Router
// UX FIRST: Simplicity, transparency, seamless navigation

const App = {
  currentRoute: "home",
  routeParams: {},
  currentHeroIndex: 0,
  heroTimer: null,
  activeRentTenure: 3, // 3, 6, 12 months

  init() {
    this.bindGlobalEvents();
    this.handleRoute();
    CartState.updateBadges();

    // Listen for hash changes
    window.addEventListener("hashchange", () => this.handleRoute());

    // Listen for custom state changes
    window.addEventListener("cart-updated", () => CartState.updateBadges());
    window.addEventListener("wishlist-updated", () => CartState.updateBadges());

    // Window resize for dynamic carousel dots
    window.addEventListener("resize", () => {
      if (this.currentRoute === "home") {
        this.setupCarouselDots("category-carousel-track", "category-carousel-dots");
        this.setupCarouselDots("home-rental-track", "home-rental-dots");
      }
    });
  },

  // Global UI Listeners
  bindGlobalEvents() {
    // Mobile Hamburger
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
    const mobileCloseBtn = document.getElementById("mobile-close-btn");

    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileNavDrawer.classList.add("active");
      });
      if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener("click", () => {
          mobileNavDrawer.classList.remove("active");
        });
      }
      mobileNavDrawer.addEventListener("click", (e) => {
        if (e.target === mobileNavDrawer) {
          mobileNavDrawer.classList.remove("active");
        }
      });
    }

    // Search Modal
    const searchTrigger = document.getElementById("search-trigger");
    const searchOverlay = document.getElementById("search-overlay");
    const searchClose = document.getElementById("search-close");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    if (searchTrigger && searchOverlay) {
      searchTrigger.addEventListener("click", () => {
        searchOverlay.classList.add("active");
        if (searchInput) {
          searchInput.focus();
          this.renderSearchSuggestions("");
        }
      });

      if (searchClose) {
        searchClose.addEventListener("click", () => {
          searchOverlay.classList.remove("active");
        });
      }

      searchOverlay.addEventListener("click", (e) => {
        if (e.target === searchOverlay) {
          searchOverlay.classList.remove("active");
        }
      });

      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.renderSearchSuggestions(e.target.value.trim());
        });
      }
    }

    // Close Modals on ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (searchOverlay) searchOverlay.classList.remove("active");
        if (mobileNavDrawer) mobileNavDrawer.classList.remove("active");
        this.closeQuickView();
      }
    });
  },

  // Live Search Suggestions
  renderSearchSuggestions(query) {
    const resultsContainer = document.getElementById("search-results");
    if (!resultsContainer) return;

    if (!query) {
      resultsContainer.innerHTML = `
        <div class="search-suggestions-title">Popular Furniture Searches</div>
        <div class="search-tag-list">
          <span class="search-tag" onclick="App.searchTagClick('Sofa')">Sofa</span>
          <span class="search-tag" onclick="App.searchTagClick('Wooden Palang')">Wooden Palang</span>
          <span class="search-tag" onclick="App.searchTagClick('Study Table')">Study Table</span>
          <span class="search-tag" onclick="App.searchTagClick('Temple')">Pooja Mandir</span>
          <span class="search-tag" onclick="App.searchTagClick('Dining Table')">Dining Table</span>
          <span class="search-tag" onclick="App.searchTagClick('Shoe Rake')">Shoe Rake</span>
          <span class="search-tag" onclick="App.searchTagClick('Sofa Cum Bed')">Sofa Cum Bed</span>
          <span class="search-tag" onclick="window.location.hash='#rent'">Furniture on Rent</span>
          <span class="search-tag" onclick="window.location.hash='#custom'">Custom Furniture</span>
        </div>
      `;
      return;
    }

    const matches = PRODUCTS_DATA.filter((p) => {
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.room.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.descriptor.toLowerCase().includes(q)
      );
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--color-text-muted);">
          <p>No furniture found matching "<strong>${this.escapeHtml(query)}</strong>"</p>
          <p style="font-size: 0.8125rem; margin-top: 6px;">Looking for something specific? We can handcraft it.</p>
          <a href="#custom" class="btn btn-primary btn-sm" style="margin-top: 12px;" onclick="document.getElementById('search-overlay').classList.remove('active');">Request Custom Build</a>
        </div>
      `;
      return;
    }

    let html = `
      <div class="search-suggestions-title">Matching Products (${matches.length})</div>
      <div class="search-results-list">
    `;

    matches.slice(0, 5).forEach((p) => {
      html += `
        <a href="#product?id=${p.id}" class="search-result-item" onclick="document.getElementById('search-overlay').classList.remove('active');">
          <img src="${p.image}" alt="${p.name}" class="search-result-thumb">
          <div class="search-result-info">
            <div class="search-result-name">${p.name}</div>
            <div class="search-result-price">
              ₹${p.buyPrice.toLocaleString("en-IN")}
              ${p.rentPrice ? ` <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: normal;">| Rent: ₹${p.rentPrice}/mo</span>` : ""}
            </div>
          </div>
        </a>
      `;
    });

    html += `</div>`;
    resultsContainer.innerHTML = html;
  },

  searchTagClick(term) {
    const input = document.getElementById("search-input");
    if (input) {
      input.value = term;
      this.renderSearchSuggestions(term);
    }
  },

  // Route Resolver
  handleRoute() {
    const hash = window.location.hash.slice(1) || "home";
    const [path, queryString] = hash.split("?");

    this.currentRoute = path;
    this.routeParams = {};

    if (queryString) {
      queryString.split("&").forEach((part) => {
        const [k, v] = part.split("=");
        if (k) this.routeParams[k] = decodeURIComponent(v || "");
      });
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "instant" });

    // Update active nav links
    document.querySelectorAll(".nav-link").forEach((link) => {
      const linkHash = link.getAttribute("href")?.replace("#", "");
      if (linkHash === this.currentRoute) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Close mobile nav drawer if open
    const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
    if (mobileNavDrawer) mobileNavDrawer.classList.remove("active");

    const mainContainer = document.getElementById("app-root");
    if (!mainContainer) return;

    // Clear homepage background intervals when leaving home
    if (this.currentRoute !== "home") {
      if (this.heroTimer) clearInterval(this.heroTimer);
      if (this.rentalCarouselTimer) clearInterval(this.rentalCarouselTimer);
    }

    // View Router Switching
    switch (this.currentRoute) {
      case "home":
        this.renderHome(mainContainer);
        break;
      case "shop":
        this.renderShop(mainContainer);
        break;
      case "product":
        this.renderProductDetail(mainContainer);
        break;
      case "rent":
        this.renderRentPage(mainContainer);
        break;
      case "custom":
        this.renderCustomPage(mainContainer);
        break;
      case "cart":
        this.renderCart(mainContainer);
        break;
      case "checkout":
        this.renderCheckout(mainContainer);
        break;
      case "order-success":
        this.renderOrderSuccess(mainContainer);
        break;
      case "track-order":
        this.renderTracking(mainContainer);
        break;
      case "account":
        this.renderAccount(mainContainer);
        break;
      case "about":
        this.renderAbout(mainContainer);
        break;
      case "contact":
        this.renderContact(mainContainer);
        break;
      case "faq":
        this.renderFAQ(mainContainer);
        break;
      default:
        this.renderHome(mainContainer);
        break;
    }
  },

  // =========================================================================
  // VIEW: HOMEPAGE
  // =========================================================================
  renderHome(container) {
    container.innerHTML = `
      <!-- 1. Hero Horizontal Slider (40-50% desktop viewport height) -->
      <section class="hero-slider-section" id="hero-slider">
        <div class="hero-track" id="hero-track">
          <!-- Slide 1 -->
          <div class="hero-slide">
            <img src="assets/images/hero/hero_slide_1.jpg" alt="Living room furniture" class="hero-slide-bg">
            <div class="hero-slide-overlay"></div>
            <div class="container hero-content">
              <h1 class="hero-title">Furniture made for everyday living.</h1>
              <p class="hero-subtitle">Thoughtfully designed furniture for homes that feel like yours.</p>
              <div class="hero-actions">
                <a href="#shop" class="btn btn-primary">Shop Furniture</a>
                <a href="#rent" class="btn btn-secondary" style="color: #FFFFFF; border-color: var(--color-secondary);">Explore Rentals</a>
              </div>
            </div>
          </div>

          <!-- Slide 2 -->
          <div class="hero-slide">
            <img src="assets/images/hero/hero_slide_2.jpg" alt="Study and work furniture on rent" class="hero-slide-bg">
            <div class="hero-slide-overlay"></div>
            <div class="container hero-content">
              <h2 class="hero-title">Need furniture for a while?</h2>
              <p class="hero-subtitle">Rent the furniture you need without committing to a long-term purchase.</p>
              <div class="hero-actions">
                <a href="#rent" class="btn btn-primary">Explore Rentals</a>
                <a href="#shop" class="btn btn-secondary" style="color: #FFFFFF; border-color: var(--color-secondary);">Browse Buy Options</a>
              </div>
            </div>
          </div>

          <!-- Slide 3 -->
          <div class="hero-slide">
            <img src="assets/images/hero/hero_slide_3.jpg" alt="Custom wooden furniture craftsmanship" class="hero-slide-bg">
            <div class="hero-slide-overlay"></div>
            <div class="container hero-content">
              <h2 class="hero-title">Made around your space.</h2>
              <p class="hero-subtitle">Get custom furniture designed around your needs, measurements and style.</p>
              <div class="hero-actions">
                <a href="#custom" class="btn btn-primary">Request Custom Furniture</a>
                <a href="#about" class="btn btn-secondary" style="color: #FFFFFF; border-color: var(--color-secondary);">Our Craftsmanship</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Arrows & Dots -->
        <button class="hero-nav-arrow hero-nav-prev" onclick="App.prevHeroSlide()" aria-label="Previous slide">‹</button>
        <button class="hero-nav-arrow hero-nav-next" onclick="App.nextHeroSlide()" aria-label="Next slide">›</button>
        <div class="hero-dots" id="hero-dots">
          <button class="hero-dot active" onclick="App.goToHeroSlide(0)" aria-label="Slide 1"></button>
          <button class="hero-dot" onclick="App.goToHeroSlide(1)" aria-label="Slide 2"></button>
          <button class="hero-dot" onclick="App.goToHeroSlide(2)" aria-label="Slide 3"></button>
        </div>
      </section>

      <!-- 2. Shop by Need (Visual Category Cards) -->
      <section class="section-block">
        <div class="container">
          <div class="section-header">
            <div class="section-heading-group">
              <h2 class="section-title">What are you looking for?</h2>
              <p class="section-subtitle">Find practical, beautifully finished furniture organized by room and need.</p>
            </div>
            <div style="display: flex; align-items: center; gap: 14px;">
              <a href="#shop" class="section-link">View All Furniture →</a>
              <div class="carousel-nav-arrows">
                <button class="carousel-arrow-btn" onclick="App.scrollCategoryCarousel(-1)" aria-label="Previous categories">‹</button>
                <button class="carousel-arrow-btn" onclick="App.scrollCategoryCarousel(1)" aria-label="Next categories">›</button>
              </div>
            </div>
          </div>

          <div class="carousel-wrapper">
            <div class="category-carousel-track" id="category-carousel-track">
              ${SHOP_BY_NEED_CATEGORIES.map((cat, idx) => `
                <a href="${cat.categoryFilter === 'Custom Furniture' ? '#custom' : `#shop?category=${encodeURIComponent(cat.categoryFilter)}`}" class="category-card" data-idx="${idx}">
                  <div class="category-thumb-wrap">
                    <img src="${cat.image}" alt="${cat.room}" class="category-thumb" loading="lazy">
                  </div>
                  <div class="category-card-body">
                    <div class="category-room-name">${cat.room}</div>
                    <div class="category-items-list">${cat.items.join(" • ")}</div>
                  </div>
                </a>
              `).join("")}
            </div>

            <!-- Dots Pagination (Only visible if space is constrained) -->
            <div class="carousel-dots-container" id="category-carousel-dots"></div>
          </div>
        </div>
      </section>

      <!-- 3. Featured Products ("Made for your space") -->
      <section class="section-block section-block-alt">
        <div class="container">
          <div class="section-header">
            <div class="section-heading-group">
              <h2 class="section-title">Made for your space</h2>
              <p class="section-subtitle">Solid Sheesham and Teak wood essentials crafted for durability, comfort, and everyday living.</p>
            </div>
            <a href="#shop" class="section-link">Explore Full Catalog →</a>
          </div>

          <div class="product-grid">
            ${PRODUCTS_DATA.slice(0, 8).map((p) => this.renderProductCardHtml(p)).join("")}
          </div>
        </div>
      </section>

      <!-- 4. Dedicated Furniture on Rent Section (Auto + Manual Carousel) -->
      <section class="section-block">
        <div class="container">
          <div class="rental-section-box">
            <div class="rental-header-flex">
              <div class="section-heading-group">
                <h2 class="section-title">Furniture when you need it.</h2>
                <p class="section-subtitle">Flexible furniture options for temporary homes, offices, changing needs and short-term living.</p>
              </div>
              <div class="rental-header-actions">
                <div class="rental-tenure-tabs">
                  <button class="rental-tab-btn ${this.activeRentTenure === 3 ? 'active' : ''}" onclick="App.setHomeRentTenure(3)">3 Months</button>
                  <button class="rental-tab-btn ${this.activeRentTenure === 6 ? 'active' : ''}" onclick="App.setHomeRentTenure(6)">6 Months</button>
                  <button class="rental-tab-btn ${this.activeRentTenure === 12 ? 'active' : ''}" onclick="App.setHomeRentTenure(12)">12 Months</button>
                </div>
                <a href="#rent" class="btn btn-primary btn-sm">Explore Furniture on Rent</a>
              </div>
            </div>

            <div class="carousel-wrapper">
              <div class="rental-carousel-track" id="home-rental-track">
                ${PRODUCTS_DATA.filter((p) => p.rentPrice).map((p) => this.renderRentalCardHtml(p, this.activeRentTenure)).join("")}
              </div>

              <!-- Dots Pagination -->
              <div class="carousel-dots-container" id="home-rental-dots"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Custom Furniture Section -->
      <section class="section-block section-block-alt">
        <div class="container">
          <div class="section-header">
            <div class="section-heading-group">
              <h2 class="section-title">Can't find exactly what you need?</h2>
              <p class="section-subtitle">Tell us what you have in mind and we'll help create furniture around your space and requirements.</p>
            </div>
            <div style="display: flex; gap: 12px;">
              <a href="#custom" class="btn btn-primary">Request Custom Furniture</a>
              <a href="#contact" class="btn btn-secondary">Talk to Us</a>
            </div>
          </div>

          <div class="custom-process-grid">
            <div class="custom-step-card">
              <div class="step-num">01</div>
              <h3 class="step-title">Tell us what you need</h3>
              <p class="step-desc">Share your room dimensions, desired furniture type, and reference photos or rough sketch.</p>
            </div>

            <div class="custom-step-card">
              <div class="step-num">02</div>
              <h3 class="step-title">Discuss size, design & material</h3>
              <p class="step-desc">Our craftsmen advise on seasoned Sheesham or Teak wood selection, joinery, and natural finishes.</p>
            </div>

            <div class="custom-step-card">
              <div class="step-num">03</div>
              <h3 class="step-title">We build it for your space</h3>
              <p class="step-desc">Built in our dedicated workshop and delivered with white-glove doorstep assembly.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Why Sonali (4 Factual Pillars) -->
      <section class="section-block">
        <div class="container">
          <div class="section-header" style="justify-content: center; text-align: center; margin-bottom: var(--space-2xl);">
            <div class="section-heading-group" style="max-width: 600px;">
              <h2 class="section-title">Why choose Sonali?</h2>
              <p class="section-subtitle">Honest craftsmanship and practical furniture created for Indian homes.</p>
            </div>
          </div>

          <div class="why-grid">
            <div class="why-card">
              <div class="why-icon-box">🪵</div>
              <h3 class="why-title">Built for everyday use</h3>
              <p class="why-desc">Practical furniture designed for real homes, heavy everyday living, and zero squeaks.</p>
            </div>

            <div class="why-card">
              <div class="why-icon-box">🔨</div>
              <h3 class="why-title">Made with care</h3>
              <p class="why-desc">Thoughtful solid wood materials, authentic joinery, and durable protective finishing.</p>
            </div>

            <div class="why-card">
              <div class="why-icon-box">🔄</div>
              <h3 class="why-title">Buy or Rent</h3>
              <p class="why-desc">Choose the option that fits your current life stage, budget, and living arrangements.</p>
            </div>

            <div class="why-card">
              <div class="why-icon-box">📐</div>
              <h3 class="why-title">Custom when you need it</h3>
              <p class="why-desc">Furniture designed and built precisely around your space and millimeter requirements.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Trust & Service Information -->
      <section class="trust-strip">
        <div class="container">
          <div class="trust-flex">
            <div class="trust-item">
              <div class="trust-icon">🛡️</div>
              <div>
                <div class="trust-text-title">Secure Transparent Payment</div>
                <div class="trust-text-sub">UPI, Cards, NetBanking, No hidden fees</div>
              </div>
            </div>

            <div class="trust-item">
              <div class="trust-icon">🚚</div>
              <div>
                <div class="trust-text-title">Free Delivery & Assembly</div>
                <div class="trust-text-sub">White-glove carpenter setup in 5–7 days</div>
              </div>
            </div>

            <div class="trust-item">
              <div class="trust-icon">↩️</div>
              <div>
                <div class="trust-text-title">7-Day Return / Inspection</div>
                <div class="trust-text-sub">Hassle-free doorstep resolution</div>
              </div>
            </div>

            <div class="trust-item">
              <div class="trust-icon">🎖️</div>
              <div>
                <div class="trust-text-title">Up to 5-Year Wood Warranty</div>
                <div class="trust-text-sub">Guaranteed structural integrity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 8. Hinglish Support Banner & Store Touchpoint -->
      <section class="section-block section-block-alt" style="padding: var(--space-2xl) 0;">
        <div class="container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
          <div>
            <h3 style="font-size: 1.25rem; color: var(--color-primary-dark); font-weight: 700;">Need help choosing?</h3>
            <p style="color: var(--color-text-muted); font-size: 0.9375rem; margin-top: 4px;">
              <span style="font-style: italic; color: var(--color-primary);">Samajh nahi aa raha kaunsa size sahi rahega?</span> Talk to our furniture specialist.
            </p>
          </div>
          <div style="display: flex; gap: 12px;">
            <a href="tel:+919504326798" class="btn btn-secondary btn-sm">📞 Call +91 95043 26798</a>
            <a href="https://wa.me/919504326798?text=Hello%20Sonali%20Furniture%2C%20I%20need%20help%20choosing%20furniture%20for%20my%20home" target="_blank" class="btn btn-primary btn-sm">💬 WhatsApp Us</a>
          </div>
        </div>
      </section>
    `;

    this.initHeroSlider();
    this.initCategoryCarousel();
    this.initRentalCarousel();
  },

  // Hero Slider Mechanics
  initHeroSlider() {
    this.currentHeroIndex = 0;
    const track = document.getElementById("hero-track");
    if (!track) return;

    if (this.heroTimer) clearInterval(this.heroTimer);
    this.heroTimer = setInterval(() => {
      this.nextHeroSlide();
    }, 6000);
  },

  goToHeroSlide(index) {
    this.currentHeroIndex = index;
    const track = document.getElementById("hero-track");
    const dots = document.querySelectorAll(".hero-dot");
    if (track) {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  },

  nextHeroSlide() {
    let nextIndex = (this.currentHeroIndex + 1) % 3;
    this.goToHeroSlide(nextIndex);
  },

  prevHeroSlide() {
    let prevIndex = (this.currentHeroIndex - 1 + 3) % 3;
    this.goToHeroSlide(prevIndex);
  },

  setHomeRentTenure(tenure) {
    this.activeRentTenure = tenure;
    document.querySelectorAll(".rental-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.textContent.startsWith(tenure.toString()));
    });
    const track = document.getElementById("home-rental-track");
    if (track) {
      const currentScroll = track.scrollLeft;
      track.innerHTML = PRODUCTS_DATA.filter((p) => p.rentPrice).map((p) => this.renderRentalCardHtml(p, tenure)).join("");
      track.scrollLeft = currentScroll;
      this.setupCarouselDots("home-rental-track", "home-rental-dots");
    }
  },

  // -------------------------------------------------------------
  // HOMEPAGE CAROUSELS (Category Manual & Rental Auto/Manual)
  // -------------------------------------------------------------
  setupCarouselDots(trackId, dotsContainerId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsContainerId);
    if (!track || !dotsContainer) return;

    const renderDots = () => {
      const scrollWidth = track.scrollWidth;
      const clientWidth = track.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      if (maxScroll <= 10) {
        dotsContainer.style.display = "none";
        return;
      }

      dotsContainer.style.display = "flex";
      const firstChild = track.firstElementChild;
      const cardWidth = firstChild ? firstChild.offsetWidth : 200;
      const visibleCount = Math.max(1, Math.floor(clientWidth / cardWidth));
      const totalCount = track.children.length;
      const totalPages = Math.max(2, Math.ceil(totalCount / visibleCount));

      dotsContainer.innerHTML = Array.from({ length: totalPages }).map((_, i) => `
        <button class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="App.scrollCarouselToPage('${trackId}', ${i}, ${totalPages})" aria-label="Go to slide ${i + 1}"></button>
      `).join("");
    };

    renderDots();

    // Scroll listener to update active dot in real-time
    let ticking = false;
    track.onscroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const maxScroll = track.scrollWidth - track.clientWidth;
          if (maxScroll > 10) {
            const dots = dotsContainer.querySelectorAll(".carousel-dot");
            const totalPages = dots.length;
            if (totalPages > 0) {
              const fraction = Math.max(0, Math.min(1, track.scrollLeft / maxScroll));
              const activeIdx = Math.min(totalPages - 1, Math.round(fraction * (totalPages - 1)));
              dots.forEach((d, idx) => d.classList.toggle("active", idx === activeIdx));
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
  },

  scrollCarouselToPage(trackId, pageIndex, totalPages) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = (maxScroll / (totalPages - 1)) * pageIndex;
    track.scrollTo({ left: target, behavior: "smooth" });
  },

  scrollCategoryCarousel(dir) {
    const track = document.getElementById("category-carousel-track");
    if (!track) return;
    const card = track.querySelector(".category-card");
    const step = card ? (card.offsetWidth + 16) * 2 : track.clientWidth * 0.75;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  },

  scrollRentalCarousel(dir) {
    const track = document.getElementById("home-rental-track");
    if (!track) return;
    const card = track.querySelector(".product-card");
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  },

  initCategoryCarousel() {
    this.setupCarouselDots("category-carousel-track", "category-carousel-dots");
  },

  initRentalCarousel() {
    const track = document.getElementById("home-rental-track");
    if (!track) return;

    this.setupCarouselDots("home-rental-track", "home-rental-dots");

    if (this.rentalCarouselTimer) clearInterval(this.rentalCarouselTimer);
    this.rentalCarouselHovered = false;

    // Auto-slide every 3800ms to continuously show more rental products
    this.rentalCarouselTimer = setInterval(() => {
      if (this.rentalCarouselHovered) return;
      const card = track.querySelector(".product-card");
      const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.8;
      const maxScroll = track.scrollWidth - track.clientWidth - 15;

      if (track.scrollLeft >= maxScroll) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollTo({ left: track.scrollLeft + step, behavior: "smooth" });
      }
    }, 3800);

    // Pause on mouse hover & touch interaction
    track.addEventListener("mouseenter", () => { this.rentalCarouselHovered = true; });
    track.addEventListener("mouseleave", () => { this.rentalCarouselHovered = false; });
    track.addEventListener("touchstart", () => { this.rentalCarouselHovered = true; }, { passive: true });
    track.addEventListener("touchend", () => {
      setTimeout(() => { this.rentalCarouselHovered = false; }, 3000);
    }, { passive: true });
  },

  // Product Card Template
  renderProductCardHtml(p) {
    const isWishlisted = CartState.isInWishlist(p.id);
    return `
      <div class="product-card" id="card-${p.id}">
        <div class="product-image-box">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <span class="product-badge ${p.availability === 'Available to Rent' ? 'rent-badge' : ''}">${p.availability}</span>
          <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="App.toggleWishlist('${p.id}', event)" title="Save to Wishlist" aria-label="Save to Wishlist">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
          <button class="product-quick-view-btn" onclick="App.openQuickView('${p.id}', event)">
            Quick View
          </button>
        </div>

        <div class="product-card-body">
          <div class="product-meta-row">
            <span class="product-category-tag">${p.category}</span>
            <span class="product-rating-snippet">★ ${p.rating} (${p.reviewsCount})</span>
          </div>

          <h3 class="product-card-title">
            <a href="#product?id=${p.id}">${p.name}</a>
          </h3>
          <p class="product-card-desc">${p.descriptor}</p>

          ${p.rentPrice ? `
            <div class="card-mode-toggle-wrap">
              <div class="mode-toggle-group card-toggle-group">
                <button class="mode-toggle-btn card-mode-btn active" data-mode="buy" onclick="App.switchCardMode('${p.id}', 'buy', event)">BUY</button>
                <button class="mode-toggle-btn card-mode-btn" data-mode="rent" onclick="App.switchCardMode('${p.id}', 'rent', event)">RENT</button>
              </div>
            </div>
          ` : ""}

          <div class="product-pricing-box">
            <div class="price-main card-price-buy">
              <span class="price-buy-tag">${p.availability === 'Custom Only' ? 'Starting From' : 'Buy Price'}</span>
              <span class="price-buy-value">₹${p.buyPrice.toLocaleString("en-IN")}</span>
            </div>
            ${p.rentPrice ? `
              <div class="card-price-rent" style="display: none; flex-direction: column;">
                <span class="price-buy-tag">Rent Monthly</span>
                <div class="price-buy-value" style="color: var(--color-primary); font-size: 1.1875rem;">₹${p.rentPrice}<span style="font-size: 0.8125rem; font-weight: normal; color: var(--color-text-muted);">/mo</span></div>
              </div>
              <div class="card-rent-preview" style="text-align: right;">
                <span class="price-buy-tag">Rent From</span>
                <div class="price-rent-value"><span class="price-rent-highlight">₹${p.rentPrice}</span>/mo</div>
              </div>
            ` : ""}
          </div>

          ${p.availability === 'Buy & Rent' ? `
            <div class="product-card-cta product-card-cta-dual">
              <a href="#product?id=${p.id}&mode=buy" class="btn btn-secondary btn-sm card-cta-link">View Details</a>
              <button class="btn btn-primary btn-sm card-add-cart-btn" onclick="App.quickAddToCart('${p.id}', event)">Add to Cart</button>
            </div>
          ` : `
            <div class="product-card-cta">
              <a href="${p.availability === 'Custom Only' ? '#custom' : `#product?id=${p.id}`}" class="btn btn-secondary btn-block btn-sm card-cta-link">
                ${p.availability === 'Custom Only' ? 'Custom Request' : 'View Details'}
              </a>
            </div>
          `}
        </div>
      </div>
    `;
  },

  quickAddToCart(productId, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return;

    // Check if card has active rent mode
    const card = document.getElementById(`card-${productId}`);
    let activeMode = "buy";
    if (card) {
      const activeBtn = card.querySelector(".card-mode-btn.active");
      if (activeBtn && activeBtn.dataset.mode === "rent") {
        activeMode = "rent";
      }
    }

    CartState.addItem(product, activeMode, 3);
  },

  switchCardMode(productId, mode, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const card = document.getElementById(`card-${productId}`);
    if (!card) return;

    card.querySelectorAll(".card-mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    const buyPriceEl = card.querySelector(".card-price-buy");
    const rentPriceEl = card.querySelector(".card-price-rent");
    const rentPreview = card.querySelector(".card-rent-preview");
    const ctaLink = card.querySelector(".card-cta-link");
    const addBtn = card.querySelector(".card-add-cart-btn");
    const product = PRODUCTS_DATA.find((p) => p.id === productId);

    if (mode === "rent") {
      if (buyPriceEl) buyPriceEl.style.display = "none";
      if (rentPreview) rentPreview.style.display = "none";
      if (rentPriceEl) rentPriceEl.style.display = "flex";
      if (ctaLink && product) {
        ctaLink.href = `#product?id=${productId}&mode=rent`;
      }
      if (addBtn) {
        addBtn.textContent = "Rent to Cart";
      }
    } else {
      if (buyPriceEl) buyPriceEl.style.display = "flex";
      if (rentPreview) rentPreview.style.display = "block";
      if (rentPriceEl) rentPriceEl.style.display = "none";
      if (ctaLink && product) {
        ctaLink.href = `#product?id=${productId}&mode=buy`;
      }
      if (addBtn) {
        addBtn.textContent = "Add to Cart";
      }
    }
  },

  // Rental Card Template (Dedicated Tenure Matrix)
  renderRentalCardHtml(p, tenure = 3) {
    const monthlyRate = CartState.calculateRentPrice(p.rentPrice, tenure);
    const deposit = p.rentDeposit || 1500;
    return `
      <div class="product-card" id="rent-card-${p.id}">
        <div class="product-image-box">
          <a href="#product?id=${p.id}&mode=rent" style="display: block; width: 100%; height: 100%;">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </a>
          <span class="product-badge rent-badge">Rent • ${tenure} Mo</span>
          <button class="product-quick-view-btn" onclick="App.openQuickView('${p.id}', event, 'rent')">
            Quick View
          </button>
        </div>

        <div class="product-card-body">
          <div class="product-meta-row">
            <span class="product-category-tag">${p.category}</span>
            <span class="product-rating-snippet">★ ${p.rating}</span>
          </div>

          <h3 class="product-card-title">
            <a href="#product?id=${p.id}&mode=rent">${p.name}</a>
          </h3>
          <p class="product-card-desc">${p.descriptor}</p>

          <div class="product-pricing-box" style="align-items: center;">
            <div>
              <span class="price-buy-tag">Monthly Rent</span>
              <div class="price-buy-value" style="font-size: 1.3rem;">₹${monthlyRate}<span style="font-size: 0.8125rem; font-weight: normal; color: var(--color-text-muted);">/mo</span></div>
            </div>
            <div style="text-align: right; font-size: 0.75rem; color: var(--color-text-muted);">
              <div>Deposit: ₹${deposit.toLocaleString("en-IN")}</div>
              <div style="color: #2F6F38; font-weight: 500;">✓ Fully Refundable</div>
            </div>
          </div>

          <div class="product-card-cta" style="display: flex; gap: 8px; margin-top: var(--space-sm);">
            <a href="#product?id=${p.id}&mode=rent" class="btn btn-secondary btn-sm" style="flex: 1;">View Details</a>
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="App.quickRentNow('${p.id}', ${tenure})">Rent Now</button>
          </div>
        </div>
      </div>
    `;
  },

  quickRentNow(productId, tenure = 3) {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (product) {
      CartState.addItem(product, "rent", tenure);
      window.location.hash = "#cart";
    }
  },

  // Wishlist Toggle
  toggleWishlist(productId, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return;

    const added = CartState.toggleWishlist(product);
    document.querySelectorAll(`.product-wishlist-btn`).forEach((btn) => {
      const parent = btn.closest(".product-card");
      if (parent && parent.id.includes(productId)) {
        btn.classList.toggle("active", added);
        btn.innerHTML = added ? "❤️" : "🤍";
      }
    });
  },

  // Quick View Modal
  openQuickView(productId, e, initialMode = "buy") {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return;

    let overlay = document.getElementById("quickview-modal");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "quickview-modal";
      overlay.className = "modal-overlay";
      document.body.appendChild(overlay);
    }

    const isRentMode = initialMode === "rent" && product.rentPrice;
    const currentTenure = this.activeRentTenure || 3;
    const monthlyRate = isRentMode ? CartState.calculateRentPrice(product.rentPrice, currentTenure) : product.rentPrice;
    const deposit = product.rentDeposit || 1500;

    overlay.innerHTML = `
      <div class="modal-dialog">
        <button class="modal-close-btn" onclick="App.closeQuickView()" aria-label="Close modal">✕</button>
        <div class="quickview-layout">
          <div class="quickview-image-wrap">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div style="display: flex; flex-direction: column; justify-content: center;">
            <div class="product-category-tag" style="margin-bottom: 4px;">${product.category} ${isRentMode ? '• Available on Rent' : ''}</div>
            <h2 style="font-size: 1.375rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 8px;">${product.name}</h2>
            <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 12px;">★ ${product.rating} (${product.reviewsCount} customer reviews)</div>
            <p style="font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.45; margin-bottom: 16px;">${product.overview}</p>

            <div style="background-color: var(--color-bg-base); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 16px; border: 1px solid var(--color-border);">
              <div style="font-size: 0.8125rem; font-weight: 600; color: var(--color-primary-dark); margin-bottom: 4px;">Specifications & Service:</div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">
                • <strong>Material:</strong> ${product.material}<br>
                • <strong>Dimensions:</strong> ${product.dimensions}<br>
                • <strong>Assembly:</strong> Free Doorstep Setup Included
              </div>
            </div>

            ${isRentMode ? `
              <div class="product-pricing-box" style="margin-bottom: 16px; background: var(--color-bg-base); padding: 10px; border-radius: 4px;">
                <div>
                  <span class="price-buy-tag">Rental Rate (${currentTenure} Mo Tenure)</span>
                  <div class="price-buy-value" style="font-size: 1.4rem;">₹${monthlyRate}<span style="font-size: 0.8125rem; font-weight: normal; color: var(--color-text-muted);">/mo</span></div>
                </div>
                <div style="text-align: right; font-size: 0.75rem; color: var(--color-text-muted);">
                  <div>Deposit: ₹${deposit.toLocaleString("en-IN")}</div>
                  <div style="color: #2F6F38; font-weight: 500;">✓ 100% Refundable</div>
                </div>
              </div>

              <div style="display: flex; gap: 10px;">
                <a href="#product?id=${product.id}&mode=rent" class="btn btn-secondary btn-block btn-sm" onclick="App.closeQuickView()">View Full Rental Details</a>
                <button class="btn btn-primary btn-block btn-sm" onclick="App.quickRentNow('${product.id}', ${currentTenure}); App.closeQuickView();">Rent Now</button>
              </div>
            ` : `
              <div class="product-pricing-box" style="margin-bottom: 16px;">
                <div class="price-main">
                  <span class="price-buy-tag">Buy Price</span>
                  <span class="price-buy-value">₹${product.buyPrice.toLocaleString("en-IN")}</span>
                </div>
                ${product.rentPrice ? `
                  <div style="text-align: right;">
                    <span class="price-buy-tag">Rent From</span>
                    <div class="price-rent-value"><span class="price-rent-highlight">₹${product.rentPrice}</span>/mo</div>
                  </div>
                ` : ""}
              </div>

              <div style="display: flex; gap: 10px;">
                <a href="#product?id=${product.id}" class="btn btn-primary btn-block btn-sm" onclick="App.closeQuickView()">View Full Product Details</a>
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    overlay.onclick = (event) => {
      if (event.target === overlay) App.closeQuickView();
    };
  },

  closeQuickView() {
    const overlay = document.getElementById("quickview-modal");
    if (overlay) overlay.classList.remove("active");
  },

  // =========================================================================
  // VIEW: SHOP / CATALOG LISTING PAGE (PLP)
  // =========================================================================
  renderShop(container) {
    const selectedCategory = this.routeParams.category || "All";
    const selectedMode = this.routeParams.mode || "all";
    const selectedSort = this.routeParams.sort || "recommended";
    const selectedMaterial = this.routeParams.material || "all";

    // Filtering logic
    let filtered = PRODUCTS_DATA.filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (selectedMode === "buy" && p.availability === "Available to Rent") return false;
      if (selectedMode === "rent" && !p.rentPrice) return false;
      if (selectedMaterial !== "all") {
        if (!p.material.toLowerCase().includes(selectedMaterial.toLowerCase())) return false;
      }
      return true;
    });

    // Sorting logic
    if (selectedSort === "price-low") {
      filtered.sort((a, b) => a.buyPrice - b.buyPrice);
    } else if (selectedSort === "price-high") {
      filtered.sort((a, b) => b.buyPrice - a.buyPrice);
    } else if (selectedSort === "newest") {
      filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    const categoriesList = [
      "All",
      "Temple",
      "Shoe Rake",
      "Study Table",
      "Wooden Palang",
      "Sofa",
      "Dining Chair",
      "Dining Table",
      "Sofa Cum Bed",
      "Dressing Table",
      "Office Table",
      "Custom Furniture"
    ];

    container.innerHTML = `
      <div class="container">
        <!-- Breadcrumb & Header -->
        <div style="padding-top: var(--space-xl); margin-bottom: var(--space-lg);">
          <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 6px;">
            <a href="#home">Home</a> / <span>Shop Furniture</span>
          </div>
          <h1 style="font-size: 1.875rem; color: var(--color-primary-dark); font-weight: 700;">
            ${selectedCategory === "All" ? "All Handcrafted Furniture" : selectedCategory}
          </h1>
          <p style="font-size: 0.9375rem; color: var(--color-text-muted); margin-top: 4px;">
            Curated solid wood furniture designed for Indian homes. Available to buy or rent with doorstep installation.
          </p>
        </div>

        <div class="shop-page-layout">
          <!-- Sidebar Filters -->
          <aside class="filter-sidebar">
            <!-- Mode Filter -->
            <div class="filter-group">
              <div class="filter-title">Availability / Mode</div>
              <ul class="filter-options-list">
                <li>
                  <label class="filter-checkbox-label">
                    <input type="radio" name="shop-mode" value="all" ${selectedMode === 'all' ? 'checked' : ''} onchange="App.applyShopFilter('mode', 'all')">
                    All Furniture
                  </label>
                </li>
                <li>
                  <label class="filter-checkbox-label">
                    <input type="radio" name="shop-mode" value="buy" ${selectedMode === 'buy' ? 'checked' : ''} onchange="App.applyShopFilter('mode', 'buy')">
                    Available to Buy
                  </label>
                </li>
                <li>
                  <label class="filter-checkbox-label">
                    <input type="radio" name="shop-mode" value="rent" ${selectedMode === 'rent' ? 'checked' : ''} onchange="App.applyShopFilter('mode', 'rent')">
                    Available on Rent
                  </label>
                </li>
              </ul>
            </div>

            <!-- Category Filter (Strictly 10 core categories) -->
            <div class="filter-group">
              <div class="filter-title">Category</div>
              <ul class="filter-options-list">
                ${categoriesList.map((cat) => `
                  <li>
                    <label class="filter-checkbox-label">
                      <input type="radio" name="shop-cat" value="${cat}" ${selectedCategory === cat ? 'checked' : ''} onchange="App.applyShopFilter('category', '${cat}')">
                      ${cat}
                    </label>
                  </li>
                `).join("")}
              </ul>
            </div>

            <!-- Material Filter -->
            <div class="filter-group">
              <div class="filter-title">Wood & Material</div>
              <ul class="filter-options-list">
                <li>
                  <label class="filter-checkbox-label">
                    <input type="radio" name="shop-mat" value="all" ${selectedMaterial === 'all' ? 'checked' : ''} onchange="App.applyShopFilter('material', 'all')">
                    All Materials
                  </label>
                </li>
                <li>
                  <label class="filter-checkbox-label">
                    <input type="radio" name="shop-mat" value="Sheesham" ${selectedMaterial === 'Sheesham' ? 'checked' : ''} onchange="App.applyShopFilter('material', 'Sheesham')">
                    Solid Sheesham Wood
                  </label>
                </li>
                <li>
                  <label class="filter-checkbox-label">
                    <input type="radio" name="shop-mat" value="Teak" ${selectedMaterial === 'Teak' ? 'checked' : ''} onchange="App.applyShopFilter('material', 'Teak')">
                    Solid Teak Wood
                  </label>
                </li>
                <li>
                  <label class="filter-checkbox-label">
                    <input type="radio" name="shop-mat" value="Linen" ${selectedMaterial === 'Linen' ? 'checked' : ''} onchange="App.applyShopFilter('material', 'Linen')">
                    Textured Fabric / Linen
                  </label>
                </li>
              </ul>
            </div>

            <button class="btn btn-secondary btn-sm btn-block" onclick="App.resetShopFilters()">Reset All Filters</button>
          </aside>

          <!-- Main Catalog Content -->
          <div class="shop-main-content">
            <div class="shop-toolbar">
              <div class="shop-count">Showing <strong>${filtered.length}</strong> products</div>

              <div class="shop-sort-group">
                <label for="shop-sort" class="shop-sort-label">Sort by:</label>
                <select id="shop-sort" class="shop-sort-select" onchange="App.applyShopFilter('sort', this.value)">
                  <option value="recommended" ${selectedSort === 'recommended' ? 'selected' : ''}>Recommended</option>
                  <option value="newest" ${selectedSort === 'newest' ? 'selected' : ''}>Customer Rating</option>
                  <option value="price-low" ${selectedSort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                  <option value="price-high" ${selectedSort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
                </select>
              </div>
            </div>

            <!-- Product Grid -->
            ${filtered.length > 0 ? `
              <div class="product-grid">
                ${filtered.map((p) => this.renderProductCardHtml(p)).join("")}
              </div>
            ` : `
              <div style="padding: 48px; text-align: center; background-color: #FFFFFF; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <div style="font-size: 2.5rem; margin-bottom: 12px;">🪑</div>
                <h3 style="font-size: 1.125rem; color: var(--color-primary-dark); font-weight: 700;">No furniture matches your selected filters</h3>
                <p style="font-size: 0.875rem; color: var(--color-text-muted); margin: 6px 0 16px;">Try adjusting your filters or request custom furniture built for your room dimensions.</p>
                <button class="btn btn-primary btn-sm" onclick="App.resetShopFilters()">Clear Filters</button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  },

  applyShopFilter(key, value) {
    const currentParams = { ...this.routeParams };
    currentParams[key] = value;
    const queryString = Object.keys(currentParams)
      .map((k) => `${k}=${encodeURIComponent(currentParams[k])}`)
      .join("&");
    window.location.hash = `#shop?${queryString}`;
  },

  resetShopFilters() {
    window.location.hash = "#shop";
  },

  // =========================================================================
  // VIEW: PRODUCT DETAIL PAGE (PDP) — CRITICAL UX FOCUS
  // =========================================================================
  renderProductDetail(container) {
    const productId = this.routeParams.id || PRODUCTS_DATA[0].id;
    const product = PRODUCTS_DATA.find((p) => p.id === productId) || PRODUCTS_DATA[0];
    const initialMode = this.routeParams.mode === "rent" && product.rentPrice ? "rent" : "buy";

    // Related products (same room or category)
    const related = PRODUCTS_DATA.filter((p) => p.id !== product.id && (p.room === product.room || p.category === product.category)).slice(0, 4);

    container.innerHTML = `
      <div class="container pdp-container">
        <!-- Breadcrumb -->
        <div class="pdp-breadcrumb">
          <a href="#home">Home</a> / <a href="#shop">Shop</a> / <a href="#shop?category=${encodeURIComponent(product.category)}">${product.category}</a> / <span>${product.name}</span>
        </div>

        <div class="pdp-grid">
          <!-- LEFT: 6-Image Product Gallery -->
          <div class="pdp-gallery-wrap">
            <div class="pdp-main-image-box" id="pdp-main-box" onclick="App.zoomPdpImage()">
              <img src="${product.gallery[0] || product.image}" alt="${product.name}" id="pdp-active-img" class="pdp-main-image">
            </div>

            <div class="pdp-thumbnails">
              ${product.gallery.map((img, idx) => `
                <button class="pdp-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="App.switchPdpImage('${img}', this)">
                  <img src="${img}" alt="${product.name} view ${idx + 1}">
                </button>
              `).join("")}
            </div>

            <div style="font-size: 0.75rem; color: var(--color-text-muted); text-align: center;">
              🔍 Click on photo to view high-resolution zoom
            </div>
          </div>

          <!-- RIGHT: Product Details & Buy/Rent Interactive Matrix -->
          <div class="pdp-details-wrap">
            <div class="product-category-tag" style="margin-bottom: 4px;">${product.category}</div>
            <h1 class="pdp-title">${product.name}</h1>

            <div class="pdp-meta-row">
              <span class="pdp-rating-badge">★ ${product.rating}</span>
              <span class="pdp-reviews-count">${product.reviewsCount} verified customer reviews</span>
              <span style="color: #2F6F38; font-weight: 500; font-size: 0.8125rem;">✓ In Stock</span>
            </div>

            <p class="pdp-short-desc">${product.overview}</p>

            <!-- BUY / RENT SELECTION MATRIX -->
            <div class="pdp-mode-box">
              <div class="pdp-mode-selector">
                <button class="pdp-mode-option ${initialMode === 'buy' ? 'active' : ''}" id="pdp-opt-buy" onclick="App.setPdpMode('buy')">
                  BUY TO OWN
                </button>
                <button class="pdp-mode-option ${initialMode === 'rent' ? 'active' : ''}" id="pdp-opt-rent" onclick="App.setPdpMode('rent')" ${!product.rentPrice ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''}>
                  RENT MONTHLY ${!product.rentPrice ? '(Not Available)' : ''}
                </button>
              </div>

              <!-- Buy Mode Display -->
              <div id="pdp-buy-section" style="display: ${initialMode === 'buy' ? 'block' : 'none'};">
                <div class="pdp-buy-display">
                  <div class="pdp-price-large">₹${product.buyPrice.toLocaleString("en-IN")}</div>
                  <div class="pdp-price-tax-note">Inclusive of all taxes • Zero hidden charges • Free white-glove assembly</div>
                </div>
              </div>

              <!-- Rent Mode Display -->
              <div id="pdp-rent-section" style="display: ${initialMode === 'rent' ? 'block' : 'none'};">
                <div class="pdp-rent-display">
                  <div class="pdp-rent-rate-row">
                    <span class="pdp-rent-monthly" id="pdp-rent-val">₹${product.rentPrice ? product.rentPrice : 0}</span>
                    <span style="font-size: 0.875rem; color: var(--color-text-muted);">/ month</span>
                  </div>

                  <div class="pdp-tenure-picker">
                    <span class="pdp-tenure-label">Select Rental Tenure:</span>
                    <div class="pdp-tenure-options">
                      <button class="pdp-tenure-btn active" id="tenure-btn-3" onclick="App.setPdpRentTenure(${product.rentPrice || 0}, 3, ${product.rentDeposit || 1500})">
                        <div class="pdp-tenure-months">3 Months</div>
                        <div class="pdp-tenure-rate">₹${product.rentPrice}/mo</div>
                      </button>
                      <button class="pdp-tenure-btn" id="tenure-btn-6" onclick="App.setPdpRentTenure(${product.rentPrice || 0}, 6, ${product.rentDeposit || 1500})">
                        <div class="pdp-tenure-months">6 Months</div>
                        <div class="pdp-tenure-rate">₹${Math.round((product.rentPrice || 0) * 0.9)}/mo (10% off)</div>
                      </button>
                      <button class="pdp-tenure-btn" id="tenure-btn-12" onclick="App.setPdpRentTenure(${product.rentPrice || 0}, 12, ${product.rentDeposit || 1500})">
                        <div class="pdp-tenure-months">12 Months</div>
                        <div class="pdp-tenure-rate">₹${Math.round((product.rentPrice || 0) * 0.8)}/mo (20% off)</div>
                      </button>
                    </div>
                  </div>

                  <!-- Transparent Rental Breakdown Card -->
                  <div class="pdp-rent-breakdown-card">
                    <div class="breakdown-row">
                      <span>Monthly Rent:</span>
                      <strong id="pdp-breakdown-rent">₹${product.rentPrice}/mo</strong>
                    </div>
                    <div class="breakdown-row">
                      <span>Refundable Security Deposit:</span>
                      <strong>₹${(product.rentDeposit || 1500).toLocaleString("en-IN")}</strong>
                    </div>
                    <div class="breakdown-row">
                      <span>Delivery & Setup:</span>
                      <strong style="color: #2F6F38;">FREE (Included)</strong>
                    </div>
                    <div class="breakdown-row highlight">
                      <span>Payable today on ordering:</span>
                      <strong id="pdp-breakdown-total">₹${((product.rentPrice || 0) + (product.rentDeposit || 1500)).toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PINCODE / DELIVERY AVAILABILITY CHECKER -->
            <div class="pdp-pincode-card">
              <div class="pdp-pincode-title">Check Delivery & Installation Date</div>
              <div class="pdp-pincode-input-row">
                <input type="text" id="pdp-pincode-input" class="pdp-pincode-field" placeholder="Enter your 6-digit pincode" maxlength="6">
                <button class="btn btn-secondary btn-sm" onclick="App.checkPincodeDelivery()">Check</button>
              </div>
              <div id="pdp-pincode-result" class="pdp-pincode-feedback">
                Enter your pincode to verify free delivery and carpenter installation slot.
              </div>
            </div>

            <!-- Primary CTAs -->
            <div class="pdp-cta-group">
              <button class="btn btn-primary btn-lg" id="pdp-main-cta" onclick="App.handlePdpAddToCart('${product.id}')">
                ${initialMode === 'buy' ? 'Add to Cart' : 'Rent Now'}
              </button>
              <button class="btn btn-warm btn-lg" onclick="App.handlePdpBuyNow('${product.id}')">
                ${initialMode === 'buy' ? 'Buy Now' : 'Checkout Rental'}
              </button>
            </div>

            <!-- 6 Expandable Product Info Accordions -->
            <div class="pdp-accordions">
              <!-- 1. Product Details -->
              <div class="accordion-item active">
                <button class="accordion-header" onclick="App.toggleAccordion(this)">
                  <span>Product Specifications</span>
                  <span class="accordion-icon">▾</span>
                </button>
                <div class="accordion-body">
                  <table class="spec-table">
                    <tr><td>Material</td><td>${product.material}</td></tr>
                    <tr><td>Dimensions</td><td>${product.dimensions}</td></tr>
                    <tr><td>Weight</td><td>${product.weight}</td></tr>
                    <tr><td>Finish</td><td>${product.finish}</td></tr>
                    <tr><td>Color / Shade</td><td>${product.color}</td></tr>
                    <tr><td>Assembly</td><td>${product.assembly}</td></tr>
                    <tr><td>Warranty</td><td>${product.warranty}</td></tr>
                  </table>
                </div>
              </div>

              <!-- 2. What's Included -->
              <div class="accordion-item">
                <button class="accordion-header" onclick="App.toggleAccordion(this)">
                  <span>What's Included in the Box</span>
                  <span class="accordion-icon">▾</span>
                </button>
                <div class="accordion-body">
                  <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 6px;">
                    ${product.whatsIncluded.map((item) => `<li>${item}</li>`).join("")}
                  </ul>
                </div>
              </div>

              <!-- 3. Delivery & Installation -->
              <div class="accordion-item">
                <button class="accordion-header" onclick="App.toggleAccordion(this)">
                  <span>Delivery & Installation Process</span>
                  <span class="accordion-icon">▾</span>
                </button>
                <div class="accordion-body">
                  <p>${product.deliveryInfo}</p>
                  <p style="margin-top: 8px;"><strong>What happens after ordering:</strong> You receive an SMS & WhatsApp notification with technician details. Our team inspects the room, unpacks, installs the furniture, and clears away all packaging materials.</p>
                </div>
              </div>

              <!-- 4. Returns & Replacement -->
              <div class="accordion-item">
                <button class="accordion-header" onclick="App.toggleAccordion(this)">
                  <span>7-Day Return & Replacement Policy</span>
                  <span class="accordion-icon">▾</span>
                </button>
                <div class="accordion-body">
                  <p>${product.returnsInfo}</p>
                </div>
              </div>

              <!-- 5. Warranty Information -->
              <div class="accordion-item">
                <button class="accordion-header" onclick="App.toggleAccordion(this)">
                  <span>Warranty Coverage</span>
                  <span class="accordion-icon">▾</span>
                </button>
                <div class="accordion-body">
                  <p>Covers structural wood defects, termite resistance, and joint stability. Under ordinary residential usage, our seasoned hardwood is guaranteed for years.</p>
                </div>
              </div>

              <!-- 6. Wood Care Instructions -->
              <div class="accordion-item">
                <button class="accordion-header" onclick="App.toggleAccordion(this)">
                  <span>Care & Maintenance Guide</span>
                  <span class="accordion-icon">▾</span>
                </button>
                <div class="accordion-body">
                  <p>${product.careInstructions}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Reviews Section -->
        <section class="pdp-reviews-section">
          <div class="section-header">
            <div class="section-heading-group">
              <h2 class="section-title">Verified Customer Reviews</h2>
              <p class="section-subtitle">Real experiences from homes across India using Sonali Furniture.</p>
            </div>
          </div>

          <div class="reviews-grid">
            ${PRODUCT_REVIEWS.filter((r) => r.productId === product.id).length > 0 ? `
              ${PRODUCT_REVIEWS.filter((r) => r.productId === product.id).map((r) => `
                <div class="review-card">
                  <div class="review-header">
                    <div class="review-stars">★★★★★</div>
                    <div class="review-date">${r.date}</div>
                  </div>
                  <div class="review-title">${r.title}</div>
                  <p class="review-body">${r.text}</p>
                  <div class="review-author">✓ ${r.author} • ${r.city}</div>
                </div>
              `).join("")}
            ` : `
              ${PRODUCT_REVIEWS.slice(0, 3).map((r) => `
                <div class="review-card">
                  <div class="review-header">
                    <div class="review-stars">★★★★★</div>
                    <div class="review-date">${r.date}</div>
                  </div>
                  <div class="review-title">${r.title}</div>
                  <p class="review-body">${r.text}</p>
                  <div class="review-author">✓ ${r.author} • ${r.city}</div>
                </div>
              `).join("")}
            `}
          </div>
        </section>

        <!-- Related Products ("You may also like") -->
        ${related.length > 0 ? `
          <section class="section-block" style="padding-top: var(--space-3xl);">
            <div class="section-header">
              <h2 class="section-title">You may also like</h2>
              <a href="#shop?category=${encodeURIComponent(product.category)}" class="section-link">View More in ${product.category} →</a>
            </div>
            <div class="product-grid">
              ${related.map((p) => this.renderProductCardHtml(p)).join("")}
            </div>
          </section>
        ` : ""}
      </div>

      <!-- Mobile Sticky CTA Bar -->
      <div class="mobile-sticky-cta-bar">
        <div class="mobile-sticky-cta-inner">
          <div class="mobile-sticky-price">
            <span class="mobile-sticky-price-label">${initialMode === 'buy' ? 'Buy Price' : 'Monthly Rent'}</span>
            <span class="mobile-sticky-price-val" id="mobile-sticky-val">
              ${initialMode === 'buy' ? `₹${product.buyPrice.toLocaleString("en-IN")}` : `₹${product.rentPrice}/mo`}
            </span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="App.handlePdpAddToCart('${product.id}')" id="mobile-sticky-cta">
            ${initialMode === 'buy' ? 'Add to Cart' : 'Rent Now'}
          </button>
        </div>
      </div>
    `;

    this.currentPdpMode = initialMode;
    this.currentPdpTenure = 3;
    this.currentPdpProduct = product;
  },

  switchPdpImage(src, btn) {
    const mainImg = document.getElementById("pdp-active-img");
    if (mainImg) mainImg.src = src;
    document.querySelectorAll(".pdp-thumb-btn").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
  },

  zoomPdpImage() {
    const mainImg = document.getElementById("pdp-active-img");
    if (mainImg) {
      this.openQuickView(this.currentPdpProduct.id);
    }
  },

  setPdpMode(mode) {
    this.currentPdpMode = mode;
    const optBuy = document.getElementById("pdp-opt-buy");
    const optRent = document.getElementById("pdp-opt-rent");
    const buySection = document.getElementById("pdp-buy-section");
    const rentSection = document.getElementById("pdp-rent-section");
    const mainCta = document.getElementById("pdp-main-cta");
    const mobileStickyCta = document.getElementById("mobile-sticky-cta");
    const mobileStickyVal = document.getElementById("mobile-sticky-val");

    if (mode === "buy") {
      if (optBuy) optBuy.classList.add("active");
      if (optRent) optRent.classList.remove("active");
      if (buySection) buySection.style.display = "block";
      if (rentSection) rentSection.style.display = "none";
      if (mainCta) mainCta.textContent = "Add to Cart";
      if (mobileStickyCta) mobileStickyCta.textContent = "Add to Cart";
      if (mobileStickyVal && this.currentPdpProduct) {
        mobileStickyVal.textContent = `₹${this.currentPdpProduct.buyPrice.toLocaleString("en-IN")}`;
      }
    } else {
      if (optBuy) optBuy.classList.remove("active");
      if (optRent) optRent.classList.add("active");
      if (buySection) buySection.style.display = "none";
      if (rentSection) rentSection.style.display = "block";
      if (mainCta) mainCta.textContent = "Rent Now";
      if (mobileStickyCta) mobileStickyCta.textContent = "Rent Now";
      if (mobileStickyVal && this.currentPdpProduct) {
        const rate = CartState.calculateRentPrice(this.currentPdpProduct.rentPrice, this.currentPdpTenure);
        mobileStickyVal.textContent = `₹${rate}/mo`;
      }
    }
  },

  setPdpRentTenure(baseRate, tenure, deposit) {
    this.currentPdpTenure = tenure;
    document.querySelectorAll(".pdp-tenure-btn").forEach((b) => b.classList.remove("active"));
    const activeBtn = document.getElementById(`tenure-btn-${tenure}`);
    if (activeBtn) activeBtn.classList.add("active");

    const calculatedMonthly = CartState.calculateRentPrice(baseRate, tenure);
    const rentVal = document.getElementById("pdp-rent-val");
    const breakdownRent = document.getElementById("pdp-breakdown-rent");
    const breakdownTotal = document.getElementById("pdp-breakdown-total");
    const mobileStickyVal = document.getElementById("mobile-sticky-val");

    if (rentVal) rentVal.textContent = `₹${calculatedMonthly}`;
    if (breakdownRent) breakdownRent.textContent = `₹${calculatedMonthly}/mo`;
    if (breakdownTotal) breakdownTotal.textContent = `₹${(calculatedMonthly + deposit).toLocaleString("en-IN")}`;
    if (mobileStickyVal) mobileStickyVal.textContent = `₹${calculatedMonthly}/mo`;
  },

  checkPincodeDelivery() {
    const input = document.getElementById("pdp-pincode-input");
    const result = document.getElementById("pdp-pincode-result");
    if (!input || !result) return;

    const val = input.value.trim();
    if (!/^\d{6}$/.test(val)) {
      result.className = "pdp-pincode-feedback error";
      result.innerHTML = "⚠️ Please enter a valid 6-digit Indian postal code.";
      return;
    }

    result.className = "pdp-pincode-feedback success";
    result.innerHTML = `
      ✓ <strong>Delivery available to ${val}</strong><br>
      • Estimated delivery in <strong>5–7 business days</strong><br>
      • Free doorstep delivery & skilled carpenter installation included.
    `;
    CartState.showToast(`Delivery confirmed for pincode ${val}`);
  },

  toggleAccordion(btn) {
    const item = btn.closest(".accordion-item");
    if (item) {
      item.classList.toggle("active");
    }
  },

  handlePdpAddToCart(productId) {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return;
    CartState.addItem(product, this.currentPdpMode, this.currentPdpTenure);
  },

  handlePdpBuyNow(productId) {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return;
    CartState.addItem(product, this.currentPdpMode, this.currentPdpTenure);
    window.location.hash = "#cart";
  },

  // =========================================================================
  // VIEW: DEDICATED FURNITURE ON RENT PAGE
  // =========================================================================
  selectedRentCategory: "All",

  renderRentPage(container) {
    this.selectedRentCategory = this.routeParams.category || "All";
    const allRentalItems = PRODUCTS_DATA.filter((p) => p.rentPrice);

    // Unique non-duplicated categories for rent with their respective authentic photos
    const rentalCategories = [
      {
        id: "All",
        name: "All Rentals",
        count: allRentalItems.length,
        image: "assets/images/hero/hero_slide_1.jpg"
      },
      {
        id: "Sofa",
        name: "Sofa",
        count: allRentalItems.filter(p => p.category === "Sofa").length,
        image: "assets/images/products/sofa.jpg"
      },
      {
        id: "Wooden Palang",
        name: "Wooden Palang",
        count: allRentalItems.filter(p => p.category === "Wooden Palang").length,
        image: "assets/images/products/wooden_palang.jpg"
      },
      {
        id: "Study Table",
        name: "Study Table",
        count: allRentalItems.filter(p => p.category === "Study Table").length,
        image: "assets/images/products/study_table.jpg"
      },
      {
        id: "Dining Table",
        name: "Dining Table",
        count: allRentalItems.filter(p => p.category === "Dining Table").length,
        image: "assets/images/products/dining_table.jpg"
      },
      {
        id: "Dining Chair",
        name: "Dining Chair",
        count: allRentalItems.filter(p => p.category === "Dining Chair").length,
        image: "assets/images/products/dining_chair.jpg"
      },
      {
        id: "Sofa Cum Bed",
        name: "Sofa Cum Bed",
        count: allRentalItems.filter(p => p.category === "Sofa Cum Bed").length,
        image: "assets/images/products/sofa_cum_bed.jpg"
      },
      {
        id: "Dressing Table",
        name: "Dressing Table",
        count: allRentalItems.filter(p => p.category === "Dressing Table").length,
        image: "assets/images/products/dressing_table.jpg"
      },
      {
        id: "Office Table",
        name: "Office Table",
        count: allRentalItems.filter(p => p.category === "Office Table").length,
        image: "assets/images/products/office_table.jpg"
      },
      {
        id: "Shoe Rake",
        name: "Shoe Rake",
        count: allRentalItems.filter(p => p.category === "Shoe Rake").length,
        image: "assets/images/products/shoe_rack.jpg"
      }
    ];

    container.innerHTML = `
      <div class="container" style="padding: var(--space-xl) 0 var(--space-3xl);">
        <!-- Title & Subtitle -->
        <div style="text-align: center; max-width: 680px; margin: 0 auto var(--space-2xl);">
          <h1 style="font-size: 2.25rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 8px;">Furniture on Rent</h1>
          <p style="font-size: 1rem; color: var(--color-text-muted); line-height: 1.5;">
            Get the furniture you need without committing to a long-term purchase. Transparent pricing, refundable security deposit, and free doorstep maintenance.
          </p>

          <div style="margin-top: var(--space-lg); display: inline-flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-primary-dark);">Choose Rental Duration:</span>
            <div class="rental-tenure-tabs">
              <button class="rental-tab-btn ${this.activeRentTenure === 3 ? 'active' : ''}" onclick="App.setRentPageTenure(3)">3 Months</button>
              <button class="rental-tab-btn ${this.activeRentTenure === 6 ? 'active' : ''}" onclick="App.setRentPageTenure(6)">6 Months (10% Off)</button>
              <button class="rental-tab-btn ${this.activeRentTenure === 12 ? 'active' : ''}" onclick="App.setRentPageTenure(12)">12 Months (20% Off)</button>
            </div>
          </div>
        </div>

        <!-- Rental Benefits Bar -->
        <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-md) var(--space-xl); margin-bottom: var(--space-xl); display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; text-align: center;">
          <div>
            <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 0.9375rem;">₹0 Free Delivery</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Doorstep drop & setup</div>
          </div>
          <div>
            <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 0.9375rem;">100% Refundable Deposit</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Returned within 48h of pickup</div>
          </div>
          <div>
            <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 0.9375rem;">Free Doorstep Relocation</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Shifting homes? We move it free</div>
          </div>
          <div>
            <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 0.9375rem;">Rent to Own Option</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Convert rent into ownership</div>
          </div>
        </div>

        <!-- CIRCULAR OUTLINE IMAGE CATEGORY SELECTOR -->
        <div class="rental-category-box">
          <div class="rental-category-header">
            <div class="rental-category-heading">
              <span>Choose Category to Rent:</span>
            </div>
            <div class="rental-category-sub">Showing furniture available strictly for monthly rental</div>
          </div>

          <div class="rental-circle-categories">
            ${rentalCategories.map((c) => `
              <button class="rental-circle-item ${this.selectedRentCategory === c.id ? 'active' : ''}" onclick="App.setRentCategory('${c.id}')" data-cat="${c.id}">
                <div class="circle-img-wrap">
                  <img src="${c.image}" alt="${c.name}" loading="lazy">
                </div>
                <span class="circle-cat-name">${c.name}</span>
                <span class="circle-cat-count">${c.count} ${c.count === 1 ? 'item' : 'items'}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Filter Status Bar -->
        <div id="rental-status-bar" class="rental-filter-status-bar">
          <div>
            Showing <strong id="rental-status-count">${this.getFilteredRentItems().length}</strong> furniture items available on rent
            <span id="rental-status-desc">${this.getRentFilterDescription()}</span>
          </div>
          <div style="color: var(--color-primary); font-weight: 600;">
            ✓ Rental Plan: ${this.activeRentTenure} Months • 100% Refundable Deposit • Free Assembly
          </div>
        </div>

        <!-- Product Grid (Exclusively Rental Cards) -->
        <div class="product-grid" id="rent-page-grid">
          ${this.getFilteredRentItems().map((p) => this.renderRentalCardHtml(p, this.activeRentTenure)).join("")}
        </div>
      </div>
    `;
  },

  setRentCategory(category) {
    this.selectedRentCategory = category;

    // Update active circle classes
    document.querySelectorAll(".rental-circle-item").forEach((item) => {
      item.classList.toggle("active", item.getAttribute("data-cat") === category);
    });

    this.updateRentGrid();
  },

  getFilteredRentItems() {
    let items = PRODUCTS_DATA.filter((p) => p.rentPrice);
    if (this.selectedRentCategory && this.selectedRentCategory !== "All") {
      items = items.filter((p) => p.category === this.selectedRentCategory);
    }
    return items;
  },

  getRentFilterDescription() {
    if (this.selectedRentCategory && this.selectedRentCategory !== "All") {
      return `in <strong>${this.selectedRentCategory}</strong>`;
    }
    return "across all rental categories";
  },

  updateRentGrid() {
    const grid = document.getElementById("rent-page-grid");
    const countEl = document.getElementById("rental-status-count");
    const descEl = document.getElementById("rental-status-desc");
    const items = this.getFilteredRentItems();

    if (countEl) countEl.textContent = items.length;
    if (descEl) descEl.innerHTML = this.getRentFilterDescription();

    if (grid) {
      if (items.length > 0) {
        grid.innerHTML = items.map((p) => this.renderRentalCardHtml(p, this.activeRentTenure)).join("");
      } else {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 48px; text-align: center; background-color: #FFFFFF; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">🛋️</div>
            <h3 style="font-size: 1.125rem; color: var(--color-primary-dark); font-weight: 700;">No items found in this category for rent</h3>
            <p style="font-size: 0.875rem; color: var(--color-text-muted); margin: 6px 0 16px;">Try selecting "All Rentals" to view all available furniture.</p>
            <button class="btn btn-primary btn-sm" onclick="App.setRentCategory('All')">View All Rentals</button>
          </div>
        `;
      }
    }
  },

  setRentPageTenure(tenure) {
    this.activeRentTenure = tenure;
    document.querySelectorAll(".rental-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.textContent.startsWith(tenure.toString()));
    });
    this.updateRentGrid();
  },

  // =========================================================================
  // VIEW: CUSTOM FURNITURE PAGE
  // =========================================================================
  renderCustomPage(container) {
    container.innerHTML = `
      <section class="custom-page-hero">
        <div class="container">
          <div style="max-width: 640px;">
            <div style="font-size: 0.8125rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Bespoke Carpentry</div>
            <h1 style="font-size: 2.25rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 8px;">Let's build something for your space.</h1>
            <p style="font-size: 1rem; color: var(--color-text-muted); line-height: 1.5;">
              Tell us what you have in mind and we'll help create furniture around your space, measurements and style. Handcrafted in solid Sheesham and Teak wood.
            </p>
          </div>
        </div>
      </section>

      <div class="container">
        <div class="custom-grid-layout">
          <!-- Left: Clean Request Form -->
          <div class="custom-form-card">
            <h2 style="font-size: 1.25rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: var(--space-lg); border-bottom: 1px solid var(--color-border); padding-bottom: 10px;">
              Custom Furniture Request
            </h2>

            <form id="custom-request-form" onsubmit="App.handleCustomSubmit(event)">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                <div class="form-group">
                  <label class="form-label" for="cust-name">Your Full Name *</label>
                  <input type="text" id="cust-name" class="form-control" placeholder="e.g. Ramesh Kumar" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="cust-phone">WhatsApp / Phone Number *</label>
                  <input type="tel" id="cust-phone" class="form-control" placeholder="+91 95043 26798" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="cust-email">Email Address</label>
                <input type="email" id="cust-email" class="form-control" placeholder="name@example.com">
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                <div class="form-group">
                  <label class="form-label" for="cust-type">Furniture Type *</label>
                  <select id="cust-type" class="form-control" required onchange="App.updateCustomEstimate()">
                    <option value="">Select Category</option>
                    <option value="Wooden Palang / Bed">Wooden Palang / Bed</option>
                    <option value="Sofa / Seating">Sofa / Living Seating</option>
                    <option value="Study Table / Desk">Study Table / Office Desk</option>
                    <option value="Dining Table">Dining Table Set</option>
                    <option value="Temple / Pooja Mandir">Temple (Pooja Mandir)</option>
                    <option value="Shoe Rake / Console">Shoe Rake / Console</option>
                    <option value="Dressing Table">Dressing Table</option>
                    <option value="Other Custom Cabinetry">Other Bespoke Unit</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="cust-wood">Preferred Wood *</label>
                  <select id="cust-wood" class="form-control" required onchange="App.updateCustomEstimate()">
                    <option value="Solid Sheesham Wood">Solid Sheesham (Indian Rosewood)</option>
                    <option value="Solid Teak Wood">Solid Teak Wood (Sagwan)</option>
                    <option value="Solid Sal Wood">Solid Sal Wood</option>
                    <option value="Architectural White Oak">Architectural White Oak</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="cust-dimensions">Approximate Dimensions (Length x Width x Height)</label>
                <input type="text" id="cust-dimensions" class="form-control" placeholder="e.g. 72 inch Length x 36 inch Width x 30 inch Height" oninput="App.updateCustomEstimate()">
                <span class="form-hint">Mention in inches or feet. If unsure, our carpenter can take room measurements.</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="cust-budget">Estimated Budget Range</label>
                <select id="cust-budget" class="form-control">
                  <option value="₹15,000 - ₹25,000">₹15,000 - ₹25,000</option>
                  <option value="₹25,000 - ₹45,000">₹25,000 - ₹45,000</option>
                  <option value="₹45,000 - ₹75,000">₹45,000 - ₹75,000</option>
                  <option value="₹75,000+">₹75,000+ (Extensive Bespoke Project)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="cust-notes">Additional Requirements & Design Preferences</label>
                <textarea id="cust-notes" class="form-control" rows="3" placeholder="Tell us about storage needs, finish color, or space constraints..."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Upload Reference Photo / Sketch (Optional)</label>
                <input type="file" id="cust-file" class="form-control" accept="image/*">
                <span class="form-hint">Accepted formats: JPG, PNG, PDF up to 10MB</span>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: var(--space-md);">
                Send Request
              </button>
            </form>
          </div>

          <!-- Right: Instant Estimate Card & Direct Talk -->
          <div class="custom-sidebar-card">
            <!-- Dynamic Estimate Card -->
            <div class="custom-estimate-preview">
              <h3 style="font-size: 1.0625rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 6px;">
                Instant Ballpark Calculator
              </h3>
              <p style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 14px;">
                Estimated price based on chosen hardwood and typical dimensions.
              </p>

              <div style="font-size: 1.75rem; font-weight: 700; color: var(--color-primary-dark);" id="cust-est-val">
                ₹18,500 – ₹24,000
              </div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 4px;">
                Includes wood seasoning, hand-rubbed finish, and free doorstep assembly.
              </div>

              <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed var(--color-secondary); font-size: 0.8125rem; color: var(--color-primary-dark);">
                ✓ 100% Solid Hardwood<br>
                ✓ 5-Year Craftsmanship Guarantee<br>
                ✓ On-site millimeter fitting
              </div>
            </div>

            <!-- Prefer to talk -->
            <div class="custom-contact-options">
              <h3 style="font-size: 1.0625rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 4px;">
                Prefer to talk?
              </h3>
              <p style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 16px;">
                <span style="font-style: italic; color: var(--color-primary);">Aapke space ke liye custom furniture chahiye?</span> Speak directly with our master carpenter.
              </p>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                <a href="tel:+919504326798" class="btn btn-secondary btn-block">
                  📞 Call +91 95043 26798
                </a>
                <a href="https://wa.me/919504326798?text=Hello%20Sonali%20Furniture%2C%20I%20want%20to%20discuss%20a%20custom%20furniture%20project." target="_blank" class="btn btn-primary btn-block">
                  💬 WhatsApp Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  updateCustomEstimate() {
    const type = document.getElementById("cust-type")?.value || "";
    const wood = document.getElementById("cust-wood")?.value || "";
    const estVal = document.getElementById("cust-est-val");
    if (!estVal) return;

    let base = 18000;
    if (type.includes("Palang")) base = 34000;
    else if (type.includes("Dining")) base = 28000;
    else if (type.includes("Sofa")) base = 30000;
    else if (type.includes("Study")) base = 15000;
    else if (type.includes("Temple")) base = 20000;
    else if (type.includes("Shoe")) base = 12000;

    if (wood.includes("Teak")) base = Math.round(base * 1.25);
    if (wood.includes("Oak")) base = Math.round(base * 1.35);

    estVal.textContent = `₹${base.toLocaleString("en-IN")} – ₹${Math.round(base * 1.3).toLocaleString("en-IN")}`;
  },

  handleCustomSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("cust-name")?.value;
    const phone = document.getElementById("cust-phone")?.value;
    const type = document.getElementById("cust-type")?.value;

    CartState.showToast(`Thank you ${name}! Custom furniture request received.`);

    let modal = document.getElementById("custom-success-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "custom-success-modal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-dialog" style="max-width: 480px; text-align: center; padding: var(--space-2xl);">
        <div style="font-size: 3rem; color: #2F6F38; margin-bottom: 12px;">✓</div>
        <h2 style="font-size: 1.5rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 8px;">Request Received</h2>
        <p style="font-size: 0.9375rem; color: var(--color-text-muted); line-height: 1.45; margin-bottom: var(--space-lg);">
          Thank you <strong>${name}</strong>. Our custom furniture specialist will contact you on <strong>${phone}</strong> within 4 hours to review your dimensions and share wood samples.
        </p>
        <button class="btn btn-primary btn-block" onclick="document.getElementById('custom-success-modal').classList.remove('active'); window.location.hash='#shop';">
          Continue Browsing
        </button>
      </div>
    `;

    modal.classList.add("active");
  },

  // =========================================================================
  // VIEW: CART PAGE
  // =========================================================================
  renderCart(container) {
    const cart = CartState.getCart();
    const totals = CartState.getCartTotals();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="container" style="padding: 60px 0 80px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 16px;">🛒</div>
          <h1 style="font-size: 1.75rem; color: var(--color-primary-dark); font-weight: 700;">Your Cart is Empty</h1>
          <p style="font-size: 0.9375rem; color: var(--color-text-muted); margin: 8px auto 24px; max-width: 400px;">
            Explore our solid wood furniture available to buy or rent with free delivery and installation.
          </p>
          <a href="#shop" class="btn btn-primary">Start Exploring Furniture</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="container" style="padding-top: var(--space-xl);">
        <h1 style="font-size: 1.875rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: var(--space-lg);">
          Your Cart (${totals.totalItems} ${totals.totalItems === 1 ? 'item' : 'items'})
        </h1>

        <div class="cart-layout">
          <!-- Cart Items Table -->
          <div class="cart-items-table">
            ${cart.map((item, idx) => `
              <div class="cart-item-card">
                <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">

                <div class="cart-item-meta">
                  <span class="cart-item-badge ${item.mode === 'rent' ? 'style="background-color: var(--color-primary); color: #fff;"' : ''}">
                    ${item.mode === 'rent' ? `Rent (${item.tenureMonths} Months)` : 'Buy'}
                  </span>
                  <div class="cart-item-title">${item.name}</div>
                  <div style="font-size: 0.75rem; color: var(--color-text-muted);">
                    Category: ${item.category}
                    ${item.mode === 'rent' ? ` • Refundable Deposit: ₹${item.deposit.toLocaleString("en-IN")}` : ""}
                  </div>
                  <button class="cart-item-remove-btn" onclick="App.removeCartItem(${idx})">✕ Remove</button>
                </div>

                <div class="cart-qty-ctrl">
                  <button class="cart-qty-btn" onclick="App.updateCartQty(${idx}, ${item.quantity - 1})">-</button>
                  <span class="cart-qty-val">${item.quantity}</span>
                  <button class="cart-qty-btn" onclick="App.updateCartQty(${idx}, ${item.quantity + 1})">+</button>
                </div>

                <div class="cart-item-price-col">
                  <div class="cart-item-price-val">₹${(item.unitPrice * item.quantity).toLocaleString("en-IN")}${item.mode === 'rent' ? '/mo' : ''}</div>
                  <span style="font-size: 0.6875rem; color: var(--color-text-muted);">
                    ${item.quantity > 1 ? `(₹${item.unitPrice.toLocaleString("en-IN")} each)` : ''}
                  </span>
                </div>
              </div>
            `).join("")}

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-md);">
              <a href="#shop" class="btn btn-secondary btn-sm">← Continue Shopping</a>
              <button class="btn btn-secondary btn-sm" onclick="App.clearAllCart()">Clear Cart</button>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="order-summary-box">
            <h2 class="summary-title">Order Summary</h2>

            <div class="summary-row">
              <span>Items Total:</span>
              <span>₹${totals.subtotal.toLocaleString("en-IN")}</span>
            </div>

            ${totals.totalDeposit > 0 ? `
              <div class="summary-row">
                <span>Rental Security Deposit:</span>
                <span>₹${totals.totalDeposit.toLocaleString("en-IN")}</span>
              </div>
              <div style="font-size: 0.6875rem; color: #2F6F38; margin-top: -6px;">
                ✓ 100% Refundable upon rental completion
              </div>
            ` : ""}

            <div class="summary-row">
              <span>Delivery & Installation:</span>
              <span style="color: #2F6F38; font-weight: 600;">FREE</span>
            </div>

            <div class="summary-row total">
              <span>Payable Now:</span>
              <span>₹${totals.grandTotal.toLocaleString("en-IN")}</span>
            </div>

            <a href="#checkout" class="btn btn-primary btn-block btn-lg" style="margin-top: var(--space-md);">
              Proceed to Checkout
            </a>

            <div style="font-size: 0.75rem; color: var(--color-text-muted); text-align: center; margin-top: 8px;">
              🛡️ Safe & Encrypted Checkout • Zero Hidden Charges
            </div>
          </div>
        </div>
      </div>
    `;
  },

  updateCartQty(idx, qty) {
    CartState.updateQuantity(idx, qty);
    this.renderCart(document.getElementById("app-root"));
  },

  removeCartItem(idx) {
    CartState.removeItem(idx);
    this.renderCart(document.getElementById("app-root"));
  },

  clearAllCart() {
    if (confirm("Are you sure you want to empty your cart?")) {
      CartState.clearCart();
      this.renderCart(document.getElementById("app-root"));
    }
  },

  // =========================================================================
  // VIEW: CHECKOUT FLOW (4-Step Wizard)
  // =========================================================================
  renderCheckout(container) {
    const cart = CartState.getCart();
    if (cart.length === 0) {
      window.location.hash = "#cart";
      return;
    }

    const totals = CartState.getCartTotals();

    container.innerHTML = `
      <div class="container" style="padding: var(--space-xl) 0 var(--space-3xl);">
        <div style="margin-bottom: var(--space-xl);">
          <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 4px;">
            <a href="#cart">← Back to Cart</a>
          </div>
          <h1 style="font-size: 1.875rem; color: var(--color-primary-dark); font-weight: 700;">Checkout</h1>
          <p style="font-size: 0.875rem; color: var(--color-text-muted);">
            No account required. Complete your order in 4 quick steps.
          </p>
        </div>

        <form id="checkout-form" onsubmit="App.handlePlaceOrder(event)">
          <div class="cart-layout">
            <!-- 4-Step Stepper Blocks -->
            <div class="checkout-stepper-wrap">
              <!-- Step 1: Delivery Address -->
              <div class="checkout-step-block">
                <div class="step-header-row">
                  <div class="step-indicator-badge">1</div>
                  <div>
                    <h2 style="font-size: 1.125rem; font-weight: 700; color: var(--color-primary-dark);">Delivery Address</h2>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">Where should we deliver and assemble your furniture?</div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                  <div class="form-group">
                    <label class="form-label" for="chk-name">Full Name *</label>
                    <input type="text" id="chk-name" class="form-control" required placeholder="Abhay Kumar Singh" value="Abhay Kumar Singh">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="chk-phone">Phone Number (for delivery updates) *</label>
                    <input type="tel" id="chk-phone" class="form-control" required placeholder="+91 95043 26798" value="+91 95043 26798">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="chk-address">Street Address / House No / Apartment *</label>
                  <input type="text" id="chk-address" class="form-control" required placeholder="923G+35G, Sonali Furniture, Pali road, near karpuri chowk" value="923G+35G, Sonali Furniture, Pali road, near karpuri chowk">
                </div>

                <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: var(--space-md);">
                  <div class="form-group">
                    <label class="form-label" for="chk-city">City *</label>
                    <input type="text" id="chk-city" class="form-control" required placeholder="Masaurhi" value="Masaurhi">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="chk-state">State *</label>
                    <input type="text" id="chk-state" class="form-control" required placeholder="Bihar" value="Bihar">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="chk-pin">Pincode *</label>
                    <input type="text" id="chk-pin" class="form-control" required placeholder="804452" value="804452" maxlength="6">
                  </div>
                </div>
              </div>

              <!-- Step 2: Delivery & Installation Slot -->
              <div class="checkout-step-block">
                <div class="step-header-row">
                  <div class="step-indicator-badge">2</div>
                  <div>
                    <h2 style="font-size: 1.125rem; font-weight: 700; color: var(--color-primary-dark);">Delivery & Assembly Schedule</h2>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">Choose when you want our carpentry technician to assemble</div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                  <div class="form-group">
                    <label class="form-label" for="chk-slot-date">Preferred Delivery Day</label>
                    <select id="chk-slot-date" class="form-control">
                      <option value="Standard (5–7 Business Days)">Standard (5–7 Business Days)</option>
                      <option value="Saturday Morning (Free Setup)">Saturday Morning (10 AM - 1 PM)</option>
                      <option value="Sunday Afternoon (Free Setup)">Sunday Afternoon (2 PM - 6 PM)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="chk-elevator">Floor / Elevator Availability</label>
                    <select id="chk-elevator" class="form-control">
                      <option value="Ground floor or elevator available">Ground floor or elevator available</option>
                      <option value="Stairs only (Up to 3rd floor)">Stairs only (Up to 3rd floor)</option>
                      <option value="Stairs only (4th floor or higher)">Stairs only (4th floor or higher)</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Step 3: Payment Method -->
              <div class="checkout-step-block">
                <div class="step-header-row">
                  <div class="step-indicator-badge">3</div>
                  <div>
                    <h2 style="font-size: 1.125rem; font-weight: 700; color: var(--color-primary-dark);">Payment Method</h2>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">100% secure payment gateway</div>
                  </div>
                </div>

                <div class="payment-options-grid">
                  <div class="payment-radio-card active" onclick="App.selectPaymentMethod(this, 'UPI (Google Pay / PhonePe / Paytm)')">
                    <input type="radio" name="pay-method" value="UPI" checked style="display: none;">
                    <strong>📱 UPI QR / App</strong>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">Google Pay, PhonePe, Paytm</span>
                  </div>

                  <div class="payment-radio-card" onclick="App.selectPaymentMethod(this, 'Credit / Debit Card')">
                    <input type="radio" name="pay-method" value="Card" style="display: none;">
                    <strong>💳 Credit / Debit Card</strong>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">Visa, MasterCard, RuPay</span>
                  </div>

                  <div class="payment-radio-card" onclick="App.selectPaymentMethod(this, 'Net Banking')">
                    <input type="radio" name="pay-method" value="NetBanking" style="display: none;">
                    <strong>🏦 Net Banking</strong>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">All major Indian banks</span>
                  </div>

                  <div class="payment-radio-card" onclick="App.selectPaymentMethod(this, 'Pay on Delivery')">
                    <input type="radio" name="pay-method" value="POD" style="display: none;">
                    <strong>💵 Pay on Delivery</strong>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">Pay upon carpenter inspection</span>
                  </div>
                </div>
              </div>

              <!-- Step 4: Review -->
              <div class="checkout-step-block">
                <div class="step-header-row">
                  <div class="step-indicator-badge">4</div>
                  <div>
                    <h2 style="font-size: 1.125rem; font-weight: 700; color: var(--color-primary-dark);">Review & Confirm</h2>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">By placing order you agree to our 7-day return policy</div>
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.8125rem; color: var(--color-text-muted);">
                  <div>✓ Free delivery & carpenter installation included.</div>
                  <div>✓ You will receive an SMS and WhatsApp invoice with tracking link.</div>
                  ${totals.hasRentals ? `<div>✓ Rental security deposit will be fully refunded within 48 hours of tenure completion.</div>` : ""}
                </div>
              </div>
            </div>

            <!-- Right: Order Summary Sidebar -->
            <div class="order-summary-box">
              <h2 class="summary-title">Summary (${totals.totalItems} items)</h2>

              <div style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-bottom: 8px; border-bottom: 1px solid var(--color-border);">
                ${cart.map((i) => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
                    <span>${i.name} (x${i.quantity})</span>
                    <strong>₹${(i.unitPrice * i.quantity).toLocaleString("en-IN")}</strong>
                  </div>
                `).join("")}
              </div>

              <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${totals.subtotal.toLocaleString("en-IN")}</span>
              </div>

              ${totals.totalDeposit > 0 ? `
                <div class="summary-row">
                  <span>Refundable Deposit:</span>
                  <span>₹${totals.totalDeposit.toLocaleString("en-IN")}</span>
                </div>
              ` : ""}

              <div class="summary-row">
                <span>Delivery:</span>
                <span style="color: #2F6F38; font-weight: 600;">FREE</span>
              </div>

              <div class="summary-row total">
                <span>Total Payable:</span>
                <span>₹${totals.grandTotal.toLocaleString("en-IN")}</span>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: var(--space-md);">
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    `;

    this.selectedPaymentMethod = "UPI (Google Pay / PhonePe / Paytm)";
  },

  selectPaymentMethod(cardEl, method) {
    document.querySelectorAll(".payment-radio-card").forEach((c) => c.classList.remove("active"));
    cardEl.classList.add("active");
    this.selectedPaymentMethod = method;
  },

  handlePlaceOrder(e) {
    e.preventDefault();
    const cart = CartState.getCart();
    const totals = CartState.getCartTotals();

    const name = document.getElementById("chk-name")?.value || "Valued Customer";
    const phone = document.getElementById("chk-phone")?.value || "";
    const address = document.getElementById("chk-address")?.value || "";
    const city = document.getElementById("chk-city")?.value || "Masaurhi";
    const state = document.getElementById("chk-state")?.value || "Bihar";
    const pincode = document.getElementById("chk-pin")?.value || "804452";

    // Generate readable Order ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SF-${randomNum}`;

    const orderRecord = {
      orderId: orderId,
      createdAt: new Date().toISOString(),
      expectedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      status: "Order Confirmed",
      statusStep: 1, // 1: Confirmed, 2: Preparing, 3: Out for delivery, 4: Delivered
      customer: { name, phone, address, city, state, pincode },
      items: cart,
      paymentMethod: this.selectedPaymentMethod,
      totalAmount: totals.grandTotal,
      isRental: totals.hasRentals,
      rentalDetails: totals.hasRentals ? {
        startDate: "Immediate",
        tenure: "Selected Tenure",
        nextBilling: "In 30 days",
        endDate: "After tenure"
      } : null
    };

    CartState.createOrder(orderRecord);
    CartState.showToast(`Order #${orderId} Placed Successfully!`, "success");
    window.location.hash = `#order-success?id=${orderId}`;
  },

  // =========================================================================
  // VIEW: ORDER CONFIRMATION
  // =========================================================================
  renderOrderSuccess(container) {
    const orderId = this.routeParams.id;
    const orders = CartState.getOrders();
    const order = orders.find((o) => o.orderId === orderId) || orders[0];

    container.innerHTML = `
      <div class="container" style="max-width: 680px; padding: var(--space-3xl) var(--space-md);">
        <div class="order-success-hero">
          <div class="order-success-icon">✓</div>
          <h1 style="font-size: 2rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 6px;">Order Confirmed!</h1>
          <p style="font-size: 1rem; color: var(--color-text-muted);">
            Thank you, <strong>${order.customer.name}</strong>. Your order has been placed successfully.
          </p>
        </div>

        <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-xl); box-shadow: var(--shadow-sm); margin-bottom: var(--space-xl);">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; margin-bottom: 16px;">
            <div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">ORDER NUMBER</div>
              <div style="font-size: 1.125rem; font-weight: 700; color: var(--color-primary-dark);">${order.orderId}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">EXPECTED DELIVERY</div>
              <div style="font-size: 1rem; font-weight: 700; color: #2F6F38;">${order.expectedDelivery}</div>
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <div style="font-size: 0.8125rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 8px;">Delivery & Installation Address:</div>
            <div style="font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.4;">
              ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}<br>
              Phone: ${order.customer.phone}
            </div>
          </div>

          <div style="border-top: 1px solid var(--color-border); padding-top: 12px;">
            <div style="font-size: 0.8125rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 8px;">Ordered Items:</div>
            ${order.items.map((i) => `
              <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 6px;">
                <span>${i.name} (x${i.quantity}) [${i.mode.toUpperCase()}]</span>
                <strong>₹${(i.unitPrice * i.quantity).toLocaleString("en-IN")}</strong>
              </div>
            `).join("")}
          </div>

          <div style="border-top: 1px solid var(--color-border); padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; font-size: 1rem; font-weight: 700; color: var(--color-primary-dark);">
            <span>Total Paid:</span>
            <span>₹${order.totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center;">
          <a href="#track-order?id=${order.orderId}" class="btn btn-primary">Track Order</a>
          <a href="#home" class="btn btn-secondary">Continue Shopping</a>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // VIEW: ORDER TRACKING
  // =========================================================================
  renderTracking(container) {
    const orders = CartState.getOrders();
    const queryId = this.routeParams.id;
    const currentOrder = orders.find((o) => o.orderId === queryId) || orders[0];

    container.innerHTML = `
      <div class="container" style="padding: var(--space-xl) 0 var(--space-3xl);">
        <div style="text-align: center; max-width: 600px; margin: 0 auto var(--space-lg);">
          <h1 style="font-size: 2rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 6px;">Track Your Furniture Order</h1>
          <p style="font-size: 0.9375rem; color: var(--color-text-muted);">
            Real-time status of your woodworking fabrication, dispatch and carpenter assembly.
          </p>

          <div style="display: flex; gap: 8px; margin-top: 16px; max-width: 400px; margin-left: auto; margin-right: auto;">
            <input type="text" id="track-id-input" class="form-control" placeholder="Enter Order # (e.g. SF-1024)" value="${currentOrder.orderId}">
            <button class="btn btn-primary btn-sm" onclick="App.searchTrackOrder()">Track</button>
          </div>
        </div>

        <!-- Tracking Card -->
        <div class="tracking-card">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 16px;">
            <div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">ORDER ID</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary-dark);">${currentOrder.orderId}</div>
            </div>
            <div style="text-align: right;">
              <span class="product-badge" style="background-color: var(--color-primary);">${currentOrder.status}</span>
            </div>
          </div>

          <!-- Stepper UI -->
          <div class="tracking-stepper">
            <div class="tracking-step-node ${currentOrder.statusStep >= 1 ? 'completed' : ''}">
              <div class="tracking-circle">${currentOrder.statusStep > 1 ? '✓' : '1'}</div>
              <div class="tracking-label">Order Confirmed</div>
            </div>

            <div class="tracking-step-node ${currentOrder.statusStep >= 2 ? (currentOrder.statusStep > 2 ? 'completed' : 'current') : ''}">
              <div class="tracking-circle">${currentOrder.statusStep > 2 ? '✓' : '2'}</div>
              <div class="tracking-label">In Workshop</div>
            </div>

            <div class="tracking-step-node ${currentOrder.statusStep >= 3 ? (currentOrder.statusStep > 3 ? 'completed' : 'current') : ''}">
              <div class="tracking-circle">${currentOrder.statusStep > 3 ? '✓' : '●'}</div>
              <div class="tracking-label">Out for Delivery</div>
            </div>

            <div class="tracking-step-node ${currentOrder.statusStep >= 4 ? 'completed' : ''}">
              <div class="tracking-circle">4</div>
              <div class="tracking-label">Delivered & Assembled</div>
            </div>
          </div>

          <!-- Estimated Delivery & Address -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background-color: var(--color-bg-base); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 20px;">
            <div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">ESTIMATED DELIVERY</div>
              <div style="font-size: 1rem; font-weight: 700; color: var(--color-primary-dark);">${currentOrder.expectedDelivery}</div>
              <div style="font-size: 0.75rem; color: #2F6F38; margin-top: 2px;">Carpenter assembly team assigned</div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">DELIVERING TO</div>
              <div style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-main);">${currentOrder.customer.name}</div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">${currentOrder.customer.address}, ${currentOrder.customer.city}</div>
            </div>
          </div>

          <!-- Rental Schedule Info if Rental -->
          ${currentOrder.isRental && currentOrder.rentalDetails ? `
            <div style="border: 1px solid var(--color-secondary); background-color: var(--color-secondary-light); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 20px;">
              <div style="font-size: 0.8125rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 8px;">Active Rental Schedule</div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 0.75rem;">
                <div>
                  <span style="color: var(--color-text-muted);">Tenure:</span><br>
                  <strong>${currentOrder.rentalDetails.tenure}</strong>
                </div>
                <div>
                  <span style="color: var(--color-text-muted);">Rental Start:</span><br>
                  <strong>${currentOrder.rentalDetails.startDate}</strong>
                </div>
                <div>
                  <span style="color: var(--color-text-muted);">Next Billing:</span><br>
                  <strong>${currentOrder.rentalDetails.nextBilling}</strong>
                </div>
                <div>
                  <span style="color: var(--color-text-muted);">Tenure End:</span><br>
                  <strong>${currentOrder.rentalDetails.endDate}</strong>
                </div>
              </div>
            </div>
          ` : ""}

          <!-- Support Contact Snippet -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--color-border); padding-top: 16px; flex-wrap: wrap; gap: 12px;">
            <div style="font-size: 0.8125rem; color: var(--color-text-muted);">
              Need delivery slot rescheduling or special instructions?
            </div>
            <div style="display: flex; gap: 10px;">
              <a href="tel:+919504326798" class="btn btn-secondary btn-sm">Call Logistics</a>
              <a href="https://wa.me/919504326798?text=Tracking%20Order%20${currentOrder.orderId}" target="_blank" class="btn btn-primary btn-sm">WhatsApp Support</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  searchTrackOrder() {
    const input = document.getElementById("track-id-input");
    if (!input) return;
    const query = input.value.trim().toUpperCase();
    const orders = CartState.getOrders();
    const found = orders.find((o) => o.orderId === query);

    if (found) {
      window.location.hash = `#track-order?id=${found.orderId}`;
    } else {
      CartState.showToast(`Order "${query}" not found. Showing sample order #SF-1024.`);
      window.location.hash = `#track-order?id=SF-1024`;
    }
  },

  // =========================================================================
  // VIEW: ACCOUNT DASHBOARD
  // =========================================================================
  renderAccount(container) {
    const orders = CartState.getOrders();
    const wishlist = CartState.getWishlist();

    container.innerHTML = `
      <div class="container" style="padding: var(--space-xl) 0 var(--space-3xl);">
        <h1 style="font-size: 1.875rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: var(--space-lg);">My Account</h1>

        <div class="account-layout">
          <!-- Sidebar Tabs -->
          <aside>
            <ul class="account-nav-list">
              <li><button class="account-nav-btn active" onclick="App.switchAccountTab('orders', this)">📦 My Orders (${orders.length})</button></li>
              <li><button class="account-nav-btn" onclick="App.switchAccountTab('rentals', this)">🔄 Active Rentals (${orders.filter(o => o.isRental).length})</button></li>
              <li><button class="account-nav-btn" onclick="App.switchAccountTab('wishlist', this)">❤️ Wishlist (${wishlist.length})</button></li>
              <li><button class="account-nav-btn" onclick="App.switchAccountTab('addresses', this)">📍 Saved Addresses</button></li>
              <li><button class="account-nav-btn" onclick="App.switchAccountTab('profile', this)">👤 Profile Settings</button></li>
            </ul>
          </aside>

          <!-- Tab Content Area -->
          <div id="account-tab-content">
            <!-- Default Tab: Orders -->
            <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-xl);">
              <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: var(--space-md);">Recent Orders</h2>
              ${orders.map((o) => `
                <div style="border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                  <div>
                    <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 1rem;">Order #${o.orderId}</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">${o.items.length} items • Expected Delivery: ${o.expectedDelivery}</div>
                    <div style="font-size: 0.8125rem; color: var(--color-text-main); font-weight: 500; margin-top: 4px;">Total: ₹${o.totalAmount.toLocaleString("en-IN")}</div>
                  </div>
                  <div style="display: flex; gap: 8px;">
                    <a href="#track-order?id=${o.orderId}" class="btn btn-secondary btn-sm">Track Progress</a>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  switchAccountTab(tab, btn) {
    document.querySelectorAll(".account-nav-btn").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    const container = document.getElementById("account-tab-content");
    if (!container) return;

    const orders = CartState.getOrders();
    const wishlist = CartState.getWishlist();

    if (tab === "orders") {
      container.innerHTML = `
        <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-xl);">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: var(--space-md);">Recent Orders</h2>
          ${orders.map((o) => `
            <div style="border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 1rem;">Order #${o.orderId}</div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted);">${o.items.length} items • Expected Delivery: ${o.expectedDelivery}</div>
                <div style="font-size: 0.8125rem; color: var(--color-text-main); font-weight: 500; margin-top: 4px;">Total: ₹${o.totalAmount.toLocaleString("en-IN")}</div>
              </div>
              <div style="display: flex; gap: 8px;">
                <a href="#track-order?id=${o.orderId}" class="btn btn-secondary btn-sm">Track Progress</a>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    } else if (tab === "rentals") {
      const rentalOrders = orders.filter((o) => o.isRental);
      container.innerHTML = `
        <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-xl);">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: var(--space-md);">Active Furniture Rentals</h2>
          ${rentalOrders.length > 0 ? rentalOrders.map((o) => `
            <div style="border: 1px solid var(--color-secondary); background-color: var(--color-secondary-light); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong style="color: var(--color-primary-dark);">Rental #${o.orderId}</strong>
                <span class="product-badge" style="background-color: var(--color-primary);">Active Subscription</span>
              </div>
              <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 12px;">
                ${o.items.map(i => `${i.name} (${i.tenureMonths || 6} Mo)`).join(", ")}
              </div>
              <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary btn-sm" onclick="CartState.showToast('Rental tenure extension requested!')">Extend Tenure</button>
                <button class="btn btn-secondary btn-sm" onclick="CartState.showToast('Pickup request logged with logistics team')">Request Pickup</button>
              </div>
            </div>
          `).join("") : `<p style="color: var(--color-text-muted);">No active furniture rentals right now.</p>`}
        </div>
      `;
    } else if (tab === "wishlist") {
      container.innerHTML = `
        <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-xl);">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: var(--space-md);">Saved Wishlist Items</h2>
          ${wishlist.length > 0 ? `
            <div class="product-grid">
              ${wishlist.map((p) => {
        const fullP = PRODUCTS_DATA.find(x => x.id === p.id) || p;
        return this.renderProductCardHtml(fullP);
      }).join("")}
            </div>
          ` : `<p style="color: var(--color-text-muted);">You have not saved any items yet.</p>`}
        </div>
      `;
    } else if (tab === "addresses") {
      container.innerHTML = `
        <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-xl);">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: var(--space-md);">Saved Delivery Addresses</h2>
          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 12px;">
            <div style="font-weight: 700; color: var(--color-primary-dark);">Abhay Kumar Singh (Default)</div>
            <div style="font-size: 0.875rem; color: var(--color-text-muted); margin-top: 4px;">
              923G+35G, Sonali Furniture, Pali road, near karpuri chowk, Masaurhi, Bihar - 804452<br>
              Phone: +91 95043 26798
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="CartState.showToast('Address management active')">+ Add New Address</button>
        </div>
      `;
    } else if (tab === "profile") {
      container.innerHTML = `
        <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-xl);">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: var(--space-md);">Profile Information</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" value="Abhay Kumar Singh">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="text" class="form-control" value="+91 95043 26798">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" value="abhay@example.com">
          </div>
          <button class="btn btn-primary btn-sm" onclick="CartState.showToast('Profile updated!')">Save Changes</button>
        </div>
      `;
    }
  },

  // =========================================================================
  // VIEW: ABOUT SONALI FURNITURE
  // =========================================================================
  renderAbout(container) {
    container.innerHTML = `
      <section style="background-color: var(--color-bg-alt); padding: var(--space-3xl) 0; border-bottom: 1px solid var(--color-border);">
        <div class="container" style="max-width: 720px; text-align: center;">
          <div style="font-size: 0.8125rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">Our Story & Purpose</div>
          <h1 style="font-size: 2.25rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 12px;">Furniture that feels like home.</h1>
          <p style="font-size: 1.0625rem; color: var(--color-text-muted); line-height: 1.6;">
            We believe everyday furniture should be honest, solid, and built for real Indian households. Crafted from seasoned Sheesham and Teak wood, without synthetic veneers or empty marketing jargon.
          </p>
        </div>
      </section>

      <div class="container" style="padding: var(--space-3xl) 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3xl); align-items: center; margin-bottom: var(--space-3xl);">
          <div>
            <h2 style="font-size: 1.75rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 12px;">Generational Woodworking, Modern Precision</h2>
            <p style="font-size: 0.9375rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 12px;">
              Sonali Furniture started as a family workshop dedicated to genuine solid timber. While the industry moved towards flat-pack particle board that chips in a year, we stayed rooted in seasoned Sheesham (Indian Rosewood) and Sagwan (Teak).
            </p>
            <p style="font-size: 0.9375rem; color: var(--color-text-muted); line-height: 1.6;">
              Every joint is cut with precision dovetail and mortise techniques. Every slab is seasoned to Indian humidity conditions so your wooden palang or dining table never squeaks or cracks.
            </p>
          </div>
          <div style="border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-md);">
            <img src="assets/images/about/workshop.jpg" alt="Master craftsman in Sonali workshop">
          </div>
        </div>

        <div class="why-grid">
          <div class="why-card">
            <h3 class="why-title">Natural Hardwoods</h3>
            <p class="why-desc">We use sustainably procured, kiln-dried Indian Sheesham and Teak wood known for natural resilience.</p>
          </div>
          <div class="why-card">
            <h3 class="why-title">Zero Hidden Fees</h3>
            <p class="why-desc">Whether buying or renting, every cost — security deposit, delivery, setup — is shown transparently upfront.</p>
          </div>
          <div class="why-card">
            <h3 class="why-title">Doorstep Assembly</h3>
            <p class="why-desc">Our own trained carpentry technicians personally assemble your furniture at your room of choice.</p>
          </div>
          <div class="why-card">
            <h3 class="why-title">Responsible Rentals</h3>
            <p class="why-desc">High-quality furniture made available to rent for temporary residents and changing needs.</p>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // VIEW: CONTACT & STORE PAGE
  // =========================================================================
  renderContact(container) {
    container.innerHTML = `
      <div class="container" style="padding: var(--space-2xl) 0 var(--space-3xl);">
        <div style="max-width: 600px; margin-bottom: var(--space-2xl);">
          <h1 style="font-size: 2.25rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 6px;">How can we help?</h1>
          <p style="font-size: 1rem; color: var(--color-text-muted);">
            Reach our workshop and showroom directly. We respond promptly on call, WhatsApp, or in person.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3xl);">
          <!-- Contact Options -->
          <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
            <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-lg); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <strong style="color: var(--color-primary-dark); font-size: 1.0625rem;">Call Us Directly</strong>
                <div style="font-size: 0.875rem; color: var(--color-text-muted); margin-top: 2px;">+91 95043 26798 (Mon–Sun, 9 AM – 8 PM)</div>
              </div>
              <a href="tel:+919504326798" class="btn btn-secondary btn-sm">Call Now</a>
            </div>

            <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-lg); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <strong style="color: var(--color-primary-dark); font-size: 1.0625rem;">WhatsApp Consultation</strong>
                <div style="font-size: 0.875rem; color: var(--color-text-muted); margin-top: 2px;">Instant replies for sizing, wood samples & photos</div>
              </div>
              <a href="https://wa.me/919504326798?text=Hello%20Sonali%20Furniture" target="_blank" class="btn btn-primary btn-sm">Chat on WhatsApp</a>
            </div>

            <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-lg);">
              <strong style="color: var(--color-primary-dark); font-size: 1.0625rem;">Store & Workshop Address</strong>
              <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-top: 6px; line-height: 1.5;">
                <strong>Sonali Furniture Workshop & Showroom</strong><br>
                923G+35G, Sonali Furniture, Pali road, near karpuri chowk,<br>
                Masaurhi, Bihar 804452<br>
                Email: support@sonalifurniture.com
              </p>
              <div style="font-size: 0.8125rem; color: var(--color-primary); font-weight: 600; margin-top: 8px;">
                Store Hours: Monday to Sunday • 10:00 AM – 8:30 PM
              </div>
            </div>
          </div>

          <!-- Message Form -->
          <div style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-xl);">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: var(--space-md);">Send us a Message</h2>
            <form onsubmit="event.preventDefault(); CartState.showToast('Message sent! We will call you back shortly.');">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" required placeholder="Your Name">
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-control" required placeholder="+91 95043 26798">
              </div>
              <div class="form-group">
                <label class="form-label">Your Message / Inquiry</label>
                <textarea class="form-control" rows="4" required placeholder="How can we help you? Ask about pricing, rental terms or custom builds..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Submit Inquiry</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // VIEW: FAQ PAGE
  // =========================================================================
  renderFAQ(container) {
    container.innerHTML = `
      <div class="container" style="max-width: 800px; padding: var(--space-2xl) var(--space-md) var(--space-3xl);">
        <div style="text-align: center; margin-bottom: var(--space-2xl);">
          <h1 style="font-size: 2.25rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 6px;">Frequently Asked Questions</h1>
          <p style="font-size: 1rem; color: var(--color-text-muted);">
            Clear, honest answers to common questions about buying, renting, delivery, and custom builds.
          </p>
        </div>

        <div class="pdp-accordions" style="background-color: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-lg);">
          ${FAQS_DATA.map((faq, i) => `
            <div class="accordion-item ${i === 0 ? 'active' : ''}">
              <button class="accordion-header" onclick="App.toggleAccordion(this)">
                <span>${faq.q}</span>
                <span class="accordion-icon">▾</span>
              </button>
              <div class="accordion-body">
                <p>${faq.a}</p>
              </div>
            </div>
          `).join("")}
        </div>

        <div style="text-align: center; margin-top: var(--space-2xl); background-color: var(--color-bg-alt); padding: var(--space-xl); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
          <h3 style="font-size: 1.125rem; color: var(--color-primary-dark); font-weight: 700;">Still have a question?</h3>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin: 6px 0 16px;">We are always happy to help you pick the right furniture.</p>
          <a href="#contact" class="btn btn-primary btn-sm">Contact Our Team</a>
        </div>
      </div>
    `;
  },

  escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
};

// Initialize Application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
