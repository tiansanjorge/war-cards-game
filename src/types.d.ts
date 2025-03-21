export interface Deck {
  success: boolean;
  deck_id: string;
  shuffled: boolean;
  remaining: number;
}

export interface CardsDrawn {
  success: boolean;
  deck_id: string;
  cards: [
    {
      code: string;
      image: string;
      images: {
        svg: string;
        png: string;
      };
      value: string;
      suit: string;
    },
    {
      code: string;
      image: string;
      images: {
        svg: string;
        png: string;
      };
      value: string;
      suit: string;
    }
  ];
  remaining: number;
}