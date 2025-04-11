import React, { useState } from 'react';
import { Bank, Installment } from './types';
import { CaretDown, CaretUp, CheckCircle, Trash } from '@phosphor-icons/react';
import Modal from './components/ModalBase';

interface AccountsTableProps {
  bank: Bank;
  onToggleConclusion: (accountId: number, installmentId?: number) => void;
  onToggleInstallments: (accountId: number) => void;
  onDeleteAccount: (accountId: number) => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({
  bank,
  onToggleConclusion,
  onToggleInstallments,
  onDeleteAccount
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [expandedAccounts, setExpandedAccounts] = useState<number[]>([]);
  const [accountToDelete, setAccountToDelete] = useState<number | null>(null);

  const handleToggleInstallments = (accountId: number) => {
    onToggleInstallments(accountId);

    // 🔁 Alternar o ID na lista de expandidos
    setExpandedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };
  const openDeleteModal = (accountId: number) => {
    setAccountToDelete(accountId);
    setIsModalOpen(true);
  };
  const handleConfirm = () => {
    if (accountToDelete !== null) {
      onDeleteAccount(accountToDelete);
    }
    setIsModalOpen(false);
    setAccountToDelete(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAccountToDelete(null);
  };


  return (
    <div className="p-4">
      <table className="w-full border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-600 text-white">
            <th className="p-2">Ações</th>
            <th className="p-2">Data</th>
            <th className="p-2">Valor</th>
            <th className="p-2">Descrição</th>
          </tr>
        </thead>
        <tbody>
          {bank.accounts.map((account) => {
            // Se a conta estiver concluída, deixamos um estilo semi-transparente
            const rowStyle = account.isConcluded ? 'opacity-50' : '';
            const isExpanded = expandedAccounts.includes(account.id);

            return (
              <React.Fragment key={account.id}>
                <tr className={`${rowStyle} border-b border-gray-300 bg-gray-700 text-white`}>
                  <td className="grid grid-cols-3 space-x-1 p-2 justify-end w-32">
                    {/* Botão de expandir parcelas (se houver) */}
                    {account.installments && account.installments.length > 0 ? (
                      <button
                      className="text-white px-2 py-1 rounded hover:cursor-pointer hover:text-gray-300 hover:scale-110"
                      onClick={() => handleToggleInstallments(account.id)}
                      title="Exibir parcelas"
                      >
                        {isExpanded? <CaretUp size={22}/>:<CaretDown size={22} />}
                      </button>
                    ): <div></div>}
                    {/* Botão de marcar como concluído */}
                    <button
                      className="mr-2 text-green-500 hover:text-green-600 hover:cursor-pointer hover:scale-110"
                      onClick={() => onToggleConclusion(account.id)}
                      title="Marcar como concluída"
                    >
                      <CheckCircle size={22} />
                    </button>

                    {/* Botão de apagar a conta */}
                    <button
                      className="mr-2 text-red-500 hover:text-red-600 hover:cursor-pointer hover:scale-110"
                      onClick={() => openDeleteModal(account.id)}
                      title="Apagar conta"
                    >
                      <Trash size={22} />
                    </button>

                  </td>
                  <td className="p-2">{account.date}</td>
                  <td className="p-2">{account.value}</td>
                  <td className="p-2">{account.description}</td>
                </tr>

                {/* Se showInstallments estiver true, exibe as parcelas */}
                {account.showInstallments && account.installments?.map((inst: Installment) => {
                  const installmentStyle = inst.isConcluded ? 'opacity-50' : '';
                  return (
                    <tr
                      key={inst.id}
                      className={`border-b border-gray-300 ${installmentStyle}`}
                    >
                      <td className="grid grid-cols-3 space-x-1 p-2 justify-end w-32">
                        {/* Marcando parcela como concluída */}
                        <div></div>
                        <button
                          className="mr-2 text-green-500 hover:text-green-600 hover:cursor-pointer hover:scale-110"
                          onClick={() => onToggleConclusion(account.id, inst.id)}
                          title="Marcar parcela como concluída"
                          >
                          <CheckCircle size={22} />
                        </button>
                          <div></div>
                        {/* Não apagamos parcela individual, mas poderia adicionar
                            um botão, se desejado. */}
                      </td>
                      <td className="p-2">{inst.date}</td>
                      <td className="p-2">{inst.value}</td>
                      <td className="p-2">Parcela #{inst.id}</td>
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        message="Você tem certeza que deseja continuar?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AccountsTable;
