const express = require('express');
const debug = require('debug')('app:server'); // For debugging

const connectDB = require('./config/db');
const roiRouter = require('./routes/marks_sheet_roi_routes'); // Import your routes
const dataRouter = require('./routes/extract_text_route')

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware setup
// app.use(express.json()); // Parse incoming JSON requests
app.use(express.json({ limit: '100mb' }));

// Mount your routes
app.use('/roi', roiRouter); // Mount the todosRouter under the /todos path
app.use('/data',dataRouter);
// Start the server
app.listen(port, () => {
    debug(`Server is running on port ${port}`);
});
