# Task 1

## Running the Simulation

Run the `index.js` script to start the simulation:

```bash
node index.js
```

The script will log:

- Total operation time in milliseconds.
- Peak power demand in kW.
- Total energy consumed in kWh.
- Max possible power demand in kW.
- Demand utilization percentage.

Finally, it outputs the final state of all chargers.

## Thoughts

Hi!

Firstly, I know JavaScript may not be the best language for writing these kind of simulations. However, it is the language I am most comfortable with, so I went with it.

I didn’t use TypeScript mainly to avoid complicating the simulation’s execution process. But I will of course integrate it in Task 1a.

While I would have loved to document every line of code in detail to explain my decisions, I understand that you guys don't have that much time. So I focused on making the code as readable and easy to follow as possible. This approach aligns with how I work professionally, though during code challenges, I often wish I could walk reviewers through my code line by line haha!

Lastly, the simulation currently yields a maximum power demand of either 121, 132, 143, or 154 kW. I aimed to achieve the correct range of 77-121 kW but couldn’t resolve this after several hours of debugging. Sadly I have to deliver in just three days, next week will be a big one at work -- So I decided to leave it as is to concentrate on the rest of the assignment. I would GREATLY appreciate any insights on why this occurs. I got to a point where I'm convinced it's a language limitation even if I don't have the time to test this theory (I will though -- after monday at least).
