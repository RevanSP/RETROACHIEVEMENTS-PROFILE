/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { ModalGamesProps } from '../types/type';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import useUserProfile from '../hooks/useUserProfile';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ModalGames: React.FC<ModalGamesProps> = ({
    game,
    gameInfo,
    isLoading,
    isModalOpen,
    handleCloseModal,
    handleImageClick,
    sortedAchievements,
}) => {
    const { fetchGameHashes, gameHashes, fetchAchievementDistribution, achievementDistribution } = useUserProfile(String(game.GameID));
    const modalRef = useRef<HTMLDialogElement>(null);


    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
            handleCloseModal();
        }
    };

    useEffect(() => {
        if (isModalOpen && game.GameID) {
            fetchGameHashes(game.GameID);
            fetchAchievementDistribution(game.GameID, true);
        }
    }, [isModalOpen, game.GameID, fetchGameHashes, fetchAchievementDistribution]);

    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        if (achievementDistribution) {
            const backgroundColors: string[] = [];
            const borderColors: string[] = [];
            Object.values(achievementDistribution).forEach((value) => {
                const numValue = value as number;

                if (numValue >= 50) {
                    backgroundColors.push('rgba(37, 99, 235, 0.5)');
                    borderColors.push('rgba(37, 99, 235, 1)');
                } else {
                    backgroundColors.push('rgba(250, 204, 21, 0.5)');
                    borderColors.push('rgba(250, 204, 21, 1)');
                }
            });

            const data = {
                labels: Object.keys(achievementDistribution),
                datasets: [
                    {
                        label: 'Hardcore Achievements',
                        data: Object.values(achievementDistribution),
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1,
                    },
                ],
            };

            setChartData(data);
        }
    }, [achievementDistribution]);
    const renderTypeIcon = (type: string | null) => {
        let tooltipText = "";

        if (type === null) {
            tooltipText = "Unknown Type";
            return (
                <div className="tooltip tooltip-left" data-tip={tooltipText}>
                    <button className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle-fill mx-auto" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                        </svg>
                    </button>
                </div>
            );
        }

        if (type === 'win_condition') {
            tooltipText = "Win Condition";
            return (
                <div className="tooltip tooltip-left" data-tip={tooltipText}>
                    <button className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-award-fill mx-auto" viewBox="0 0 16 16">
                            <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864z" />
                            <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z" />
                        </svg>
                    </button>
                </div>
            );
        }

        if (type === 'progression') {
            tooltipText = "Progression";
            return (
                <div className="tooltip tooltip-left" data-tip={tooltipText}>
                    <button className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill mx-auto" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                        </svg>
                    </button>
                </div>
            );
        }

        if (type === 'missable') {
            tooltipText = "Missable";
            return (
                <div className="tooltip tooltip-left" data-tip={tooltipText}>
                    <button className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill mx-auto" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                        </svg>
                    </button>
                </div>
            );
        }

        return null;
    };

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
                                        <img loading="lazy"
                                            src={`https://retroachievements.org${gameInfo.ImageIngame}`}
                                            alt={`${game.Title} In-Game Screenshot`}
                                            className="rounded shadow-lg w-80 border-2 border-base-300"
                                            onClick={() => {
                                                closeModal();
                                                handleImageClick(`https://retroachievements.org${gameInfo.ImageIngame}`);
                                            }}
                                        />
                                    )}
                                    {gameInfo.ImageTitle && (
                                        <img loading="lazy"
                                            src={`https://retroachievements.org${gameInfo.ImageTitle}`}
                                            alt={`${game.Title} Title Image`}
                                            className="rounded shadow-lg w-80 border-2 border-base-300"
                                            onClick={() => {
                                                closeModal();
                                                handleImageClick(`https://retroachievements.org${gameInfo.ImageTitle}`);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                                <div className="card bg-base-300 w-full shadow-xl flex flex-col min-h-full">
                                    <div className="card-body p-2 flex-1">
                                        <div className="overflow-x-auto">
                                            <table className="table table-xs">
                                                <thead>
                                                    <tr>
                                                        <th>MD5</th>
                                                        <th>Name</th>
                                                        <th>Labels</th>
                                                        <th>Patch URL</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {gameHashes && gameHashes.length > 0 ? (
                                                        gameHashes.map((hash, index) => (
                                                            <tr key={index}>
                                                                <td>{hash.MD5}</td>
                                                                <td>{hash.Name}</td>
                                                                <td>{hash.Labels ? hash.Labels.join(", ").toUpperCase() : "N/A"}</td>
                                                                <td>{hash.PatchUrl ? <a href={hash.PatchUrl} target="_blank" rel="noopener noreferrer">Download</a> : "N/A"}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={4} className="text-center">No game hashes available</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="card bg-base-300 w-full shadow-xl flex flex-col min-h-full">
                                    <div className="card-body p-2 flex-1">
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
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="card bg-base-300 w-full shadow-xl flex flex-col min-h-full">
                                    <div className="card-body p-2 flex-1">
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
                                                        <td>{new Date(gameInfo.Released).toLocaleString('en-GB', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            second: 'numeric',
                                                            timeZone: 'Asia/Jakarta',
                                                            timeZoneName: 'short'
                                                        })}</td>
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
                                                    <th>Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedAchievements.map((achievement) => (
                                                    <tr key={achievement.ID} className="text-center">
                                                        <td>{achievement.Title}</td>
                                                        <td>{achievement.Description}</td>
                                                        <td>{achievement.Points}</td>
                                                        <td>
                                                            <div className="tooltip tooltip-left" data-tip={achievement.DateEarned ? new Date(achievement.DateEarned).toLocaleString('en-GB', {
                                                                timeZone: 'Asia/Jakarta',
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                second: 'numeric',
                                                                hour12: false
                                                            }) : "You have not earned this achievement yet"}>
                                                                <button className="btn btn-ghost">
                                                                    {achievement.DateEarned ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill mx-auto" viewBox="0 0 16 16">
                                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill mx-auto" viewBox="0 0 16 16">
                                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td>{renderTypeIcon(achievement.type)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-base-300 w-full shadow-xl flex flex-col min-h-full mt-6">
                                <div className="card-body p-2 flex-1">
                                    {chartData ? (
                                        <Bar
                                            data={chartData}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    title: {
                                                        display: true,
                                                        text: 'Achievement Distribution',
                                                    },
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                },
                                                scales: {
                                                    x: {
                                                        title: {
                                                            display: true,
                                                            text: 'Achievement Level',
                                                        },
                                                    },
                                                    y: {
                                                        title: {
                                                            display: true,
                                                            text: 'Number of Achievements',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    ) : (
                                        <div>Loading achievement distribution...</div>
                                    )}
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
