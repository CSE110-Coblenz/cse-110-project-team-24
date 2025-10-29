/**
 * New York City facts organized in pairs
 * Each pair will be displayed simultaneously on two taxis
 * One fact is true, the other is false
 */
export interface FactPair {
  fact1: string;
  fact2: string;
  fact1IsTrue: boolean; // true if fact1 is true, false if fact2 is true
}

/**
 * Array of fact pairs about New York City
 */
export const NEW_YORK_FACT_PAIRS: FactPair[] = [
  {
    fact1: "NYC has over 800 languages spoken", // TRUE
    fact2: "NYC has only 5 languages spoken", // FALSE
    fact1IsTrue: true,
  },
  {
    fact1: "NYC was never the US capital", // FALSE
    fact2: "NYC was the US capital (1785-1790)", // TRUE
    fact1IsTrue: false,
  },
  {
    fact1: "The NYC subway runs 24/7", // TRUE
    fact2: "The NYC subway closes at midnight", // FALSE
    fact1IsTrue: true,
  },
  {
    fact1: "Over 200 million tourists visit yearly", // FALSE
    fact2: "Over 50 million tourists visit yearly", // TRUE
    fact1IsTrue: false,
  },
  {
    fact1:
      "NYC has 5 boroughs: Manhattan, Brooklyn, Queens, Bronx, Staten Island", // TRUE
    fact2: "NYC has only 3 boroughs", // FALSE
    fact1IsTrue: true,
  },
  {
    fact1: "The Brooklyn Bridge opened in 1783", // FALSE
    fact2: "The Brooklyn Bridge opened in 1883", // TRUE
    fact1IsTrue: false,
  },
  {
    fact1: "NYC has over 13,000 yellow taxis", // TRUE
    fact2: "NYC has less than 5,000 yellow taxis", // FALSE
    fact1IsTrue: true,
  },
  {
    fact1: "NYC consumes 10 billion gallons of water daily", // FALSE
    fact2: "NYC consumes 1 billion gallons of water daily", // TRUE
    fact1IsTrue: false,
  },
];

/**
 * Get a specific fact pair by index
 * @param index - Index of the fact pair (0-based)
 * @returns The FactPair at the given index, or the first one if index is out of bounds
 */
export function getFactPairByIndex(index: number): FactPair {
  if (index < 0 || index >= NEW_YORK_FACT_PAIRS.length) {
    return NEW_YORK_FACT_PAIRS[0];
  }
  return NEW_YORK_FACT_PAIRS[index];
}

/**
 * Check if fact1 or fact2 is the correct (true) answer
 * @param factPair - The fact pair to check
 * @returns 1 if fact1 is true, 2 if fact2 is true
 */
export function getCorrectFactIndex(factPair: FactPair): 1 | 2 {
  return factPair.fact1IsTrue ? 1 : 2;
}
