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
    if (cartElement) cartElement.textContent = cart.length;
    if (checkoutCount) checkoutCount.textContent = cart.length;
    if (checkoutSection) {
        checkoutSection.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

// Add to cart functionality (does NOT open checkout modal)
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        if (button.textContent.trim() === 'Add to Cart') {
            const card = button.closest('.product-card, .package-card');
            const name = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Product';
            const priceElem = card.querySelector('.current-price');
            const price = priceElem ? parseFloat(priceElem.textContent.replace(/[^0-9.]/g, '')) : 0;

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
