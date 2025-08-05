import express from 'express';
import { registerUser, loginUser, getProtectedResource, authenticateJWT, logoutUser } from './handlers.js';

const gates = express.Router();

gates.post('/register', registerUser);
gates.post('/login', loginUser);
gates.get('/profile', authenticateJWT, getProtectedResource);
gates.post('/logout', logoutUser); // New logout gate

export default gates;