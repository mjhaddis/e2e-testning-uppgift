describe("Movie search tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have no movies from start", () => {
    cy.get("div#movie-container").children().should("have.length", 0);
  });

  it("should display message from empty/invalid input", () => {
    const form = cy.get("form#searchForm").should("exist");
    const input = cy.get("input#searchText").should("exist");
    const button = cy.get("button#search").should("exist");

    button.click();

    cy.get("div#movie-container").children().should("have.length.at.least", 1);
  });

  it("should display data from movie API", () => {
    cy.intercept("GET", "**/search").as("search");
    cy.get("#searchText").type("matrix");
    cy.get("#search").click();
  });
});
