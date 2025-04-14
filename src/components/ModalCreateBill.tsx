import React, { useState, useEffect } from 'react';
import { NewAccount } from '../types';

interface ModalCreateBillProps {
  isOpen: boolean;
  banks: string[];
  onCancel: () => void;
  onConfirm: (newAccount: NewAccount) => void;
}

const ModalCreateBill: React.FC<ModalCreateBillProps> = ({
  isOpen,
  banks,
  onCancel,
  onConfirm,
}) => {
  const [selectedBank, setSelectedBank] = useState('');
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

  const handleConfirm = () => {
    const parsedInstallmentValues = installmentValues.map((v) => parseFloat(v) || 0);
    const totalInstallmentValue = parsedInstallmentValues.reduce((acc, curr) => acc + curr, 0);
  
    const newAccount = {
      bank: selectedBank,
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
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
          >
            <option value="">Selecione um banco</option>
            {banks.map((bankName) => (
              <option key={bankName} value={bankName}>
                {bankName}
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
