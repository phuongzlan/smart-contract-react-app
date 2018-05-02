const cfg = {};

cfg.domain = process.env.NODE_ENV === 'develop' ? 'localhost': 'chattkn.com';
// HTTP Port to run our web application
cfg.port = process.env.PORT || 9000;

// Export configuration object
module.exports = cfg;