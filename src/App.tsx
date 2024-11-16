import { useState, useEffect, useMemo } from "react";
import useUserProfile from "./hooks/useUserProfile";
import { UserCompletedGame } from "./types/type";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import CardUserProfile from "./components/CardUserProfile";
import CardUserAwards from "./components/CardUserAwards";
import CardUserCompleted from "./components/CardUserCompleted";
import ModalPreview from "./components/ModalPreview";
import Loader from "./components/Loader";
import ModalGames from "./components/ModalGames";
import { Achievement } from "./types/type";
const App = () => {
  const [username, setUsername] = useState<string>("Reiivan");
  const [searchUsername, setSearchUsername] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeGameID, setActiveGameID] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const { consoleData, userData, completedGames, userAwards, gameInfo, fetchGameInfo, awardCounts } = useUserProfile(username);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getConsoleIcon = (consoleName: string) => {
    if (!consoleData) {
      return '';
    }

    const console = consoleData.find(c => c.Name === consoleName);
    return console ? console.IconURL : '';
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    setCurrentPage(1);
  };

  const filteredGames = useMemo(() => {
    if (!completedGames) return [];
    if (!searchQuery) return completedGames;

    return completedGames.filter((game) => {
      const gameIdMatch = game.GameID.toString().includes(searchQuery);
      const titleMatch = game.Title.toLowerCase().includes(searchQuery.toLowerCase());
      return gameIdMatch || titleMatch;
    });
  }, [completedGames, searchQuery]);

  const handleUsernameChange = (username: string) => {
    setSearchUsername(username);
  };

  const handleSearchClick = async () => {
    if (searchUsername && searchUsername !== username) {
      setIsSearching(true);
      setUsername(searchUsername);
      await new Promise(resolve => setTimeout(resolve, 0));
      setIsSearching(false);
    }
  };

  const handleOpenModal = (gameID: number) => {
    setIsLoading(true);
    fetchGameInfo(gameID);
    setActiveGameID(gameID);
  };

  const handleCloseModal = () => {
    setActiveGameID(null);
    setIsLoading(false);
    setIsModalOpen(false);
    setSelectedImage(undefined);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const sortedAchievements = useMemo(() => {
    return gameInfo && gameInfo.Achievements
      ? Object.values(gameInfo.Achievements).sort((a: Achievement, b: Achievement) => {
        if (!a.DateEarned && b.DateEarned) return -1;
        if (a.DateEarned && !b.DateEarned) return 1;
        return 0;
      })
      : [];
  }, [gameInfo]);

  useEffect(() => {
    if (gameInfo) {
      setIsLoading(false);
    }
  }, [gameInfo]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const totalPages = useMemo(() => {
    return filteredGames ? Math.ceil(filteredGames.length / itemsPerPage) : 1;
  }, [filteredGames, itemsPerPage]);

  const indexOfLastGame = currentPage * itemsPerPage;
  const indexOfFirstGame = indexOfLastGame - itemsPerPage;
  const currentGames = useMemo(() => {
    return filteredGames ? filteredGames.slice(indexOfFirstGame, indexOfLastGame) : [];
  }, [filteredGames, indexOfFirstGame, indexOfLastGame]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000);

    const hideLoaderTimer = setTimeout(() => {
      document.body.style.overflow = 'visible';
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideLoaderTimer);
    };
  }, []);

  return (
    <>
      <Loader isFadingOut={isFadingOut} />
      <div className="min-h-screen flex flex-col">
        <Navbar
          username={searchUsername}
          onUsernameChange={handleUsernameChange}
          onSearchClick={handleSearchClick} isSearching={isSearching}
        />
        <Hero />
        <main className="flex-grow">
          <div className="px-6 mx-auto">
            <div className="mb-4 mt-4">
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CardUserProfile
                userData={userData}
                awardCounts={awardCounts}
                onImageClick={handleImageClick}
              />
              <CardUserAwards userAwards={userAwards || []} getConsoleIcon={getConsoleIcon} />
            </div>
            <CardUserCompleted
              searchQuery={searchQuery}
              currentGames={currentGames}
              isSearching={isSearching}
              handleSearchQueryChange={handleSearchQueryChange}
              handleOpenModal={handleOpenModal}
              currentPage={currentPage}
              paginate={paginate}
              pageNumbers={pageNumbers}
              handleInputFocus={handleInputFocus} getConsoleIcon={getConsoleIcon} />
          </div>
        </main>
        {isModalOpen && (
          <ModalPreview
            selectedImage={selectedImage}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {completedGames && completedGames.map((game: UserCompletedGame) => (
          <ModalGames
            key={game.GameID}
            game={game}
            gameInfo={gameInfo}
            isLoading={isLoading}
            isModalOpen={activeGameID === game.GameID}
            handleCloseModal={handleCloseModal}
            handleImageClick={handleImageClick}
            sortedAchievements={sortedAchievements}
          />
        ))}
        <Footer />
      </div>
    </>
  );
};

export default App;
