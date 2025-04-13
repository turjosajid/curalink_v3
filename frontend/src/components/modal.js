// components/Modal.js
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded shadow-md relative">
          <button onClick={onClose} className="absolute top-2 right-2">❌</button>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;

  
  