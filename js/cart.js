// Sonali Furniture — Cart, Wishlist, Order & Storage State Manager

const CartState = {
  cartKey: "sonali_cart_v1",
  wishlistKey: "sonali_wishlist_v1",
  ordersKey: "sonali_orders_v1",
  activeModeKey: "sonali_mode_v1", // 'buy' or 'rent'

  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.cartKey)) || [];
    } catch (e) {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateBadges();
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { cart } }));
  },

  addItem(product, mode = "buy", tenureMonths = 3) {
    let cart = this.getCart();
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.mode === mode && (mode === "buy" || item.tenureMonths === tenureMonths)
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      let unitPrice = mode === "buy" ? product.buyPrice : this.calculateRentPrice(product.rentPrice, tenureMonths);
      let deposit = mode === "rent" ? (product.rentDeposit || 1500) : 0;

      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        mode: mode, // 'buy' or 'rent'
        tenureMonths: mode === "rent" ? tenureMonths : null,
        unitPrice: unitPrice,
        deposit: deposit,
        quantity: 1,
        material: product.material,
        dimensions: product.dimensions
      });
    }

    this.saveCart(cart);
    this.showToast(`Added "${product.name}" to cart (${mode.toUpperCase()})`);
  },

  calculateRentPrice(baseMonthly, tenure) {
    if (!baseMonthly) return 0;
    // 3 mo: base, 6 mo: 10% discount, 12 mo: 20% discount
    if (tenure === 6) return Math.round(baseMonthly * 0.9);
    if (tenure === 12) return Math.round(baseMonthly * 0.8);
    return baseMonthly;
  },

  updateQuantity(index, newQty) {
    let cart = this.getCart();
    if (index >= 0 && index < cart.length) {
      if (newQty <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = newQty;
      }
      this.saveCart(cart);
    }
  },

  removeItem(index) {
    let cart = this.getCart();
    if (index >= 0 && index < cart.length) {
      const removed = cart.splice(index, 1);
      this.saveCart(cart);
      if (removed[0]) {
        this.showToast(`Removed "${removed[0].name}" from cart`);
      }
    }
  },

  clearCart() {
    this.saveCart([]);
  },

  getCartTotals() {
    const cart = this.getCart();
    let buySubtotal = 0;
    let rentMonthlySubtotal = 0;
    let totalDeposit = 0;
    let totalItems = 0;

    cart.forEach((item) => {
      totalItems += item.quantity;
      if (item.mode === "buy") {
        buySubtotal += item.unitPrice * item.quantity;
      } else {
        rentMonthlySubtotal += item.unitPrice * item.quantity;
        totalDeposit += item.deposit * item.quantity;
      }
    });

    const subtotal = buySubtotal + rentMonthlySubtotal;
    const delivery = 0; // Transparent Free Delivery policy
    const grandTotal = subtotal + totalDeposit + delivery;

    return {
      buySubtotal,
      rentMonthlySubtotal,
      totalDeposit,
      subtotal,
      delivery,
      grandTotal,
      totalItems,
      hasRentals: rentMonthlySubtotal > 0
    };
  },

  // Wishlist
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(this.wishlistKey)) || [];
    } catch (e) {
      return [];
    }
  },

  saveWishlist(list) {
    localStorage.setItem(this.wishlistKey, JSON.stringify(list));
    this.updateBadges();
    window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { list } }));
  },

  isInWishlist(productId) {
    const list = this.getWishlist();
    return list.some((item) => item.id === productId);
  },

  toggleWishlist(product) {
    let list = this.getWishlist();
    const index = list.findIndex((item) => item.id === product.id);
    if (index > -1) {
      list.splice(index, 1);
      this.saveWishlist(list);
      this.showToast(`Removed from Wishlist`);
      return false;
    } else {
      list.push({
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        buyPrice: product.buyPrice,
        rentPrice: product.rentPrice
      });
      this.saveWishlist(list);
      this.showToast(`Saved "${product.name}" to Wishlist`);
      return true;
    }
  },

  // Orders
  getOrders() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.ordersKey));
      if (stored && stored.length > 0) return stored;
    } catch (e) {}

    // Default seeded realistic order for immediate tracking demo
    const defaultOrders = [
      {
        orderId: "SF-1024",
        createdAt: "2026-10-02T10:30:00Z",
        expectedDelivery: "2026-10-08",
        status: "Out for Delivery",
        statusStep: 3, // 1: Confirmed, 2: Preparing, 3: Out for Delivery, 4: Delivered
        customer: {
          name: "Abhay Kumar Singh",
          phone: "+91 95043 26798",
          address: "923G+35G, Sonali Furniture, Pali road, near karpuri chowk",
          city: "Masaurhi",
          state: "Bihar",
          pincode: "804452"
        },
        items: [
          {
            id: "sf-study-01",
            name: "ErgoCraft Solid Wood Study Table",
            mode: "rent",
            tenureMonths: 6,
            unitPrice: 629,
            deposit: 1500,
            quantity: 1,
            image: "assets/images/products/study_table.jpg"
          }
        ],
        paymentMethod: "UPI (Google Pay)",
        totalAmount: 2129,
        isRental: true,
        rentalDetails: {
          startDate: "08 Oct 2026",
          tenure: "6 Months",
          nextBilling: "08 Nov 2026",
          endDate: "08 Apr 2027"
        }
      }
    ];
    this.saveOrders(defaultOrders);
    return defaultOrders;
  },

  saveOrders(orders) {
    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
  },

  createOrder(orderData) {
    const orders = this.getOrders();
    orders.unshift(orderData);
    this.saveOrders(orders);
    this.clearCart();
    return orderData;
  },

  // Global Buy / Rent Mode toggle
  getActiveMode() {
    return localStorage.getItem(this.activeModeKey) || "all";
  },

  setActiveMode(mode) {
    localStorage.setItem(this.activeModeKey, mode);
    window.dispatchEvent(new CustomEvent("mode-changed", { detail: { mode } }));
  },

  // Badge Counters
  updateBadges() {
    const cartCount = this.getCart().reduce((sum, i) => sum + i.quantity, 0);
    const wishlistCount = this.getWishlist().length;

    document.querySelectorAll(".cart-count-badge").forEach((el) => {
      el.textContent = cartCount;
      el.style.display = cartCount > 0 ? "inline-flex" : "none";
    });

    document.querySelectorAll(".wishlist-count-badge").forEach((el) => {
      el.textContent = wishlistCount;
      el.style.display = wishlistCount > 0 ? "inline-flex" : "none";
    });
  },

  // Toast UI
  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-dot"></span>
        <span class="toast-text">${message}</span>
      </div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.add("toast-show");
    });

    setTimeout(() => {
      toast.classList.remove("toast-show");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
};
