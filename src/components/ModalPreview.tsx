import { ModalPreviewProps } from "../types/type";

const ModalPreview: React.FC<ModalPreviewProps> = ({ selectedImage, isModalOpen, setIsModalOpen }) => {
    if (!isModalOpen || !selectedImage) return null;

    return (
        <dialog id="image_modal" className="modal modal-open">
            <div className="modal-box flex justify-center items-center border-2 border-base-300 rounded-lg">
                <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-w-full max-h-full rounded-lg p-4 border-2 border-base-300 bg-base-200"
                />
            </div>
            <div className="modal-backdrop">
                <button onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
        </dialog>
    );
};

export default ModalPreview;
