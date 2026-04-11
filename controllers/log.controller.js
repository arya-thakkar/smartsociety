const logService = require("../services/log.service");
const getLogs = async (req, res, next) => { try { const logs = await logService.getLogs(req.user.society, req.query); res.json({ success: true, logs }); } catch (err) { next(err); } };
module.exports = { getLogs };
