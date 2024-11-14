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
}

export interface UserAward {
  AwardData: string;            
  Title: string;                
  AwardType: string;            
  ImageIcon: string;            
  ConsoleName: string;          
  AwardedAt: string;          
}

export interface UseUserProfileResponse {
  userData: UserProfileData | null;
  completedGames: UserCompletedGame[] | null;
  userAwards: UserAward[] | null;
  loading: boolean;
  error: string | null;
}
