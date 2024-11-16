import { useState, useEffect, useCallback } from 'react';
import { UseUserProfileResponse, UserProfileData, UserCompletedGame, UserAward, AwardCounts, GameInfo, CachedUserProfileData, ConsoleData } from '../types/type';

const useUserProfile = (username: string): UseUserProfileResponse => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [completedGames, setCompletedGames] = useState<UserCompletedGame[] | null>(null);
  const [userAwards, setUserAwards] = useState<UserAward[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [awardCounts, setAwardCounts] = useState<AwardCounts | null>(null);
  const [consoleData, setConsoleData] = useState<ConsoleData[]>([]);

  const isValidUsername = (username: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(username);
  };

  const saveToCache = (username: string, data: CachedUserProfileData) => {
    const cacheData = {
      timestamp: new Date().getTime(),
      data: data,
    };
    localStorage.setItem(`userProfile_${username}`, JSON.stringify(cacheData));
  };

  const loadFromCache = useCallback((username: string) => {
    const CACHE_EXPIRY_TIME = 1000 * 60 * 5;

    const cachedData = localStorage.getItem(`userProfile_${username}`);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const timestamp = parsedData.timestamp;
      const currentTime = new Date().getTime();

      if (currentTime - timestamp < CACHE_EXPIRY_TIME) {
        return parsedData.data;
      }
    }
    return null;
  }, []);

  // Fetch console data
  useEffect(() => {
    const fetchConsoleData = async () => {
      const consoleApiKey = import.meta.env.VITE_API_KEY_PROFILE;
      const consoleUrl = `https://retroachievements.org/API/API_GetConsoleIDs.php?z=${username}&y=${consoleApiKey}&g=1`; // Fetch only game systems

      try {
        const response = await fetch(consoleUrl);
        const data = await response.json();
        if (data) {
          setConsoleData(data); // Save the console data
        }
      } catch (err) {
        console.error('Error fetching console data:', err);
      }
    };

    fetchConsoleData();
  }, [username]);

  useEffect(() => {
    if (!username || !isValidUsername(username)) {
      setUserData(null);
      setCompletedGames(null);
      setUserAwards(null);
      setGameInfo(null);
      setAwardCounts(null);
      setLoading(false);
      return;
    }

    const cachedData = loadFromCache(username);
    if (cachedData) {
      setUserData(cachedData.userData);
      setCompletedGames(cachedData.completedGames);
      setUserAwards(cachedData.userAwards);
      setAwardCounts(cachedData.awardCounts);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
    
      const profileApiKey = import.meta.env.VITE_API_KEY_PROFILE;
      const profileUrl = `https://retroachievements.org/API/API_GetUserProfile.php?u=${username}&y=${profileApiKey}`;
      const awardsUrl = `https://retroachievements.org/API/API_GetUserAwards.php?u=${username}&y=${profileApiKey}`;
      const completedGamesUrl = `https://retroachievements.org/API/API_GetUserCompletedGames.php?u=${username}&y=${profileApiKey}`;
    
      try {
        const profileResponse = await fetch(profileUrl);
        const profileData = await profileResponse.json();
    
        if (profileData.Error) {
          setError('Error fetching user profile');
          setUserData(null);
          setCompletedGames(null);
          setUserAwards(null);
          setAwardCounts(null);
          setLoading(false);
          return;
        }
    
        const awardsResponse = await fetch(awardsUrl);
        const awardsData = await awardsResponse.json();
    
        if (awardsData.Error) {
          setError('Error fetching user awards');
          setUserData(profileData);
          setCompletedGames(null);
          setUserAwards(null);
          setAwardCounts(null);
          setLoading(false);
          return; // Stop execution if there was an error with awards data
        }
    
        // Fetch completed games data
        const completedGamesResponse = await fetch(completedGamesUrl);
        const completedGamesData = await completedGamesResponse.json();
    
        // Check for any error in completed games response
        if (completedGamesData.Error) {
          setError('Error fetching completed games');
          setUserData(profileData);
          setCompletedGames(null);
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
    
        saveToCache(username, {
          userData: profileData,
          completedGames: completedGamesData,
          userAwards: awardsData.VisibleUserAwards,
          awardCounts: {
            TotalAwardsCount: awardsData.TotalAwardsCount,
            HiddenAwardsCount: awardsData.HiddenAwardsCount,
            MasteryAwardsCount: awardsData.MasteryAwardsCount,
            CompletionAwardsCount: awardsData.CompletionAwardsCount,
            BeatenHardcoreAwardsCount: awardsData.BeatenHardcoreAwardsCount,
            BeatenSoftcoreAwardsCount: awardsData.BeatenSoftcoreAwardsCount,
            EventAwardsCount: awardsData.EventAwardsCount,
            SiteAwardsCount: awardsData.SiteAwardsCount,
          },
        });
    
        setLoading(false);
      } catch (err) {
        setError('Error fetching user data');
        setLoading(false);
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [username, loadFromCache]);

  const fetchGameInfo = async (gameID: number) => {
    if (!gameID) return;
    const apiKey = import.meta.env.VITE_API_KEY_PROFILE;
    const gameInfoUrl = `https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php?g=${gameID}&u=${username}&y=${apiKey}`;

    try {
      const response = await fetch(gameInfoUrl);
      const data = await response.json();
      setGameInfo(data);
    } catch (err) {
      console.error("Error fetching game info:", err);
      setGameInfo(null);
    }
  };

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
