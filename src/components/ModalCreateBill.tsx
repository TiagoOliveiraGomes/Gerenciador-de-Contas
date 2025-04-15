import React, { useState, useEffect } from 'react';
import { NewAccount } from '../types';

interface ModalCreateBillProps {
  isOpen: boolean;
  banks: { id: number; name: string }[];
  onCancel: () => void;
  onConfirm: (newAccount: NewAccount & { bankId: number }) => void;
}

const ModalCreateBill: React.FC<ModalCreateBillProps> = ({
  isOpen,
  banks,
  onCancel,
  onConfirm,
}) => {
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [isInstallment, setIsInstallment] = useState(false);
  const [numInstallments, setNumInstallments] = useState(2);
  const [value, setValue] = useState('');
  const [installmentValues, setInstallmentValues] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [installmentDates, setInstallmentDates] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    setInstallmentValues(Array(numInstallments).fill(''));
    setInstallmentDates(Array(numInstallments).fill(''));
  }, [numInstallments]);
  
  useEffect(() => {
    if (isOpen && banks.length > 0) {
      setSelectedBankId(banks[0].id);
    }
  }, [isOpen, banks]);

  const handleConfirm = () => {
    if (selectedBankId === null) {
      console.log("id do banco selecionado é nulo")
      // Opcional: exibir um aviso ou retornar
      return;
    }
    
    const parsedInstallmentValues = installmentValues.map((v) => parseFloat(v) || 0);
    const totalInstallmentValue = parsedInstallmentValues.reduce((acc, curr) => acc + curr, 0);
  
    // Se você não tiver acesso direto ao nome, pode passar o nome do banco buscado no array.
    const selectedBankObject = banks.find(bank => bank.id === selectedBankId);
  
    const newAccount = {
      bank: selectedBankObject ? selectedBankObject.name : '', // propriedade exigida em NewAccount
      bankId: selectedBankId, // propriedade adicional
      isInstallment,
      value: isInstallment ? totalInstallmentValue : parseFloat(value),
      date: isInstallment ? installmentDates[0] : date,
      description,
      isConcluded: false,
      showInstallments: false,
      installments: isInstallment
        ? parsedInstallmentValues.map((v, idx) => ({
            id: idx + 1,
            value: v,
            date: installmentDates[idx],
            isConcluded: false,
          }))
        : [],
    };
  
    onConfirm(newAccount);
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Adicionar Nova Conta</h2>

        <label className="block mb-2">
          Banco:
          <select
            className="block w-full mt-1 p-2 border rounded"
            value={selectedBankId ?? 1}
            onChange={(e) => setSelectedBankId(Number(e.target.value))}
            
          >
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>
        </label>


        <label className="block mb-2">
          Tipo de pagamento:
          <select
            className="block w-full mt-1 p-2 border rounded"
            value={isInstallment ? 'parcelado' : 'avista'}
            onChange={(e) => setIsInstallment(e.target.value === 'parcelado')}
          >
            <option value="avista">À vista</option>
            <option value="parcelado">Parcelado</option>
          </select>
        </label>

        {isInstallment ? (
          <>
            <label className="block mb-2">
              Quantidade de parcelas:
              <input
                type="number"
                min={2}
                value={numInstallments}
                onChange={(e) => setNumInstallments(Number(e.target.value))}
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>

            {installmentValues.map((_, idx) => (
              <div key={idx} className="mb-2 flex gap-2">
                <input
                  type="number"
                  placeholder={`Valor da parcela ${idx + 1}`}
                  className="w-1/2 p-2 border rounded"
                  value={installmentValues[idx]}
                  onChange={(e) => {
                    const newValues = [...installmentValues];
                    newValues[idx] = e.target.value;
                    setInstallmentValues(newValues);
                  }}
                />
                <input
                  type="date"
                  className="w-1/2 p-2 border rounded"
                  value={installmentDates[idx]}
                  onChange={(e) => {
                    const newDates = [...installmentDates];
                    newDates[idx] = e.target.value;
                    setInstallmentDates(newDates);
                  }}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <label className="block mb-2">
              Valor:
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>

            <label className="block mb-2">
              Data:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
          </>
        )}

        <label className="block mb-4">
          Descrição:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full mt-1 p-2 border rounded resize-none"
          />
        </label>

        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateBill;
