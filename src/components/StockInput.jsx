import React, { useState } from "react";
import StockList from "./StockDisplay";
import "./StockInput.css";

const StockForm = () => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [stocks, setStocks] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol && quantity && purchasePrice) {
      const newStock = {
        symbol,
        quantity: parseFloat(quantity),
        purchasePrice: parseFloat(purchasePrice),
      };
      setStocks([...stocks, newStock]);
      setSymbol("");
      setQuantity("");
      setPurchasePrice("");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Stock Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Purchase Price"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
        />
        <button type="submit" className="add-stock">
          Add Stock
        </button>
      </form>
      <StockList stocks={stocks} />
    </div>
  );
};

export default StockForm;
