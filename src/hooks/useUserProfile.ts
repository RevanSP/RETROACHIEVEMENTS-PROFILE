/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { UseUserProfileResponse } from '../types/type';
import { UserProfileData } from '../types/type';
import { UserCompletedGame } from '../types/type';
import { UserAward } from '../types/type';

interface AwardCounts {
  TotalAwardsCount: number;
  HiddenAwardsCount: number;
  MasteryAwardsCount: number;
  CompletionAwardsCount: number;
  BeatenHardcoreAwardsCount: number;
  BeatenSoftcoreAwardsCount: number;
  EventAwardsCount: number;
  SiteAwardsCount: number;
}

const useUserProfile = (username: string): UseUserProfileResponse => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [completedGames, setCompletedGames] = useState<UserCompletedGame[] | null>(null);
  const [userAwards, setUserAwards] = useState<UserAward[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gameInfo, setGameInfo] = useState<any | null>(null);
  const [awardCounts, setAwardCounts] = useState<AwardCounts | null>(null);  

  const isValidUsername = (username: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(username);
  };

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

    const fetchUserData = async () => {
      setLoading(true);

      const profileApiKey = import.meta.env.VITE_API_KEY_PROFILE;
      const profileUrl = `https://retroachievements.org/API/API_GetUserProfile.php?u=${username}&y=${profileApiKey}`;
      const awardsUrl = `https://retroachievements.org/API/API_GetUserAwards.php?u=${username}&y=${profileApiKey}`;
      const completedGamesUrl = `https://retroachievements.org/API/API_GetUserCompletedGames.php?u=${username}&y=${profileApiKey}`;

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
          setError('Error fetching user data or user not found');
          setUserData(null);
          setCompletedGames(null);
          setUserAwards(null);
          setAwardCounts(null); 
        } else {
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
          });  // Set the award counts in state
          setError(null);
        }

        setLoading(false);
      } catch (err) {
        setError('Error fetching user data');
        setLoading(false);
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [username]);

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

  return { userData, completedGames, userAwards, loading, error, fetchGameInfo, gameInfo, awardCounts }; 
};

export default useUserProfile;
