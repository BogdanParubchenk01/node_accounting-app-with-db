'use strict';

const expensesService = require('../servicres/expenseServices');
const usersService = require('../servicres/userServices');

const getAllExpenses = async(req, res) => {
  const expenses = await expensesService.getAllExpenses(req.query);

  if (!expenses) {
    res.sendStatus(500);
  };

  const normalizeExpensenses = expenses.map(expensesService.normalize);

  res
    .status(200)
    .send(normalizeExpensenses);
};

const getExpenseById = async(req, res) => {
  const { expenseId } = req.params;

  if (!expenseId) {
    res.sendStatus(400);

    return;
  };

  const expense = await expensesService.getExpenseById(expenseId);

  if (!expense) {
    res
      .sendStatus(404);
  };

  const normalizedExpense = expensesService.normalize(expense);

  res
    .status(200)
    .send(normalizedExpense);
};

const deleteExpense = async(req, res) => {
  const { expenseId } = req.params;

  if (!expenseId) {
    res.sendStatus(400);

    return;
  }

  const isDeleteExpense = expensesService.deleteExpense(expenseId);

  if (!isDeleteExpense) {
    res.sendStatus(404);

    return;
  }

  res.sendStatus(204);
};

const addExpense = async(req, res) => {
  const {
    userId,
    spentAt,
    title,
    amount,
    category,
    note,
  } = req.body;

  if (!userId || !spentAt || !title || !amount || !category || !note) {
    res.sendStatus(400);

    return;
  }

  const user = await usersService.getUser(userId);

  if (!user) {
    res.sendStatus(400);

    return;
  }

  const expense = await expensesService.addExpense(req.body);

  if (!expense) {
    res
      .sendStatus(500);

    return;
  }

  const normalizedExpense = expensesService.normalize(expense);

  res
    .status(201)
    .send(normalizedExpense);
};

const updateExpense = async(req, res) => {
  const { expenseId } = req.params;

  if (!expenseId) {
    res.sendStatus(400);

    return;
  }

  const expense = await expensesService.getExpenseById(expenseId);

  if (!expense) {
    res.sendStatus(404);

    return;
  }

  const {
    title,
    amount,
    category,
    note,
  } = req.body;

  if (title) {
    expense.title = title;
  }

  if (amount) {
    expense.amount = amount;
  }

  if (category) {
    expense.category = category;
  }

  if (note) {
    expense.note = note;
  }

  const normalizedExpense = expensesService.normalize(expense);

  res
    .status(200)
    .send(normalizedExpense);
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  deleteExpense,
  addExpense,
  updateExpense,
};