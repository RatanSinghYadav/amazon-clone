const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'https://app-01.onrender.com', // Replace with your target server URL
        changeOrigin: true,
      })
    );
  };
  