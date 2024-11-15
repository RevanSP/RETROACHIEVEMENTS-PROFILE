import { useEffect, useRef } from 'react';
import { ModalGamesProps } from '../types/type';

const ModalGames: React.FC<ModalGamesProps> = ({
    game,
    gameInfo,
    isLoading,
    isModalOpen,
    handleCloseModal,
    handleImageClick,
    sortedAchievements,
}) => {

    const modalRef = useRef<HTMLDialogElement>(null);

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
            handleCloseModal();
        }
    };

    useEffect(() => {
        if (isModalOpen && modalRef.current) {
            modalRef.current.showModal();
        } else if (!isModalOpen && modalRef.current) {
            modalRef.current.close();
        }
    }, [isModalOpen]);


    return (
        <dialog
            ref={modalRef}
            id={`game-modal-${game.GameID}`}
            className={`modal ${isModalOpen ? 'modal-open' : ''}`}
        >
            <div className="modal-box w-11/12 max-w-7xl border-2 border-base-300 rounded-lg">
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
                                            loading="lazy"
                                            src={`https://retroachievements.org${gameInfo.ImageBoxArt}`}
                                            alt={`${game.Title} Box Art`}
                                            className="rounded-lg shadow-lg w-48 cursor-pointer"
                                            onClick={() => {
                                                closeModal();
                                                handleImageClick(`https://retroachievements.org${gameInfo.ImageBoxArt}`);
                                            }}
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
                                        <img
                                            loading="lazy"
                                            src={`https://retroachievements.org${gameInfo.ImageIngame}`}
                                            alt={`${game.Title} In-Game Screenshot`}
                                            className="rounded shadow-lg w-80 border-2 border-base-300 ml-24"
                                            onClick={() => {
                                                closeModal();
                                                handleImageClick(`https://retroachievements.org${gameInfo.ImageIngame}`);
                                            }}
                                        />
                                    )}
                                    {gameInfo.ImageTitle && (
                                        <img
                                            loading="lazy"
                                            src={`https://retroachievements.org${gameInfo.ImageTitle}`}
                                            alt={`${game.Title} Title Image`}
                                            className="rounded shadow-lg w-80 border-2 border-base-300 mr-24"
                                            onClick={() => {
                                                closeModal();
                                                handleImageClick(`https://retroachievements.org${gameInfo.ImageTitle}`);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="mb-4 text-center block sm:hidden">
                                <strong>In-Game Screenshot & Title Image :</strong>
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
                                                {sortedAchievements.map((achievement) => (
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
    );
};

export default ModalGames;
