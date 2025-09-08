import React, { useEffect, useState } from "react";
import Header from "../components/Header"; 
import Cards from "../components/Cards";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import TransactionsTable from "../components/TransactionsTable";
import NoTransactions from "../components/NoTransactions";
import { addDoc, collection, getDocs, query, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../pages/firebase";  
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import SavingsGoals from "../components/SavingsGoals";
import ChartComponent from "../components/ChartComponent";


function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // Savings Goals (state for user-specific goals)
  const [savingsGoals, setSavingsGoals] = useState([]);

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many = false) {
    try {
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      if (!many) toast.success("Transaction added");
    } catch (e) {
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    if (user) {
      fetchTransactions();
      loadSavingsGoals();
    }
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  // Calculate income, expenses, and total balance from transactions
  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += Number(transaction.amount);
      } else {
        expensesTotal += Number(transaction.amount);
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  // Fetch transactions for logged-in user
  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  // Load savings goals from Firestore user document
  async function loadSavingsGoals() {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSavingsGoals(data.savingsGoals || []);
      } else {
        setSavingsGoals([]);
      }
    } catch (error) {
      console.error("Failed to load savings goals:", error);
    }
  }

  // Save savings goals to Firestore user document
  async function saveSavingsGoals(updatedGoals) {
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { savingsGoals: updatedGoals }, { merge: true });
      setSavingsGoals(updatedGoals);
      toast.success("Savings goals updated");
    } catch (error) {
      console.error("Failed to save savings goals:", error);
      toast.error("Failed to update savings goals");
    }
  }

  return (
    <div>
      <Header />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expenses}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />

          {transactions.length !== 0 ? (
  <ChartComponent transactions={transactions} />
) : (
  <NoTransactions />
)}


          {/* Add Modals */}
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />

          {/* Transactions */}
          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
            setTransactions={setTransactions}
          />

          {/* Savings Goals */}
          <SavingsGoals
            savingsGoals={savingsGoals}
            setSavingsGoals={setSavingsGoals}
            saveSavingsGoals={saveSavingsGoals}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
