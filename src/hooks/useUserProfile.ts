import { useState, useEffect } from 'react';
import { UseUserProfileResponse } from '../types/type';
import { UserProfileData } from '../types/type';
import { UserCompletedGame } from '../types/type';
import { UserAward } from '../types/type';

const useUserProfile = (username: string): UseUserProfileResponse => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [completedGames, setCompletedGames] = useState<UserCompletedGame[] | null>(null);
  const [userAwards, setUserAwards] = useState<UserAward[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const profileApiKey = import.meta.env.VITE_API_KEY_PROFILE;
      const awardsApiKey = import.meta.env.VITE_API_KEY_AWARDS;
      const completedGamesApiKey = import.meta.env.VITE_API_KEY_COMPLETED_GAMES;

      const profileUrl = `https://retroachievements.org/API/API_GetUserProfile.php?u=${username}&y=${profileApiKey}`;
      const awardsUrl = `https://retroachievements.org/API/API_GetUserAwards.php?u=${username}&y=${awardsApiKey}`;
      const completedGamesUrl = `https://retroachievements.org/API/API_GetUserCompletedGames.php?u=${username}&y=${completedGamesApiKey}`;

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
        } else {
          setUserData(profileData);
          setCompletedGames(completedGamesData);
          setUserAwards(awardsData.VisibleUserAwards);
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

  return { userData, completedGames, userAwards, loading, error };
};

export default useUserProfile;
