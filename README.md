# Task 1

## Running the Simulation

Run the `index.js` script to start the simulation:

```bash
node index.js
```

For each iteration, the script will log:

- The amount of chargers that's being used to feed the simulation
- Total operation time in milliseconds.
- Peak power demand in kW.
- Total energy consumed in kWh.
- Max possible power demand in kW.
- Demand utilization percentage.

Finally, it outputs the analytics calculated for the current iteration.

## Thoughts

Can't take credit for `calculateStatisticalSummary` and `calculateTrend` function as I just used resources available in my day-to-day life to look up how to figure out the relevant values -- and I also thought of something like `findPeakConcurrencyFactor` but I then quickly realized it would always return the value associated with a chargerCount of 1 😂
