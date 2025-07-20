import Image from "next/image";

const Footer = () => {
  return (
    <footer className="footer text-xs xs:footer-horizontal footer-center bg-base-100 text-base-content p-3 border-t-4 border-black mt-1">
      <aside>
        <p className="flex flex-wrap items-center justify-center gap-1 text-center">
          Copyright © {new Date().getFullYear()} – All rights reserved by
          <span className="flex items-center gap-1 ml-1 flex-wrap">
            <Image
              width={24}
              height={24}
              src="/logo.avif"
              unoptimized
              alt="Logo"
              className="w-5 h-5 object-contain"
            />&nbsp;
            <a
              href="https://retroachievements.org/user/Reiivan"
              className="underline decoration-2 underline-offset-2 font-semibold hover:text-green-500 hover:decoration-green-500"
            >
              ReiivanTheOnlyOne.
            </a>
          </span>
        </p>
      </aside>
    </footer>
  );
};

export default Footer;