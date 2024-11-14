import { SearchProps } from "../types/type";

const Search: React.FC<SearchProps> = ({ username, onUsernameChange }) => {
  return (
    <div className="card bg-base-200 w-full border-base-300 border-2">
      <div className="card-body p-6">
        <label className="input input-bordered border-base-300 flex bg-base-100 items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
            />
          </svg>
          <input
            type="text"
            className="grow"
            id="username"
            value={username}
            onChange={onUsernameChange}
            placeholder="Enter username"
          />
        </label>
      </div>
    </div>
  );
};

export default Search;
