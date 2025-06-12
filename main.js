// Carfunctionality
let cartCount = 0;
const cartElement = document.querySelector('.cart-count');
const checkoutSection = document.getElementById('checkoutSection');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutCount = document.getElementById('checkoutCount');
const paymentModal = document.getElementById('paymentModal');
const paymentClose = document.getElementById('paymentClose');
const addressForm = document.getElementById('addressForm');
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

// Add to cart functionality (does NOT open checkout modal)
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        if (button.textContent.trim() === 'Add to Cart') {
            const card = button.closest('.product-card, .package-card, .custom-package-card');
            let name = 'Product';
            let price = 0;

            // Try to get name and price from data attributes first
            if (card) {
                name = card.getAttribute('data-name') || name;
                price = parseFloat(card.getAttribute('data-price')) || price;

                // Fallback to h3 and .current-price if not present
                if (!name && card.querySelector('h3')) {
                    name = card.querySelector('h3').textContent;
                }
                if (!price && card.querySelector('.current-price')) {
                    price = parseFloat(card.querySelector('.current-price').textContent.replace(/[^0-9.]/g, ''));
                }
            }

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ name, price });
            localStorage.setItem('cart', JSON.stringify(cart));

            // Animate button, update cart count, etc.
            button.textContent = 'Added!';
            button.style.backgroundColor = 'var(--success)';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = 'var(--primary)';
            }, 1000);

            updateCart();
        }
    });
})

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

// Submit payment
if (submitPayment) {
    submitPayment.addEventListener('click', () => {
        // Validate address form
        if (!addressForm.checkValidity()) {
            alert('Please fill in all required fields');
            return;
        }
        // Validate payment proof
        if (!document.getElementById('paymentProof').value || 
            !document.getElementById('transactionId').value) {
            alert('Please upload payment proof and enter transaction ID');
            return;
        }
        // Process payment (in a real app, this would be sent to a server)
        paymentModal.classList.remove('active');
        
        // Show success notification
        successNotification.classList.add('active');
        
        // Reset cart
        localStorage.removeItem('cart');
        updateCart();
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            successNotification.classList.remove('active');
        }, 5000);
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
});

// Show Men-container as modal when "Check package" under Men's Package is clicked
document.addEventListener('DOMContentLoaded', function() {
    const menCheckBtn = document.getElementById('menCheckPackageBtn');
    const menContainer = document.getElementById('custom-package');
    const body = document.body;

    if (menCheckBtn && menContainer) {
        menCheckBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all main content except menContainer
            document.querySelectorAll('section, header, footer').forEach(el => {
                if (el !== menContainer) el.style.display = 'none';
            });
            // Center and show menContainer
            menContainer.classList.add('centered-modal');
            menContainer.style.display = 'flex';
        });
    }

    // Optional: Click outside to close or add a close button inside menContainer
    menContainer.addEventListener('click', function(e) {
        if (e.target === menContainer) {
            menContainer.classList.remove('centered-modal');
            menContainer.style.display = 'none'; // <-- Add this line
            document.querySelectorAll('section, header, footer').forEach(el => {
                el.style.display = '';
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const menCloseBtn = document.getElementById('menModalCloseBtn');
    const menContainer = document.getElementById('custom-package');
    if (menCloseBtn && menContainer) {
        menCloseBtn.addEventListener('click', function() {
            menContainer.classList.remove('centered-modal');
            menContainer.style.display = 'none'; // <-- This hides the modal and the close button
            document.querySelectorAll('section, header, footer').forEach(el => {
                el.style.display = '';
            });
        });
    }
});

// --- KEEP THIS BLOCK: Card slider logic ---
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('#customPack .custom-package-card');
    let current = 0;

    function showCard(idx) {
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === idx);
        });
    }

    if (cards.length) {
        showCard(current);

        cards.forEach((card, idx) => {
            const prevBtn = card.querySelector('.custom-card-nav.custom-prev');
            const nextBtn = card.querySelector('.custom-card-nav.custom-next');

            if (prevBtn) {
                prevBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    current = (current - 1 + cards.length) % cards.length;
                    showCard(current);
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    current = (current + 1) % cards.length;
                    showCard(current);
                });
            }
        });
    }
});
// --- END CARD SLIDER LOGIC ---

document.addEventListener('DOMContentLoaded', function() {
    // Men
    const menCheckBtn = document.getElementById('menCheckPackageBtn');
    const menContainer = document.getElementById('custom-package');
    const menCloseBtn = document.getElementById('menModalCloseBtn');

    if (menCheckBtn && menContainer) {
        menCheckBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('section, header, footer').forEach(el => {
                if (el !== menContainer) el.style.display = 'none';
            });
            menContainer.classList.add('centered-modal');
            menContainer.style.display = 'flex';
        });
    }
    if (menCloseBtn && menContainer) {
        menCloseBtn.addEventListener('click', function() {
            menContainer.classList.remove('centered-modal');
            menContainer.style.display = 'none'; // <-- This hides the modal and the close button
            document.querySelectorAll('section, header, footer').forEach(el => {
                el.style.display = '';
            });
        });
    }

    // Women
    const womenCheckBtn = document.getElementById('womenCheckPackageBtn');
    const womenContainer = document.getElementById('custom-package-women');
    const womenCloseBtn = document.getElementById('womenModalCloseBtn');
    if (womenCheckBtn && womenContainer) {
        womenCheckBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('section, header, footer').forEach(el => {
                if (el !== womenContainer) el.style.display = 'none';
            });
            womenContainer.classList.add('centered-modal');
            womenContainer.style.display = 'flex';
        });
    }
    if (womenCloseBtn && womenContainer) {
        womenCloseBtn.addEventListener('click', function() {
            womenContainer.classList.remove('centered-modal');
            womenContainer.style.display = 'none';
            document.querySelectorAll('section, header, footer').forEach(el => {
                el.style.display = '';
            });
        });
    }

    // Kids
    const kidsCheckBtn = document.getElementById('kidsCheckPackageBtn');
    const kidsContainer = document.getElementById('custom-package-kids');
    const kidsCloseBtn = document.getElementById('kidsModalCloseBtn');
    if (kidsCheckBtn && kidsContainer) {
        kidsCheckBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('section, header, footer').forEach(el => {
                if (el !== kidsContainer) el.style.display = 'none';
            });
            kidsContainer.classList.add('centered-modal');
            kidsContainer.style.display = 'flex';
        });
    }
    if (kidsCloseBtn && kidsContainer) {
        kidsCloseBtn.addEventListener('click', function() {
            kidsContainer.classList.remove('centered-modal');
            kidsContainer.style.display = 'none';
            document.querySelectorAll('section, header, footer').forEach(el => {
                el.style.display = '';
            });
        });
    }
});


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