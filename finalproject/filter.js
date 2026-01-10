const API_URL =
  "https://itunes.apple.com/search?term=vinyl&media=music&entity=album&limit=130";

let releasesData = [];

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchArtist")
    ?.addEventListener("input", filterVinyls);

  document
    .getElementById("searchGenre")
    ?.addEventListener("input", filterVinyls);

  document
    .getElementById("searchYear")
    ?.addEventListener("input", filterVinyls);

  loadVinyls();
});

async function loadVinyls() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    releasesData = data.results || [];
    renderVinyls(releasesData);
  } catch (error) {
    console.error("API error:", error);
  }
}

function renderVinyls(releases) {
  const gallery = document.getElementById("vinylGallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  releases.forEach((release, index) => {
    const artist = release.artistName || "Unknown Artist";
    const title = release.collectionName || "Unknown Title";
    const year = release.releaseDate
      ? release.releaseDate.slice(0, 4)
      : "";
    const genre = release.primaryGenreName || "vinyl";
    const image = release.artworkUrl100.replace("100x100", "300x300");
    const price = release.collectionPrice || 24.99;

    const item = document.createElement("div");
    item.className = "gallery-item";

    item.dataset.artist = artist.toLowerCase();
    item.dataset.genre = genre.toLowerCase();
    item.dataset.year = year;
    item.dataset.index = index; 

    item.innerHTML = `
      <div class="vinyl-effect">
        <img src="${image}" alt="${artist} Vinyl" loading="lazy">
      </div>

      <div class="desc">
        ${artist} – ${title} ${year ? `(${year})` : ""}
      </div>

      <a href="description.html" class="buy-button" data-index="${index}">
        Buy Now - $${price.toFixed(2)}
      </a>
    `;

    gallery.appendChild(item);
  });

  setTimeout(() => {
    const buyButtons = document.querySelectorAll('.buy-button[data-index]');
    buyButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const index = parseInt(this.getAttribute('data-index'));
        const release = releases[index];
        
        if (release) {
          const vinylData = {
            artist: release.artistName,
            title: release.collectionName,
            year: release.releaseDate ? release.releaseDate.slice(0, 4) : "",
            genre: release.primaryGenreName,
            image: release.artworkUrl100.replace("100x100", "600x600"),
            price: release.collectionPrice || 24.99,
            trackCount: release.trackCount,
            copyright: release.copyright,
            country: release.country,
            collectionId: release.collectionId,
            artistId: release.artistId,
            description: generateAlbumDescription(release)
          };
     
          localStorage.setItem('selectedVinyl', JSON.stringify(vinylData));
          window.location.href = 'description.html';
        }
      });
    });
  }, 100);
}

function generateAlbumDescription(release) {
  const artist = release.artistName || "Unknown Artist";
  const title = release.collectionName || "Unknown Title";
  const year = release.releaseDate ? release.releaseDate.slice(0, 4) : "";
  const genre = release.primaryGenreName || "music";
  const tracks = release.trackCount || 0;
  
  return `${title} by ${artist} is a critically acclaimed ${genre} album released in ${year}. Featuring ${tracks} tracks, this album showcases ${artist}'s musical evolution and creative vision. The vinyl edition includes premium 180-gram audiophile pressing, a printed inner sleeve with lyrics and artwork, and a digital download card. Limited pressing available, ensuring collectible value for music enthusiasts.`;
}

function filterVinyls() {
  const searchArtist =
    document.getElementById("searchArtist")?.value.toLowerCase() || "";
  const searchGenre =
    document.getElementById("searchGenre")?.value.toLowerCase() || "";
  const searchYear =
    document.getElementById("searchYear")?.value || "";

  const items = document.querySelectorAll(".gallery-item");

  items.forEach(item => {
    const artist = item.dataset.artist || "";
    const genre = item.dataset.genre || "";
    const year = item.dataset.year || "";

    const artistMatch = !searchArtist || artist.includes(searchArtist);
    const genreMatch = !searchGenre || genre.includes(searchGenre);
    const yearMatch = !searchYear || year.includes(searchYear);

    item.style.display =
      artistMatch && genreMatch && yearMatch ? "block" : "none";
  });
}

document.getElementById('searchArtist')?.addEventListener('input', function() {
  const value = this.value.toLowerCase();
  if (value.length > 0) {
    console.log('Searching for artist:', value);
  }
});

function clearFilters() {
  document.getElementById('searchArtist').value = '';
  document.getElementById('searchGenre').value = '';
  document.getElementById('searchYear').value = '';
  filterVinyls();
}