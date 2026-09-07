const { query } = require('../config/db');

async function getPlacementOverview(req, res, next) {
  try {
    const [stats] = await query('SELECT * FROM view_placement_statistics');
    return res.status(200).json({ success: true, overview: stats });
  } catch (error) {
    next(error);
  }
}

async function getDepartmentStats(req, res, next) {
  try {
    const stats = await query('SELECT * FROM view_department_recruitment_stats ORDER BY placement_percentage DESC');
    return res.status(200).json({ success: true, departments: stats });
  } catch (error) {
    next(error);
  }
}

async function getSkillDemandStats(req, res, next) {
  try {
    const stats = await query(
      `SELECT * FROM view_skill_demand_supply 
       ORDER BY required_in_internships DESC 
       LIMIT 15`
    );
    return res.status(200).json({ success: true, skills: stats });
  } catch (error) {
    next(error);
  }
}

async function getCompanyFunnelStats(req, res, next) {
  try {
    const stats = await query(
      `SELECT * FROM view_company_recruitment_summary 
       WHERE total_applications_received > 0
       ORDER BY total_applications_received DESC 
       LIMIT 10`
    );
    return res.status(200).json({ success: true, companies: stats });
  } catch (error) {
    next(error);
  }
}

async function getMonthlyTrends(req, res, next) {
  try {
    // Aggregation of applications by month
    const trends = await query(
      `SELECT 
         DATE_FORMAT(applied_at, '%b %Y') AS month_label,
         COUNT(*) AS applications_count,
         SUM(CASE WHEN status = 'Offered' OR status = 'Accepted' THEN 1 ELSE 0 END) AS offers_count
       FROM applications
       GROUP BY DATE_FORMAT(applied_at, '%b %Y'), YEAR(applied_at), MONTH(applied_at)
       ORDER BY YEAR(applied_at) ASC, MONTH(applied_at) ASC`
    );
    return res.status(200).json({ success: true, trends });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPlacementOverview,
  getDepartmentStats,
  getSkillDemandStats,
  getCompanyFunnelStats,
  getMonthlyTrends
};
