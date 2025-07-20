import Head from "next/head";
import Navbar from "../components/Navbar";
import Image from "next/image";
import React, { useState, useMemo, useEffect } from "react";
import { RiProgress8Line, RiProgress4Line } from "react-icons/ri";
import {
  LuAward,
  LuBadgeAlert,
  LuCalendarCheck,
  LuChartBar,
  LuGamepad2,
  LuSparkles,
  LuStar,
  LuTrophy,
} from "react-icons/lu";
import Link from "next/link";
import Footer from "@/components/Footer";

const UserSkeleton = () => (
  <div className="animate-pulse">
    <li className="relative flex items-start space-x-2">
      <div className="w-7 h-7 bg-blue-400 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
      <div className="flex flex-col justify-start flex-1">
        <div className="h-3 bg-blue-400 rounded w-20 ml-1"></div>
      </div>
    </li>
    <hr className="border-b-2 my-2 border-black" />
  </div>
);

const GameSkeleton = () => (
  <div className="animate-pulse">
    <li className="flex items-start space-x-3 w-full">
      <div className="w-10 h-10 bg-blue-400 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
      <div className="flex-1">
        <div className="h-3 bg-blue-400 rounded w-32 mb-2"></div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <div className="h-2 bg-blue-400 rounded w-16"></div>
        </div>
      </div>
    </li>
    <div className="flex justify-between items-center w-full px-1 mt-2.5 text-xs">
      <div className="flex items-center space-x-1">
        <div className="w-4 h-4 bg-blue-400 rounded"></div>
        <div className="h-2 bg-blue-400 rounded w-24"></div>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-4 h-4 bg-blue-400 rounded"></div>
        <div className="h-2 bg-blue-400 rounded w-16"></div>
      </div>
    </div>
    <hr className="border-b-2 my-2 border-black" />
  </div>
);

