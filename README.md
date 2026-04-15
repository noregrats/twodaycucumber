# Playwright + Cucumber + TypeScript Project

This project demonstrates end-to-end testing using [Playwright](https://playwright.dev/), [Cucumber.js](https://github.com/cucumber/cucumber-js), and TypeScript.

## Getting Started

### Install dependencies
```
npm install
```

### Run Cucumber BDD tests
```
npm test
```

### Run Playwright UI tests (if you add .spec.ts files)
```
npm run test:ui
```

## Project Structure
- `features/` - Gherkin feature files and step definitions
- `src/` - (Optional) Custom helpers or page objects
- `cucumber.js` - Cucumber configuration
- `tsconfig.json` - TypeScript configuration

## Example
See `features/example.feature` and `features/step_definitions/example.steps.ts` for a sample Google search scenario.

---

For more information, see the official docs:
- [Playwright](https://playwright.dev/)
- [Cucumber.js](https://github.com/cucumber/cucumber-js)
- [TypeScript](https://www.typescriptlang.org/)
