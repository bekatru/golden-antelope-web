import { useState } from "react";
import { TransactionDto, useStore } from "../services/zustand";
import { Save, X} from "lucide-react";
import { useNavigate } from "react-router";

export const CreateTransactionScreen = () => {
  const navigate = useNavigate();
  const {createTransaction, accounts} = useStore();

  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState<string>("");
  const [account, setAccount] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount === "" || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newTransaction: TransactionDto = {
      amount: Number(amount),
      note: note || null,
    };

    createTransaction(newTransaction);

    // Reset form
    setAmount("");
    setNote("");
    setAccount("")
  };


  return (
    <form onSubmit={handleSubmit} className="px-4 h-full flex flex-col font-light">
        <input
          autoFocus
          type="number"
          inputMode="decimal"
          autoComplete="off"
          placeholder="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || "")}
          className="w-full p-2 text-right focus:outline-0 text-2xl"
          required
        />

        <select
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="w-full p-2 text-right focus:outline-0 text-2xl placeholder:text-gray-500"
          required
        >
          <option key={'select-account'} value="" disabled>select account</option>
          {
            accounts.map(({id, name}) => (
              <option key={id} value={id}>{name}</option>
            ))
          }
        </select>

        <textarea
          placeholder="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 focus:outline-0 text-2xl text-right"
        />



      
      <div className="w-full mt-auto border-t border-gray-500 flex justify-evenly">
        <X onClick={() => navigate(-1)} size={28} strokeWidth={1} className="flex-1 py-4 box-content"/>
        <button type="submit" className="flex-1 py-4 box-content flex justify-center">
          <Save size={28} strokeWidth={1} />
        </button>
      </div>

    </form>
  );
};
