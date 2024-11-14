const Hero = () => {
  return (
    <div
      className="hero mt-16 mb-3 border-b-2 border-base-300"
      style={{
        backgroundImage: "url(/hero.jpg)",
      }}
    >
      <div className="hero-overlay bg-opacity-80"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md py-16">
          <img loading="lazy"
            alt="RA Logo"
            className="w-full rounded-xl shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
            src="/RA_FULL.png"
          />
          <p className="mt-4">
            View and manage your achievements across various retro games. Explore your progress,
            track earned awards, and see how you compare with other users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
