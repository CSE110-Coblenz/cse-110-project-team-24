import type { Museum, MuseumFact } from "./Museum.ts";

export const CHICAGO_MUSEUMS: Museum[] = [
  {
    id: "field",
    name: "Field Museum",
    imageUrl: "/chicago/field-museum.jpg",
  },
  {
    id: "art-institute",
    name: "Art Institute of Chicago",
    imageUrl: "/chicago/art-institute.jpg",
  },
  {
    id: "museum-science-industry",
    name: "Museum of Science & Industry",
    imageUrl: "/chicago/msi.jpg",
  },
  {
    id: "du-sable",
    name: "DuSable Black History Museum",
    imageUrl: "/chicago/dusable.jpg",
  },
  {
    id: "adler",
    name: "Adler Planetarium",
    imageUrl: "/chicago/adler.jpg",
  },
];

export const CHICAGO_MUSEUM_FACTS: MuseumFact[] = [
  {
    id: "fact-sue",
    museumId: "field",
    fact: "Home to Sue, the most complete T. rex ever found.",
    detail:
      "Sue the Tyrannosaurus rex was discovered in South Dakota in 1990 and is a centerpiece of the Field Museum’s fossil collection.",
  },
  {
    id: "fact-nighthawks",
    museumId: "art-institute",
    fact: "Displays Hopper’s iconic painting “Nighthawks.”",
    detail:
      "Edward Hopper’s 1942 masterpiece captures a late-night diner scene and is one of the Art Institute’s most visited works.",
  },
  {
    id: "fact-u505",
    museumId: "museum-science-industry",
    fact: "Showcases the captured WWII submarine U-505.",
    detail:
      "The U-505 exhibit dives into naval history with an actual German submarine captured by the U.S. Navy in 1944.",
  },
  {
    id: "fact-black-heritage",
    museumId: "du-sable",
    fact: "Celebrates African American art, history, and culture.",
    detail:
      "Founded in 1961, the DuSable Museum highlights stories of Black leaders, artists, and movements rooted in Chicago and beyond.",
  },
  {
    id: "fact-sky-show",
    museumId: "adler",
    fact: "Pioneered the first planetarium in the Western Hemisphere.",
    detail:
      "Opened in 1930, the Adler Planetarium’s sky shows and telescope gallery connect visitors to astronomy discoveries.",
  },
];
