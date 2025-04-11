import React from 'react';
import { Bank }  from './types'; // Ajuste o caminho conforme seu projeto
import { Bank as BankIcon } from '@phosphor-icons/react';

interface BankSelectorProps {
  banks: Bank[];
  selectedBankId: number;
  onSelectBank: (id: number) => void;
}

const BankSelector: React.FC<BankSelectorProps> = ({
  banks,
  selectedBankId,
  onSelectBank
}) => {
  return (
    <div className="flex flex-row items-center justify-center space-x-6 overflow-x-auto py-4 bg-gray-100">
      {banks.map((bank) => {
        const isSelected = bank.id === selectedBankId;
        return (
          <button
            key={bank.id}
            onClick={() => onSelectBank(bank.id)}
            className={`flex flex-col items-center justify-center cursor-pointer 
              ${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              transition-colors duration-200 hover:text-blue-500 min-w-[80px]
            `}
          >
            {/* Substitua pela forma que você estiver rendendo o ícone:
                - Pode ser um <img src={bank.icon} /> 
                - Ou algum componente de ícone de biblioteca.
            */}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
              {/* <span>{bank.icon}</span>  */}
              <span><BankIcon size={32} /></span>
            </div>
            <span>{bank.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BankSelector;
