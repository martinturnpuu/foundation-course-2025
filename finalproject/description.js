// This file handles the dynamic loading of vinyl data on the description page

document.addEventListener('DOMContentLoaded', function() {
    console.log('Description page loaded');
    loadAlbumDetails();
    
    // Setup debug button
    document.getElementById('debugButton')?.addEventListener('click', function() {
        testLocalStorage();
    });
});

function loadAlbumDetails() {
    console.log('Loading album details...');
    
    // Get vinyl data from localStorage
    const vinylDataString = localStorage.getItem('selectedVinyl');
    console.log('Raw vinyl data from localStorage:', vinylDataString);
    
    if (!vinylDataString) {
        console.error('No vinyl data found in localStorage');
        displayError();
        return;
    }
    
    try {
        const vinylData = JSON.parse(vinylDataString);
        console.log('Parsed vinyl data:', vinylData);
        
        if (!vinylData || Object.keys(vinylData).length === 0) {
            throw new Error('Vinyl data is empty');
        }
        
        displayAlbumDetails(vinylData);
        
        // Set up the Buy Now button to save data for checkout
        setupBuyButton(vinylData);
        
    } catch (error) {
        console.error('Error parsing vinyl data:', error);
        displayError();
    }
}

function displayAlbumDetails(vinylData) {
    console.log('Displaying album details:', vinylData);
    
    // Update the page with vinyl data
    document.getElementById('albumTitle').textContent = vinylData.title || 'Unknown Album';
    document.getElementById('albumArtist').textContent = vinylData.artist || 'Unknown Artist';
    document.getElementById('albumYear').textContent = vinylData.year || 'Unknown Year';
    document.getElementById('albumGenre').textContent = vinylData.genre || 'Unknown Genre';
    document.getElementById('albumTracks').textContent = vinylData.trackCount || 'N/A';
    
    const price = vinylData.price || 24.99;
    document.getElementById('albumPrice').textContent = `$${price.toFixed(2)}`;
    
    // Format and display description
    const description = vinylData.description || generateDefaultDescription(vinylData);
    document.getElementById('albumDescription').textContent = description;
    
    // Set album image
    const albumImage = document.getElementById('albumImage');
    if (vinylData.image) {
        albumImage.src = vinylData.image;
        albumImage.alt = `${vinylData.artist} - ${vinylData.title}`;
    } else {
        albumImage.src = 'images/default-vinyl.jpg';
        albumImage.alt = 'Default vinyl image';
    }
    
    // Update page title
    document.title = `Vinyl Shop - ${vinylData.title}`;
    
    console.log('Album details displayed successfully');
}

function setupBuyButton(vinylData) {
    const buyButton = document.getElementById('buyButton');
    
    if (!buyButton) {
        console.error('Buy button not found');
        return;
    }
    
    buyButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log('Buy button clicked');
        
        // Save enhanced data for checkout
        saveVinylForCheckout(vinylData);
        
        // Navigate to checkout page
        window.location.href = 'checkout.html';
    });
}

function saveVinylForCheckout(vinylData) {
    // Create enhanced data object for checkout
    const checkoutData = {
        // Basic info
        artist: vinylData.artist || 'Unknown Artist',
        title: vinylData.title || 'Unknown Album',
        year: vinylData.year || 'Unknown Year',
        genre: vinylData.genre || 'Unknown Genre',
        price: vinylData.price || 24.99,
        image: vinylData.image || 'images/default-vinyl.jpg',
        
        // Additional details
        trackCount: vinylData.trackCount || 0,
        description: vinylData.description || generateDefaultDescription(vinylData),
        collectionId: vinylData.collectionId || '',
        artistId: vinylData.artistId || '',
        
        // Timestamp for ordering
        addedToCart: new Date().toISOString(),
        
        // Ensure we have a valid price number
        price: typeof vinylData.price === 'number' ? vinylData.price : 24.99
    };
    
    console.log('Saving to checkout:', checkoutData);
    
    // Save to localStorage under 'currentVinyl' key (for checkout page)
    localStorage.setItem('currentVinyl', JSON.stringify(checkoutData));
    
    // Also keep it under 'selectedVinyl' for reference
    localStorage.setItem('selectedVinyl', JSON.stringify(checkoutData));
    
    console.log('Data saved successfully to localStorage');
}

function generateDefaultDescription(vinylData) {
    const artist = vinylData.artist || 'Unknown Artist';
    const title = vinylData.title || 'Unknown Album';
    const year = vinylData.year || 'Unknown Year';
    const genre = vinylData.genre || 'Unknown Genre';
    const tracks = vinylData.trackCount || 0;
    
    return `${title} by ${artist} is a ${genre} album released in ${year}. 
    This limited edition vinyl features ${tracks} tracks and has been remastered 
    for optimal audio quality. Each purchase includes a digital download code 
    and a printed inner sleeve with artwork and lyrics.`;
}

function displayError() {
    console.log('Displaying error message');
    
    document.getElementById('albumTitle').textContent = 'Album Not Found';
    document.getElementById('albumDescription').textContent = 
        'Please return to the shop and select a vinyl to view details.';
    
    // Hide buy button if there's an error
    const buyButton = document.getElementById('buyButton');
    if (buyButton) {
        buyButton.style.display = 'none';
    }
    
    // Optionally hide other elements
    const albumDetails = document.querySelector('.album-details');
    if (albumDetails) {
        albumDetails.style.display = 'none';
    }
}

// Debug function (optional)
function testLocalStorage() {
    console.log('=== LOCALSTORAGE DEBUG ===');
    console.log('selectedVinyl:', localStorage.getItem('selectedVinyl'));
    console.log('currentVinyl:', localStorage.getItem('currentVinyl'));
    
    try {
        const selected = JSON.parse(localStorage.getItem('selectedVinyl') || '{}');
        const current = JSON.parse(localStorage.getItem('currentVinyl') || '{}');
        console.log('Parsed selectedVinyl:', selected);
        console.log('Parsed currentVinyl:', current);
    } catch (e) {
        console.error('Parse error:', e);
    }
    console.log('=== END DEBUG ===');
}

// Add error handling for images
const albumImage = document.getElementById('albumImage');
if (albumImage) {
    albumImage.addEventListener('error', function() {
        console.log('Image failed to load, using default');
        this.src = 'images/default-vinyl.jpg';
        this.alt = 'Default vinyl image';
    });
}