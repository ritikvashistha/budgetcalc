import React, { useState, useEffect } from "react";
import "./App.css";
import ExpenseList from "./components/ExpenseList";
import Expenseform from "./components/Expenseform";
import Alert from "./components/Alert";
import uuid from "uuid/v4";

const App = () => {
  //**state values**
  //all expenses and expense
  const [expenses, setExpenses] = useState(
    localStorage.getItem("expenses")
      ? JSON.parse(localStorage.getItem("expenses"))
      : []
  );
  //single expense
  const [charge, setCharge] = useState("");
  // single charge
  const [amount, setAmount] = useState("");
  // alert
  const [alert, setAlert] = useState({ show: false });
  //edit
  const [edit, setEdit] = useState(false);
  //edit item
  const [id, setId] = useState(0);

  //use effect for local storage
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  //**functionality**/

  //handle charge
  const handleCharge = e => {
    setCharge(e.target.value);
  };
  //handle amount
  const handleAmount = e => {
    setAmount(e.target.value);
  };
  //handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id
            ? { ...item, charge: charge, amount: amount }
            : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "Item Edited" });
      } else {
        const singleExpense = { id: uuid(), charge: charge, amount: amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: "success", text: "Item Added" });
      }
      setAmount("");
      setCharge("");
    } else {
      //handle alert called
      handleAlert({
        type: "danger",
        text: `Charge can not be empty value has to be bigger than Zero`
      });
    }
  };
  //clear all items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: "success", text: "All Items Deleted" });
  };
  //handle  delete
  const handleDelete = id => {
    let tempExpense = expenses.filter(item => item.id !== id);
    setExpenses(tempExpense);
    handleAlert({ type: "danger", text: "Item Deleted" });
  };
  //handle  edit
  const handleEdit = id => {
    let expense = expenses.find(item => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };
  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1> Budget Calculator</h1>
      <main className="App">
        <Expenseform
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        Total Spending :{" "}
        <span className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
};
export default App;
