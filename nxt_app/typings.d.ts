export interface RickandmortyCharacter {
  id: number,
  name: string,
  status: string,
  species: string,
  type: string,
  gender: string,
  origin: {
    name: string,
    url: string
  },
  location: {
    name: string,
    url: string
  },
  image: string,
  episode: string[],
  url: string,
  created: string,
}

interface RickandmortyCharacterRes {
  info: {
    count: number,
    pages: number,
    next: string | null,
    prev: string | null,
  },
  results: RickandmortyCharacter[]
}

interface RickandmortyLocation {
  id:	number;
  name:	string;
  type:	string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

interface RickandmortyLocationRes {
  info: {
    count: number,
    pages: number,
    next: string | null,
    prev: string | null,
  },
  results: RickandmortyLocation[]
}
