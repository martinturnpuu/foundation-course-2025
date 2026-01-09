const API_URL =
  "https://itunes.apple.com/search?term=vinyl&media=music&entity=album&limit=130";

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
    renderVinyls(data.results || []);
  } catch (error) {
    console.error("API error:", error);
  }
}

function renderVinyls(releases) {
  const gallery = document.getElementById("vinylGallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  releases.forEach(release => {
    const artist = release.artistName || "Unknown Artist";
    const title = release.collectionName || "Unknown Title";
    const year = release.releaseDate
      ? release.releaseDate.slice(0, 4)
      : "";
    const genre = release.primaryGenreName || "vinyl";
    const image = release.artworkUrl100.replace("100x100", "300x300");

    const item = document.createElement("div");
    item.className = "gallery-item";

    item.dataset.artist = artist.toLowerCase();
    item.dataset.genre = genre.toLowerCase();
    item.dataset.year = year;

    item.innerHTML = `
      <div class="vinyl-effect">
        <img src="${image}" alt="${artist} Vinyl" loading="lazy">
      </div>

      <div class="desc">
        ${artist} – ${title} ${year ? `(${year})` : ""}
      </div>

      <a href="description.html" class="buy-button">
        Buy Now - $24.99
      </a>
    `;

    gallery.appendChild(item);
  });
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
