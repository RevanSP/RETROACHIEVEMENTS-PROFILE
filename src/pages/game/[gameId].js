import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  LuCheck,
  LuGamepad,
  LuHouse,
  LuAward,
  LuTrophy,
  LuRefreshCcw,
  LuUsers,
  LuUser,
  LuPercent,
  LuCode,
  LuCalendar,
  LuMegaphone,
  LuGitPullRequest,
  LuCpu,
  LuHash,
  LuList,
  LuActivity,
  LuGem,
  LuFeather,
  LuSwords,
  LuZap,
  LuFolderOpen,
  LuFlag,
  LuStar,
  LuBadgeInfo,
  LuClock,
} from "react-icons/lu";

export default function GameAchievements({ gameDetails, error }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("display");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState("icon"); // This state is not currently used in the provided JSX for image selection, but kept for completeness.
  const [showHashes, setShowHashes] = useState(false); // This state is not currently used to toggle visibility, but kept for completeness.

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-600 text-white p-6 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-bold mb-2">
              <LuRefreshCcw className="inline-block mr-2" />
              Error Loading Game Details
            </h2>
            <p>{error.message || error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gameDetails) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-xl">Loading game details...</p>
        </div>
      </div>
    );
  }

  const achievements = gameDetails.UserProgress?.Achievements
    ? Object.values(gameDetails.UserProgress.Achievements)
    : [];

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch =
      achievement.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.Description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "earned") return achievement.DateEarned && matchesSearch;
    if (filter === "unearned") return !achievement.DateEarned && matchesSearch;
    if (filter === "progression")
      return achievement.Type === "progression" && matchesSearch;
    if (filter === "missable")
      return achievement.Type === "missable" && matchesSearch;
    if (filter === "win_condition")
      return achievement.Type === "win_condition" && matchesSearch;
    return matchesSearch;
  });

  const sortedAchievements = filteredAchievements.sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.Title.localeCompare(b.Title);
      case "points":
        return b.Points - a.Points;
      case "trueRatio":
        return b.TrueRatio - a.TrueRatio;
      case "earned":
        if (a.DateEarned && b.DateEarned) {
          return new Date(b.DateEarned) - new Date(a.DateEarned);
        }
        return a.DateEarned ? -1 : 1;
      case "rarity":
        return a.NumAwarded - b.NumAwarded;
      case "created":
        return new Date(b.DateCreated) - new Date(a.DateCreated);
      default:
        return a.DisplayOrder - b.DisplayOrder;
    }
  });

  const earnedCount = achievements.filter((a) => a.DateEarned).length;
  const totalPoints = achievements.reduce((sum, a) => sum + a.Points, 0);
  const earnedPoints = achievements
    .filter((a) => a.DateEarned)
    .reduce((sum, a) => sum + a.Points, 0);
  const totalTrueRatio = achievements.reduce((sum, a) => sum + a.TrueRatio, 0);
  const earnedTrueRatio = achievements
    .filter((a) => a.DateEarned)
    .reduce((sum, a) => sum + a.TrueRatio, 0);

  const getTypeColor = (type) => {
    switch (type) {
      case "progression":
        return "bg-blue-400 text-blue-700";
      case "missable":
        return "bg-red-400 text-red-700";
      case "win_condition":
        return "bg-green-400 text-green-700";
      default:
        return "bg-yellow-400 text-yellow-600";
    }
  };

  const getRarityText = (numAwarded) => {
    if (numAwarded < 100) return "Ultra Rare";
    if (numAwarded < 300) return "Very Rare";
    if (numAwarded < 600) return "Rare";
    if (numAwarded < 1000) return "Uncommon";
    return "Common";
  };

  const getRarityColor = (numAwarded) => {
    if (numAwarded < 100) return "text-purple-800";
    if (numAwarded < 300) return "text-red-800";
    if (numAwarded < 600) return "text-orange-800";
    if (numAwarded < 1000) return "text-black";
    return "text-green-800";
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>{gameDetails.Title} Achievements</title>
      </Head>
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="breadcrumbs text-xs bg-blue-600 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black px-4 mb-4 rounded">
          <ul>
            <li>
              <Link href="/">
                <LuHouse className="inline-block mr-1" />
                Home
              </Link>
            </li>
            <li>
              <Link href="/">
                <LuGamepad className="inline-block mr-1" />
                {gameDetails.Title}
              </Link>
            </li>
          </ul>
        </div>
        <div className="bg-blue-600 rounded p-6 mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              <Image
                unoptimized
                sizes="100vw"
                width={0}
                height={0}
                src={gameDetails.ImageIcon}
                alt={`${gameDetails.Title} icon`}
                className="w-26 h-26 rounded border-2 border-black object-cover shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-in-out hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-xl font-bold mb-4 text-black">
                {gameDetails.Title}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-black border-b border-black pb-1">
                    <LuFolderOpen className="inline-block mr-2" />
                    Game Info
                  </h3>
                  <p>
                    <span className="font-semibold">
                      <LuGamepad className="inline-block mr-1" /> Game ID :
                    </span>{" "}
                    <span className="font-semibold">{gameDetails.GameID}</span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuCpu className="inline-block mr-1" /> Console :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.ConsoleName} (ID: {gameDetails.ConsoleID})
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuCode className="inline-block mr-1" /> Developer :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.Developer}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuMegaphone className="inline-block mr-1" /> Publisher :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.Publisher}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuList className="inline-block mr-1" /> Genre :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.Genre}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuCalendar className="inline-block mr-1" /> Released :
                    </span>{" "}
                    <span className="font-semibold">
                      {new Date(
                        gameDetails.UserProgress?.Released
                      ).toLocaleDateString()}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuCheck className="inline-block mr-1" /> Final :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.IsFinal ? "Yes" : "No"}
                    </span>
                  </p>
                  {gameDetails.ParentGameID && (
                    <p>
                      <span className="font-semibold">
                        <LuFolderOpen className="inline-block mr-1" /> Parent
                        Game ID :
                      </span>{" "}
                      <span className="font-semibold">
                        {gameDetails.ParentGameID}
                      </span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-black border-b border-black pb-1">
                    <LuActivity className="inline-block mr-2" />
                    Progress
                  </h3>
                  <p>
                    <span className="font-semibold">
                      <LuPercent className="inline-block mr-1" /> Completion :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.UserCompletion}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuTrophy className="inline-block mr-1" /> Hardcore :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.UserCompletionHardcore}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuAward className="inline-block mr-1" /> Achievements :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.NumAwarded} / {gameDetails.MaxPossible}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuGem className="inline-block mr-1" /> Points :
                    </span>{" "}
                    <span className="font-semibold">
                      {earnedPoints} / {totalPoints}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuFeather className="inline-block mr-1" /> True Ratio :
                    </span>{" "}
                    <span className="font-semibold">
                      {earnedTrueRatio} / {totalTrueRatio}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuTrophy className="inline-block mr-1" /> Highest Award :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.HighestAwardKind}
                    </span>
                  </p>
                  {gameDetails.HighestAwardDate && (
                    <p>
                      <span className="font-semibold">
                        <LuCalendar className="inline-block mr-1" /> Award Date
                        :
                      </span>{" "}
                      <span className="font-semibold">
                        {new Date(
                          gameDetails.HighestAwardDate
                        ).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-black border-b border-black pb-1">
                    <LuUsers className="inline-block mr-2" />
                    Community
                  </h3>
                  <p>
                    <span className="font-semibold">
                      <LuUsers className="inline-block mr-1" /> Total Players :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.NumDistinctPlayers}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuUsers className="inline-block mr-1" /> Casual Players :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.NumDistinctPlayersCasual}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuUsers className="inline-block mr-1" /> Hardcore Players
                      :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.NumDistinctPlayersHardcore}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuSwords className="inline-block mr-1" /> Forum Topic :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.ForumTopicID}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuFlag className="inline-block mr-1" /> Flags :
                    </span>{" "}
                    <span className="font-semibold">
                      {gameDetails.UserProgress?.Flags}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      <LuGitPullRequest className="inline-block mr-1" /> Rich
                      Presence :
                    </span>{" "}
                    <span className="font-semibold text-xs break-all">
                      {gameDetails.UserProgress?.RichPresencePatch}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Achievement Progress</span>
                    <span>
                      {earnedCount}/{gameDetails.MaxPossible}
                    </span>
                  </div>
                  <div className="w-full bg-blue-400 rounded-full h-3 border-2 border-black">
                    <div
                      className="bg-yellow-500 h-full rounded-full"
                      style={{
                        width: `${
                          (earnedCount / gameDetails.MaxPossible) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Points Progress</span>
                    <span>
                      {earnedPoints}/{totalPoints}
                    </span>
                  </div>
                  <div className="w-full bg-blue-400 rounded-full h-3 border-2 border-black">
                    <div
                      className="bg-yellow-500 h-full rounded-full"
                      style={{
                        width: `${(earnedPoints / totalPoints) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                {
                  label: "Title",
                  url: gameDetails.UserProgress?.ImageTitle,
                },
                {
                  label: "In-Game",
                  url: gameDetails.UserProgress?.ImageIngame,
                },
                {
                  label: "Box Art",
                  url: gameDetails.UserProgress?.ImageBoxArt,
                },
              ]
                .filter((img) => img.url)
                .map((img) => (
                  <div
                    key={img.label}
                    className="relative group border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-1 bg-blue-400"
                  >
                    <Image
                      unoptimized
                      width={0}
                      height={0}
                      sizes="100vw"
                      src={img.url}
                      alt={`${gameDetails.Title} ${img.label}`}
                      className="object-contain max-w-full rounded border-none w-full"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="bg-blue-600 rounded p-6 mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
          <h3 className="text-xl font-bold mb-6">
            <LuAward className="inline-block mr-2" />
            Complete Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="bg-blue-400 rounded px-0 py-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <div className="text-2xl font-bold">{earnedCount}</div>
              <div className=" text-xs">
                <LuCheck className="inline-block mr-1" />
                Earned
              </div>
            </div>
            <div className="bg-blue-400 rounded px-0 py-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <div className="text-2xl font-bold">
                {gameDetails.MaxPossible - earnedCount}
              </div>
              <div className=" text-xs">
                <LuTrophy className="inline-block mr-1" />
                Remaining
              </div>
            </div>
            <div className="bg-blue-400 rounded p-0 py-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <div className="text-2xl font-bold ">{earnedPoints}</div>
              <div className=" text-xs">
                <LuGem className="inline-block mr-1" />
                Points Earned
              </div>
            </div>
            <div className="bg-blue-400 rounded p-0 py-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <div className="text-2xl font-bold ">{earnedTrueRatio}</div>
              <div className=" text-xs">
                <LuFeather className="inline-block mr-1" />
                True Ratio
              </div>
            </div>
            <div className="bg-blue-400 rounded p-0 py-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <div className="text-2xl font-bold">
                {Math.round((earnedCount / gameDetails.MaxPossible) * 100)}%
              </div>
              <div className=" text-xs">
                <LuPercent className="inline-block mr-1" />
                Completion
              </div>
            </div>
            <div className="bg-blue-400 rounded px-0 py-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <div className="text-2xl font-bold">
                {gameDetails.UserProgress?.NumDistinctPlayers}
              </div>
              <div className=" text-xs">
                <LuUsers className="inline-block mr-1" />
                Total Players
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4 text-black">
              <LuList className="inline-block mr-2" />
              Achievement Types
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["progression", "missable", "win_condition"].map((type) => {
                const typeAchievements = achievements.filter(
                  (a) => a.Type === type
                );
                const earnedType = typeAchievements.filter(
                  (a) => a.DateEarned
                ).length;
                const progress =
                  typeAchievements.length > 0
                    ? (earnedType / typeAchievements.length) * 100
                    : 0;

                const TypeIcon =
                  type === "progression"
                    ? LuActivity
                    : type === "missable"
                    ? LuZap
                    : type === "win_condition"
                    ? LuTrophy
                    : LuAward; // Default icon

                return (
                  <div
                    key={type}
                    className="bg-blue-300 rounded p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black ${getTypeColor(
                          type
                        )}`}
                      >
                        <TypeIcon className="inline-block mr-1" />
                        {type.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold">
                        {earnedType} / {typeAchievements.length}
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3 border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div
                        className={`${getTypeColor(
                          type
                        )} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-blue-600 rounded border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            <LuHash className="inline-block mr-2" />
            ROM Hashes & Compatibility
          </div>
          <div className="collapse-content text-xs">
            <div className="mt-4 space-y-4">
              {gameDetails.Hashes?.map((hash, index) => (
                <div
                  key={index}
                  className="bg-blue-400 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-in-out hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] border-black rounded px-4 py-2"
                >
                  <h4 className="font-semibold mb-2">
                    <LuHash className="inline-block mr-1" />
                    {hash.Name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p>
                        <span className="font-semibold">MD5:</span>{" "}
                        <span className="font-mono">{hash.MD5}</span>
                      </p>
                      <p>
                        <span className="font-semibold">Labels:</span>{" "}
                        <span className="font-semibold">
                          {hash.Labels?.join(", ")}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold">Patch URL:</span>{" "}
                        <span className="font-semibold">
                          {hash.PatchUrl || "None"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="join w-full rounded ">
          <div className="w-full">
            <div className="w-full">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-xs join-item w-full bg-base-100 border-r-2 border-black transition-all duration-200 ease-in-out
        hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[3px] active:translate-y-[3px] mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                placeholder="Search Achievements ..."
              />
            </div>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select join-item select-xs bg-blue-600 border-l-2 border-black transition-all duration-200 ease-in-out
        hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[3px] active:translate-y-[3px] mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <option value="all">
              <LuAward className="inline-block mr-1" /> All Achievements
            </option>
            <option value="earned">
              <LuCheck className="inline-block mr-1" /> Earned
            </option>
            <option value="unearned">
              <LuTrophy className="inline-block mr-1" /> Not Earned
            </option>
            <option value="progression">
              <LuActivity className="inline-block mr-1" /> Progression
            </option>
            <option value="missable">
              <LuZap className="inline-block mr-1" /> Missable
            </option>
            <option value="win_condition">
              <LuTrophy className="inline-block mr-1" /> Win Condition
            </option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select join-item select-xs bg-blue-600 transition-all duration-200 ease-in-out
        hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[3px] active:translate-y-[3px] mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-l-2 border-black"
          >
            <option value="display">
              <LuList className="inline-block mr-1" /> Display Order
            </option>
            <option value="title">
              <LuAward className="inline-block mr-1" /> Title
            </option>
            <option value="points">
              <LuGem className="inline-block mr-1" /> Points
            </option>
            <option value="trueRatio">
              <LuFeather className="inline-block mr-1" /> True Ratio
            </option>
            <option value="earned">
              <LuCalendar className="inline-block mr-1" /> Recently Earned
            </option>
            <option value="rarity">
              <LuStar className="inline-block mr-1" /> Rarity
            </option>
            <option value="created">
              <LuCalendar className="inline-block mr-1" /> Date Created
            </option>
          </select>
        </div>
        <div className="space-y-4">
          {sortedAchievements.length > 0 ? (
            sortedAchievements.map((achievement) => (
              <div
                key={achievement.ID}
                className="collapse collapse-arrow bg-blue-600 rounded border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <input type="checkbox" />
                <div className="collapse-title flex items-center gap-4 text-sm font-semibold text-black">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      unoptimized
                      sizes="100vw"
                      width={0}
                      height={0}
                      src={achievement.BadgeName}
                      alt={achievement.Title}
                      className={`w-full h-full object-cover rounded-none ${
                        achievement.DateEarned
                          ? "opacity-100"
                          : "opacity-50 grayscale"
                      }`}
                    />
                    {achievement.DateEarned && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                        <LuCheck className="w-2 h-2" />
                      </div>
                    )}
                  </div>
                  <span className="line-clamp-2">{achievement.Title}</span>
                </div>
                <div className="collapse-content text-xs text-black space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`badge uppercase  badge-sm rounded text-xs font-semibold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getTypeColor(
                        achievement.Type
                      )}`}
                    >
                      {achievement.Type?.replace("_", " ").toUpperCase() ||
                        "STANDARD"}
                    </span>
                    <span className="bg-blue-400 text-blue-600 badge uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] badge-sm rounded text-xs font-semibold">
                      <LuGem className="inline-block" />
                      {achievement.Points} pts
                    </span>
                    <span className="bg-blue-400 badge text-blue-600 uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] badge-sm rounded text-xs font-semibold">
                      <LuFeather className="inline-block" />
                      {achievement.TrueRatio} ratio
                    </span>
                  </div>
                  <div className="border-b border-black pb-2">
                    <p className="text-xs">{achievement.Description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold uppercase text-blue-400">
                        <LuActivity className="inline-block mr-1" />
                        Stats
                      </h4>
                      <div
                        className={`font-semibold badge badge-xs bg-blue-400 border-none ${getRarityColor(
                          achievement.NumAwarded
                        )}`}
                      >
                        <LuStar className="inline-block mr-1" />
                        {getRarityText(achievement.NumAwarded)}
                      </div>
                      <div>
                        <span className="font-semibold">
                          <LuUsers className="inline-block mr-1" /> Earned by :
                        </span>{" "}
                        {achievement.NumAwarded} players
                      </div>
                      <div>
                        <span className="font-semibold">
                          <LuTrophy className="inline-block mr-1" /> Hardcore :
                        </span>{" "}
                        {achievement.NumAwardedHardcore} players
                      </div>
                      <div>
                        <span className="font-semibold">
                          <LuList className="inline-block mr-1" /> Display Order
                          :
                        </span>{" "}
                        {achievement.DisplayOrder}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold uppercase text-blue-400">
                        <LuBadgeInfo className="inline-block mr-1" />
                        Metadata
                      </h4>
                      <div>
                        <span className="font-semibold">
                          <LuHash className="inline-block mr-1" /> Achievement
                          ID :
                        </span>{" "}
                        {achievement.ID}
                      </div>
                      <div>
                        <span className="font-semibold">
                          <LuUser className="inline-block mr-1" /> Created by :
                        </span>{" "}
                        {achievement.Author}
                      </div>
                      <div>
                        <span className="font-semibold">
                          <LuCalendar className="inline-block mr-1" /> Created :
                        </span>{" "}
                        {new Date(achievement.DateCreated).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-semibold">
                          <LuCalendar className="inline-block mr-1" /> Modified
                          :
                        </span>{" "}
                        {new Date(
                          achievement.DateModified
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-1 break-words">
                      <h4 className="text-[11px] font-bold uppercase text-blue-400">
                        <LuClock className="inline-block mr-1" />
                        Earned & Dev Info
                      </h4>
                      {achievement.DateEarned && (
                        <>
                          <div className="font-semibold">
                            <LuCheck className="inline-block mr-1" /> Earned :{" "}
                            {new Date(
                              achievement.DateEarned
                            ).toLocaleDateString()}
                          </div>
                          {achievement.DateEarnedHardcore && (
                            <div className="font-semibold">
                              <LuZap className="inline-block mr-1" /> Hardcore :{" "}
                              {new Date(
                                achievement.DateEarnedHardcore
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </>
                      )}
                      <div>
                        <span className="font-semibold">
                          <LuCode className="inline-block mr-1" /> Author ULID :
                        </span>{" "}
                        <span className="font-mono text-xs break-all">
                          {achievement.AuthorULID}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">
                          <LuCpu className="inline-block mr-1" /> Memory Address
                          :
                        </span>{" "}
                        <span className="font-mono text-xs break-all">
                          {achievement.MemAddr}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black py-12 bg-red-500">
              <LuTrophy className="text-red-400 text-6xl mb-4" />
              <p className="text-red-400 text-xl font-semibold">
                No achievements match your current filters
              </p>
              <p className="text-red-400 mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { gameId } = context.params;
  const isProd = process.env.NODE_ENV === "production";
  const baseUrl = isProd
    ? "https://retroachievements.revanspstudy28.workers.dev"
    : `http://${context.req.headers.host}`;

  const targetUserParam = context.query.targetUser
    ? `&targetUser=${context.query.targetUser}`
    : "";

  try {
    const res = await fetch(
      `${baseUrl}/api/game-detail/${gameId}${targetUserParam}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.error ||
          `Failed to fetch game details: ${res.status} ${res.statusText}`
      );
    }

    const gameDetails = await res.json();

    return {
      props: {
        gameDetails,
      },
    };
  } catch (e) {
    console.error(
      `Error fetching game details for GameID ${gameId}:`,
      e.message
    );
    return {
      props: {
        gameDetails: null,
        error: { message: e.message || "Failed to fetch game details." },
      },
    };
  }
}