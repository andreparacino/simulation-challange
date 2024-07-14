export const calculateTrend = (results) => {
  const n = results.length;
  const x = results.map((result) => result.chargersCount);
  const y = results.map((result) => result.concurrencyFactor);

  const sumX = x.reduce((acc, val) => acc + val, 0);
  const sumY = y.reduce((acc, val) => acc + val, 0);
  const sumXY = x.reduce((acc, val, idx) => acc + val * y[idx], 0);
  const sumXX = x.reduce((acc, val) => acc + val * val, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

export const calculateStatisticalSummary = (results) => {
  const concurrencyFactors = results.map((result) => result.concurrencyFactor);
  const length = results.length;

  const mean = concurrencyFactors.reduce((acc, val) => acc + val, 0) / length;
  const median = concurrencyFactors.sort((a, b) => a - b)[
    Math.floor(length / 2)
  ];
  const variance =
    concurrencyFactors.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    length;
  const standardDeviation = Math.sqrt(variance);

  return { mean, median, standardDeviation, variance };
};
