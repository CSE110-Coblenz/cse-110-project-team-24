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
        this.postcards = [
                        {
                title: "Boston",
                postcardImageSrc: "/public/Postcards/BostonPostcard.jpg",
                xPos: 700,
                yPos: -900,
            },
            {
                title: "New York",
                postcardImageSrc: "/public/Postcards/NewYorkPostcard.jpg",
                xPos: 1500,
                yPos: 0,
            },
            {
                title: "Washington DC",
                postcardImageSrc: "/public/Postcards/DCPostcard.jpg",
                xPos: -1600,
                yPos: 0,
            },
            {
                title: "San Francisco",
                postcardImageSrc: "/public/Postcards/SFPostcard.jpg",
                xPos: -700,
                yPos: -900,
            },
            {
                title: "Los Angeles",
                postcardImageSrc: "/public/Postcards/LAPostcard.jpg",
                xPos: 500,
                yPos: 600,
            },
            {
                title: "San Diego",
                postcardImageSrc: "/public/Postcards/SanDiegoPostcard.jpg",
                xPos: -1300,
                yPos: 950,
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
