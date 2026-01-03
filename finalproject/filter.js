const API_URL =
  "https://musicbrainz.org/ws/2/release/?query=vinyl&fmt=json&limit=130";

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchArtist')?.addEventListener('input', filterVinyls);
  document.getElementById('searchGenre')?.addEventListener('input', filterVinyls);
  document.getElementById('searchYear')?.addEventListener('input', filterVinyls);
  
  loadVinyls();
});

async function loadVinyls() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    renderVinyls(data.releases);
  } catch (error) {
    console.error("API error:", error);
  }
}

function renderVinyls(releases) {
  const gallery = document.getElementById('vinylGallery');
  
  if (!gallery) return;

  releases.forEach(release => {
    const artist = release["artist-credit"]?.[0]?.name || "Unknown Artist";
    const title = release.title || "Unknown Title";
    const year = release.date ? release.date.slice(0, 4) : "";
    const genre = "vinyl";

    const item = document.createElement("div");
    item.className = "gallery-item";

    item.dataset.artist = artist.toLowerCase();
    item.dataset.genre = genre.toLowerCase();
    item.dataset.year = year;

    item.innerHTML = `
      <div class="vinyl-effect">
        <img src="images/default.webp" alt="${artist} Vinyl">
      </div>
      <div class="desc">${artist} – ${title} ${year ? `(${year})` : ''}</div>
      <a href="description.html" class="buy-button">Buy Now - $24.99</a>
    `;

    gallery.appendChild(item);
  });
}

function filterVinyls() {
  const searchArtist = document.getElementById('searchArtist')?.value.toLowerCase() || '';
  const searchGenre = document.getElementById('searchGenre')?.value.toLowerCase() || '';
  const searchYear = document.getElementById('searchYear')?.value || '';
  
  const items = document.querySelectorAll('.gallery-item');
  
  items.forEach(item => {
    const artist = item.dataset.artist || '';
    const genre = item.dataset.genre || '';
    const year = item.dataset.year || '';
    
    const artistMatch = !searchArtist || artist.includes(searchArtist);
    const genreMatch = !searchGenre || genre.includes(searchGenre);
    const yearMatch = !searchYear || year.includes(searchYear);
    
    if (artistMatch && genreMatch && yearMatch) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}