import React, { useState, useMemo } from 'react';
import { CardUserAwardsProps, GroupedAward } from '../types/type';

const CardUserAwards: React.FC<CardUserAwardsProps> = ({ userAwards, getConsoleIcon }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const itemsPerPage = 9;

    // Grouping awards by title
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
        return Object.values(groupedByTitle);
    }, [userAwards]);

    // Filter awards based on search query
    const filteredAwards = useMemo(() => {
        return groupedAwards.filter((award) =>
            award.Title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [groupedAwards, searchQuery]);

    const totalPages = Math.ceil(filteredAwards.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedAwards = filteredAwards.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getAwardIcon = (hasMastery: boolean, hasBeaten: boolean) => {
        if (hasMastery && hasBeaten) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle-fill text-blue-600" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8" />
                </svg>
            );
        } else if (hasMastery || hasBeaten) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle-half text-yellow-500" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
                </svg>
            );
        }
        return <span className="badge badge-outline rounded-md bg-neutral-700">No Awards</span>;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4 md:col-span-2">
            <div className="card-body">
                {/* Search Input */}
                <div className="input-group flex items-center input-sm w-full mb-4">
                    <label className="input flex input-sm items-center w-full gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 bi bi-joystick" viewBox="0 0 16 16">
                            <path d="M10 2a2 2 0 0 1-1.5 1.937v5.087c.863.083 1.5.377 1.5.726 0 .414-.895.75-2 .75s-2-.336-2-.75c0-.35.637-.643 1.5-.726V3.937A2 2 0 1 1 10 2" />
                            <path d="M0 9.665v1.717a1 1 0 0 0 .553.894l6.553 3.277a2 2 0 0 0 1.788 0l6.553-3.277a1 1 0 0 0 .553-.894V9.665c0-.1-.06-.19-.152-.23L9.5 6.715v.993l5.227 2.178a.125.125 0 0 1 .001.23l-5.94 2.546a2 2 0 0 1-1.576 0l-5.94-2.546a.125.125 0 0 1 .001-.23L6.5 7.708l-.013-.988L.152 9.435a.25.25 0 0 0-.152.23" />
                        </svg>
                        <input
                            type="text"
                            className="grow"
                            placeholder="Search Game Title"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </label>
                </div>
                
                {/* Displaying Loading State if No Data */}
                {userAwards.length === 0 ? (
                    <div className="text-center py-4">Loading awards...</div>
                ) : (
                    <>
                        {/* Table for Displaying Awards */}
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
                                                        className="w-12 h-12 object-cover rounded-md mx-auto"
                                                    />
                                                </td>
                                                <td className="text-center">{award.Title}</td>
                                                <td className="text-center">
                                                    <div className="tooltip tooltip-bottom" data-tip={award.ConsoleName}>
                                                        <button className="btn btn-ghost p-0">
                                                            <img
                                                                src={getConsoleIcon(award.ConsoleName)}
                                                                alt={award.ConsoleName}
                                                                className="w-12 h-auto object-contain"
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="tooltip tooltip-bottom" data-tip="Awarded">
                                                        <button className="btn btn-ghost p-0">
                                                            {getAwardIcon(award.hasMastery, award.hasBeaten)}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    {new Date(award.AwardedAt).toLocaleString('en-GB')}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4">No awards found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4 overflow-x-auto">
                        <div className="flex justify-center whitespace-nowrap">
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


