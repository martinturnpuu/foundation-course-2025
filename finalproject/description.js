const API_URL =
  "https://itunes.apple.com/search?term=vinyl&media=music&entity=album&limit=130";


document.addEventListener('DOMContentLoaded', function() {
    loadAlbumDetails();
});

function loadAlbumDetails() {
    const vinylData = JSON.parse(localStorage.getItem('selectedVinyl'));
    
    if (vinylData) {
        displayAlbumDetails(vinylData);
    } else {
        displayError();
    }
}

function displayAlbumDetails(vinylData) {
    document.getElementById('albumTitle').textContent = vinylData.title;
    document.getElementById('albumArtist').textContent = vinylData.artist;
    document.getElementById('albumYear').textContent = vinylData.year;
    document.getElementById('albumGenre').textContent = vinylData.genre;
    document.getElementById('albumTracks').textContent = vinylData.trackCount || 'N/A';
    document.getElementById('albumPrice').textContent = `$${vinylData.price.toFixed(2)}`;
    
    const description = vinylData.description || generateDefaultDescription(vinylData);
    document.getElementById('albumDescription').textContent = description;
    
    const albumImage = document.getElementById('albumImage');
    albumImage.src = vinylData.image;
    albumImage.alt = `${vinylData.artist} - ${vinylData.title}`;  
    document.title = `Vinyl Shop - ${vinylData.title}`;
    localStorage.setItem('currentVinyl', JSON.stringify(vinylData));
}

function generateDefaultDescription(vinylData) {
    return `${vinylData.title} by ${vinylData.artist} is a ${vinylData.genre} album released in ${vinylData.year}. This limited edition vinyl features remastered audio quality and comes with a digital download code. The album showcases the artist's signature style and has been praised by critics for its production quality and musical innovation.`;
}

function displayError() {
    document.getElementById('albumTitle').textContent = 'Album Not Found';
    document.getElementById('albumDescription').textContent = 'Please return to the shop and select a vinyl to view details.';
    
    const albumDetails = document.querySelector('.album-details');
    if (albumDetails) {
        albumDetails.style.display = 'none';
    }
    
    const buyButton = document.querySelector('.buy-button');
    if (buyButton) {
        buyButton.style.display = 'none';
    }
}

function setupImageErrorHandling() {
    const albumImage = document.getElementById('albumImage');
    if (albumImage) {
        albumImage.addEventListener('error', function() {
            this.src = 'images/default-vinyl.jpg';
            this.alt = 'Default vinyl image';
        });
    }
}

setupImageErrorHandling();