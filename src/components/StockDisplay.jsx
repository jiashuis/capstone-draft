import React, { useEffect, useState } from "react";
import "./StockDisplay.css";

const StockList = ({ stocks }) => {
  const [currentPrices, setCurrentPrices] = useState({});
  const [profits, setProfits] = useState({});
  const apiKey = "demo";

  useEffect(() => {
    const fetchPrices = async () => {
      if (stocks.length === 0) {
        setCurrentPrices({});
        setProfits({});
        return;
      }

      const promises = stocks.map(async (stock) => {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${apiKey}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const price = data["Global Quote"]
            ? parseFloat(data["Global Quote"]["05. price"])
            : NaN;
          const purchasePrice = stock.purchasePrice;
          const profitLoss = calculateProfitLoss(price, purchasePrice);
          return { symbol: stock.symbol, currentPrice: price, profitLoss };
        } catch (error) {
          console.error("Error fetching stock price:", error);
          return {
            symbol: stock.symbol,
            currentPrice: NaN,
            profitLoss: { amount: NaN, text: "N/A", color: "black" },
          };
        }
      });

      try {
        const results = await Promise.all(promises);
        const pricesMap = results.reduce((acc, result) => {
          acc[result.symbol] = result.currentPrice;
          return acc;
        }, {});
        const profitsMap = results.reduce((acc, result) => {
          acc[result.symbol] = result.profitLoss;
          return acc;
        }, {});
        setCurrentPrices(pricesMap);
        setProfits(profitsMap);
      } catch (error) {
        console.error("Error fetching stock prices:", error);
      }
    };

    fetchPrices();
  }, [stocks, apiKey]);

  const calculateProfitLoss = (currentPrice, purchasePrice) => {
    if (!isNaN(currentPrice) && !isNaN(purchasePrice)) {
      const profitLoss = currentPrice - purchasePrice;
      return {
        amount: profitLoss,
        text:
          profitLoss >= 0
            ? `+${profitLoss.toFixed(2)}`
            : `-${Math.abs(profitLoss).toFixed(2)}`,
        color: profitLoss >= 0 ? "green" : "red",
      };
    } else {
      return {
        amount: NaN,
        text: "N/A",
        color: "black",
      };
    }
  };

  if (stocks.length === 0) {
    return <div>No stocks entered.</div>;
  }

  return (
    <div>
      <h2>Added Stocks</h2>
      <ul>
        {stocks.map((stock, index) => (
          <li key={index}>
            <div>
              <strong>Symbol:</strong> {stock.symbol}
            </div>
            <div>
              <strong>Quantity:</strong> {stock.quantity}
            </div>
            <div>
              <strong>Purchase Price:</strong> ${stock.purchasePrice.toFixed(2)}
            </div>
            <div>
              <strong>Current Price:</strong> $
              {currentPrices[stock.symbol] || "Fetching..."}
            </div>
            <div>
              <strong>Profit/Loss:</strong>{" "}
              <span style={{ color: profits[stock.symbol]?.color }}>
                {profits[stock.symbol]?.text || "N/A"}
              </span>
            </div>
            <hr /> {/* Optional: Add a horizontal line between each stock */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockList;
