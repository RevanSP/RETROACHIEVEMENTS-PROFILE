import React from "react";
import { Props } from "../types/type";

const CardUserCompleted: React.FC<Props> = ({
    searchQuery,
    currentGames,
    handleInputFocus,
    handleSearchQueryChange,
    handleOpenModal,
    currentPage,
    paginate,
    pageNumbers,
    getConsoleIcon,
}) => {

    return (
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
                            onFocus={handleInputFocus}
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
                                    <td className="text-center">
                                        <div className="tooltip tooltip-bottom" data-tip={game.ConsoleName}>
                                            <button className="btn btn-ghost">
                                                <img
                                                    src={getConsoleIcon(game.ConsoleName)}
                                                    alt={game.ConsoleName}
                                                    className="w-8 h-8 object-cover mx-auto"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <progress className="progress progress-info w-56" value={game.PctWon * 100} max="100"></progress>
                                        <div className="mt-0 text-xs">{(game.PctWon * 100).toFixed(2)}%</div>
                                    </td>
                                    <td>{game.NumAwarded} / {game.MaxPossible} Achievements</td>
                                    <td className="text-center">
                                        {game.HardcoreMode === "1" ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill mx-auto text-green-500" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill mx-auto text-red-500" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                            </svg>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn bg-base-100 rounded"
                                            onClick={() => handleOpenModal(game.GameID)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle text-white" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center">
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
                </div>
            </div>
        </div>
    );
};

export default CardUserCompleted;