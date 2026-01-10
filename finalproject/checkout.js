document.addEventListener('DOMContentLoaded', function() {
    loadSelectedVinyl();
    setupFormListeners();
});

function loadSelectedVinyl() {
    console.log('Loading vinyl data...');
    
    let vinylData = null;
    
    const currentVinyl = localStorage.getItem('currentVinyl');
    console.log('currentVinyl from localStorage:', currentVinyl);
    
    const selectedVinyl = localStorage.getItem('selectedVinyl');
    console.log('selectedVinyl from localStorage:', selectedVinyl);
    
    if (currentVinyl) {
        try {
            vinylData = JSON.parse(currentVinyl);
            console.log('Parsed currentVinyl:', vinylData);
        } catch (e) {
            console.error('Error parsing currentVinyl:', e);
        }
    } else if (selectedVinyl) {
        try {
            vinylData = JSON.parse(selectedVinyl);
            console.log('Parsed selectedVinyl:', vinylData);
        } catch (e) {
            console.error('Error parsing selectedVinyl:', e);
        }
    }
    
    if (vinylData) {
        displayOrderSummary(vinylData);
        window.currentVinylData = vinylData;
    } else {
        console.error('No vinyl data found in localStorage');
        showNoVinylMessage();
    }
}

function displayOrderSummary(vinylData) {
    console.log('Displaying order summary for:', vinylData);
    
    document.getElementById('vinylTitle').textContent = vinylData.title || 'Unknown Album';
    document.getElementById('vinylArtist').textContent = `Artist: ${vinylData.artist || 'Unknown Artist'}`;
    document.getElementById('vinylGenre').textContent = `Genre: ${vinylData.genre || 'Unknown Genre'}`;
    document.getElementById('vinylYear').textContent = `Year: ${vinylData.year || 'Unknown Year'}`;
    
    const price = vinylData.price || 24.99;
    document.getElementById('vinylPrice').textContent = `$${price.toFixed(2)}`;
    
    const vinylImage = document.getElementById('vinylImage');
    if (vinylData.image) {
        vinylImage.src = vinylData.image;
        vinylImage.alt = `${vinylData.artist} - ${vinylData.title}`;
    } else {
        vinylImage.src = 'images/default-vinyl.jpg';
        vinylImage.alt = 'Default vinyl image';
    }
    
    document.getElementById('vinylData').value = JSON.stringify(vinylData);
    
    calculateTotals(price);
}

function calculateTotals(vinylPrice) {
    const deliverySelect = document.getElementById('delivery');
    let shippingCost = 0;
    
    const selectedOption = deliverySelect.options[deliverySelect.selectedIndex];
    if (selectedOption) {
        if (selectedOption.value === 'ship') {
            shippingCost = 4.99;
        } else if (selectedOption.value === 'express') {
            shippingCost = 9.99;
        } else if (selectedOption.value === 'pickup') {
            shippingCost = 0;
        }
    }

    const subtotal = parseFloat(vinylPrice) || 0;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shippingCost').textContent = `$${shippingCost.toFixed(2)}`;
    document.getElementById('totalCost').textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
}

function setupFormListeners() {
    const deliverySelect = document.getElementById('delivery');
    if (deliverySelect) {
        deliverySelect.addEventListener('change', function() {
            const vinylPrice = window.currentVinylData?.price || 24.99;
            calculateTotals(vinylPrice);
        });
    }
  
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                processOrder();
            }
        });
    }
}

function validateForm() {
    let isValid = true;
    
    const requiredFields = [
        'fname', 'lname', 'email', 'address', 
        'city', 'postal', 'cardnumber', 'expdate', 
        'security', 'cardname'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            if (field) {
                field.style.border = '2px solid red';
                field.style.borderRadius = '4px';
            }
            isValid = false;
        } else {
            if (field) {
                field.style.border = '';
            }
        }
    });
    
    const delivery = document.getElementById('delivery');
    if (!delivery || !delivery.value) {
        if (delivery) {
            delivery.style.border = '2px solid red';
            delivery.style.borderRadius = '4px';
        }
        isValid = false;
    } else {
        if (delivery) {
            delivery.style.border = '';
        }
    }
    
    const email = document.getElementById('email');
    if (email && email.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            email.style.border = '2px solid red';
            email.style.borderRadius = '4px';
            isValid = false;
        }
    }
    
    if (!isValid) {
        alert('Please fill in all required fields correctly.');
    }
    
    return isValid;
}

function processOrder() {
    if (!window.currentVinylData) {
        alert('No vinyl selected. Please go back and select an album.');
        return;
    }
    
    const orderData = {
        vinyl: window.currentVinylData,
        customer: {
            firstName: document.getElementById('fname').value,
            lastName: document.getElementById('lname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value || '',
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postal: document.getElementById('postal').value
        },
        delivery: document.getElementById('delivery').value,
        paymentMethod: 'card',
        orderId: generateOrderId(),
        timestamp: new Date().toISOString(),
        total: document.getElementById('totalCost').textContent
    };
    
    console.log('Processing order:', orderData);
    
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    alert(`Thank you for your purchase!\n\nOrder ID: ${orderData.orderId}\n\nYou will receive a confirmation email shortly.`);
    
    localStorage.removeItem('currentVinyl');
    localStorage.removeItem('selectedVinyl');
   
    window.location.href = 'allvinyls.html';
}

function showNoVinylMessage() {
    const orderItem = document.getElementById('vinylOrderItem');
    if (orderItem) {
        orderItem.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3>No Vinyl Selected</h3>
                <p>You haven't selected any vinyl to purchase.</p>
                <a href="allvinyls.html" style="display: inline-block; 
                   background-color: #333; color: white; 
                   padding: 10px 20px; text-decoration: none; 
                   border-radius: 5px; margin-top: 20px;">
                    Browse Vinyls
                </a>
            </div>
        `;
                document.querySelector('.order-totals').style.display = 'none';
        document.querySelector('.secure-checkout').style.display = 'none';
    }
}

function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `VINYL-${timestamp}-${random}`.toUpperCase();
}