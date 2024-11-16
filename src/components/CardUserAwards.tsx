import React from 'react';
import { CardUserAwardsProps } from '../types/type';

const CardUserAwards: React.FC<CardUserAwardsProps> = ({ userAwards, getConsoleIcon }) => {
    return (
        <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4 md:col-span-2">
            <div className="card-body flex justify-center items-center">
                <div className="overflow-x-auto max-h-[425px] overflow-y-auto w-full">
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
                                                    loading="lazy"
                                                    className="w-12 h-12 object-cover rounded-md mx-auto"
                                                />
                                            </td>
                                            <td className="text-center">{award.Title}</td>
                                            <td className="text-center">
                                                <div className="tooltip tooltip-bottom" data-tip={award.ConsoleName}>
                                                    <button className="btn btn-ghost">
                                                        <img
                                                            src={getConsoleIcon(award.ConsoleName)}
                                                            alt={award.ConsoleName}
                                                            className="w-10 h-10 object-contain object-center"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                {award.AwardType === 'Mastery/Completion' ? (
                                                    <div className="tooltip tooltip-bottom" data-tip="MASTERY / COMPLETION">
                                                        <button className="btn bg-base-100 text-white rounded-full">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle-fill text-blue-600" viewBox="0 0 16 16">
                                                                <circle cx="8" cy="8" r="8" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : award.AwardType === 'Game Beaten' ? (
                                                    <div className="tooltip tooltip-bottom" data-tip="GAME BEATEN">
                                                        <button className="btn bg-base-100 text-white rounded-full">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle-half text-yellow-500" viewBox="0 0 16 16">
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
    );
};

export default CardUserAwards;
