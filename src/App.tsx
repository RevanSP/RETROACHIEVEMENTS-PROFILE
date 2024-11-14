import { useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import useUserProfile from "./hooks/useUserProfile";
import Hero from "./components/Hero";

const App = () => {
  const [username, setUsername] = useState<string>("Reiivan");
  const { userData, completedGames, userAwards } = useUserProfile(username);
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
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
                          {userData.MemberSince ? new Date(userData.MemberSince).toLocaleDateString() : "?"}
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
                </div>
              </div>
              <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4 md:col-span-2">
                <div className="card-body">
                  <h2 className="card-title">Awards</h2>
                  {userAwards && userAwards.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="table table-xs w-full">
      <thead>
        <tr>
          <th>ICON</th>
          <th>GAME TITLE</th>
          <th>AWARD TYPE</th>
          <th>CONSOLE</th>
          <th>AWARD ID</th>
          <th>AWARDED AT</th>
        </tr>
      </thead>
      <tbody>
        {userAwards.map((award) => (
          <tr key={award.AwardData}>
            <td className="flex justify-center items-center">
              <img
                src={`https://retroachievements.org${award.ImageIcon}`}
                alt={award.Title}
                className="w-12 h-12 object-cover rounded-md" // Ensures consistent size
              />
            </td>
            <td className="whitespace-nowrap">{award.Title}</td>  {/* Prevent text wrapping */}
            <td className="whitespace-nowrap">{award.AwardType}</td>
            <td className="whitespace-nowrap">{award.ConsoleName}</td>
            <td className="whitespace-nowrap">{award.AwardData}</td>
            <td className="whitespace-nowrap">
              {new Date(award.AwardedAt)
                .toLocaleString('en-GB', {
                  timeZone: 'Asia/Jakarta',
                  hour12: false,
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })
              }
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th>ICON</th>
          <th>GAME TITLE</th>
          <th>AWARD TYPE</th>
          <th>CONSOLE</th>
          <th>AWARD ID</th>
          <th>AWARDED AT</th>
        </tr>
      </tfoot>
    </table>
  </div>
) : (
  <p>No awards found.</p>
)}

                </div>
              </div>
            </div>
            <div className="card bg-base-200 w-full border-2 rounded-lg border-base-300 mt-4">
      <div className="card-body">
        <h2 className="card-title">Completed Games</h2>
        <div className="overflow-x-auto">
      <table className="table table-xs w-full">
        <thead>
          <tr>
            <th>Game Icon</th>
            <th>Game Title</th>
            <th>Console</th>
            <th>Completion %</th>
            <th>Achievements</th>
          </tr>
        </thead>
        <tbody>
          {completedGames && completedGames.length > 0 ? (
            completedGames.map((game) => (
              <tr key={game.GameID}>
                <td>
                  <img
                    src={`https://retroachievements.org${game.ImageIcon}`}
                    alt={game.Title}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </td>
                <td>{game.Title}</td>
                <td>{game.ConsoleName}</td>
                <td>{(game.PctWon * 100).toFixed(2)}%</td>
                <td>
                  {game.NumAwarded} / {game.MaxPossible} Achievements
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No completed games found.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th>Game Icon</th>
            <th>Game Title</th>
            <th>Console</th>
            <th>Completion %</th>
            <th>Achievements</th>
          </tr>
        </tfoot>
      </table>
    </div>
      </div>
    </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
