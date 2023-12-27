// import React, { useState, FormEvent } from 'react';
// import Modal from 'react-modal';

// Modal.setAppElement('#root'); // This line is needed for accessibility reasons.

// interface PasswordModalProps {
//  isOpen: boolean;
//  onRequestClose: () => void;
//  onSubmit: (password: string) => void;
// }

// const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onRequestClose, onSubmit }) => {
//  const [password, setPassword] = useState<string>('');

//  const handleSubmit = (event: FormEvent) => {
//    event.preventDefault();
//    onSubmit(password);
//  }

//  return (
//    <Modal
//      isOpen={isOpen}
//      onRequestClose={onRequestClose}
//      contentLabel="Password Modal"
//    >
//      <form onSubmit={handleSubmit}>
//        <label>
//          Password:
//          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//        </label>
//        <input type="submit" value="Submit" />
//      </form>
//    </Modal>
//  );
// };

// export default PasswordModal;
