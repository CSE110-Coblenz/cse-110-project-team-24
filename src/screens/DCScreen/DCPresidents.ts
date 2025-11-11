/**
 * Washington DC Presidents and their accomplishments
 * Used for the memory matching card game
 */

export interface PresidentPair {
	president: string;
	accomplishment: string;
	funFact?: string; // Optional fun fact to display after matching
}

/**
 * Array of president-accomplishment pairs for the memory game
 * Focuses on presidents with strong DC connections or major accomplishments
 */
export const DC_PRESIDENT_PAIRS: PresidentPair[] = [
	{
		president: "George Washington",
		accomplishment: "Established Washington, D.C. as the capital",
		funFact: "Washington never lived in the White House - it was completed after his death!",
	},
	{
		president: "Abraham Lincoln",
		accomplishment: "Issued the Emancipation Proclamation",
		funFact: "The Lincoln Memorial has 36 columns, representing the 36 states in the Union at the time of his death.",
	},
	{
		president: "Thomas Jefferson",
		accomplishment: "Author of the Declaration of Independence",
		funFact: "Jefferson designed the University of Virginia and was an accomplished architect.",
	},
	{
		president: "Franklin D. Roosevelt",
		accomplishment: "Led the nation through the Great Depression and WWII",
		funFact: "FDR served 4 terms, the only president to serve more than 2 terms.",
	},
	{
		president: "John F. Kennedy",
		accomplishment: "Initiated the Apollo space program",
		funFact: "JFK was the youngest person ever elected president at age 43.",
	},
	{
		president: "Theodore Roosevelt",
		accomplishment: "Established many national parks and conservation programs",
		funFact: "Teddy Roosevelt was the first president to ride in an airplane and travel outside the U.S. while in office.",
	},
	{
		president: "Ronald Reagan",
		accomplishment: "Played key role in ending the Cold War",
		funFact: "Reagan was a Hollywood actor before becoming president, starring in over 50 films.",
	},
	{
		president: "Barack Obama",
		accomplishment: "First African American president",
		funFact: "Obama won the Nobel Peace Prize in 2009, just months after taking office.",
	},
];

/**
 * Get all presidents from the pairs
 */
export function getAllPresidents(): string[] {
	return DC_PRESIDENT_PAIRS.map((pair) => pair.president);
}

/**
 * Get all accomplishments from the pairs
 */
export function getAllAccomplishments(): string[] {
	return DC_PRESIDENT_PAIRS.map((pair) => pair.accomplishment);
}

/**
 * Find the accomplishment for a given president
 */
export function getAccomplishmentForPresident(president: string): string | undefined {
	const pair = DC_PRESIDENT_PAIRS.find((p) => p.president === president);
	return pair?.accomplishment;
}

/**
 * Find the president for a given accomplishment
 */
export function getPresidentForAccomplishment(accomplishment: string): string | undefined {
	const pair = DC_PRESIDENT_PAIRS.find((p) => p.accomplishment === accomplishment);
	return pair?.president;
}

/**
 * Get fun fact for a president-accomplishment match
 */
export function getFunFact(president: string, accomplishment: string): string | undefined {
	const pair = DC_PRESIDENT_PAIRS.find(
		(p) => p.president === president && p.accomplishment === accomplishment
	);
	return pair?.funFact;
}

/**
 * Check if a president and accomplishment form a valid match
 */
export function isValidMatch(president: string, accomplishment: string): boolean {
	const pair = DC_PRESIDENT_PAIRS.find(
		(p) => p.president === president && p.accomplishment === accomplishment
	);
	return pair !== undefined;
}

