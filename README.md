# Task 2a

## Run the Simulation web app

```bash
cd task2a
yarn install
yarn dev
```

## Thoughts

I didn’t need a worker for lighter simulations, but I didn’t want the UI to become unresponsive lol. That would definitely happen if you increased the number of chargers.

If prop drilling had become any worse in `SimulationInput/index.tsx` (more nested levels), I would have implemented the Context API.

Given the size of the UI layer, using a router solution seemed like over-engineering.

One improvement I would have made is implementing a `useStickyState` (a combination of `useState` and local storage) to preserve the simulation state across rerenders.

Unfortunately, I didn’t have time to ensure the UI components had consistent styling across browsers, so please run the simulation on Chrome, Arc, or other Chromium-based browsers.
