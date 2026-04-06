import pool from "../config/db.js";

const sanitizeActivityRecord = (record) => {
  return {
    id: record.id,
    amount: Number(record.amount),
    type: record.type,
    category: record.category,
    recordDate: record.record_date,
    notes: record.notes,
    createdBy: record.created_by,
    createdByName: record.created_by_name,
    createdByEmail: record.created_by_email,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
};

export const getDashboardSummaryService = async () => {
  const query = `
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
      COUNT(*) AS total_records
    FROM financial_records
    WHERE is_deleted = FALSE
  `;

  const result = await pool.query(query);
  const row = result.rows[0];

  const totalIncome = Number(row.total_income);
  const totalExpense = Number(row.total_expense);

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    totalRecords: Number(row.total_records),
  };
};

export const getCategoryTotalsService = async () => {
  const query = `
    SELECT
      category,
      type,
      COALESCE(SUM(amount), 0) AS total
    FROM financial_records
    WHERE is_deleted = FALSE
    GROUP BY category, type
    ORDER BY category ASC, type ASC
  `;

  const result = await pool.query(query);

  return result.rows.map((row) => ({
    category: row.category,
    type: row.type,
    total: Number(row.total),
  }));
};

export const getRecentActivityService = async (limit = 10) => {
  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;

  const query = `
    SELECT
      fr.id,
      fr.amount,
      fr.type,
      fr.category,
      fr.record_date,
      fr.notes,
      fr.created_by,
      fr.created_at,
      fr.updated_at,
      u.name AS created_by_name,
      u.email AS created_by_email
    FROM financial_records fr
    JOIN users u ON fr.created_by = u.id
    WHERE fr.is_deleted = FALSE
    ORDER BY fr.created_at DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [safeLimit]);

  return result.rows.map(sanitizeActivityRecord);
};

export const getMonthlyTrendsService = async () => {
  const query = `
    SELECT
      TO_CHAR(DATE_TRUNC('month', record_date), 'YYYY-MM') AS month,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
    FROM financial_records
    WHERE is_deleted = FALSE
    GROUP BY DATE_TRUNC('month', record_date)
    ORDER BY DATE_TRUNC('month', record_date) ASC
  `;

  const result = await pool.query(query);

  return result.rows.map((row) => {
    const totalIncome = Number(row.total_income);
    const totalExpense = Number(row.total_expense);

    return {
      month: row.month,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  });
};