import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { RECORD_TYPES, HTTP_STATUS } from "../utils/constants.js";

const sanitizeRecord = (record) => {
  return {
    id: record.id,
    amount: Number(record.amount),
    type: record.type,
    category: record.category,
    recordDate: record.record_date,
    notes: record.notes,
    isDeleted: record.is_deleted,
    createdBy: record.created_by,
    createdByName: record.created_by_name || null,
    createdByEmail: record.created_by_email || null,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
};

export const createRecordService = async ({
  amount,
  type,
  category,
  recordDate,
  notes,
  createdBy,
}) => {
  if (!amount || !type || !category || !recordDate) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Amount, type, category, and recordDate are required"
    );
  }

  if (Number(amount) <= 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Amount must be greater than 0"
    );
  }

  if (!Object.values(RECORD_TYPES).includes(type)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Invalid record type. Allowed values are income or expense"
    );
  }

  const query = `
    INSERT INTO financial_records (
      amount,
      type,
      category,
      record_date,
      notes,
      created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, amount, type, category, record_date, notes, is_deleted, created_by, created_at, updated_at
  `;

  const values = [
    amount,
    type,
    category.trim(),
    recordDate,
    notes?.trim() || null,
    createdBy,
  ];

  const result = await pool.query(query, values);

  return sanitizeRecord(result.rows[0]);
};

export const getAllRecordsService = async ({
  type,
  category,
  fromDate,
  toDate,
}) => {
  let query = `
    SELECT
      fr.id,
      fr.amount,
      fr.type,
      fr.category,
      fr.record_date,
      fr.notes,
      fr.is_deleted,
      fr.created_by,
      fr.created_at,
      fr.updated_at,
      u.name AS created_by_name,
      u.email AS created_by_email
    FROM financial_records fr
    JOIN users u ON fr.created_by = u.id
    WHERE fr.is_deleted = FALSE
  `;

  const values = [];
  let index = 1;

  if (type) {
    query += ` AND fr.type = $${index}`;
    values.push(type);
    index++;
  }

  if (category) {
    query += ` AND LOWER(fr.category) = LOWER($${index})`;
    values.push(category.trim());
    index++;
  }

  if (fromDate) {
    query += ` AND fr.record_date >= $${index}`;
    values.push(fromDate);
    index++;
  }

  if (toDate) {
    query += ` AND fr.record_date <= $${index}`;
    values.push(toDate);
    index++;
  }

  query += ` ORDER BY fr.record_date DESC, fr.created_at DESC`;

  const result = await pool.query(query, values);

  return result.rows.map(sanitizeRecord);
};

export const getRecordByIdService = async (recordId) => {
  const query = `
    SELECT
      fr.id,
      fr.amount,
      fr.type,
      fr.category,
      fr.record_date,
      fr.notes,
      fr.is_deleted,
      fr.created_by,
      fr.created_at,
      fr.updated_at,
      u.name AS created_by_name,
      u.email AS created_by_email
    FROM financial_records fr
    JOIN users u ON fr.created_by = u.id
    WHERE fr.id = $1 AND fr.is_deleted = FALSE
    LIMIT 1
  `;

  const result = await pool.query(query, [recordId]);

  if (result.rows.length === 0) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Record not found");
  }

  return sanitizeRecord(result.rows[0]);
};

export const updateRecordService = async (
  recordId,
  { amount, type, category, recordDate, notes }
) => {
  const updates = [];
  const values = [];
  let index = 1;

  if (amount !== undefined) {
    if (Number(amount) <= 0) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Amount must be greater than 0"
      );
    }
    updates.push(`amount = $${index}`);
    values.push(amount);
    index++;
  }

  if (type !== undefined) {
    if (!Object.values(RECORD_TYPES).includes(type)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid record type. Allowed values are income or expense"
      );
    }
    updates.push(`type = $${index}`);
    values.push(type);
    index++;
  }

  if (category !== undefined) {
    if (!category.trim()) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Category cannot be empty"
      );
    }
    updates.push(`category = $${index}`);
    values.push(category.trim());
    index++;
  }

  if (recordDate !== undefined) {
    updates.push(`record_date = $${index}`);
    values.push(recordDate);
    index++;
  }

  if (notes !== undefined) {
    updates.push(`notes = $${index}`);
    values.push(notes?.trim() || null);
    index++;
  }

  if (updates.length === 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "At least one field is required to update the record"
    );
  }

  values.push(recordId);

  const query = `
    UPDATE financial_records
    SET ${updates.join(", ")}
    WHERE id = $${index} AND is_deleted = FALSE
    RETURNING id, amount, type, category, record_date, notes, is_deleted, created_by, created_at, updated_at
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Record not found");
  }

  return sanitizeRecord(result.rows[0]);
};

export const deleteRecordService = async (recordId) => {
  const query = `
    UPDATE financial_records
    SET is_deleted = TRUE
    WHERE id = $1 AND is_deleted = FALSE
    RETURNING id
  `;

  const result = await pool.query(query, [recordId]);

  if (result.rows.length === 0) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Record not found");
  }

  return {
    id: result.rows[0].id,
  };
};