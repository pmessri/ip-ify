const express = require('express');
const app = express();
const cors = require('cors');

const port = 8080;

require('./config/ipify.config.js');

app.use(cors());
app.use(express.json(), express.urlencoded({extended: true}));

const Routes = require('./routes/ipify.routes.js');
Routes(app);

app.listen(port, '0.0.0.0', () => console.log(`Express server running on port ${port}`));