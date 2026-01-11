document.addEventListener('DOMContentLoaded', function() {
    loadSelectedVinyl();
    setupFormListeners();
});

function loadSelectedVinyl() {
    const currentVinyl = localStorage.getItem('currentVinyl') || localStorage.getItem('selectedVinyl');
    if (!currentVinyl) return showNoVinylMessage();

    const vinylData = JSON.parse(currentVinyl);
    window.currentVinylData = vinylData;

    document.getElementById('vinylTitle').textContent = vinylData.title || 'Unknown Album';
    document.getElementById('vinylArtist').textContent = `Artist: ${vinylData.artist || 'Unknown'}`;
    document.getElementById('vinylGenre').textContent = `Genre: ${vinylData.genre || 'Unknown'}`;
    document.getElementById('vinylYear').textContent = `Year: ${vinylData.year || 'Unknown'}`;
    document.getElementById('vinylPrice').textContent = `$${vinylData.price.toFixed(2)}`;

    if (vinylData.image) {
        document.getElementById('vinylImage').src = vinylData.image;
        document.getElementById('vinylImage').alt = `${vinylData.artist} - ${vinylData.title}`;
    }

    document.getElementById('vinylData').value = JSON.stringify(vinylData);
    calculateTotals(vinylData.price);
}

function calculateTotals(price) {
    const delivery = document.getElementById('delivery');
    let shipping = 0;
    if (delivery) {
        const val = delivery.value;
        if (val === 'ship') shipping = 4.99;
        if (val === 'express') shipping = 9.99;
    }

    document.getElementById('subtotal').textContent = `$${price.toFixed(2)}`;
    document.getElementById('shippingCost').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('totalCost').textContent = `$${(price + shipping).toFixed(2)}`;
}

function setupFormListeners() {
    const delivery = document.getElementById('delivery');
    if (delivery) {
        delivery.addEventListener('change', () => {
            const price = window.currentVinylData?.price || 0;
            calculateTotals(price);
        });
    }

    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (validateForm()) await processOrder();
        });
    }
}

function validateForm() {
    const requiredFields = ['fname','lname','email','address','city','postal','cardnumber','expdate','security','cardname','delivery'];
    for (let id of requiredFields) {
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
            alert('Please fill in all required fields.');
            el?.focus();
            return false;
        }
    }
    return true;
}

async function processOrder() {
    if (!window.currentVinylData) return alert('No vinyl selected.');

    const user = auth.currentUser;
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
        total: document.getElementById('totalCost').textContent,
        userId: user ? user.uid : null,
        userEmail: user ? user.email : null
    };

    try {
        await db.collection('orders').add({
            ...orderData,
            createdAt: new Date(),
            status: 'completed'
        });

        if (user) {
            const purchaseRecord = {
                vinyl: orderData.vinyl,
                orderId: orderData.orderId,
                purchaseDate: new Date(), 
                total: orderData.total,
                deliveryMethod: orderData.delivery,
                status: 'purchased'
            };

            const userRef = db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                await userRef.update({
                    purchasedVinyls: firebase.firestore.FieldValue.arrayUnion(purchaseRecord)
                });
            } else {
                await userRef.set({
                    name: user.displayName || orderData.customer.firstName + ' ' + orderData.customer.lastName,
                    email: user.email || orderData.customer.email,
                    createdAt: new Date(),
                    purchasedVinyls: [purchaseRecord]
                });
            }
        }

        localStorage.removeItem('currentVinyl');
        localStorage.removeItem('selectedVinyl');

        alert(`Thank you! Order ID: ${orderData.orderId}`);
        window.location.href = 'allvinyls.html';

    } catch(err) {
        console.error(err);
        alert('Error processing order. Check console for details.');
    }
}

function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2,5);
    return `VINYL-${timestamp}-${random}`.toUpperCase();
}

function showNoVinylMessage() {
    const orderItem = document.getElementById('vinylOrderItem');
    if(orderItem) orderItem.innerHTML = `<div style="text-align:center;padding:40px"><h3>No Vinyl Selected</h3><a href="allvinyls.html">Browse Vinyls</a></div>`;
    document.querySelector('.order-totals').style.display = 'none';
    document.querySelector('.checkout-form').style.display = 'none';
}
