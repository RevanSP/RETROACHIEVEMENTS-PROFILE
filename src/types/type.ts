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

export interface GameRankAndScore {
  User: string;
  NumAchievements: number;
  TotalScore: number;
  LastAward: string;
}

export interface UserAward {
  AwardData: string;
  Title: string;
  ConsoleName: string;
  AwardType: string;
  AwardedAt: string;
  ImageIcon: string;
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
  userAwards: UserAward[];
  getConsoleIcon: (consoleName: string) => string;
}

export interface LeaderboardEntry {
  User: string;
  DateSubmitted: string;
  Score: number;
  FormattedScore: string;
  Rank: number;
}

export interface GroupedAward {
  Title: string;
  ImageIcon: string;
  ConsoleName: string;
  AwardedAt: string;
  allAwards: UserAward[];
  hasMastery: boolean;
  hasBeaten: boolean;
}

export interface Props {
  searchQuery: string;
  currentGames: UserCompletedGame[];
  isSearching: boolean;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenModal: (gameID: number) => void;
  currentPage: number;
  paginate: (pageNumber: number) => void;
  pageNumbers: number[];
  handleInputFocus: () => void;
  getConsoleIcon: (consoleName: string) => string;
}

export interface LoaderProps {
  isFadingOut: boolean;
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

export interface CachedUserProfileData {
  userData: UserProfileData | null;
  completedGames: UserCompletedGame[] | null;
  userAwards: UserAward[] | null;
  awardCounts: AwardCounts | null;
}

export interface GameInfo {
  NumDistinctPlayers: string;
  ID: number;
  Title: string;
  ConsoleID: number;
  ConsoleName: string;
  ForumTopicID: number;
  Flags: number | null;
  ImageIcon: string;
  ImageTitle: string;
  ImageIngame: string;
  ImageBoxArt: string;
  Publisher: string;
  Developer: string;
  Genre: string;
  Released: string;
  GameTitle: string;
  Console: string;
  RichPresencePatch: string;
  NumAchievements: number;
  NumDistinctPlayersCasual: number;
  NumDistinctPlayersHardcore: number;
  NumAwardedToUser: number;
  NumAwardedToUserHardcore: number;
  UserCompletion: string;
  UserCompletionHardcore: string;
  GuideURL?: string;
  Achievements: {
    [key: string]: Achievement;
  };
}

export interface ConsoleData {
  ID: number;
  Name: string;
  IconURL: string;
  Active: boolean;
  IsGameSystem: boolean;
}

export interface ModalGamesProps {
  game: UserCompletedGame;
  gameInfo: GameInfo | null;
  isLoading: boolean;
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleImageClick: (imageUrl: string) => void;
  sortedAchievements: Achievement[];
}

export interface UseUserProfileResponse {
  userData: UserProfileData | null;
  completedGames: UserCompletedGame[] | null;
  userAwards: UserAward[] | null;
  loading: boolean;
  error: string | null;
  fetchGameInfo: (gameID: number) => void;
  gameInfo: GameInfo | null;
  awardCounts: AwardCounts | null;
  consoleData?: ConsoleData[] | null;
  fetchGameHashes: (gameID: number) => void;
  gameHashes: GameHash[] | null;
  fetchAchievementDistribution: (gameID: number) => void;
  achievementDistribution: AchievementDistribution | null;
  fetchGameRankAndScore: (gameID: number) => void;
  gameRankAndScore: GameRankAndScore | null;
}

export interface GameHash {
  PatchUrl: string | null;
  Labels: string[];
  Name: string;
  MD5: string;
  id: string;
  hash: string;
  gameID: number;
  consoleID: number;
}

export interface AchievementDistribution {
  [key: string]: number;
}

export interface ConsoleData {
  Name: string;
  IconURL: string;
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

export interface Achievement {
  ID: number;
  Title: string;
  Description: string;
  Points: number;
  DateEarned: string | null;
  type: 'win_condition' | 'progression' | 'missable' | 'null';
}
