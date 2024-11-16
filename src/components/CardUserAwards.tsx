import React, { useState, useMemo } from 'react';
import { CardUserAwardsProps, GroupedAward } from '../types/type';

const CardUserAwards: React.FC<CardUserAwardsProps> = ({ userAwards, getConsoleIcon }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const groupedAwards = useMemo(() => {
        const groupedByTitle = userAwards.reduce<Record<string, GroupedAward>>((acc, award) => {
            if (!acc[award.Title]) {
                acc[award.Title] = {
                    Title: award.Title,
                    ImageIcon: award.ImageIcon,
                    ConsoleName: award.ConsoleName,
                    AwardedAt: award.AwardedAt,
                    allAwards: [award],
                    hasMastery: award.AwardType === 'Mastery/Completion',
                    hasBeaten: award.AwardType === 'Game Beaten',
                };
            } else {
                acc[award.Title].allAwards.push(award);
                if (award.AwardType === 'Mastery/Completion') {
                    acc[award.Title].hasMastery = true;
                }
                if (award.AwardType === 'Game Beaten') {
                    acc[award.Title].hasBeaten = true;
                }
                if (new Date(award.AwardedAt) > new Date(acc[award.Title].AwardedAt)) {
                    acc[award.Title].AwardedAt = award.AwardedAt;
                }
            }
            return acc;
        }, {});

        const sortedAwards = Object.values(groupedByTitle).sort((a, b) => {
            if (a.hasMastery && !b.hasMastery) return -1;
            if (!a.hasMastery && b.hasMastery) return 1;

            if (a.hasBeaten && !b.hasBeaten) return -1;
            if (!a.hasBeaten && b.hasBeaten) return 1;

            return new Date(b.AwardedAt).getTime() - new Date(a.AwardedAt).getTime();
        });

        return sortedAwards;
    }, [userAwards]);

    const totalPages = Math.ceil(groupedAwards.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedAwards = groupedAwards.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getAwardIcon = (hasMastery: boolean, hasBeaten: boolean) => {
        if (hasMastery && hasBeaten) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-circle-fill text-blue-600"
                    viewBox="0 0 16 16"
                >
                    <circle cx="8" cy="8" r="8" />
                </svg>
            );
        } else if (hasMastery || hasBeaten) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-circle-half text-yellow-500"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
                </svg>
            );
        }
        return <span className="badge badge-outline rounded-md bg-neutral-700">No Awards</span>;
    };

    return (
        <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4 md:col-span-2">
            <div className="card-body">
                <div className="overflow-x-auto w-full max-w-full">
                    <table className="table table-xs w-full table-auto">
                        <thead>
                            <tr>
                                <th className="text-center">Game Icon</th>
                                <th className="text-center">Game Title</th>
                                <th className="text-center">Console</th>
                                <th className="text-center">Award Status</th>
                                <th className="text-center">Latest Award Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedAwards.length > 0 ? (
                                paginatedAwards.map((award) => (
                                    <tr key={`${award.Title}-${award.AwardedAt}`}>
                                        <td className="text-center">
                                            <img
                                                src={`https://retroachievements.org${award.ImageIcon}`}
                                                alt={award.Title}
                                                loading="lazy"
                                                className="w-12 h-12 object-cover rounded-md mx-auto transition-all duration-300 ease-in-out hover:grayscale hover:contrast-125 active:grayscale"
                                            />
                                        </td>
                                        <td className="text-center">{award.Title}</td>
                                        <td className="text-center">
                                            <div className="tooltip tooltip-bottom" data-tip={award.ConsoleName}>
                                                <button className="btn btn-ghost p-0">
                                                    <img
                                                        src={getConsoleIcon(award.ConsoleName)}
                                                        alt={award.ConsoleName}
                                                        className="w-96 sm:w-12 h-auto object-contain transition-transform duration-300 ease-in-out hover:rotate-12 active:rotate-12"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div
                                                className="tooltip tooltip-bottom"
                                                data-tip={award.hasBeaten ? 'Game Beaten' : ''}
                                            >
                                                <button className="btn bg-base-100 text-white rounded-full">
                                                    {getAwardIcon(award.hasMastery, award.hasBeaten)}
                                                </button>
                                            </div>
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
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="mt-4 overflow-x-auto">
                        <div className="join whitespace-nowrap">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`join-item btn btn-xs ${currentPage === index + 1 ? 'btn-active' : 'bg-base-100'}`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardUserAwards;
