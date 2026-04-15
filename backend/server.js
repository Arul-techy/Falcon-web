require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`🦅 Falcon Web-Builder API running on http://localhost:${PORT}`);
});
