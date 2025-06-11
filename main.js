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
    cartElement.textContent = cartCount;
    checkoutCount.textContent = cartCount;
    
    if (cartCount > 0) {
        checkoutSection.style.display = 'block';
    } else {
        checkoutSection.style.display = 'none';
    }
}

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        cartCount++;
        updateCart();
        
        // Add animation
        button.textContent = 'Added!';
        button.style.backgroundColor = 'var(--success)';
        
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = 'var(--primary)';
        }, 1000);
    });
})
// Custom package button
if (customPackageBtn) {
    customPackageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Custom package feature coming soon!');
        cartCount++;
        updateCart();
    });
}
// Checkout button
checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (cartCount > 0) {
        paymentModal.classList.add('active');
    }
})
// Close modal
paymentClose.addEventListener('click', () => {
    paymentModal.classList.remove('active');
})
// Payment method selection
bankTransfer.addEventListener('click', () => {
    document.getElementById('bankTransferRadio').checked = true;
    bankDetails.classList.add('active');
    mobileMoneyDetails.classList.remove('active');
})
mobileMoney.addEventListener('click', () => {
    document.getElementById('mobileMoneyRadio').checked = true;
    mobileMoneyDetails.classList.add('active');
    bankDetails.classList.remove('active');
})
// Submit payment
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
    cartCount = 0;
    updateCart();
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        successNotification.classList.remove('active');
    }, 5000);
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        paymentModal.classList.remove('active');
    }
})
// Initialize
updateCart();
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
});
