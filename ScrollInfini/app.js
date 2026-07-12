const imagesList = document.querySelector(".images-list");
const errorMsg = document.querySelector(".error-msg");
const loader = document.querySelector(".loader");
const currentQueryLabel = document.querySelector(".current-query");
const scrollToTopBtn = document.querySelector(".scroll-to-top");
const input = document.querySelector("#search");
const form = document.querySelector("form");
let searchQuery = "random";
let pageIndex = 1;
let isFetching = false;
let hasMorePages = true;

async function fetchData() {
  if (isFetching || !hasMorePages) return;
  isFetching = true;
  loader.classList.add("visible");
  errorMsg.textContent = "";

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchQuery}&client_id=5zAgNdRrf65ZvvBBrduhxcOJXjnIEzxv4TkeQJCMMbA`,
    );

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      imagesList.textContent = "";
      throw new Error("Aucun résultat trouvé. Essayez un mot-clé différent !");
    }
    const totalPages = data.total_pages;
    if (pageIndex >= totalPages) {
      hasMorePages = false;
    }
    createImages(data.results);
    currentQueryLabel.textContent = `"${searchQuery}" — page ${pageIndex} / ${totalPages}`;
  } catch (error) {
    errorMsg.textContent = error.message;
  } finally {
    loader.classList.remove("visible");
    isFetching = false;
  }
}
fetchData();

function createImages(data) {
  data.forEach((imgData) => {
    const figure = document.createElement("figure");
    figure.classList.add("img-card");
    const img = document.createElement("img");
    img.src = imgData.urls.regular;
    img.alt = imgData.alt_description || "Photo Unsplash";

    img.loading = "lazy";

    const caption = document.createElement("figcaption");
    caption.textContent = `📷 ${imgData.user.name}`;

    figure.appendChild(img);
    figure.appendChild(caption);
    imagesList.appendChild(figure);
  });
}

const observer = new IntersectionObserver(handleIntersect, {
  rootMargin: "200%",
});

observer.observe(document.querySelector(".infinite-marker"));

function handleIntersect(entries) {
  if (entries[0].isIntersecting) {
    if (imagesList.children.length > 0) {
      pageIndex++;
      fetchData();
    }
  }
}

form.addEventListener("submit", handleSearch);

function handleSearch(e) {
  e.preventDefault();
  const trimmed = input.value.trim();

  if (!trimmed) {
    errorMsg.textContent = "Le champ de recherche ne peut pas être vide.";
    return;
  }

  if (trimmed.toLowerCase() === searchQuery.toLowerCase() && pageIndex > 1) {
    return;
  }

  imagesList.textContent = "";
  errorMsg.textContent = "";
  searchQuery = trimmed;
  pageIndex = 1;
  hasMorePages = true;

  fetchData();
}
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 400) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  },
  { passive: true },
);
