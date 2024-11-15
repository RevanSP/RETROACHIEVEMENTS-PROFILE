interface LoaderProps {
    isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
    return (
        <div className={`loader-container ${!isLoading ? "hidden" : ""}`}>
            <div className="loader"></div>
        </div>
    );
};

export default Loader;
