const express = require('express');
const router = express.Router();
const { expenses } = require('../models/db');

router.get('/', (req, res) => {
  const { search = '', type = '' } = req.query;
  const filtered = expenses.filter((exp) => {
    const matchesSearch = `${exp.vehicleId} ${exp.description}`.toLowerCase().includes(search.toLowerCase());
    const matchesType = !type || exp.expenseType === type;
    return matchesSearch && matchesType;
  });
  res.json(filtered);
});

router.post('/', (req, res) => {
  const { expenseType, amount, vehicleId, description } = req.body;
  if (!expenseType || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newExpense = {
    id: expenses.length + 1,
    expenseType,
    amount: Number(amount),
    vehicleId: vehicleId || 'N/A',
    date: new Date().toISOString().split('T')[0],
    description: description || '',
  };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

router.get('/summary', (req, res) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const byType = expenses.reduce((acc, exp) => {
    acc[exp.expenseType] = (acc[exp.expenseType] || 0) + exp.amount;
    return acc;
  }, {});
  res.json({ totalExpenses, byType, recordCount: expenses.length });
});

module.exports = router;
