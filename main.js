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
            let image = ''; // Initialize image variable

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
                // Get image source
                const imgElement = card.querySelector('.product-img img, .package-img img, .custom-slider-img.custom-active');
                if (imgElement) {
                    image = imgElement.src;
                }
            }

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ name, price, image }); // Push image along with name and price
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
    const menContainer = document.getElementById('custom-package-men');
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
    const menContainer = document.getElementById('custom-package-men');
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
    const menContainer = document.getElementById('custom-package-men');
    const menCloseBtn = document.getElementById('menModalCloseBtn');
    const glassBgMen = document.getElementById('glassBgMen');

    if (menCheckBtn && menContainer && glassBgMen) {
        menCheckBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all other glass backgrounds and containers
            document.querySelectorAll('.glass-bg').forEach(el => {
                if (el !== glassBgMen) el.style.display = 'none';
            });
            document.querySelectorAll('section[id^="custom-package-"]').forEach(el => {
                if (el !== menContainer) el.style.display = 'none';
            });
            // Show only men's container
            glassBgMen.style.display = 'block';
            menContainer.classList.add('centered-modal');
            menContainer.style.display = 'flex';
        });
    }

    if (menCloseBtn && menContainer && glassBgMen) {
        menCloseBtn.addEventListener('click', function() {
            menContainer.classList.remove('centered-modal');
            menContainer.style.display = 'none';
            glassBgMen.style.display = 'none';
        });
    }

    // Women
    const womenCheckBtn = document.getElementById('womenCheckPackageBtn');
    const womenContainer = document.getElementById('custom-package-women');
    const womenCloseBtn = document.getElementById('womenModalCloseBtn');
    const glassBgWomen = document.getElementById('glassBgWomen');

    if (womenCheckBtn && womenContainer && glassBgWomen) {
        womenCheckBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all other glass backgrounds and containers
            document.querySelectorAll('.glass-bg').forEach(el => {
                if (el !== glassBgWomen) el.style.display = 'none';
            });
            document.querySelectorAll('section[id^="custom-package-"]').forEach(el => {
                if (el !== womenContainer) el.style.display = 'none';
            });
            // Show only women's container
            glassBgWomen.style.display = 'block';
            womenContainer.classList.add('centered-modal');
            womenContainer.style.display = 'flex';
        });
    }

    if (womenCloseBtn && womenContainer && glassBgWomen) {
        womenCloseBtn.addEventListener('click', function() {
            womenContainer.classList.remove('centered-modal');
            womenContainer.style.display = 'none';
            glassBgWomen.style.display = 'none';
        });
    }

    // Kids
    const kidsCheckBtn = document.getElementById('kidsCheckPackageBtn');
    const kidsContainer = document.getElementById('custom-package-kids');
    const kidsCloseBtn = document.getElementById('kidsModalCloseBtn');
    const glassBgKids = document.getElementById('glassBgKids');

    if (kidsCheckBtn && kidsContainer && glassBgKids) {
        kidsCheckBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all other glass backgrounds and containers
            document.querySelectorAll('.glass-bg').forEach(el => {
                if (el !== glassBgKids) el.style.display = 'none';
            });
            document.querySelectorAll('section[id^="custom-package-"]').forEach(el => {
                if (el !== kidsContainer) el.style.display = 'none';
            });
            // Show only kids' container
            glassBgKids.style.display = 'block';
            kidsContainer.classList.add('centered-modal');
            kidsContainer.style.display = 'flex';
        });
    }

    if (kidsCloseBtn && kidsContainer && glassBgKids) {
        kidsCloseBtn.addEventListener('click', function() {
            kidsContainer.classList.remove('centered-modal');
            kidsContainer.style.display = 'none';
            glassBgKids.style.display = 'none';
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

// Formbold submission for checkoutForm
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission

        console.log('Form submission initiated...');

        // 1. Gather cart items for summary
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

        let orderSummaryHtml = `<h3>Cart Items:</h3><ul style="list-style:none;padding:0;">`;
        if (cart.length === 0) {
            orderSummaryHtml += `<li>No items in cart.</li>`;
        } else {
            cart.forEach(item => {
                orderSummaryHtml += `<li style="margin-bottom: 5px; display: flex; align-items: center;">`;
                if (item.image) {
                    orderSummaryHtml += `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 4px;">`;
                }
                orderSummaryHtml += `<span>${item.name} - ₦${item.price?.toFixed(2) || '0.00'}</span></li>`;
            });
        }
        orderSummaryHtml += `</ul><p><strong>Total:</strong> ₦${total.toFixed(2)}</p>`;

        // 2. Create FormData object from the form
        const formData = new FormData(this);

        // Log all FormData entries for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ': ' + pair[1]);
        }

        // 3. Append the dynamically generated order summary HTML for Formbold
        formData.append('orderSummaryHtmlContent', orderSummaryHtml);

        console.log('Sending data to Formbold...');

        // 4. Send data to Formbold using fetch
        try {
            const response = await fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json' // Still good practice to request JSON response
                }
            });

            console.log('Formbold response received:', response);

            if (response.ok) {
                console.log('Form submission successful!');
                // Success: close modal, show notification, clear cart
                paymentModal.classList.remove('active');
                successNotification.classList.add('active');
                localStorage.removeItem('cart');
                updateCart(); // This updates the cart count in header/cart page

                // Only call renderCart if on cart.html to update the table display
                if (document.getElementById('cartItems')) {
                    renderCart();
                }

                // Reset the form fields
                this.reset();

                setTimeout(() => {
                    successNotification.classList.remove('active');
                }, 5000);
            } else {
                console.error('Form submission failed with status:', response.status);
                // Error: read response and show alert
                const data = await response.json();
                if (data.errors) {
                    alert('Form submission failed: ' + data.errors.map(err => err.message).join(', '));
                    console.error('Formbold errors:', data.errors);
                } else {
                    alert('Form submission failed! Please try again.');
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred during submission. Please check your internet connection and try again.');
        }
    });
}