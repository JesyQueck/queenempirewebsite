// Carfunctionality
let cartCount = 0;
const cartElement = document.querySelector('.cart-count');
const checkoutSection = document.getElementById('checkoutSection');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutCount = document.getElementById('checkoutCount');
const paymentModal = document.getElementById('paymentModal');
const paymentClose = document.getElementById('paymentClose');
const submitPayment = document.getElementById('submitPayment');
const successNotification = document.getElementById('successNotification');
const bankTransfer = document.getElementById('bankTransfer');
const mobileMoney = document.getElementById('mobileMoney');
const bankDetails = document.getElementById('bankDetails');
const mobileMoneyDetails = document.getElementById('mobileMoneyDetails');
const customPackageBtn = document.getElementById('customPackageBtn')

// Update cart display
function updateCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.length;
    });
    if (checkoutCount) checkoutCount.textContent = cart.length;
    if (checkoutSection) {
        checkoutSection.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

// Add to cart function
function addToCart(product) {
    if (!product.name || !product.price) return; // Don't add invalid products
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Event delegation for add to cart buttons
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        const card = e.target.closest('.product-card, .package-card, .custom-package-card'); // Check all card types
        if (!card) return;

        // Get images: Prioritize slider images for custom cards, then regular images
        let images = [];
        const sliderImages = card.querySelectorAll('.custom-slider-images img');
        const regularImages = card.querySelectorAll('.product-img img, .package-img img');
        
        if (sliderImages.length > 0) {
            images = Array.from(sliderImages).map(img => img.src);
        } else if (regularImages.length > 0) {
            images = Array.from(regularImages).map(img => img.src);
        }

        // Use data-name and data-price if available, otherwise fall back to text content
        const productName = card.dataset.name || card.querySelector('.product-name, h3, .package-info strong')?.textContent || 'Product';
        const productPrice = parseFloat(card.dataset.price) || parseFloat(card.querySelector('.product-price, .current-price')?.textContent.replace(/[^\d.]/g, '')) || 0;

        if (productName && productPrice > 0) { // Ensure both name and a valid price exist
            const productData = {
                id: card.dataset.id || Date.now().toString(), // Keep existing ID if available
                name: productName,
                price: productPrice,
                images: images,
                category: card.querySelector('.product-category')?.textContent || 'Category' // Keep category if needed
            };
            addToCart(productData);
        }
    }
});

// Custom package button
if (customPackageBtn) {
    customPackageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Custom package feature coming soon!');
        // Optionally add to cart here if needed
    });
}

// Checkout button (only this opens the modal)
if (checkoutBtn && paymentModal) {
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            paymentModal.classList.add('active');
        }
    });
}

// Close modal
if (paymentClose && paymentModal) {
    paymentClose.addEventListener('click', function() {
        paymentModal.classList.remove('active');
    });
}

// Payment method selection
if (bankTransfer) {
    bankTransfer.addEventListener('click', () => {
        document.getElementById('bankTransferRadio').checked = true;
        bankDetails.classList.add('active');
        mobileMoneyDetails.classList.remove('active');
    });
}
if (mobileMoney) {
    mobileMoney.addEventListener('click', () => {
        document.getElementById('mobileMoneyRadio').checked = true;
        mobileMoneyDetails.classList.add('active');
        bankDetails.classList.remove('active');
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        paymentModal.classList.remove('active');
    }
})

// Initialize
updateCart();

