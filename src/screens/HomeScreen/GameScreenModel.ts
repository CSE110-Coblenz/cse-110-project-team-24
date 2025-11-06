/**
 * GameScreenModel - Manages map state and travel rules
 */
export type City =
	| "Boston"
	| "Washington, D.C."
	| "Chicago"
	| "New York"
	| "Los Angeles"
	| "San Diego";

export interface MapGraph {
	cities: City[];
	adjacency: Record<City, City[]>;
}

export class GameScreenModel {
	private graph: MapGraph;
	private currentCity: City;

	constructor() {
		this.graph = {
			cities: [
				"Boston",
				"Washington, D.C.",
				"Chicago",
				"New York",
				"Los Angeles",
				"San Diego",
			],
			adjacency: {
				"Boston": ["New York"],
				"New York": ["Boston", "Washington, D.C.", "Chicago"],
				"Washington, D.C.": ["New York"],
				"Chicago": ["New York", "Los Angeles"],
				"Los Angeles": ["Chicago", "San Diego"],
				"San Diego": ["Los Angeles"],
			},
		};
		this.currentCity = "Boston";
	}

	/**
	 * Reset state to defaults (starting city and same graph)
	 */
	reset(): void {
		this.currentCity = "Boston";
	}

	getGraph(): MapGraph {
		return this.graph;
	}

	getCities(): City[] {
		return this.graph.cities;
	}

	getEdges(): Array<[City, City]> {
		const edges: Array<[City, City]> = [];
		for (const from of this.graph.cities) {
			for (const to of this.graph.adjacency[from]) {
				// Avoid duplicates by enforcing lexical order
				if (from < to) edges.push([from, to]);
			}
		}
		return edges;
	}

	getCurrentCity(): City {
		return this.currentCity;
	}

	getConnectedCities(from?: City): City[] {
		const city = from ?? this.currentCity;
		return this.graph.adjacency[city] ?? [];
	}

	canTravelTo(destination: City): boolean {
		return this.getConnectedCities().includes(destination);
	}

	travelTo(destination: City): boolean {
		if (!this.canTravelTo(destination)) return false;
		this.currentCity = destination;
		return true;
	}
}
