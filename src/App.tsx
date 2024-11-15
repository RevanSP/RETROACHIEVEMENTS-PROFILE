/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, useRef } from "react";
import useUserProfile from "./hooks/useUserProfile";
import { UserCompletedGame } from "./types/type";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import CardUserProfile from "./components/CardUserProfile";
import CardUserAwards from "./components/CardUserAwards";
import Loader from "./components/Loader";
const App = () => {
  const [username, setUsername] = useState<string>("Reiivan");
  const [searchUsername, setSearchUsername] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeGameID, setActiveGameID] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const { userData, completedGames, userAwards, gameInfo, fetchGameInfo, awardCounts } = useUserProfile(username);
  const closeModalButtonRef = useRef<HTMLButtonElement | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
    if (closeModalButtonRef.current) {
      closeModalButtonRef.current.click();
    }
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const sortedAchievements = useMemo(() => {
    return gameInfo
      ? Object.values(gameInfo.Achievements).sort((a: any, b: any) => {
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
  return (
    <>
      <Loader isLoading={isLoading} />
      <div className="content">
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
                {userAwards && <CardUserAwards userAwards={userAwards} />}
              </div>
              {isModalOpen && (
                <dialog id="image_modal" className="modal modal-open ">
                  <div className="modal-box flex justify-center items-center border-2 border-base-300 rounded-lg">
                    <img src={selectedImage} alt="Selected" className="max-w-full max-h-full rounded-lg p-4 border-2 border-base-300 bg-base-200" />
                  </div>
                  <div className="modal-backdrop">
                    <button onClick={() => setIsModalOpen(false)}>Close</button>
                  </div>
                </dialog>
              )}
              <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4">
                <div className="card-body">
                  <div className="input-group flex items-center input-sm w-full mb-4">
                    <label className="input flex input-sm items-center w-full gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 bi bi-joystick" viewBox="0 0 16 16">
                        <path d="M10 2a2 2 0 0 1-1.5 1.937v5.087c.863.083 1.5.377 1.5.726 0 .414-.895.75-2 .75s-2-.336-2-.75c0-.35.637-.643 1.5-.726V3.937A2 2 0 1 1 10 2" />
                        <path d="M0 9.665v1.717a1 1 0 0 0 .553.894l6.553 3.277a2 2 0 0 0 1.788 0l6.553-3.277a1 1 0 0 0 .553-.894V9.665c0-.1-.06-.19-.152-.23L9.5 6.715v.993l5.227 2.178a.125.125 0 0 1 .001.23l-5.94 2.546a2 2 0 0 1-1.576 0l-5.94-2.546a.125.125 0 0 1 .001-.23L6.5 7.708l-.013-.988L.152 9.435a.25.25 0 0 0-.152.23" />
                      </svg>
                      <input
                        type="text"
                        className="grow"
                        placeholder="Search Game ID / Game Title"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                      />
                    </label>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table table-xs w-full">
                      <thead>
                        <tr className="text-center">
                          <th>Game ID</th>
                          <th>Game Icon</th>
                          <th>Game Title</th>
                          <th>Console</th>
                          <th>Completion %</th>
                          <th>Achievements</th>
                          <th>Hardcore Mode</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {currentGames.length > 0 ? (
                        currentGames.map((game) => (
                          <tr key={`${game.GameID}-${game.HardcoreMode}`} className="text-center">
                            <td>{game.GameID}</td>
                            <td className="text-center">
                              <img
                                loading="lazy"
                                src={`https://retroachievements.org${game.ImageIcon}`}
                                alt={game.Title}
                                className="w-12 h-12 object-cover rounded-md mx-auto"
                              />
                            </td>
                            <td>{game.Title}</td>
                            <td>{game.ConsoleName}</td>
                            <td className="text-center">
                              <progress className="progress w-56" value={game.PctWon * 100} max="100"></progress>
                              <div className="mt-0 text-xs">{(game.PctWon * 100).toFixed(2)}%</div>
                            </td>
                            <td>{game.NumAwarded} / {game.MaxPossible} Achievements</td>
                            <td className="text-center">
                              {game.HardcoreMode === "1" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill mx-auto" viewBox="0 0 16 16">
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill mx-auto" viewBox="0 0 16 16">
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                </svg>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn bg-base-100 rounded"
                                onClick={() => handleOpenModal(game.GameID)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-info-circle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center">
                            No results found for "{searchQuery}"
                          </td>
                        </tr>
                      )}
                    </table>
                    <div className="mt-4 flex justify-center">
                      <div className="join mt-4 overflow-x-auto">
                        {pageNumbers.map((pageNumber) => (
                          <button
                            key={pageNumber}
                            className={`join-item btn btn-xs ${currentPage === pageNumber ? "bg-base-300" : "bg-base-100"}`}
                            onClick={() => paginate(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        ))}
                      </div>
                    </div>
                    {completedGames &&
                      completedGames.map((game: UserCompletedGame) => (
                        <dialog
                          id={`game-modal-${game.GameID}`}
                          key={game.GameID}
                          className={`modal ${activeGameID === game.GameID ? "modal-open" : ""}`}
                        >
                          <div className="modal-box w-11/12 max-w-7xl border-2 border-base-300 rounded-lg">
                            <form method="dialog">
                              <button
                                ref={closeModalButtonRef}
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                onClick={handleCloseModal}
                              >
                                ✕
                              </button>
                            </form>
                            <h3 className="font-bold text-2xl mb-4 mt-4">{game.Title}</h3>
                            {isLoading ? (
                              <p>Loading game info ...</p>
                            ) : (
                              gameInfo ? (
                                <div>
                                  <div className="flex mb-6">
                                    <div className="mr-4">
                                      {gameInfo.ImageBoxArt && (
                                        <img
                                          loading="lazy"
                                          src={`https://retroachievements.org${gameInfo.ImageBoxArt}`}
                                          alt={`${game.Title} Box Art`}
                                          className="rounded-lg shadow-lg w-48 cursor-pointer"
                                          onClick={() => handleImageClick(`https://retroachievements.org${gameInfo.ImageBoxArt}`)}
                                        />
                                      )}
                                    </div>
                                    <div>
                                      <p><strong>Developer :</strong> {gameInfo.Developer || "N/A"}</p>
                                      <p><strong>Publisher :</strong> {gameInfo.Publisher || "N/A"}</p>
                                      <p><strong>Genre :</strong> {gameInfo.Genre || "N/A"}</p>
                                      <p><strong>Console :</strong> {gameInfo.ConsoleName || "N/A"}</p>
                                      <p><strong>Released :</strong> {gameInfo.Released ? new Date(gameInfo.Released).toLocaleDateString() : "N/A"}</p>
                                      <p><strong>Number of Players :</strong> {gameInfo.NumDistinctPlayers || "N/A"}</p>
                                      <p><strong>Achievements :</strong> {gameInfo.NumAchievements || "N/A"}</p>
                                    </div>
                                  </div>
                                  <div className="mb-6 text-center hidden sm:block">
                                    <strong>In-Game Screenshot & Title Image :</strong>
                                    <div className="flex overflow-x-auto justify-center sm:justify-between mt-4 sm:px-10">
                                      {gameInfo.ImageIngame && (
                                        <img loading="lazy"
                                          src={`https://retroachievements.org${gameInfo.ImageIngame}`}
                                          alt={`${game.Title} In-Game Screenshot`}
                                          className="rounded shadow-lg w-80 border-2 border-base-300 ml-24" onClick={() => handleImageClick(`https://retroachievements.org${gameInfo.ImageIngame}`)}
                                        />
                                      )}
                                      {gameInfo.ImageTitle && (
                                        <img loading="lazy"
                                          src={`https://retroachievements.org${gameInfo.ImageTitle}`}
                                          alt={`${game.Title} Title Image`}
                                          className="rounded shadow-lg w-80 border-2 border-base-300 mr-24" onClick={() => handleImageClick(`https://retroachievements.org${gameInfo.ImageTitle}`)}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div className="mb-4 text-center block sm:hidden">
                                    <strong>In-Game Screenshot & Title Image:</strong>
                                    <div className="flex space-x-4 mt-2 overflow-x-auto">
                                      {gameInfo.ImageIngame && (
                                        <img loading="lazy" onClick={() => handleImageClick(`https://retroachievements.org${gameInfo.ImageIngame}`)}
                                          src={`https://retroachievements.org${gameInfo.ImageIngame}`}
                                          alt={`${game.Title} In-Game Screenshot`}
                                          className="rounded shadow-lg w-80 border-2 border-base-300"
                                        />
                                      )}
                                      {gameInfo.ImageTitle && (
                                        <img loading="lazy" onClick={() => handleImageClick(`https://retroachievements.org${gameInfo.ImageTitle}`)}
                                          src={`https://retroachievements.org${gameInfo.ImageTitle}`}
                                          alt={`${game.Title} Title Image`}
                                          className="rounded shadow-lg w-80 border-2 border-base-300"
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                    <div className="card bg-base-300 w-full shadow-xl">
                                      <div className="card-body p-2">
                                        <div className="overflow-x-auto">
                                          <table className="table table-xs w-full">
                                            <thead>
                                              <tr>
                                                <th>Progress</th>
                                                <th>Details</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td><strong>User Completion :</strong></td>
                                                <td>{gameInfo.UserCompletion ? `${gameInfo.UserCompletion.replace('%', '')}%` : "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>User Completion (Hardcore) :</strong></td>
                                                <td>{gameInfo.UserCompletionHardcore ? `${gameInfo.UserCompletionHardcore.replace('%', '')}%` : "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Achievements Earned :</strong></td>
                                                <td>{gameInfo.NumAwardedToUser && gameInfo.NumAchievements ? `${gameInfo.NumAwardedToUser} / ${gameInfo.NumAchievements}` : "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Hardcore Achievements Earned :</strong></td>
                                                <td>{gameInfo.NumAwardedToUserHardcore && gameInfo.NumAchievements ? `${gameInfo.NumAwardedToUserHardcore} / ${gameInfo.NumAchievements}` : "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Players (Casual) :</strong></td>
                                                <td>{gameInfo.NumDistinctPlayersCasual || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Players (Hardcore) :</strong></td>
                                                <td>{gameInfo.NumDistinctPlayersHardcore || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="card bg-base-300 w-full shadow-xl">
                                      <div className="card-body p-2">
                                        <div className="overflow-x-auto">
                                          <table className="table table-xs w-full">
                                            <thead>
                                              <tr>
                                                <th>Info</th>
                                                <th>Details</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td><strong>Release Date :</strong></td>
                                                <td>{new Date(gameInfo.Released).toLocaleDateString()}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Guide URL :</strong></td>
                                                <td>{gameInfo.GuideURL || "No guide available"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Game ID :</strong></td>
                                                <td>{gameInfo.ID}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Forum Topic :</strong></td>
                                                <td>
                                                  <a href={`https://retroachievements.org/viewtopic.php?t=${gameInfo.ForumTopicID}`} target="_blank" rel="noopener noreferrer">View Forum Topic</a>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="card bg-base-300 w-full shadow-xl mt-6">
                                    <div className="card-body p-2">
                                      <div className="overflow-x-auto">
                                        <table className="table table-xs w-full">
                                          <thead>
                                            <tr className="text-center">
                                              <th>Achievement</th>
                                              <th>Description</th>
                                              <th>Points</th>
                                              <th>Earned</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {sortedAchievements.map((achievement: any) => (
                                              <tr key={achievement.ID} className="text-center">
                                                <td>{achievement.Title}</td>
                                                <td>{achievement.Description}</td>
                                                <td>{achievement.Points}</td>
                                                <td>
                                                  {achievement.DateEarned ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill mx-auto" viewBox="0 0 16 16">
                                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                    </svg>
                                                  ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill mx-auto" viewBox="0 0 16 16">
                                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                                    </svg>
                                                  )}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p>Failed to load game info. Please try again later.</p>
                              )
                            )}
                          </div>
                        </dialog>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;
