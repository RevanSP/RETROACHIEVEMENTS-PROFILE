import { useState, useEffect, useCallback } from 'react';
import { UseUserProfileResponse, UserProfileData, UserCompletedGame, UserAward, AwardCounts, GameInfo, ConsoleData } from '../types/type';

const useUserProfile = (username: string): UseUserProfileResponse => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [completedGames, setCompletedGames] = useState<UserCompletedGame[] | null>(null);
  const [userAwards, setUserAwards] = useState<UserAward[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [awardCounts, setAwardCounts] = useState<AwardCounts | null>(null);
  const [consoleData, setConsoleData] = useState<ConsoleData[]>([]);

  const [debouncedUsername, setDebouncedUsername] = useState<string>(username);

  const isValidUsername = (username: string): boolean => /^[a-zA-Z0-9]+$/.test(username);

  const apiKey = import.meta.env.VITE_API_KEY_PROFILE;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500); 

    return () => clearTimeout(timer); 
  }, [username]);

  useEffect(() => {
    const fetchConsoleData = async () => {
      const consoleUrl = `https://retroachievements.org/API/API_GetConsoleIDs.php?z=${debouncedUsername}&y=${apiKey}&g=1`;

      try {
        const response = await fetch(consoleUrl);
        const data = await response.json();
        setConsoleData(data);
      } catch (err) {
        console.error('Error fetching console data:', err);
      }
    };

    if (debouncedUsername && isValidUsername(debouncedUsername)) {
      fetchConsoleData();
    }
  }, [debouncedUsername, apiKey]);

  useEffect(() => {
    if (!debouncedUsername || !isValidUsername(debouncedUsername)) {
      setUserData(null);
      setCompletedGames(null);
      setUserAwards(null);
      setAwardCounts(null);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);

      const profileUrl = `https://retroachievements.org/API/API_GetUserProfile.php?u=${debouncedUsername}&y=${apiKey}`;
      const awardsUrl = `https://retroachievements.org/API/API_GetUserAwards.php?u=${debouncedUsername}&y=${apiKey}`;
      const completedGamesUrl = `https://retroachievements.org/API/API_GetUserCompletedGames.php?u=${debouncedUsername}&y=${apiKey}`;

      try {
        const [profileResponse, awardsResponse, completedGamesResponse] = await Promise.all([
          fetch(profileUrl), 
          fetch(awardsUrl), 
          fetch(completedGamesUrl)
        ]);

        const profileData = await profileResponse.json();
        const awardsData = await awardsResponse.json();
        const completedGamesData = await completedGamesResponse.json();

        if (profileData.Error || awardsData.Error || completedGamesData.Error) {
          setError('Error fetching user data');
          setLoading(false);
          return;
        }

        setUserData(profileData);
        setCompletedGames(completedGamesData);
        setUserAwards(awardsData.VisibleUserAwards);
        setAwardCounts({
          TotalAwardsCount: awardsData.TotalAwardsCount,
          HiddenAwardsCount: awardsData.HiddenAwardsCount,
          MasteryAwardsCount: awardsData.MasteryAwardsCount,
          CompletionAwardsCount: awardsData.CompletionAwardsCount,
          BeatenHardcoreAwardsCount: awardsData.BeatenHardcoreAwardsCount,
          BeatenSoftcoreAwardsCount: awardsData.BeatenSoftcoreAwardsCount,
          EventAwardsCount: awardsData.EventAwardsCount,
          SiteAwardsCount: awardsData.SiteAwardsCount,
        });
        setError(null);
        setLoading(false);

      } catch (err) {
        setError('Error fetching user data');
        setLoading(false);
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [debouncedUsername, apiKey]);

  const fetchGameInfo = useCallback(async (gameID: number) => {
    if (!gameID) return;

    const gameInfoUrl = `https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php?g=${gameID}&u=${debouncedUsername}&y=${apiKey}`;

    try {
      const response = await fetch(gameInfoUrl);
      const data = await response.json();
      setGameInfo(data);
    } catch (err) {
      console.error("Error fetching game info:", err);
      setGameInfo(null);
    }
  }, [debouncedUsername, apiKey]);

  return {
    userData,
    completedGames,
    userAwards,
    loading,
    error,
    fetchGameInfo,
    gameInfo,
    awardCounts,
    consoleData,
  };
};

export default useUserProfile;