export default function Home({
  profile,
  error,
  game,
  wtp,
  badge,
  gameProgress,
}) {
  const awards = badge || {};
  const formatTimeAgo = (lastPlayed) => {
    if (!lastPlayed) return "N/A";

    const date = new Date(lastPlayed.replace(" ", "T") + "Z");
    if (isNaN(date.getTime())) return "Invalid date";

    const diff = Math.floor((new Date() - date) / 1000);
    const [min, hr, day] = [60, 3600, 86400];

    if (diff >= day)
      return `${Math.floor(diff / day)} day${diff >= 2 * day ? "s" : ""} ago`;
    if (diff >= hr)
      return `${Math.floor(diff / hr)} hour${diff >= 2 * hr ? "s" : ""} ago`;
    if (diff >= min)
      return `${Math.floor(diff / min)} minute${
        diff >= 2 * min ? "s" : ""
      } ago`;
    return "just now";
  };

  const [activeTab, setActiveTab] = useState("wtp");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [followers, setFollowers] = useState({
    Results: [],
    loading: false,
    loaded: false,
    error: null,
  });
  const [following, setFollowing] = useState({
    Results: [],
    loading: false,
    loaded: false,
    error: null,
  });

  const getTargetUser = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("targetUser");
    }
    return null;
  };

  const fetchFollowers = async () => {
    if (followers.loading || followers.loaded) return;

    setFollowers((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const targetUser = getTargetUser();
      const targetUserParam = targetUser
        ? `?targetUser=${encodeURIComponent(targetUser)}`
        : "";
      const response = await fetch(`/api/followers${targetUserParam}`);

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setFollowers({
        Results: data.results || [],
        loading: false,
        loaded: true,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching followers:", error);
      setFollowers({
        Results: [],
        loading: false,
        loaded: true,
        error: error.message,
      });
    }
  };

  const fetchFollowing = async () => {
    if (following.loading || following.loaded) return;

    setFollowing((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const targetUser = getTargetUser();
      const targetUserParam = targetUser
        ? `?targetUser=${encodeURIComponent(targetUser)}`
        : "";
      const response = await fetch(`/api/following${targetUserParam}`);

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setFollowing({
        Results: data.results || [],
        loading: false,
        loaded: true,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching following:", error);
      setFollowing({
        Results: [],
        loading: false,
        loaded: true,
        error: error.message,
      });
    }
  };
  useEffect(() => {
    if (activeTab === "followers") {
      fetchFollowers();
    } else if (activeTab === "following") {
      fetchFollowing();
    }
  }, [activeTab]);

  const tabList = {
    wtp: { data: wtp.wantToPlayList || [], label: "Want To Play" },
    followers: { data: followers.Results || [], label: "Followers" },
    following: { data: following.Results || [], label: "Following" },
  };

  const filteredData = useMemo(() => {
    let data = [...tabList[activeTab].data];
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      data = data.filter((item) => {
        if (activeTab === "wtp") {
          return (
            item.Title?.toLowerCase().includes(query) ||
            item.ConsoleName?.toLowerCase().includes(query)
          );
        }
        return item.User?.toLowerCase().includes(query);
      });
    }

    if (sortOrder === "az" || sortOrder === "za") {
      data.sort((a, b) => {
        const aVal = activeTab === "wtp" ? a.Title : a.User;
        const bVal = activeTab === "wtp" ? b.Title : b.User;
        return sortOrder === "az"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    } else if (sortOrder === "ach-high") {
      data.sort((a, b) => b.AchievementsPublished - a.AchievementsPublished);
    } else if (sortOrder === "ach-low") {
      data.sort((a, b) => a.AchievementsPublished - b.AchievementsPublished);
    } else if (sortOrder === "pts-high") {
      data.sort((a, b) => b.PointsTotal - a.PointsTotal);
    } else if (sortOrder === "pts-low") {
      data.sort((a, b) => a.PointsTotal - b.PointsTotal);
    } else if (sortOrder.startsWith("console-") && activeTab === "wtp") {
      const selectedConsole = sortOrder.replace("console-", "");
      data = data.filter((g) => g.ConsoleName === selectedConsole);
    }

    return data;
  }, [searchQuery, activeTab, sortOrder, followers.Results, following.Results]);

  const current = {
    ...tabList[activeTab],
    data: filteredData,
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchQuery("");
    setSortOrder("");
  };

  const isLoading = () => {
    if (activeTab === "followers") return followers.loading;
    if (activeTab === "following") return following.loading;
    return false;
  };

  const hasError = () => {
    if (activeTab === "followers") return followers.error;
    if (activeTab === "following") return following.error;
    return null;
  };

  const renderSkeleton = () => {
    const skeletonCount = 5;
    if (activeTab === "wtp") {
      return Array.from({ length: skeletonCount }, (_, i) => (
        <GameSkeleton key={i} />
      ));
    }
    return Array.from({ length: skeletonCount }, (_, i) => (
      <UserSkeleton key={i} />
    ));
  };

  const [awardQuery, setAwardQuery] = useState("");
  const [awardSort, setAwardSort] = useState("");

  const filteredAwards = useMemo(() => {
    const list = awards?.VisibleUserAwards || [];
    const q = awardQuery.trim().toLowerCase();
    let data = [...list];

    if (q) {
      data = data.filter((a) =>
        [a.Title, a.ConsoleName, a.AwardType].some((val) =>
          val?.toLowerCase().includes(q)
        )
      );
    }

    if (awardSort.startsWith("type-")) {
      const type = awardSort.slice(5);
      data = data.filter((a) => a.AwardType === type);
    }

    if (awardSort.startsWith("mode-")) {
      const mode = awardSort.slice(5);
      const isHardcore = mode === "hardcore";
      data = data.filter((a) => a.HardcoreMode === (isHardcore ? "1" : "0"));
    }

    if (awardSort.startsWith("console-")) {
      const console = awardSort.slice(8);
      data = data.filter((a) => a.ConsoleName === console);
    }

    return data;
  }, [awards, awardQuery, awardSort]);

  const [gameQuery, setGameQuery] = useState("");
  const [gameFilter, setGameFilter] = useState("");

  const filteredGames = useMemo(() => {
    if (!gameProgress?.Results) return [];

    let list = [...gameProgress.Results];
    const q = gameQuery.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (g) =>
          g.Title.toLowerCase().includes(q) ||
          g.ConsoleName.toLowerCase().includes(q)
      );
    }

    if (gameFilter.startsWith("console-")) {
      const consoleName = gameFilter.slice(8);
      list = list.filter((g) => g.ConsoleName === consoleName);
    }

    const sortFns = {
      az: (a, b) => a.Title.localeCompare(b.Title),
      za: (a, b) => b.Title.localeCompare(a.Title),
      completion: (a, b) =>
        (parseFloat(b.UserProgress?.UserCompletion ?? "0") || 0) -
        (parseFloat(a.UserProgress?.UserCompletion ?? "0") || 0),
      recent: (a, b) =>
        new Date(b.MostRecentAwardedDate) - new Date(a.MostRecentAwardedDate),
      oldest: (a, b) =>
        new Date(a.MostRecentAwardedDate) - new Date(b.MostRecentAwardedDate),
    };

    if (gameFilter.startsWith("sort-")) {
      const sortKey = gameFilter.slice(5);
      if (sortFns[sortKey]) {
        list.sort(sortFns[sortKey]);
      }
    }

    return list;
  }, [gameProgress, gameQuery, gameFilter]);

  const calculateDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
      <Head>
        <title>Reiivan&apos;s RetroAchievements</title>
      </Head>
      <Navbar />
      <div className="container mx-auto p-4 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-4 mb-4">
          <div data-aos="flip-up">
            <div className="border-2 border-black bg-blue-600 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-2.5">
              {error ? (
                <p className="text-red-300">{error.message}</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-fit uppercase">
                      <Image
                        src={profile.UserPic}
                        alt={profile.User}
                        width={0}
                        sizes="100vw"
                        height={0}
                        className="w-26 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-in-out hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                      />
                      <span
                        data-tip={profile.Status}
                        className={`tooltip tooltip-right absolute -top-1 -right-2 w-4 h-4 rounded-full border-2 border-black z-10 ${
                          profile.Status === "Offline"
                            ? "bg-red-500 shadow-[0_0_6px_rgba(255,0,0,0.7)]"
                            : "bg-green-500 shadow-[0_0_6px_rgba(0,255,0,0.7)]"
                        }`}
                        title={profile.Status}
                      />
                      {profile.Status !== "Offline" && (
                        <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-green-400 opacity-75 animate-ping" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-lg font-bold truncate -mb-0.5">
                        {profile.User}
                      </h2>
                      <p className="text-xs italic badge shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-blue-400 text-blue-600 rounded truncate">
                        {profile.Motto}
                      </p>
                      <p className="text-xs mt-1">
                        Softcore Points : {profile.TotalSoftcorePoints}
                      </p>
                      <p className="text-xs mt-1">
                        Member Since : {profile.FormattedMemberSince}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div data-aos="flip-up">
            <div className="border-2 border-black bg-blue-600 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-3">
              <div className="flex justify-between items-center w-full">
                <p className="inline-flex items-center text-sm pb-0.5 border-black border-b-2 space-x-2">
                  <LuGamepad2 />
                  <span>Most Recently Played</span>
                </p>
                {game?.LastPlayed && (
                  <span className="text-xs badge uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-blue-400 text-blue-600 rounded">
                    {formatTimeAgo(game.LastPlayed)}
                  </span>
                )}
              </div>
              {game && (
                <div className="flex items-center space-x-3 mt-2 mb-1">
                  <Image
                    unoptimized
                    sizes="100vw"
                    width={0}
                    height={0}
                    src={game.ImageIcon}
                    alt={`${game.Title} cover`}
                    className="w-10 h-10  transition-all duration-200 ease-in-out
        hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
        hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[3px] active:translate-y-[3px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] object-contain border-2 border-black rounded"
                  />
                  <div>
                    <p className="font-bold text-xs mb-1">{game.Title}</p>
                    <p className="text-xs text-black flex items-center space-x-1">
                      <Image
                        unoptimized
                        sizes="100vw"
                        width={0}
                        height={0}
                        src={game.IconURL}
                        alt={`${game.ConsoleName} icon`}
                        className="w-4 h-4 object-contain"
                      />
                      <span>{game.ConsoleName}</span>
                    </p>
                  </div>
                </div>
              )}
              {profile?.RichPresenceMsg && (
                <span className="text-xs">{profile.RichPresenceMsg}</span>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.5fr] gap-4">
          <div data-aos="flip-up">
            <div className="border-2 border-black bg-blue-600 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-3">
              <div className="tabs tabs-boxed bg-yellow-500 rounded-none shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)] tabs-xs border-2 border-black">
                {Object.keys(tabList).map((key) => (
                  <button
                    key={key}
                    className={`tab ${
                      activeTab === key ? "bg-blue-400 !text-black" : ""
                    }`}
                    onClick={() => handleTabChange(key)}
                  >
                    {tabList[key].label}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs">
                {isLoading() ? (
                  <div className="space-y-2">{renderSkeleton()}</div>
                ) : (
                  <>
                    {["followers", "following", "wtp"].includes(activeTab) && (
                      <div
                        className="join w-full mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
          transition-all duration-200 ease-in-out
          hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
          hover:translate-x-[2px] hover:translate-y-[2px]
          active:shadow-none active:translate-x-[3px] active:translate-y-[3px] rounded"
                      >
                        <input
                          type="search"
                          className="input join-item w-full input-xs border-2 border-black bg-base-100 rounded-r-none text-xs"
                          placeholder={`${current.label} (${filteredData.length})`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                          className="select join-item input-xs bg-blue-400 border-2 border-black rounded-l-none text-xs"
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                        >
                          <option value="">Filter</option>
                          <option value="az">A - Z</option>
                          <option value="za">Z - A</option>
                          {activeTab === "wtp" && (
                            <>
                              <option value="ach-high">
                                Achievements (High to Low)
                              </option>
                              <option value="ach-low">
                                Achievements (Low to High)
                              </option>
                              <option value="pts-high">
                                Points (High to Low)
                              </option>
                              <option value="pts-low">
                                Points (Low to High)
                              </option>
                              {[
                                ...new Set(
                                  tabList.wtp.data.map((g) => g.ConsoleName)
                                ),
                              ].map((console) => (
                                <option
                                  key={console}
                                  value={`console-${console}`}
                                >
                                  {console}
                                </option>
                              ))}
                            </>
                          )}
                        </select>
                      </div>
                    )}
                    <>
                      {hasError() && (
                        <div
                          role="alert"
                          className="alert px-2 py-1.5 rounded text-xs bg-red-500 mb-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <LuBadgeAlert />
                          <span className="-ml-2">Error: {hasError()}</span>
                        </div>
                      )}
                      {searchQuery.trim() &&
                        !current.data.length &&
                        tabList[activeTab].data.length > 0 && (
                          <div
                            role="alert"
                            className="alert px-2 py-1.5 rounded text-xs bg-yellow-500 mb-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <LuBadgeAlert />
                            <span className="-ml-2">
                              No results found for "{searchQuery}"
                            </span>
                          </div>
                        )}
                      {!tabList[activeTab].data.length && !hasError() && (
                        <div
                          role="alert"
                          className="alert px-2 py-1.5 rounded text-xs bg-red-500 mb-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <LuBadgeAlert />
                          <span className="-ml-2">
                            No {current.label.toLowerCase()} yet.
                          </span>
                        </div>
                      )}
                    </>
                    {["followers", "following", "wtp"].includes(activeTab) && (
                      <div className="max-h-[270px] scroll-container overflow-y-auto pr-1 space-y-2">
                        <ul className="space-y-2">
                          {current.data.map((item, i) => (
                            <div key={i}>
                              {activeTab === "wtp" ? (
                                <>
                                  <li className="flex items-start space-x-3 w-full">
                                    <Image
                                      src={item.ImageIcon}
                                      alt={item.Title}
                                      width={0}
                                      height={0}
                                      sizes="100vw"
                                      className="w-10 h-10 transition-all duration-200 ease-in-out
                          hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
                          hover:translate-x-[2px] hover:translate-y-[2px]
                          active:shadow-none active:translate-x-[3px] active:translate-y-[3px] 
                          shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] object-contain border-2 border-black rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="font-semibold text-xs">
                                        {item.Title}
                                      </p>
                                      <p className="text-xs text-black flex items-center space-x-1 mt-1">
                                        <Image
                                          unoptimized
                                          sizes="100vw"
                                          width={0}
                                          height={0}
                                          src={item.IconURL}
                                          alt={`${item.ConsoleName} icon`}
                                          className="w-4 h-4 object-contain"
                                        />
                                        &nbsp;&nbsp;
                                        {item.ConsoleName}
                                      </p>
                                    </div>
                                  </li>
                                  <div className="flex justify-between items-center w-full px-1 mt-2.5 text-xs text-neutral-content">
                                    <div className="flex items-center space-x-1">
                                      <LuAward className="w-4 h-4 text-yellow-500" />
                                      <span className="text-black">
                                        {item.AchievementsPublished}{" "}
                                        ACHIEVEMENTS
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <LuSparkles className="w-4 h-4 text-yellow-500" />
                                      <span className="text-black">
                                        {item.PointsTotal} POINTS
                                      </span>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <li className="relative flex items-start space-x-2">
                                  <Image
                                    src={item.UserPic}
                                    alt={item.User}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-7 h-7 transition-all duration-200 ease-in-out
                        hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
                        hover:translate-x-[2px] hover:translate-y-[2px]
                        active:shadow-none active:translate-x-[3px] active:translate-y-[3px] 
                        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] object-contain border-2 border-black rounded"
                                  />
                                  <div className="flex flex-col justify-start">
                                    <span className="text-xs font-semibold">
                                      &nbsp;{item.User}
                                    </span>
                                  </div>
                                </li>
                              )}
                              <hr className="border-b-2 my-2 border-black" />
                            </div>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div data-aos="flip-up">
            <div className="border-2 border-black bg-blue-600 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-3">
              <p className="inline-flex items-center text-sm mb-3 pb-0.5 border-b-2 border-black space-x-2">
                <LuTrophy />
                <span>Award Summary</span>
              </p>
              <div className="scroll-container overflow-y-auto pr-1 space-y-2 text-xs ">
                <ul className="space-y-2 mb-2">
                  {[
                    ["Total Awards", awards?.TotalAwardsCount],
                    ["Mastery Awards", awards?.MasteryAwardsCount],
                    ["Completion Awards", awards?.CompletionAwardsCount],
                    ["Beaten (Hardcore)", awards?.BeatenHardcoreAwardsCount],
                    ["Beaten (Softcore)", awards?.BeatenSoftcoreAwardsCount],
                    ["Hidden Awards", awards?.HiddenAwardsCount],
                    ["Event Awards", awards?.EventAwardsCount],
                    ["Site Awards", awards?.SiteAwardsCount],
                  ].map(([label, value], i) => (
                    <li
                      key={i}
                      className="border-2 border-black bg-yellow-500 px-2 py-1.5 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex justify-between"
                    >
                      <span className="font-semibold">{label} :</span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div data-aos="flip-up">
            <div className="border-2 border-black bg-blue-600 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-3">
              <p className="inline-flex items-center text-sm mb-3 pb-0.5 border-b-2 border-black space-x-2">
                <LuStar />
                <span>Detailed Award List</span>
              </p>
              <div className="join w-full mb-3 mt-0.5">
                <input
                  type="search"
                  className="input join-item w-full input-xs border-2 border-black bg-base-100 rounded-r-none text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
transition-all duration-200 ease-in-out
hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
hover:translate-x-[2px] hover:translate-y-[2px]
active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                  placeholder={`Awards (${filteredAwards.length})`}
                  value={awardQuery}
                  onChange={(e) => setAwardQuery(e.target.value)}
                />
                <select
                  className="select join-item input-xs border-2 border-black bg-blue-400 rounded-l-none text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
transition-all duration-200 ease-in-out
hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
hover:translate-x-[2px] hover:translate-y-[2px]
active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                  value={awardSort}
                  onChange={(e) => setAwardSort(e.target.value)}
                >
                  <option value="">Filter</option>
                  <option value="az">A - Z</option>
                  <option value="za">Z - A</option>
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest</option>
                  <option value="achieved-high">Achieved (High To Low)</option>
                  <option value="achieved-low">Achieved (Low To High)</option>
                  <option value="points-high">Points (High To Low)</option>
                  <option value="points-low">Points (Low To High)</option>
                  <option value="hardcore-achieved-high">
                    Hardcore Achieved (High To Low)
                  </option>
                  <option value="hardcore-achieved-low">
                    Hardcore Achieved (Low To High)
                  </option>
                  <option value="hardcore-points-high">
                    Hardcore Points (High To Low)
                  </option>
                  <option value="hardcore-points-low">
                    Hardcore Points (Low To High)
                  </option>
                  <option value="type-Mastery/Completion">
                    Only Mastery/Completion
                  </option>
                  <option value="type-Game Beaten">Only Game Beaten</option>
                  <option value="mode-hardcore">Only Hardcore</option>
                  <option value="mode-normal">Only Normal</option>
                  {[
                    ...new Set(
                      awards.VisibleUserAwards?.map((a) => a.ConsoleName)
                    ),
                  ].map((console) => (
                    <option key={console} value={`console-${console}`}>
                      {console}
                    </option>
                  ))}
                </select>
              </div>
              <div className="max-h-[360px] scroll-container overflow-y-auto pr-1 space-y-2 text-xs ">
                <ul className="space-y-2">
                  {awardQuery.trim() &&
                    !filteredAwards.length &&
                    awards?.VisibleUserAwards?.length > 0 && (
                      <div
                        role="alert"
                        className="alert px-2 py-1.5 rounded text-xs bg-yellow-500 mb-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <LuBadgeAlert />
                        <span className="-ml-2">
                          No awards found for "{awardQuery}"
                        </span>
                      </div>
                    )}
                  {!awards?.VisibleUserAwards?.length && (
                    <div
                      role="alert"
                      className="alert px-2 py-1.5 rounded text-xs bg-red-500 mb-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <LuBadgeAlert />
                      <span className="-ml-2">No detailed awards yet.</span>
                    </div>
                  )}
                  {(() => {
                    const grouped = filteredAwards.reduce((acc, a) => {
                      (acc[a.AwardData] ??= []).push(a);
                      return acc;
                    }, {});

                    const finalAwards = Object.values(grouped)
                      .map((group) =>
                        ["Mastery/Completion", "Game Beaten"]
                          .flatMap((type) =>
                            ["1", "0"].map((mode) =>
                              group.find(
                                (a) =>
                                  a.AwardType === type &&
                                  a.HardcoreMode === mode
                              )
                            )
                          )
                          .find(Boolean)
                      )
                      .filter(Boolean);

                    const sorted = [...finalAwards];
                    const s = (a, b, key) => (b[key] ?? 0) - (a[key] ?? 0);
                    const sortFns = {
                      az: (a, b) => a.Title.localeCompare(b.Title),
                      za: (a, b) => b.Title.localeCompare(a.Title),
                      recent: (a, b) =>
                        new Date(b.AwardedAt) - new Date(a.AwardedAt),
                      oldest: (a, b) =>
                        new Date(a.AwardedAt) - new Date(b.AwardedAt),
                      "achieved-high": (a, b) =>
                        s(a, b, "UserProgress?.NumAchieved"),
                      "achieved-low": (a, b) =>
                        -s(a, b, "UserProgress?.NumAchieved"),
                      "points-high": (a, b) =>
                        s(a, b, "UserProgress?.ScoreAchieved"),
                      "points-low": (a, b) =>
                        -s(a, b, "UserProgress?.ScoreAchieved"),
                      "hardcore-achieved-high": (a, b) =>
                        s(a, b, "UserProgress?.NumAchievedHardcore"),
                      "hardcore-achieved-low": (a, b) =>
                        -s(a, b, "UserProgress?.NumAchievedHardcore"),
                      "hardcore-points-high": (a, b) =>
                        s(a, b, "UserProgress?.ScoreAchievedHardcore"),
                      "hardcore-points-low": (a, b) =>
                        -s(a, b, "UserProgress?.ScoreAchievedHardcore"),
                      default: (a, b) => a.DisplayOrder - b.DisplayOrder,
                    };

                    sorted.sort(sortFns[awardSort] || sortFns.default);

                    return sorted.map((award, i) => {
                      const isHardcore = award.HardcoreMode === "1";
                      const isNormal = award.HardcoreMode === "0";
                      return (
                        <div
                          key={`${award.AwardData}-${award.HardcoreMode}-${i}`}
                        >
                          <li className="flex items-start space-x-3 w-full mt-2">
                            <div className="relative">
                              <Image
                                src={award.ImageIcon}
                                alt={award.Title}
                                width={0}
                                height={0}
                                sizes="100vw"
                                className={`w-10 h-10 transition-all z-50 duration-200 ease-in-out 
hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
hover:translate-x-[2px] hover:translate-y-[2px]
active:shadow-none active:translate-x-[3px] active:translate-y-[3px]
shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] object-contain border-2 rounded ${
                                  award.hasBothModes
                                    ? "border-purple-600"
                                    : isHardcore
                                    ? "border-red-500"
                                    : "border-yellow-500"
                                }`}
                              />
                              <div
                                className={`absolute -top-1 -right-1.5 w-4 h-4 border-2 border-black rounded-full text-xs font-bold flex items-center justify-center text-black ${
                                  isHardcore ? "bg-red-500" : "bg-yellow-500"
                                }`}
                              >
                                {isHardcore ? "H" : "N"}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <p className="font-semibold text-xs">
                                  {award.Title}
                                </p>
                                <button
                                  data-tip={
                                    isHardcore
                                      ? "Hardcore Mode"
                                      : isNormal
                                      ? "Normal Mode"
                                      : "Unknown Mode"
                                  }
                                  className="tooltip tooltip-left btn btn-square btn-xs border-2 rounded
shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
transition-all duration-200 ease-in-out
hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
hover:translate-x-[2px] hover:translate-y-[2px]
active:shadow-none active:translate-x-[3px] active:translate-y-[3px] border-black bg-blue-400 text-black"
                                >
                                  ?
                                </button>
                              </div>
                              <p className="text-xs text-black flex items-center space-x-1 mt-1">
                                <Image
                                  unoptimized
                                  sizes="100vw"
                                  width={0}
                                  height={0}
                                  src={award.IconURL}
                                  alt={`${award.ConsoleName} icon`}
                                  className="w-4 h-4 object-contain"
                                />
                                &nbsp;&nbsp;
                                {award.ConsoleName}
                              </p>
                            </div>
                          </li>
                          <div className="flex justify-between items-center w-full px-1 mt-2.5 text-xs text-neutral-content uppercase">
                            <div className="flex items-center space-x-1 text-black">
                              {award.AwardType === "Game Beaten" && (
                                <RiProgress4Line
                                  className={`w-4 h-4 ${
                                    isHardcore
                                      ? "text-red-500"
                                      : "text-yellow-500"
                                  }`}
                                />
                              )}
                              {award.AwardType === "Mastery/Completion" && (
                                <RiProgress8Line
                                  className={`w-4 h-4 ${
                                    isHardcore
                                      ? "text-red-500"
                                      : "text-yellow-500"
                                  }`}
                                />
                              )}
                              <span className="font-semibold">
                                {award.AwardType}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-black">
                              <LuCalendarCheck className="w-4 h-4 text-blue-300" />
                              <span className="font-mono">
                                {new Date(award.AwardedAt).toLocaleString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center w-full px-1 mt-2.5 text-xs text-neutral-content uppercase">
                            <div className="flex items-center space-x-1 text-black">
                              <LuAward className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold">
                                {award.UserProgress?.NumAchieved ?? 0} Achieved
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-black">
                              <LuSparkles className="w-4 h-4 text-yellow-500" />
                              <span className="font-mono">
                                {award.UserProgress?.ScoreAchieved ?? 0} Pts
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center w-full px-1 mt-2.5 text-xs text-neutral-content uppercase">
                            <div className="flex items-center space-x-1 text-black">
                              <LuAward className="w-4 h-4 text-red-500" />
                              <span className="font-semibold">
                                {award.UserProgress?.NumAchievedHardcore ?? 0}{" "}
                                Hardcore Achieved
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-black">
                              <LuSparkles className="w-4 h-4 text-red-500" />
                              <span className="font-mono">
                                {award.UserProgress?.ScoreAchievedHardcore ?? 0}{" "}
                                Hardcore Pts
                              </span>
                            </div>
                          </div>
                          <hr className="border-b-2 my-2 border-black" />
                        </div>
                      );
                    });
                  })()}
                </ul>
              </div>
            </div>
          </div>
          <div data-aos="flip-up">
            <div className="border-2 border-black bg-blue-600 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-3">
              <p className="inline-flex items-center text-sm pb-0.5 border-b-2 border-black space-x-2">
                <LuChartBar />
                <span>Completion Progress</span>
              </p>
              <div>
                <div className="join w-full mt-3.5 mb-2">
                  <input
                    type="search"
                    className="input join-item w-full input-xs border-2 border-black bg-base-100 rounded-r-none text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
      transition-all duration-200 ease-in-out
      hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
      hover:translate-x-[2px] hover:translate-y-[2px]
      active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                    placeholder={`Games (${filteredGames.length})`}
                    value={gameQuery}
                    onChange={(e) => setGameQuery(e.target.value)}
                  />
                  <select
                    className="select join-item input-xs bg-blue-400 border-2 border-black rounded-l-none text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
  transition-all duration-200 ease-in-out
  hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
  hover:translate-x-[2px] hover:translate-y-[2px]
  active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                    value={gameFilter}
                    onChange={(e) => setGameFilter(e.target.value)}
                  >
                    <option value="">Filter</option>
                    <option value="sort-az">A - Z</option>
                    <option value="sort-za">Z - A</option>
                    <option value="sort-completion">Completion %</option>
                    <option value="sort-recent">Most Recent</option>
                    <option value="sort-oldest">Oldest</option>
                    {[
                      ...new Set(
                        gameProgress?.Results?.map((g) => g.ConsoleName)
                      ),
                    ].map((console) => (
                      <option key={console} value={`console-${console}`}>
                        {console}
                      </option>
                    ))}
                  </select>
                </div>
                {gameProgress && !gameProgress.error && (
                  <div className="max-h-[360px] scroll-container overflow-y-auto pr-1 space-y-2 text-xs ">
                    {gameQuery.trim() && !filteredGames.length && (
                      <div
                        role="alert"
                        className="alert px-2 py-1.5 mt-1 rounded text-xs bg-yellow-500 mb-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <LuBadgeAlert />
                        <span className="-ml-2">
                          No games found for "{gameQuery}"
                        </span>
                      </div>
                    )}
                    {filteredGames.map((game) => (
                      <React.Fragment key={game.GameID}>
                        <Link
                          href={`/game/${game.GameID}`}
                          key={game.GameID}
                          className="block bg-blue-600 border-none rounded-none px-0 py-2.5 
    hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200"
                        >
                          <div className="flex flex-col gap-3 ">
                            <div className="flex flex-row items-start md:items-center justify-between -mb-3 gap-4 w-full flex-wrap">
                              <div className="flex-shrink-0">
                                <div
                                  className="relative tooltip tooltip-right"
                                  data-tip={game.ConsoleName}
                                >
                                  <Image
                                    unoptimized
                                    sizes="100vw"
                                    width={0}
                                    height={0}
                                    src={game.ImageIcon}
                                    alt={`${game.Title} cover`}
                                    className="w-16 h-16 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-in-out hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] object-cover"
                                  />
                                  <div
                                    className={`absolute -top-1 -right-1.5 w-4 h-4 text-xs font-bold flex items-center justify-center text-black `}
                                  >
                                    <img
                                      src={game.ConsoleIcon}
                                      alt={`${game.ConsoleName} icon`}
                                      className="w-4 h-4 object-contain"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 space-y-0.5 min-w-0">
                                <div className="flex items-center justify-between w-full">
                                  <h3 className="font-semibold text-[0.625rem]">
                                    {game.Title}
                                  </h3>
                                </div>
                                <div className="flex items-center text-[0.625rem] gap-0.5">
                                  <span className="font-bold">
                                    {game.NumAwarded}
                                  </span>
                                  <span>of</span>
                                  <span className="font-bold">
                                    {game.MaxPossible}
                                  </span>
                                  <span>achievements</span>
                                </div>
                                {game.MostRecentAwardedDate && (
                                  <div className="text-[0.625rem] italic">
                                    Last played{" "}
                                    {new Date(
                                      game.MostRecentAwardedDate
                                    ).toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </div>
                                )}
                                {game.HighestAwardKind && (
                                  <div className="text-[0.625rem]">
                                    <span>
                                      {game.HighestAwardKind ===
                                      "beaten-hardcore"
                                        ? "Hardcore Beaten"
                                        : game.HighestAwardKind ===
                                          "beaten-softcore"
                                        ? "Softcore Beaten"
                                        : game.HighestAwardKind === "completed"
                                        ? "Completed"
                                        : game.HighestAwardKind === "mastered"
                                        ? "Mastered"
                                        : "In Progress"}
                                    </span>
                                    {game.HighestAwardDate &&
                                      game.MostRecentAwardedDate &&
                                      new Date(game.MostRecentAwardedDate) >
                                        new Date(game.HighestAwardDate) && (
                                        <span>
                                          {" "}
                                          over{" "}
                                          {calculateDaysBetween(
                                            game.HighestAwardDate,
                                            game.MostRecentAwardedDate
                                          )}{" "}
                                          days
                                        </span>
                                      )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="w-full flex items-center -mb-3 justify-end">
                              <div className="flex-1 h-2.5 bg-blue-400 rounded-lg border-2 border-black overflow-hidden relative">
                                <div
                                  className="h-full bg-yellow-500 absolute top-0 left-0 transition-all duration-300"
                                  style={{
                                    width: `${
                                      game.UserProgress?.UserCompletion
                                        ? Math.round(
                                            parseFloat(
                                              game.UserProgress.UserCompletion
                                            )
                                          )
                                        : Math.round(
                                            (game.NumAwarded /
                                              game.MaxPossible) *
                                              100
                                          )
                                    }%`,
                                  }}
                                />
                                {game.NumAwardedHardcore > 0 && (
                                  <div
                                    className="h-full bg-red-500 absolute top-0 left-0 transition-all duration-300"
                                    style={{
                                      width: `${Math.round(
                                        (game.NumAwardedHardcore /
                                          game.MaxPossible) *
                                          100
                                      )}%`,
                                    }}
                                  />
                                )}
                              </div>
                              <div className="w-12 text-black font-bold text-xs ml-2 text-center">
                                {Math.round(
                                  game.UserProgress?.UserCompletion
                                    ? parseFloat(
                                        game.UserProgress.UserCompletion
                                      )
                                    : (game.NumAwarded / game.MaxPossible) * 100
                                )}
                                %
                              </div>
                            </div>
                          </div>
                        </Link>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  console.log("=== getServerSideProps called ===");
  console.log("Query params:", context.query);
  console.log("Environment NODE_ENV:", process.env.NODE_ENV);

  const isProd = process.env.NODE_ENV === "production";
  const host = context.req.headers.host;
  console.log("Host:", host);

  const baseUrl = isProd
    ? "https://retroachievements-profile.revanspstudy28.workers.dev"
    : `http://${host}`;

  console.log("Base URL:", baseUrl);

  const targetUserParam = context.query.targetUser
    ? `?targetUser=${encodeURIComponent(context.query.targetUser)}`
    : "";

  console.log("Target user param:", targetUserParam);

  const endpoints = {
    wtp: `${baseUrl}/api/want-to-play${targetUserParam}`,
    badge: `${baseUrl}/api/badge${targetUserParam}`,
    gameProgress: `${baseUrl}/api/game-progress${targetUserParam}`,
  };

  console.log("Endpoints:", endpoints);

  const results = {};

  const fetchPromises = Object.entries(endpoints).map(async ([key, url]) => {
    console.log(`Fetching ${key} from:`, url);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; RetroAchievements-Profile/1.0)",
        },
      });

      clearTimeout(timeoutId);

      console.log(`${key} fetch status:`, res.status);

      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      console.log(`${key} data received:`, !!json);

      if (key === "gameProgress" && json.Results) {
        const consoleIconMap = new Map();

        const fixedGameProgressResults = json.Results.map((game) => {
          let fixedImageIcon = game.ImageIcon;
          if (fixedImageIcon && !fixedImageIcon.startsWith("http")) {
            fixedImageIcon = `https://media.retroachievements.org${fixedImageIcon}`;
          }

          let fixedConsoleIcon = game.ConsoleIcon;

          if (
            fixedConsoleIcon &&
            game.ConsoleName &&
            !consoleIconMap.has(game.ConsoleName)
          ) {
            consoleIconMap.set(game.ConsoleName, fixedConsoleIcon);
          }

          if (
            (!fixedConsoleIcon || fixedConsoleIcon === "") &&
            game.ConsoleName &&
            consoleIconMap.has(game.ConsoleName)
          ) {
            fixedConsoleIcon = consoleIconMap.get(game.ConsoleName);
          }

          return {
            ...game,
            ImageIcon: fixedImageIcon ?? null,
            ConsoleIcon: fixedConsoleIcon ?? null,
          };
        });

        results[key] = { ...json, Results: fixedGameProgressResults };
      } else {
        results[key] = json;
      }
    } catch (error) {
      console.error(`Error fetching ${key}:`, error.message);
      if (error.name === "AbortError") {
        console.error(`${key} request timed out`);
      }
      results[key] = {
        error: true,
        message: error.message || "Failed to fetch data",
        data: null,
      };
    }
  });

  await Promise.all(fetchPromises);

  let profile = null;
  let game = null;
  let profileError = null;

  try {
    const profileUrl = `${baseUrl}/api/profile${targetUserParam}`;
    console.log("Fetching profile from:", profileUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const resProfile = await fetch(profileUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RetroAchievements-Profile/1.0)",
      },
    });

    clearTimeout(timeoutId);

    console.log("Profile fetch status:", resProfile.status);

    if (!resProfile.ok) {
      const errorText = await resProfile.text();
      console.error("Profile fetch error response:", errorText);
      throw new Error(`${resProfile.status} ${resProfile.statusText}`);
    }

    const dataProfile = await resProfile.json();
    console.log("Profile data received:", !!dataProfile);
    console.log("Profile has error:", !!dataProfile.error);

    if (dataProfile.error) {
      throw new Error(dataProfile.message || "Profile API returned error");
    }

    profile = dataProfile.profile || null;
    game = dataProfile.game || null;

    console.log("Profile user:", profile?.User);
    console.log("Game title:", game?.Title);
  } catch (error) {
    console.error("=== Profile fetch error ===");
    console.error("Error message:", error.message);
    console.error("Error name:", error.name);
    if (error.name === "AbortError") {
      console.error("Profile request timed out");
    }
    console.error("========================");

    profileError = {
      error: true,
      message: error.message || "Failed to fetch profile",
    };
  }

  const hasError = profileError?.error || results.gameProgress?.error;
  console.log("Has error:", hasError);

  const props = {
    profile,
    game,
    gameProgress: results.gameProgress || {
      error: true,
      message: "No game progress data",
    },
    wtp: results.wtp || { error: true, message: "No want-to-play data" },
    badge: results.badge || { error: true, message: "No badge data" },
    error: hasError
      ? {
          message:
            profileError?.message ||
            results.gameProgress?.message ||
            "An unknown error occurred.",
        }
      : null,
  };

  console.log("Final props prepared");
  console.log("Props error:", props.error);

  return { props };
}