import Image from "next/image";
import Link from "next/link";
import {
  LuChevronDown,
  LuFacebook,
  LuGithub,
  LuInstagram,
} from "react-icons/lu";

const Navbar = () => {
  return (
    <div className="fixed top-0 z-50 w-full navbar rounded-none bg-base-100 border-b-4 border-black px-4 lg:px-8">
      <div className="flex-1">
        <Link href="/">
          <Image
            src="/logo.avif"
            alt="Logo"
            unoptimized
            sizes="100vw"
            className="w-12 rounded-none"
            width={0}
            height={0}
          />
        </Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-square btn-sm text-lg border-2 border-black bg-blue-600 rounded
        shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
        transition-all duration-200 ease-in-out
        hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
        hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
          >
            <LuChevronDown />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-yellow-500 rounded z-1 w-40 p-2 border-2 border-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-6"
          >
            <li>
              <a
                href="https://web.facebook.com/reiivan.2025/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuFacebook />
                @Reiivan
              </a>
            </li>
            <li>
              <a
                href="https://github.com/RevanSP"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuGithub />
                @RevanSP
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/m9nokuro/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuInstagram />
                @m9nokuro
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;