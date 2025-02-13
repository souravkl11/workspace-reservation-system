const pool = require('../config/database');
const { STATUS } = require('../config/constants');

const createBookingRequest = async (req, res) => {
  const { booking_date } = req.body;
  const employee_id = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO booking_requests (employee_id, booking_date, status) VALUES ($1, $2, $3) RETURNING *',
      [employee_id, booking_date, STATUS.PENDING_MANAGER]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllBookingRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT br.*, u.username as employee_name
      FROM booking_requests br
      JOIN users u ON br.employee_id = u.id
      ORDER BY br.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const managerAction = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    const checkResult = await pool.query(
      'SELECT * FROM booking_requests WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking request not found' });
    }

    const request = checkResult.rows[0];
    if (request.status !== STATUS.PENDING_MANAGER) {
      return res.status(400).json({ error: 'Invalid request status for manager action' });
    }

    const newStatus = action === 'approve' ? 
      STATUS.PENDING_ADMIN : 
      STATUS.REJECTED_BY_MANAGER;

    const result = await pool.query(
      'UPDATE booking_requests SET status = $1, manager_action_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const adminAction = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    const checkResult = await pool.query(
      'SELECT * FROM booking_requests WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking request not found' });
    }

    const request = checkResult.rows[0];
    if (request.status !== STATUS.PENDING_ADMIN) {
      return res.status(400).json({ error: 'Invalid request status for admin action' });
    }

    const newStatus = action === 'approve' ? 
      STATUS.APPROVED : 
      STATUS.REJECTED_BY_ADMIN;

    const result = await pool.query(
      'UPDATE booking_requests SET status = $1, admin_action_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createBookingRequest,
  getAllBookingRequests,
  managerAction,
  adminAction
};
