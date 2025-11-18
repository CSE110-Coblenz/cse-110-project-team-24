export interface Museum {
  id: string;
  name: string;
  imageUrl: string;
}

export interface MuseumFact {
  id: string;
  museumId: string;
  fact: string;
  detail: string;
}
