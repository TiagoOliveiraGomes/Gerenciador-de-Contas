import React, { useState } from 'react';

interface ModalAddBankProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (newBank: { name: string; }) => void;
}

const ModalAddBank: React.FC<ModalAddBankProps> = ({ isOpen, onCancel, onConfirm }) => {
  const [name, setName] = useState<string>('');

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm({ name });
      setName('');
    //   setIcon('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Adicionar Novo Banco</h2>
        
        <input
          type="text"
          placeholder="Nome do Banco"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />

        {/* <input
          type="text"
          placeholder="Ícone (ex: 🏦, B)"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        /> */}

        <div className="flex justify-around">
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Adicionar
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddBank;
