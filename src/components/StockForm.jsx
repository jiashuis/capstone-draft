import React, { useState } from "react";
import StockList from "./StockList.jsx";
import "./StockForm.css";

const StockForm = () => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [stocks, setStocks] = useState([]);

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="Stock Symbol"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
        <input
          type="number"
          placeholder="Purchase Price"
          value={purchasePrice}
          onChange={(event) => setPurchasePrice(event.target.value)}
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
