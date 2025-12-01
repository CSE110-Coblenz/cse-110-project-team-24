/**
 * Washington DC Presidents and their accomplishments
 * Used for the memory matching card game
 */

export interface PresidentPair {
	president: string;
	accomplishment: string;
}

/**
 * Array of president-accomplishment pairs for the memory game
 * Focuses on presidents with strong DC connections or major accomplishments
 */
export const DC_PRESIDENT_PAIRS: PresidentPair[] = [
	{
		president: "George Washington",
		accomplishment: "Established Washington, D.C. as the capital",
	},
	{
		president: "Abraham Lincoln",
		accomplishment: "Issued the Emancipation Proclamation",
	},
	{
		president: "Thomas Jefferson",
		accomplishment: "Author of the Declaration of Independence",
	},
	{
		president: "Franklin D. Roosevelt",
		accomplishment: "Led the nation through the Great Depression and WWII",
	},
	{
		president: "John F. Kennedy",
		accomplishment: "Initiated the Apollo space program",
	},
	{
		president: "Theodore Roosevelt",
		accomplishment: "Established many national parks and conservation programs",
	},
	{
		president: "Ronald Reagan",
		accomplishment: "Played key role in ending the Cold War",
	},
	{
		president: "Barack Obama",
		accomplishment: "First African American president",
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
 * Check if a president and accomplishment form a valid match
 */
export function isValidMatch(president: string, accomplishment: string): boolean {
	const pair = DC_PRESIDENT_PAIRS.find(
		(p) => p.president === president && p.accomplishment === accomplishment
	);
	return pair !== undefined;
}

