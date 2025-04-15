import React from 'react';
import { Bank }  from './types'; // Ajuste o caminho conforme seu projeto
import { Bank as BankIcon, X } from '@phosphor-icons/react';

interface BankSelectorProps {
  banks: Bank[];
  selectedBankId: number;
  onSelectBank: (id: number) => void;
  onDeleteBank: (id: number) => void;
}

const BankSelector: React.FC<BankSelectorProps> = ({
  banks,
  selectedBankId,
  onSelectBank,
  onDeleteBank
}) => {
  return (
    <div className="flex flex-row items-center justify-center space-x-6 overflow-x-auto py-4 bg-gray-100">
      {banks.map((bank) => {
        const isSelected = bank.id === selectedBankId;
        return (
          <div key={bank.id} className="relative group">
            {/* Botão X */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // evita que o clique selecione o banco
                onDeleteBank(bank.id);
              }}
              className="absolute -top-2 text-red-500 hover:text-red-600 -right-2 rounded-full w-5 h-5 text-xs flex items-center justify-center z-10 hover:cursor-pointer hover:scale-110"
              title="Remover banco"
            >
              <X size={15} />
            </button>

            {/* Botão do banco */}
            <button
              onClick={() => onSelectBank(bank.id)}
              className={`flex flex-col items-center justify-center cursor-pointer 
                ${isSelected ? 'text-blak font-semibold scale-110' : 'text-gray-700'}
                transition-colors duration-200 hover:text-blue-900 min-w-[80px]
                hover:scale-110
              `}
            >
              <div className="w-10 h-10  flex items-center justify-center mb-2 relative">
                <span><BankIcon size={32} /></span>
              </div>
              <span>{bank.name}</span>
            </button>
          </div>
        );
      })}
    </div>

  );
};

export default BankSelector;
