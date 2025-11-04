/**
 * PostcardScreenModel - Manages postcard view state
 */

// Psotcard interface
export interface Postcard {
    title: string;
    description: string;
    postcardImageSrc: string;
    xPos: number;
    yPos: number;
}

export class PostcardScreenModel {

    // Add a property to hold the postcards
    private postcards: Postcard[] = [];

    constructor() {
        // Initialize postcards
        this.postcards = [
            {
                title: "San Diego",
                description: "A beautiful postcard from San Diego.",
                postcardImageSrc: "/public/Postcards/SanDiegoPostcard.jpg",
                xPos: -1300,
                yPos: 700,
            },
            {
                title: "Boston",
                description: "A charming postcard from Boston.",
                postcardImageSrc: "/public/Postcards/BostonPostcard.jpg",
                xPos: 700,
                yPos: -500,
            },
        ];
    }

    // Displays the postcards which are unlocked
    getActivePostcards(): Postcard[] {
        //TODO: Create an array of only postcards unlocked
        //TODO: Order the array in the order the player collected the cards
        return this.postcards;
    }
}
