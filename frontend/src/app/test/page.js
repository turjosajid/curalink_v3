"use client";
import { useState } from "react";
import Modal from "../../components/modal";

export default function Page() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h1>Modal Content</h1>
        <p>This is the content inside the modal.</p>
      </Modal>
    </div>
  );
}
