describe("Movie search tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have no movies from start", () => {
    cy.get("div#movie-container").children().should("have.length", 0);
  });

  it("should display message from empty/invalid input", () => {
    cy.get("form#searchForm").should("exist");
    cy.get("input#searchText").should("exist");
    const button = cy.get("button#search").should("exist");

    button.click();

    cy.get("div#movie-container").children().should("have.length.at.least", 1);
  });

  it("should show mocked movie", () => {
    cy.intercept("GET", "**/omdbapi.com/**", {
      statusCode: 200,
      body: {
        Search: [{ Title: "The Matrix", Year: "1999" }],
        totalResults: "1",
        Response: "True",
      },
    });

    cy.get("#searchText").type("Matrix");

    const button = cy.get("button#search").should("exist");
    button.click();

    cy.get("#movie-container").children().should("have.length", 1);
    cy.get("#movie-container")
      .children()
      .first()
      .should("have.text", "The Matrix");
  });

  it("should display data from movie API", () => {
    cy.intercept("GET", "**/omdbapi.com/**").as("search");
    cy.get("#searchText").type("matrix");

    cy.get("#search").click();

    cy.get("#movie-container").should("have.descendants", ".movie");
  });

  it("should be able to sort movies by asc/desc title", () => {
    cy.intercept("GET", "**/omdbapi.com/**", {
      statusCode: 200,
      body: {
        Search: [
          {
            Title: "C Movie",
            Year: "2001",
            imdbID: "id1",
            Type: "movie",
            Poster: "N/A",
          },
          {
            Title: "A Movie",
            Year: "2002",
            imdbID: "id2",
            Type: "movie",
            Poster: "N/A",
          },
          {
            Title: "B Movie",
            Year: "2003",
            imdbID: "id3",
            Type: "movie",
            Poster: "N/A",
          },
        ],
      },
    }).as("search");

    cy.get("#searchText").type("test");
    cy.get("#search").click();

    cy.get("#sortAsc").click();
    cy.get(".movie h3").first().should("have.text", "A Movie");
    cy.get(".movie h3").last().should("have.text", "C Movie");

    cy.get("#sortDesc").click();
    cy.get(".movie h3").first().should("have.text", "C Movie");
    cy.get(".movie h3").last().should("have.text", "A Movie");
  });
});
