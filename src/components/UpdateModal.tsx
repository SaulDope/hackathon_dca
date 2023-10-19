import React, { useRef, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UpdateModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const modalContentRef = useRef<HTMLDivElement | null>(null); // 2. Initialize the ref

  useEffect(() => {
    // 3. Event listener function
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]); // Pass the onClose function as a dependency

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" ref={modalContentRef}>
        {" "}
        {/* 4. Attach the ref */}
        {/* Sample content */}
        <div className="modal-header">
          <h2>Update</h2>
          <button onClick={onClose} className="close-btn">
            X
          </button>
        </div>
        <div className="modal-body">
          <p>Update modal functions</p>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
