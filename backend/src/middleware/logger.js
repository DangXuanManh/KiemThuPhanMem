const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const appLogStream = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' });

const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next();

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}\n`;
  appLogStream.write(logMessage);
  next();
};

const logError = (err, req) => {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ERROR: ${err.message} | URL: ${req?.originalUrl}\nStack: ${err.stack}\n---\n`;
  errorLogStream.write(errorMessage);
};

module.exports = {
  requestLogger,
  logError
};
