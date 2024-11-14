import React from 'react';
import { CardUserProfileProps } from '../types/type';

const CardUserProfile: React.FC<CardUserProfileProps> = ({ userData, awardCounts }) => {
    return (
        <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4 md:col-span-1">
            <div className="card-body">
                {userData && (
                    <>
                        <div className="flex items-center mb-4">
                            <div className="avatar">
                                <div className="ring-yellow-500 ring-offset-base-100 w-28 rounded-full ring ring-offset-2">
                                    {userData.UserPic ? (
                                        <img loading="lazy"
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
                                {userData.MemberSince
                                    ? new Date(userData.MemberSince).toLocaleString('en-GB', {
                                        timeZone: 'Asia/Jakarta',
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        second: 'numeric',
                                        hour12: false,
                                    })
                                    : "?"}
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
                <div className="overflow-x-auto mt-3 bg-base-100 rounded border-2 border-base-300 p-4">
                    <table className="table table-xs">
                        <thead>
                            <tr>
                                <th className="pl-8">Awards</th>
                                <th className="text-center">Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {awardCounts && (
                                <>
                                    <tr>
                                        <td className="pl-8">Total Awards</td>
                                        <td className="text-center">{awardCounts.TotalAwardsCount}</td>
                                    </tr>
                                    <tr>
                                        <td className="pl-8">Mastery Awards</td>
                                        <td className="text-center">{awardCounts.MasteryAwardsCount}</td>
                                    </tr>
                                    <tr>
                                        <td className="pl-8">Completion Awards</td>
                                        <td className="text-center">{awardCounts.CompletionAwardsCount}</td>
                                    </tr>
                                    <tr>
                                        <td className="pl-8">Beaten Hardcore Awards</td>
                                        <td className="text-center">{awardCounts.BeatenHardcoreAwardsCount}</td>
                                    </tr>
                                    <tr>
                                        <td className="pl-8">Beaten Softcore Awards</td>
                                        <td className="text-center">{awardCounts.BeatenSoftcoreAwardsCount}</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CardUserProfile;
