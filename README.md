# Flowerbed

Flowerbed is a speculative frontend project built for a counterfactual world in which drug governance, black-market exchange, platform economics, and socialist distribution systems have fused into a single everyday marketplace.

This website presents Flowerbed Market as a simulated darknet-style trading interface. It is not a real purchasing system. Instead, it is a narrative tool for showing how platform logic, state control, and class exploitation can be hidden inside familiar interface patterns.

## Project Concept

In this fictional setting:

- `Byte coin` is the transaction currency used in exchange.
- drug tickets and drug-linked vouchers are themselves part of the goods being sold, traded, and circulated.
- the buyer is pushed toward more consumption through performance language, scarcity cues, and algorithmic ranking.
- the system view reveals how promotion, visibility, and pricing are coordinated behind the scenes.

The project is part of a larger script-based speculative work centered on:

- black-market voucher circulation
- state rationing and productivity governance
- platform-style recommendation manipulation
- the hidden cooperation between regulation and extraction

## Current Features

- Buyer view for browsing an endless flood of manipulated listings
- System view for exposing pricing pressure, feed share, and promotion bias
- Dynamic pricing model that reacts to demand, exposure, productivity pressure, and wallet state
- Infinite-scroll product feed with weighted reappearance logic
- Promotion controls that influence which products surface in buyer view
- Round reset button for live presentation and repeated simulation
- Foldable header for easier browsing during demos
- Flowerbed-specific branding and custom icon integration

## Tech Stack

- Vue 3
- Vite
- Plain CSS

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

- `src/App.vue`
  Main simulation flow, view switching, round logic, and feed rendering.
- `src/components/`
  UI components including the header, product cards, banners, and reflection modal.
- `src/data/products.js`
  Speculative product and voucher catalog used as the base family data.
- `src/utils/pricing.js`
  Hidden pricing logic for the black-box market simulation.
- `src/utils/feed.js`
  Endless-feed generation and ranking logic for buyer view.

## Notes

- This project is a critical design/speculative design work, not an endorsement of drug trade or exploitative platform systems.
- The interface intentionally mimics persuasive and extractive digital marketplaces in order to critique them.
- The current implementation focuses on the frontend simulation and narrative presentation rather than backend realism.
