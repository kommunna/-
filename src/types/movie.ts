export type EveningMood =
  | 'cozy' // Уют и спокойствие
  | 'thriller' // Мурашки и интрига
  | 'comedy' // Легкость и смех
  | 'aesthetic' // Визуальный шедевр
  | 'deep' // Пища для ума
  | 'romantic'; // Романтика

export type CompanyType = 'solo' | 'couple' | 'friends' | 'family';

export type DurationCategory = 'short' | 'standard' | 'epic'; // <105m, 105-140m, >140m

export interface Movie {
  id: string;
  kinopoiskId?: number;
  posterPath: string;
  title: string;
  originalTitle: string;
  year: number;
  duration: number; // in minutes
  genres: string[];
  ratingKp: number;
  ratingImdb: number;
  ageRating: string;
  director: string;
  country: string;
  shortTagline: string;
  synopsis: string;
  moods: EveningMood[];
  suitableFor: CompanyType[];
  eveningVerdict: {
    whyTonight: string;
    atmosphere: string;
    pairings: {
      foodOrDrink: string;
      lightAndSetup: string;
      bestAudience: string;
    };
    vibeMetrics: {
      tension: number; // 0 to 100
      coziness: number;
      humor: number;
      depth: number;
      visuals: number;
    };
  };
  cast: {
    name: string;
    role: string;
  }[];
  trivia: string[];
  streaming: {
    name: string;
    type: 'included' | 'rent';
    available: boolean;
  }[];
  youtubeTrailerId: string;
  posterVisual: {
    gradient: string;
    accent: string;
    iconSymbol: string;
    quoteSnippet: string;
    textureStyle: string;
  };
}
