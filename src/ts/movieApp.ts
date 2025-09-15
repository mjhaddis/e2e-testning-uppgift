import { IMovie } from "./models/Movie";
import { getData } from "./services/movieService";
import { movieSort } from "./functions";

let movies: IMovie[] = [];
let currentOrder: "asc" | "desc" = "asc";

export const init = () => {
  let form = document.getElementById("searchForm") as HTMLFormElement;
  const btnAsc = document.getElementById("sortAsc") as HTMLButtonElement;
  const btnDesc = document.getElementById("sortDesc") as HTMLButtonElement;

  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    handleSubmit();
  });

  btnAsc.addEventListener("click", () => {
    currentOrder = "asc";
    render();
    setActiveButtons();
  });

  btnDesc.addEventListener("click", () => {
    currentOrder = "desc";
    render();
    setActiveButtons();
  });

  setActiveButtons();
};

export async function handleSubmit() {
  let searchText = (document.getElementById("searchText") as HTMLInputElement)
    .value;

  let container: HTMLDivElement = document.getElementById(
    "movie-container"
  ) as HTMLDivElement;
  container.innerHTML = "";

  try {
    movies = await getData(searchText);

    if (movies.length > 0) {
      createHtml(movies, container);
    } else {
      displayNoResult(container);
    }
  } catch {
    displayNoResult(container);
  }
}

function render() {
  const container = document.getElementById(
    "movie-container"
  ) as HTMLDivElement;
  container.innerHTML = "";

  if (!movies || movies.length === 0) {
    displayNoResult(container);
    return;
  }

  const wantAsc = currentOrder === "asc";

  const sorted = movieSort([...movies], wantAsc ? true : false);

  createHtml(sorted, container);
}

function setActiveButtons() {
  const btnAsc = document.getElementById("sortAsc") as HTMLButtonElement;
  const btnDesc = document.getElementById("sortDesc") as HTMLButtonElement;

  const activeClass = "active-sort";
  btnAsc.classList.toggle(activeClass, currentOrder === "asc");
  btnDesc.classList.toggle(activeClass, currentOrder === "desc");
}

export const createHtml = (movies: IMovie[], container: HTMLDivElement) => {
  for (let i = 0; i < movies.length; i++) {
    let movie = document.createElement("div");
    let title = document.createElement("h3");
    let img = document.createElement("img");

    movie.classList.add("movie");
    title.innerHTML = movies[i].Title;
    img.src = movies[i].Poster;
    img.alt = movies[i].Title;

    movie.appendChild(title);
    movie.appendChild(img);

    container.appendChild(movie);
  }
};

export const displayNoResult = (container: HTMLDivElement) => {
  let noMessage = document.createElement("p");

  noMessage.innerHTML = "Inga sökresultat att visa";

  container.appendChild(noMessage);
};
