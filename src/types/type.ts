/* eslint-disable @typescript-eslint/no-explicit-any */
// types/type.ts

export interface UserProfileData {
  User: string;
  UserPic: string | null;
  Motto: string;
  MemberSince: string | null;
  RichPresenceMsg: string | null;
  TotalPoints: number;
  TotalSoftcorePoints: number;
  TotalTruePoints: number;
  LastGameID: number | null;
  ID: number;
  Permissions: string;
}

export interface NavbarProps {
  username: string;
  onUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface UserCompletedGame {
  GameID: number;
  Title: string;
  ImageIcon: string;
  PctWon: number;
  ConsoleName: string;  
  NumAwarded: number;   
  MaxPossible: number;  
  HardcoreMode: string;  
}

// src/types/type.ts
export interface UserAward {
  AwardData: string;        // Unique identifier for the award
  Title: string;            // Title of the award
  ConsoleName: string;      // Console associated with the award
  AwardType: string;        // Award type (e.g., "Game Beaten", "Mastery/Completion")
  AwardedAt: string;        // Date when the award was granted
  ImageIcon: string;        // URL or path to the award image
}

// src/types/type.ts
export interface UseUserProfileResponse {
  userData: UserProfileData | null;
  completedGames: UserCompletedGame[] | null;
  userAwards: UserAward[] | null;
  loading: boolean;
  error: string | null;
  fetchGameInfo: (gameID: number) => Promise<void>;  // Add the fetchGameInfo function signature
  gameInfo: any | null;  // Add the gameInfo property to store the game data
}


export interface UserCompletedGame {
  GameID: number;           // Unique identifier for the game
  Title: string;            // The title of the game
  ConsoleName: string;      // The name of the console the game is for
  PctWon: number;           // The percentage of achievements the user has completed for this game (0-1 scale)
  NumAwarded: number;       // The number of achievements awarded
  MaxPossible: number;      // The maximum number of achievements that can be earned for this game
  ImageIcon: string;        // URL for the game's icon image
  HardcoreMode: string;     // "1" if the game was completed in Hardcore Mode, otherwise "0"
}
