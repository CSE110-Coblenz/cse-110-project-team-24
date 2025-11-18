/**
 * PostcardScreenModel - Manages postcard view state
 */

// Postcard interface
export interface Postcard {
    title: string;
    postcardImageSrc: string;
    xPos: number;
    yPos: number;
}


export class PostcardScreenModel {

    // Add a property to hold the postcards
    private postcards: Postcard[] = [];

    // Keeps track of view state
    private isZoomedIn: boolean = false;

    constructor() {
        // Initialize postcards
        //Note: xPos and yPos are relative to percentages of screen size
        this.postcards = [
                        {
                title: "Boston",
                postcardImageSrc: "/public/Postcards/BostonPostcard.jpg",
                xPos: 42,
                yPos: 65,
            },
            {
                title: "New York",
                postcardImageSrc: "/public/Postcards/NewYorkPostcard.jpg",
                xPos: 80,
                yPos: 80,
            },
            {
                title: "Washington DC",
                postcardImageSrc: "/public/Postcards/DCPostcard.jpg",
                xPos: 15,
                yPos: 85,
            },
            {
                title: "San Francisco",
                postcardImageSrc: "/public/Postcards/SFPostcard.jpg",
                xPos: 20,
                yPos:15,
            },
            {
                title: "Los Angeles",
                postcardImageSrc: "/public/Postcards/LAPostcard.jpg",
                xPos: 55,
                yPos: 25,
            },
            {
                title: "San Diego",
                postcardImageSrc: "/public/Postcards/SanDiegoPostcard.jpg",
                xPos: 85,
                yPos: 15,
            },





        ];
    }

    // Displays the postcards which are unlocked
    getActivePostcards(): Postcard[] {
        //TODO: Create an array of only postcards unlocked
        //TODO: Order the array in the order the player collected the cards
        return this.postcards;
    }

    // Zoom in on a postcard
    getIsZoomedIn(): boolean {
        return this.isZoomedIn;
    }
    setIsZoomedIn(zoomedIn: boolean): void {
        this.isZoomedIn = zoomedIn;
    }

}
