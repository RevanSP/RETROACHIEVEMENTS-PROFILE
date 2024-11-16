import React from 'react';
import { CardUserProfileProps } from '../types/type';

const CardUserProfile: React.FC<CardUserProfileProps> = ({ userData, awardCounts, onImageClick }) => {
    return (
        <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4 md:col-span-1">
            <div className="card-body">
                {userData && (
                    <>
                        <div className="flex items-center mb-4">
                            <div className="avatar">
                                <div className={`ring-offset-base-100 w-28 rounded-full ring ring-offset-2 transition-all ease-in-out duration-300 ${userData.User === 'Reiivan' ? 'ring-blue-700' : 'ring-yellow-500'}`}>
                                    {userData.UserPic ? (
                                        <img
                                            loading="lazy"
                                            src={`https://retroachievements.org${userData.UserPic}`}
                                            alt="User Profile"
                                            className="cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
                                            onClick={() => onImageClick(`https://retroachievements.org${userData.UserPic}`)}
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
                                <div className="flex items-center space-x-2">
                                    <h2 className="card-title">{userData.User}</h2>
                                    {userData.User === "Reiivan" && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-blue-700 w-5 bi bi-patch-check-fill" viewBox="0 0 16 16">
                                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                                        </svg>
                                    )}
                                </div>
                                <p>{userData.Motto}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                {userData.User === "Reiivan" && (
                                    <div className="flex space-x-2 mt-3 mb-5">
                                        <span className="badge bg-yellow-500 p-4 rounded-3xl">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-black bi bi-code-slash" viewBox="0 0 16 16">
                                                <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
                                            </svg>
                                            <span className="ml-2 text-sm font-bold text-black">Developer</span>
                                        </span>
                                        <span className="badge bg-yellow-500 p-4 rounded-3xl">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-black bi bi-person-fill-check" viewBox="0 0 16 16">
                                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                                            </svg>
                                            <span className="ml-2 text-sm font-bold text-black">Exclusive</span>
                                        </span>
                                    </div>
                                )}
                                <strong>Member Since :</strong>{" "}
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
                                <strong>Rich Presence :</strong> {userData.RichPresenceMsg || "?"}
                            </div>
                            <div>
                                <strong>Last Game ID :</strong> {userData.LastGameID || "?"}
                            </div>
                            <div>
                                <strong>Total Points :</strong> {userData.TotalPoints || "?"}
                            </div>
                            <div>
                                <strong>Total Softcore Points :</strong> {userData.TotalSoftcorePoints || "?"}
                            </div>
                            <div>
                                <strong>Total True Points :</strong> {userData.TotalTruePoints || "?"}
                            </div>
                            <div>
                                <strong>User ID :</strong> {userData.ID || "?"}
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
