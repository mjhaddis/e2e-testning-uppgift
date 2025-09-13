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
    cy.intercept("GET", "**/search").as("search");
    cy.get("#searchText").type("matrix");
    cy.get("#search").click();
  });
});
