import { useEffect, useRef, useState } from 'react';
import { ModalGamesProps } from '../types/type';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, TooltipItem } from 'chart.js';
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

    const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);

    useEffect(() => {
        if (achievementDistribution) {
            const labels = Object.keys(achievementDistribution);
            const totalValues = Object.values(achievementDistribution) as number[];

            const hardcoreValues = totalValues.map(value => Math.round(value * 0.4));
            const softcoreValues = totalValues.map(value => Math.round(value * 0.6));

            const data: ChartData<'bar'> = {
                labels,
                datasets: [
                    {
                        label: 'Hardcore Users',
                        data: hardcoreValues,
                        backgroundColor: 'rgba(37, 99, 235, 0.6)',
                        borderColor: 'rgba(37, 99, 235, 1)',
                        borderWidth: 1,
                        stack: 'Stack 0',
                    },
                    {
                        label: 'Softcore Users',
                        data: softcoreValues,
                        backgroundColor: 'rgba(250, 204, 21, 0.6)',
                        borderColor: 'rgba(250, 204, 21, 1)',
                        borderWidth: 1,
                        stack: 'Stack 0',
                    }
                ]
            };

            setChartData(data);
        }
    }, [achievementDistribution]);
    const renderTypeIcon = (type: string | null) => {
        let tooltipText = "";

        if (type === null) {
            tooltipText = "Untype";
            return (
                <div className="tooltip tooltip-left" data-tip={tooltipText}>
                    <button className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle mx-auto" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-award-fill mx-auto text-yellow-500" viewBox="0 0 16 16">
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2-circle text-blue-500 mx-auto" viewBox="0 0 16 16">
                            <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                            <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-auto text-white bi bi-exclamation-octagon" viewBox="0 0 16 16">
                            <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
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
                                <div className="card bg-base-300 w-full shadow-xl flex flex-col min-h-full border-2 border-base-100 rounded-md">
                                    <div className="card-body p-2 flex-1">
                                        <div className="overflow-x-auto">
                                            <table className="table table-xs">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">MD5</th>
                                                        <th className="text-center">Name</th>
                                                        <th className="text-center">Labels</th>
                                                        <th className="text-center">Patch URL</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {gameHashes && gameHashes.length > 0 ? (
                                                        gameHashes.map((hash, index) => (
                                                            <tr key={index}>
                                                                <td className="text-center">{hash.MD5}</td>
                                                                <td className="text-center">{hash.Name}</td>
                                                                <td className="text-center">
                                                                    {hash.Labels ? hash.Labels.join(", ").toUpperCase() : "N/A"}
                                                                </td>
                                                                <td className="text-center">
                                                                    {hash.PatchUrl ? (
                                                                        <a
                                                                            href={hash.PatchUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="btn btn-circle bg-blue-700 font-bold text-white flex items-center justify-center"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="currentColor"
                                                                                className="bi w-6 h-6"
                                                                                viewBox="0 0 16 16"
                                                                            >
                                                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                                                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                                                                            </svg>
                                                                        </a>
                                                                    ) : "N/A"}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={4} className="text-center">No game hashes available</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="text-center">
                                                        <th>MD5</th>
                                                        <th>Name</th>
                                                        <th>Labels</th>
                                                        <th>Patch URL</th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="card bg-base-300 w-full shadow-xl flex flex-col min-h-full border-base-100 rounded-md">
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
                                <div className="card bg-base-300 w-full shadow-xl flex flex-col min-h-full border-base-100 rounded-md">
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
                            <div className="card bg-base-300 w-full shadow-xl mt-6 border-base-100 rounded-md">
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
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill mx-auto text-green-500" viewBox="0 0 16 16">
                                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill mx-auto text-red-500" viewBox="0 0 16 16">
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
                            <div className="card bg-base-300 w-full shadow-xl flex flex-col min-h-[300px] mt-6 border-base-100 rounded-md">
                                <div className="card-body p-2 flex-1">
                                    {chartData ? (
                                        <Bar
                                            data={chartData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    title: {
                                                        display: true,
                                                        text: 'Achievement Distribution',
                                                    },
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: function (context: TooltipItem<'bar'>) {
                                                                const label = context.dataset.label || '';
                                                                const value = context.parsed.y;

                                                                const total = (context.dataset.data as number[])
                                                                    .filter((item) => typeof item === 'number')
                                                                    .reduce((a, b) => a + b, 0);

                                                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

                                                                return `${label}: ${value} (${percentage}%)`;
                                                            }
                                                        }
                                                    }
                                                },
                                                scales: {
                                                    x: {
                                                        stacked: true,
                                                        title: {
                                                            display: true,
                                                            text: 'Achievement Level',
                                                        }
                                                    },
                                                    y: {
                                                        stacked: true,
                                                        title: {
                                                            display: true,
                                                            text: 'Number of Users',
                                                        }
                                                    }
                                                }
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
