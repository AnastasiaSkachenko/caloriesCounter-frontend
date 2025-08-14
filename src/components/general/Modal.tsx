import React from "react";

interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ id, title, children}) => {

  return (
    <div className="modal fade" id={id}>
      <div className={`modal-dialog modal-dialog-centered`}>
        <div className="bg-secondary-light text-black modal-content">
          <h3 className="text-center m-3">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
