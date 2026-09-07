const { query } = require('../config/db');

async function createEvaluation(req, res, next) {
  try {
    const {
      internship_record_id,
      evaluated_by = 'Corporate Supervisor',
      technical_score,
      communication_score,
      punctuality_score,
      problem_solving_score,
      ppo_offered = false,
      qualitative_feedback = ''
    } = req.body;

    const overall = (
      (parseFloat(technical_score) +
       parseFloat(communication_score) +
       parseFloat(punctuality_score) +
       parseFloat(problem_solving_score)) / 4.0
    ).toFixed(2);

    const [resInsert] = await query(
      `INSERT INTO evaluations 
        (internship_record_id, evaluated_by, technical_score, communication_score, punctuality_score, problem_solving_score, overall_score, ppo_offered, qualitative_feedback)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         evaluated_by = VALUES(evaluated_by),
         technical_score = VALUES(technical_score),
         communication_score = VALUES(communication_score),
         punctuality_score = VALUES(punctuality_score),
         problem_solving_score = VALUES(problem_solving_score),
         overall_score = VALUES(overall_score),
         ppo_offered = VALUES(ppo_offered),
         qualitative_feedback = VALUES(qualitative_feedback),
         evaluated_at = NOW()`,
      [internship_record_id, evaluated_by, technical_score, communication_score, punctuality_score, problem_solving_score, overall, ppo_offered, qualitative_feedback]
    );

    // Also mark record completed if not already
    await query("UPDATE internship_records SET status = 'Completed', updated_at = NOW() WHERE id = ?", [internship_record_id]);

    return res.status(201).json({
      success: true,
      message: 'Evaluation and performance assessment recorded successfully.',
      evaluationId: resInsert.insertId
    });
  } catch (error) {
    next(error);
  }
}

async function getEvaluationByRecord(req, res, next) {
  try {
    const recordId = req.params.recordId;
    const evals = await query(
      `SELECT e.*, r.student_id, i.title AS role_title, c.name AS company_name
       FROM evaluations e
       JOIN internship_records r ON e.internship_record_id = r.id
       JOIN internships i ON r.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       WHERE e.internship_record_id = ?`,
      [recordId]
    );

    if (evals.length === 0) {
      return res.status(404).json({ success: false, message: 'No evaluation on file for this internship record.' });
    }

    return res.status(200).json({ success: true, evaluation: evals[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEvaluation,
  getEvaluationByRecord
};
