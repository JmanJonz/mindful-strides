import express from 'express';
import cookieParser from 'cookie-parser';
import gates from './gates.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware
app.use('/auth', gates);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});