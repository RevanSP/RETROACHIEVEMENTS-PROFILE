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
  onUsernameChange: (username: string) => void;
  onSearchClick: () => void;
  isSearching?: boolean;
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
  onImageClick: (imageUrl: string) => void;
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

export interface Props {
  searchQuery: string;
  currentGames: Game[];
  isSearching: boolean;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenModal: (gameID: number) => void;
  currentPage: number;
  paginate: (pageNumber: number) => void;
  pageNumbers: number[];
  handleInputFocus: () => void;
}

export interface Game {
  GameID: number;
  ImageIcon: string;
  Title: string;
  ConsoleName: string;
  PctWon: number;
  NumAwarded: number;
  MaxPossible: number;
  HardcoreMode: string;
}

export interface ModalPreviewProps {
  selectedImage: string | undefined;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// export interface GameInfo {
//   ImageBoxArt?: string;
//   Developer?: string;
//   Publisher?: string;
//   Genre?: string;
//   ConsoleName?: string;
//   Released?: string;
//   NumDistinctPlayers?: number;
//   NumAchievements?: number;
//   ImageIngame?: string;
//   ImageTitle?: string;
//   UserCompletion?: string;
//   UserCompletionHardcore?: string;
//   NumAwardedToUser?: number;
//   NumAwardedToUserHardcore?: number;
//   NumDistinctPlayersCasual?: number;
//   NumDistinctPlayersHardcore?: number;
//   GuideURL?: string;
//   ForumTopicID?: string;
//   ID?: number;
//   Achievements?: Record<string, any>;
// }

// export interface ModalGamesProps {
//   game: any;
//   activeGameID: number | null;
//   isLoading: boolean;
//   gameInfo: GameInfo | null;
//   sortedAchievements: any[];
//   handleImageClick: (imageUrl: string) => void;
//   handleCloseModal: () => void;
// }