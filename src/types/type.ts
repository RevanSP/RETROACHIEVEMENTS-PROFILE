/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface UserAward {
  AwardData: string;
  Title: string;
  ConsoleName: string;
  AwardType: string;
  AwardedAt: string;
  ImageIcon: string;
}

export interface UseUserProfileResponse {
  awardCounts: AwardCounts | null;
  userData: UserProfileData | null;
  completedGames: UserCompletedGame[] | null;
  userAwards: UserAward[] | null;
  loading: boolean;
  error: string | null;
  fetchGameInfo: (gameID: number) => Promise<void>;
  gameInfo: any | null;
}

export interface AwardCounts {
  TotalAwardsCount: number;
  HiddenAwardsCount: number;
  MasteryAwardsCount: number;
  CompletionAwardsCount: number;
  BeatenHardcoreAwardsCount: number;
  BeatenSoftcoreAwardsCount: number;
  EventAwardsCount: number;
  SiteAwardsCount: number;
}

export interface UserCompletedGame {
  GameID: number;
  Title: string;
  ConsoleName: string;
  PctWon: number;
  NumAwarded: number;
  MaxPossible: number;
  ImageIcon: string;
  HardcoreMode: string;
}

export interface CardUserProfileProps {
  userData: UserProfileData | null;
  awardCounts: AwardCounts | null;
}

export interface SearchProps {
  username: string;
  onUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface Award {
  AwardData: string;
  ImageIcon: string;
  Title: string;
  ConsoleName: string;
  AwardType: string;
  AwardedAt: string;
}

export interface CardUserAwardsProps {
  userAwards: Award[];
}