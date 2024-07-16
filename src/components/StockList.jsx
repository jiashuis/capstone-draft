import React, { useEffect, useState } from 'react';
import "./StockList.css";


const StockList = ({ stocks }) => {
  const [currentPrices, setCurrentPrices] = useState({});
  const [profits, setProfits] = useState({});

  useEffect(() => {
    if (stocks.length === 0) {
      setCurrentPrices({});
      setProfits({});
      return;
    }

    const fetchPrices = () => {
      const promises = stocks.map(stock => {
        return fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=demo`)
          .then((res) => res.json()
          )
          .then(data => {
            const price = data['Global Quote'] ? parseFloat(data['Global Quote']['05. price']) : null;
            const purchasePrice = stock.purchasePrice;
            const profitLoss = calculateProfitLoss(price, purchasePrice);
            return { symbol: stock.symbol, currentPrice: price, profitLoss };
          })
          .catch(error => {
            console.error('Error fetching stock price:', error);
            return { symbol: stock.symbol, currentPrice: null, profitLoss: { amount: null, text: 'N/A', color: 'black' } };
          });
      });

      Promise.all(promises)
        .then(results => {
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
        })
        .catch(error => {
          console.error('Error fetching stock prices:', error);
          setCurrentPrices({});
          setProfits({});
        });
    };

    fetchPrices();
  }, [stocks]);

  const calculateProfitLoss = (currentPrice, purchasePrice) => {
    if (typeof currentPrice === 'number' && typeof purchasePrice === 'number' && !isNaN(currentPrice) && !isNaN(purchasePrice)) {
      const profitLoss = currentPrice - purchasePrice;
      return {
        amount: profitLoss,
        text: profitLoss >= 0 ? `+${profitLoss.toFixed(2)}` : `-${Math.abs(profitLoss).toFixed(2)}`,
        color: profitLoss >= 0 ? 'green' : 'red'
      };
    } else {
      return {
        amount: null,
        text: 'N/A',
        color: 'black'
      };
    }
  };

  if (stocks.length === 0) {
    return <div><br  />No stocks entered.</div>;
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
              <strong>Current Price:</strong> ${currentPrices[stock.symbol] || 'Fetching...'}
            </div>
            <div>
              <strong>Profit/Loss:</strong>{' '}
              <span style={{ color: profits[stock.symbol]?.color }}>{profits[stock.symbol]?.text || 'N/A'}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockList;