// Sidebar and Cart rendering
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu');
    const sidebar = document.querySelector('.header-top.sidebar');
    const container = document.querySelector('.container');

    if (menuBtn && sidebar && container) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.toggle('active');
            container.classList.toggle('sidebar-open');
        });

        // Cancel button closes sidebar
        const cancelBtn = document.querySelector('.sidebar-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                sidebar.classList.remove('active');
                container.classList.remove('sidebar-open');
            });
        }

        // Optional: Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (
                sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                !menuBtn.contains(e.target)
            ) {
                sidebar.classList.remove('active');
                container.classList.remove('sidebar-open');
            }
        });
    }

    // Cart rendering on cart.html only
    const cartItemsTbody = document.getElementById('cartItems');
    const cartTotalDiv = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;

        if (cart.length === 0) {
            cartItemsTbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Your cart is empty.</td></tr>`;
            cartTotalDiv.textContent = '';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
        } else {
            let html = '';
            cart.forEach((item, idx) => {
                html += `<tr>
                            <td>${item.name}</td>
                            <td style="text-align:right;">₦${item.price.toFixed(2)}</td>
                            <td style="text-align:center;">
                                <button class="remove-btn" data-index="${idx}" title="Remove">&#10005;</button>
                            </td>
                        </tr>`;
                total += item.price;
            });
            cartItemsTbody.innerHTML = html;
            cartTotalDiv.textContent = `Total: ₦${total.toFixed(2)}`;
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
        }

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                let index = parseInt(this.getAttribute('data-index'));
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
    }

    // Initial render
    if (cartItemsTbody && cartTotalDiv && checkoutBtn) {
        renderCart();
    }

    // Package Modal Logic (Men, Women, Kids)
    const packageButtons = [
        { btnId: 'menCheckPackageBtn', containerId: 'custom-package-men', modalId: 'glassBgMen', closeBtnId: 'menModalCloseBtn' },
        { btnId: 'womenCheckPackageBtn', containerId: 'custom-package-women', modalId: 'glassBgWomen', closeBtnId: 'womenModalCloseBtn' },
        { btnId: 'kidsCheckPackageBtn', containerId: 'custom-package-kids', modalId: 'glassBgKids', closeBtnId: 'kidsModalCloseBtn' },
    ];

    packageButtons.forEach(packageInfo => {
        const checkBtn = document.getElementById(packageInfo.btnId);
        const container = document.getElementById(packageInfo.containerId);
        const closeBtn = document.getElementById(packageInfo.closeBtnId);
        const glassBg = document.getElementById(packageInfo.modalId);

        if (checkBtn && container && glassBg) {
            checkBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Hide all other glass backgrounds and containers
                document.querySelectorAll('.glass-bg').forEach(el => {
                    if (el !== glassBg) el.style.display = 'none';
                });
                document.querySelectorAll('section[id^="custom-package-"]').forEach(el => {
                    if (el !== container) el.style.display = 'none';
                });
                // Show only the current package's container and glass background
                glassBg.style.display = 'block';
                container.classList.add('centered-modal');
                container.style.display = 'flex';
                initCustomPackageSlider(packageInfo.containerId, packageInfo.modalId); // Initialize slider for this package
            });
        }

        if (closeBtn && container && glassBg) {
            closeBtn.addEventListener('click', function() {
                container.classList.remove('centered-modal');
                container.style.display = 'none';
                glassBg.style.display = 'none';
            });
        }

        // Close modal when clicking outside of the package container
        if (glassBg && container) {
            window.addEventListener('click', (e) => {
                if (e.target === glassBg) {
                    container.classList.remove('centered-modal');
                    container.style.display = 'none';
                    glassBg.style.display = 'none';
                }
            });
        }
    });
});

// Custom Package Slider Control - REFACTORED to be generic
function initCustomPackageSlider(containerId, modalId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cards = container.querySelectorAll('.custom-package-card');
    const nextBtn = container.querySelector('.custom-navigation .custom-card-nav.custom-next');
    const prevBtn = container.querySelector('.custom-navigation .custom-card-nav.custom-prev');
    const modal = document.getElementById(modalId);
    
    // Find the initially active card or default to first card
    let currentIndex = Array.from(cards).findIndex(card => card.classList.contains('active'));
    if (currentIndex === -1) currentIndex = 0;

    function updateSlider() {
        // Remove active class from all cards and hide them
        cards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class and show current card
        if (cards[currentIndex]) {
            cards[currentIndex].classList.add('active');
        }
    }

    function showNextCard() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    }

    function showPrevCard() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
    }

    // Add click event listeners to navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextCard);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevCard);
    }

    // Initialize the slider when the modal is shown
    if (modal) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style') {
                    const isVisible = modal.style.display !== 'none';
                    if (isVisible) {
                        // Always reset to the first card when modal opens
                        currentIndex = 0;
                        updateSlider();
                    }
                }
            });
        });

        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['style']
        });
    } else {
        // If no modal is associated, initialize immediately
        updateSlider();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const customSliderWrappers = document.querySelectorAll('.custom-slider-wrapper');

    customSliderWrappers.forEach(wrapper => {
        const images = wrapper.querySelectorAll('.custom-slider-img');
        const prevBtn = wrapper.querySelector('.custom-slider-btn.custom-prev');
        const nextBtn = wrapper.querySelector('.custom-slider-btn.custom-next');
        let current = 0;

        function showImage(index) {
            images.forEach((img, i) => {
                img.classList.toggle('custom-active', i === index);
            });
        }

        if (images.length) {
            showImage(current);

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                current = (current - 1 + images.length) % images.length;
                showImage(current);
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                current = (current + 1) % images.length;
                showImage(current);
            });
        }
    });
});

const checkoutForm = document.getElementById('checkoutForm');

if (checkoutForm) {
  checkoutForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop normal form submission

    console.log('Checkout form submitted.');

    // 1. Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    // 2. Get customer info
    const formData = new FormData(this);
    const firstName = formData.get('First Name') || '';
    const lastName = formData.get('Last Name') || '';
    const phone = formData.get('Phone Number') || 'Not provided';
    const address = formData.get('Street Address') || 'Not provided';
    const city = formData.get('City') || '';
    const region = formData.get('Region/State') || '';
    const postalCode = formData.get('Postal Code') || '';
    const country = formData.get('Country') || '';
    const paymentMethod = formData.get('Payment Method') || 'Not specified';
    const transactionId = formData.get('Transaction ID/Reference') || '';
    const deliveryNotes = formData.get('Delivery Instructions') || '';
    const paymentProof = formData.get('Proof of Payment');

    // 3. Build WhatsApp message
    let message = `*🛒 New Order Received!*\n\n`;
    message += `*Customer Info:*\n`;
    message += `👤 Name: ${firstName} ${lastName}\n`;
    message += `📞 Phone: ${phone}\n`;
    message += `🏠 Address: ${address}, ${city}, ${region}, ${postalCode}, ${country}\n\n`;

    message += `*🧾 Order Items:*\n`;
    if (cart.length === 0) {
      message += `No items in cart.\n`;
    } else {
      cart.forEach(item => {
        message += `- ${item.name || 'Unnamed Product'} - ₦${(item.price || 0).toFixed(2)}\n`;
        if (item.images && item.images.length > 0) {
          message += `  📷 Product Images:\n`;
          item.images.forEach((image, index) => {
            message += `    ${index + 1}. ${image}\n`;
          });
        }
      });
    }

    message += `\n💰 *Total:* ₦${total.toFixed(2)}\n`;
    message += `💳 *Payment Method:* ${paymentMethod}\n`;

    if (paymentProof && paymentProof.name) {
      message += `📎 *Proof of Payment:* ${paymentProof.name}\n`;
    }

    if (transactionId) {
      message += `🧾 *Transaction ID:* ${transactionId}\n`;
    }

    if (deliveryNotes) {
      message += `📝 *Delivery Notes:*\n${deliveryNotes}\n`;
    }

    // 4. Encode and redirect to WhatsApp
    const encodedMessage = encodeURIComponent(message);

    // ✅ Replace with YOUR WhatsApp number in international format (no + or 0)
    const whatsappNumber = '2347051890111';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Debug information
    console.log('WhatsApp Number:', whatsappNumber);
    console.log('Original Message:', message);
    console.log('Encoded Message:', encodedMessage);
    console.log('WhatsApp URL:', whatsappURL);

    // 👉 Use location.href instead of window.open for better reliability
    window.location.href = whatsappURL;

    // 5. Post-submission: Reset and update UI
    if (typeof paymentModal !== 'undefined') {
      paymentModal.classList.remove('active');
    }

    if (typeof successNotification !== 'undefined') {
      successNotification.classList.add('active');
    }

    localStorage.removeItem('cart');
    if (typeof updateCart === 'function') updateCart();
    if (document.getElementById('cartItems') && typeof renderCart === 'function') {
      renderCart();
    }

    this.reset();

    setTimeout(() => {
      if (typeof successNotification !== 'undefined') {
        successNotification.classList.remove('active');
      }
    }, 5000);
  });
}


// Function to handle package card navigation
function setupPackageNavigation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cards = container.querySelectorAll('.custom-package-card');
    const prevBtn = container.querySelector('.custom-prev');
    const nextBtn = container.querySelector('.custom-next');
    let currentIndex = 0;

    // Function to show a specific card
    function showCard(index) {
        cards.forEach(card => {
            card.classList.remove('active');
            card.style.display = 'none';
        });
        cards[index].classList.add('active');
        cards[index].style.display = 'block';
    }

    // Initialize first card
    showCard(currentIndex);

    // Previous button click handler
    prevBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        showCard(currentIndex);
    });

    // Next button click handler
    nextBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        showCard(currentIndex);
    });
}

// Function to show only active card in custom package
function showOnlyActiveCard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const cards = container.querySelectorAll('.custom-package-card');
    cards.forEach(card => {
        if (!card.classList.contains('active')) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
        }
    });
}

// Add event listeners for check package buttons
document.getElementById('menCheckPackageBtn')?.addEventListener('click', () => {
    document.getElementById('glassBgMen').style.display = 'block';
    showOnlyActiveCard('customPackMen');
    setupPackageNavigation('customPackMen');
});

document.getElementById('womenCheckPackageBtn')?.addEventListener('click', () => {
    document.getElementById('glassBgWomen').style.display = 'block';
    showOnlyActiveCard('customPackWomen');
    setupPackageNavigation('customPackWomen');
});

document.getElementById('kidsCheckPackageBtn')?.addEventListener('click', () => {
    document.getElementById('glassBgKids').style.display = 'block';
    showOnlyActiveCard('customPackKids');
    setupPackageNavigation('customPackKids');
});

// Add event listeners for modal close buttons
document.getElementById('menModalCloseBtn')?.addEventListener('click', () => {
    document.getElementById('glassBgMen').style.display = 'none';
});

document.getElementById('womenModalCloseBtn')?.addEventListener('click', () => {
    document.getElementById('glassBgWomen').style.display = 'none';
});

document.getElementById('kidsModalCloseBtn')?.addEventListener('click', () => {
    document.getElementById('glassBgKids').style.display = 'none';
});

// Add to wishlist functionality
document.querySelectorAll('.wishlist').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.product-card, .package-card');
        if (!card) return;

        const productData = {
            id: card.dataset.id || Date.now().toString(),
            name: card.querySelector('.product-name, h3')?.textContent || 'Product',
            price: card.querySelector('.product-price, .current-price')?.textContent || '0',
            image: card.querySelector('.product-img img, .package-img img')?.src || '',
            category: card.querySelector('.product-category')?.textContent || 'Category'
        };

        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const existingIndex = wishlist.findIndex(item => item.id === productData.id);

        const icon = this.querySelector('i');
        
        if (existingIndex === -1) {
            // Add to wishlist
            wishlist.push(productData);
            this.classList.add('active');
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            icon.style.color = '#e83e8c';
        } else {
            // Remove from wishlist
            wishlist.splice(existingIndex, 1);
            this.classList.remove('active');
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            icon.style.color = '';
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateCart();
        renderWishlist();

        // If we're on the wishlist page, remove the item from the DOM
        if (window.location.pathname.includes('wishlist.html')) {
            const wishlistItem = document.querySelector(`.wishlist-item[data-id="${productData.id}"]`);
            if (wishlistItem) {
                wishlistItem.remove();
                // If no items left, show empty message
                if (wishlist.length === 0) {
                    const wishlistContainer = document.querySelector('.wishlist-items');
                    if (wishlistContainer) {
                        wishlistContainer.innerHTML = '<p class="empty-wishlist">Your wishlist is empty</p>';
                    }
                }
            }
        }
    });
});

// Check for existing wishlist items on page load
document.addEventListener('DOMContentLoaded', function() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.querySelectorAll('.wishlist').forEach(button => {
        const card = button.closest('.product-card, .package-card');
        if (!card) return;
        
        const cardId = card.dataset.id || card.querySelector('.product-name, h3')?.textContent;
        if (wishlist.some(item => item.id === cardId)) {
            button.classList.add('active');
            const icon = button.querySelector('i');
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            icon.style.color = '#e83e8c';
        }
    });
});

// Render wishlist items
function renderWishlist() {
    const wishlistContainer = document.querySelector('.wishlist-items');
    if (!wishlistContainer) return;

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p class="empty-wishlist">Your wishlist is empty</p>';
        return;
    }

    wishlistContainer.innerHTML = wishlist.map(item => `
        <div class="wishlist-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="wishlist-item-info">
                <h3>${item.name}</h3>
                <div class="price">${item.price}</div>
                <div class="category">${item.category}</div>
                <div class="wishlist-item-actions">
                    <button class="add-to-cart">Add to Cart</button>
                    <button class="remove">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners for the new buttons
    wishlistContainer.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.wishlist-item');
            const productData = {
                id: item.dataset.id,
                name: item.querySelector('h3').textContent,
                price: item.querySelector('.price').textContent,
                image: item.querySelector('img').src,
                category: item.querySelector('.category').textContent
            };
            addToCart(productData);
        });
    });

    wishlistContainer.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.wishlist-item');
            const itemId = item.dataset.id;
            
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            wishlist = wishlist.filter(product => product.id !== itemId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update the heart icon in the main product cards
            document.querySelectorAll('.wishlist').forEach(wishlistBtn => {
                const card = wishlistBtn.closest('.product-card, .package-card');
                if (card && card.dataset.id === itemId) {
                    wishlistBtn.classList.remove('active');
                    const icon = wishlistBtn.querySelector('i');
                    icon.classList.remove('fa-solid');
                    icon.classList.add('fa-regular');
                    icon.style.color = '';
                }
            });
            
            renderWishlist();
        });
    });
}

// Category Selection Functionality
document.querySelectorAll('.add-to-cart[data-href*="Product.html"]').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const category = this.closest('.package-card').querySelector('h3').textContent;
        const url = this.getAttribute('data-href');
        
        // Store the selected category
        localStorage.setItem('selectedCategory', category);
        
        // Navigate to the selected page
        window.location.href = url;
    });
});

// Display selected category on the product pages
document.addEventListener('DOMContentLoaded', function() {
    const selectedCategory = localStorage.getItem('selectedCategory');
    const previewCategory = document.getElementById('previewCategory');
    
    if (previewCategory && selectedCategory) {
        previewCategory.textContent = `Selected Category: ${selectedCategory}`;
    }
});

