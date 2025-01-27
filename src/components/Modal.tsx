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
        <div className="bg-secondary text-black modal-content">
          <h3 className="modal-header">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
