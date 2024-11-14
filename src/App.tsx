/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, useRef } from "react";
import useUserProfile from "./hooks/useUserProfile";
import { UserCompletedGame } from "./types/type";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";

const App = () => {
  const [username, setUsername] = useState<string>("Reiivan");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeGameID, setActiveGameID] = useState<number | null>(null);
  const { userData, completedGames, userAwards, gameInfo, fetchGameInfo, awardCounts } = useUserProfile(username);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleOpenModal = (gameID: number) => {
    setIsLoading(true);
    fetchGameInfo(gameID);
    setActiveGameID(gameID);
  };

  const handleCloseModal = () => {
    setActiveGameID(null);
    setIsLoading(false);
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

  const [modalDescription, setModalDescription] = useState('');
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const openModal = (description: string) => {
    setModalDescription(description);
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar username={username} onUsernameChange={handleUsernameChange} />
        <Hero />
        <main className="flex-grow">
          <div className="px-6 mx-auto">
            <div className="mb-4 mt-4">
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4 md:col-span-1">
                <div className="card-body">
                  {userData && (
                    <>
                      <div className="flex items-center mb-4">
                        <div className="avatar">
                          <div className="ring-yellow-500 ring-offset-base-100 w-28 rounded-full ring ring-offset-2">
                            {userData.UserPic ? (
                              <img
                                src={`https://retroachievements.org${userData.UserPic}`}
                                alt="User Profile"
                              />
                            ) : (
                              <div className="avatar placeholder">
                                <div className="bg-blue-600 text-neutral-content w-28 rounded-full">
                                  <span className="text-3xl">?</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-5">
                          <h2 className="card-title">{userData.User}</h2>
                          <p>{userData.Motto}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <strong>Member Since:</strong>{" "}
                          {userData.MemberSince ?
                            new Date(userData.MemberSince).toLocaleString('en-GB', {
                              timeZone: 'Asia/Jakarta',
                              weekday: 'long',
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric',
                              hour12: false,
                            }) : "?"}
                        </div>
                        <div>
                          <strong>Rich Presence:</strong> {userData.RichPresenceMsg || "?"}
                        </div>
                        <div>
                          <strong>Last Game ID:</strong> {userData.LastGameID || "?"}
                        </div>
                        <div>
                          <strong>Total Points:</strong> {userData.TotalPoints || "?"}
                        </div>
                        <div>
                          <strong>Total Softcore Points:</strong> {userData.TotalSoftcorePoints || "?"}
                        </div>
                        <div>
                          <strong>Total True Points:</strong> {userData.TotalTruePoints || "?"}
                        </div>
                        <div>
                          <strong>User ID:</strong> {userData.ID || "?"}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="overflow-x-auto mt-3 bg-base-100">
                    <table className="table table-xs">
                      <thead>
                        <tr>
                          <th>Awards</th>
                          <th>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {awardCounts && (
                          <>
                            <tr>
                              <td>Total Awards</td>
                              <td>{awardCounts.TotalAwardsCount}</td>
                            </tr>
                            <tr>
                              <td>Mastery Awards</td>
                              <td>{awardCounts.MasteryAwardsCount}</td>
                            </tr>
                            <tr>
                              <td>Completion Awards</td>
                              <td>{awardCounts.CompletionAwardsCount}</td>
                            </tr>
                            <tr>
                              <td>Beaten Hardcore Awards</td>
                              <td>{awardCounts.BeatenHardcoreAwardsCount}</td>
                            </tr>
                            <tr>
                              <td>Beaten Softcore Awards</td>
                              <td>{awardCounts.BeatenSoftcoreAwardsCount}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4 md:col-span-2">
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="table table-xs w-full">
                      <thead>
                        <tr>
                          <th className="text-center">Award Icon</th>
                          <th className="text-center">Game Title</th>
                          <th className="text-center">Console</th>
                          <th className="text-center">Award Type</th>
                          <th className="text-center">Award Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userAwards && userAwards.length > 0 ? (
                          userAwards
                            .sort((a, b) => {
                              const aEarned = a.AwardedAt;
                              const bEarned = b.AwardedAt;
                              if (!aEarned && bEarned) return -1;
                              if (aEarned && !bEarned) return 1;
                              if (a.AwardType === 'Mastery/Completion' && b.AwardType !== 'Mastery/Completion') return -1;
                              if (b.AwardType === 'Mastery/Completion' && a.AwardType !== 'Mastery/Completion') return 1;
                              if (a.AwardType === 'Game Beaten' && b.AwardType !== 'Game Beaten') return 1;
                              if (b.AwardType === 'Game Beaten' && a.AwardType !== 'Game Beaten') return -1;
                              return new Date(b.AwardedAt).getTime() - new Date(a.AwardedAt).getTime();
                            })
                            .map((award) => (
                              <tr key={award.AwardData}>
                                <td className="text-center">
                                  <img
                                    src={`https://retroachievements.org${award.ImageIcon}`}
                                    alt={award.Title}
                                    className="w-12 h-12 object-cover rounded-md mx-auto"
                                  />
                                </td>
                                <td className="text-center">{award.Title}</td>
                                <td className="text-center">{award.ConsoleName}</td>
                                <td className="text-center">
                                  {award.AwardType === "Mastery/Completion" ? (
                                    <div className="tooltip tooltip-bottom" data-tip="MASTERY / COMPLETION">
                                      <button className="btn bg-base-100 text-white rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle-fill" viewBox="0 0 16 16">
                                          <circle cx="8" cy="8" r="8" />
                                        </svg>
                                      </button>
                                    </div>
                                  ) : award.AwardType === "Game Beaten" ? (
                                    <div className="tooltip tooltip-bottom" data-tip="GAME BEATEN">
                                      <button className="btn bg-base-100 text-white rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle-half" viewBox="0 0 16 16">
                                          <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
                                        </svg>
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="badge badge-outline rounded-md bg-neutral-700">{award.AwardType}</span>
                                  )}
                                </td>
                                <td className="text-center">
                                  {new Date(award.AwardedAt).toLocaleString('en-GB', {
                                    timeZone: 'Asia/Jakarta',
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                    hour12: false,
                                  })}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-4">
                              No awards found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th className="text-center">Award Icon</th>
                          <th className="text-center">Game Title</th>
                          <th className="text-center">Console</th>
                          <th className="text-center">Award Type</th>
                          <th className="text-center">Award Date</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4">
              <div className="card-body">
                <div className="overflow-x-auto">
                  <table className="table table-xs w-full ">
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
                    <tbody>
                      {completedGames && completedGames.length > 0 ? (
                        completedGames.map((game: UserCompletedGame) => (
                          <tr key={game.GameID} className="text-center">
                            <td>{game.GameID}</td>
                            <td className="text-center">
                              <img
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
                                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-4">
                            No completed games found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {completedGames &&
                    completedGames.map((game: UserCompletedGame) => (
                      <dialog
                        id={`game-modal-${game.GameID}`}
                        key={game.GameID}
                        className={`modal ${activeGameID === game.GameID ? "modal-open" : ""}`}
                      >
                        <div className="modal-box w-11/12 max-w-7xl">
                          <form method="dialog">
                            <button
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
                                        src={`https://retroachievements.org${gameInfo.ImageBoxArt}`}
                                        alt={`${game.Title} Box Art`}
                                        className="rounded-lg shadow-lg w-48"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <p><strong>Developer:</strong> {gameInfo.Developer}</p>
                                    <p><strong>Publisher:</strong> {gameInfo.Publisher}</p>
                                    <p><strong>Genre:</strong> {gameInfo.Genre}</p>
                                    <p><strong>Console:</strong> {gameInfo.ConsoleName}</p>
                                    <p><strong>Released:</strong> {new Date(gameInfo.Released).toLocaleDateString()}</p>
                                    <p><strong>Number of Players:</strong> {gameInfo.NumDistinctPlayers}</p>
                                    <p><strong>Achievements:</strong> {gameInfo.NumAchievements}</p>
                                  </div>
                                </div>
                                <div className="mb-6 text-center hidden sm:block">
                                  <strong>In-Game Screenshot & Title Image:</strong>
                                  <div className="flex overflow-x-auto justify-center sm:justify-between mt-4 sm:px-10">
                                    {gameInfo.ImageIngame && (
                                      <img
                                        src={`https://retroachievements.org${gameInfo.ImageIngame}`}
                                        alt={`${game.Title} In-Game Screenshot`}
                                        className="rounded shadow-lg w-80 border-2 border-base-300 ml-24"
                                      />
                                    )}
                                    {gameInfo.ImageTitle && (
                                      <img
                                        src={`https://retroachievements.org${gameInfo.ImageTitle}`}
                                        alt={`${game.Title} Title Image`}
                                        className="rounded shadow-lg w-80 border-2 border-base-300 mr-24"
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="mb-4 text-center block sm:hidden">
                                  <strong>In-Game Screenshot & Title Image:</strong>
                                  <div className="flex space-x-4 mt-2 overflow-x-auto">
                                    {gameInfo.ImageIngame && (
                                      <img
                                        src={`https://retroachievements.org${gameInfo.ImageIngame}`}
                                        alt={`${game.Title} In-Game Screenshot`}
                                        className="rounded shadow-lg w-80 border-2 border-base-300"
                                      />
                                    )}
                                    {gameInfo.ImageTitle && (
                                      <img
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
                                              <td><strong>User Completion:</strong></td>
                                              <td>{gameInfo.UserCompletion ? `${gameInfo.UserCompletion.replace('%', '')}%` : "N/A"}</td>
                                            </tr>
                                            <tr>
                                              <td><strong>User Completion (Hardcore):</strong></td>
                                              <td>{gameInfo.UserCompletionHardcore ? `${gameInfo.UserCompletionHardcore.replace('%', '')}%` : "N/A"}</td>
                                            </tr>
                                            <tr>
                                              <td><strong>Achievements Earned:</strong></td>
                                              <td>{gameInfo.NumAwardedToUser && gameInfo.NumAchievements ? `${gameInfo.NumAwardedToUser} / ${gameInfo.NumAchievements}` : "N/A"}</td>
                                            </tr>
                                            <tr>
                                              <td><strong>Hardcore Achievements Earned:</strong></td>
                                              <td>{gameInfo.NumAwardedToUserHardcore && gameInfo.NumAchievements ? `${gameInfo.NumAwardedToUserHardcore} / ${gameInfo.NumAchievements}` : "N/A"}</td>
                                            </tr>
                                            <tr>
                                              <td><strong>Players (Casual):</strong></td>
                                              <td>{gameInfo.NumDistinctPlayersCasual || "N/A"}</td>
                                            </tr>
                                            <tr>
                                              <td><strong>Players (Hardcore):</strong></td>
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
                                              <td><strong>Release Date:</strong></td>
                                              <td>{new Date(gameInfo.Released).toLocaleDateString()}</td>
                                            </tr>
                                            <tr>
                                              <td><strong>Guide URL:</strong></td>
                                              <td>{gameInfo.GuideURL || "No guide available"}</td>
                                            </tr>
                                            <tr>
                                              <td><strong>Game ID:</strong></td>
                                              <td>{gameInfo.ID}</td>
                                            </tr>
                                            <tr>
                                              <td><strong>Forum Topic:</strong></td>
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
                                            <th>Guide</th>
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
                                                <button
                                                  className="btn bg-base-100"
                                                  onClick={() => openModal(achievement.Description)}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-question-circle-fill"
                                                    viewBox="0 0 16 16"
                                                  >
                                                    <path
                                                      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"
                                                    />
                                                  </svg>
                                                </button>
                                              </td>
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
        <dialog id="guide_modal" ref={modalRef} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Achievement Description</h3>
            <p className="py-4">{modalDescription}</p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={closeModal}>Close</button>
          </form>
        </dialog>
        <Footer />
      </div>
    </>
  );
};

export default App;
