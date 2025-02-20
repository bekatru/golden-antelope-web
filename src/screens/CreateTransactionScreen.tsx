import { useState } from "react";
import { useStore } from "../services/zustand";
import { Save } from "lucide-react";
import { Expense, Income, Transfer } from "../modules/transaction";
import {
  AccountSelect,
  BackButton,
  CategorySelect,
  TransactionTypeSelect,
  AmountInput,
  ConversionRateInput,
  NoteInput,
} from "../components";

export const CreateTransactionScreen = () => {
  const { createTransaction, accounts, categories } = useStore();

  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [fromAccountId, setFromAccountId] = useState<string>("");
  const [toAccountId, setToAccountId] = useState<string>("");
  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState<string>("");
  const [conversionRate, setConversionRate] = useState<string>("1");

  const handleTypeChange = (type: TransactionType) => {
    switch (type) {
      case "income":
        setFromAccountId("");
        break;
      case "expense":
        setToAccountId("");
        break;
      case "transfer":
    }
    setType(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      return;
    }

    const newTransaction: TransactionDto = {
      type,
      amount: Number(amount),
      note: note || null,
      category: categories[categoryId] || null,
    };

    switch (type) {
      case "income":
        createTransaction(
          new Income({
            ...newTransaction,
            toAccount: accounts[toAccountId],
          })
        );
        break;
      case "expense":
        createTransaction(
          new Expense({
            ...newTransaction,
            fromAccount: accounts[fromAccountId],
          })
        );
        break;
      case "transfer":
        createTransaction(
          new Transfer({
            ...newTransaction,
            toAccount: accounts[toAccountId],
            fromAccount: accounts[fromAccountId],
            conversionRate: Number(conversionRate),
          })
        );
        break;
    }

    setAmount("");
    setNote("");
    setFromAccountId("");
    setToAccountId("");
    setType;
    setCategoryId("");
    setConversionRate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 h-full flex flex-col font-light text-2xl"
    >
      <TransactionTypeSelect value={type} onChange={handleTypeChange} />
      <AmountInput value={amount} onChange={setAmount} />
      <AccountSelect
        value={fromAccountId}
        onChange={setFromAccountId}
        required={type != "income"}
        disabled={type == "income"}
        placeholderPrefix="from"
        disabledOptionIds={[toAccountId]}
      />
      <AccountSelect
        value={toAccountId}
        onChange={setToAccountId}
        required={type != "expense"}
        disabled={type == "expense"}
        placeholderPrefix="to"
        disabledOptionIds={[fromAccountId]}
      />

      {type == "transfer" &&
        fromAccountId &&
        toAccountId &&
        accounts[fromAccountId]?.currency !=
          accounts[toAccountId]?.currency && (
          <ConversionRateInput
            value={conversionRate}
            onChange={setConversionRate}
          />
        )}

      <CategorySelect value={categoryId} onChange={setCategoryId} />
      <NoteInput value={note} onChange={setNote} />

      <div className="mt-auto w-full border-t flex justify-evenly">
        <BackButton />
        <button
          type="submit"
          className="flex-1 py-4 box-content flex justify-center"
        >
          <Save size={28} strokeWidth={1} />
        </button>
      </div>
    </form>
  );
};
