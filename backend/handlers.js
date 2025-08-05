import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByUsername, createUser } from "./models.js";

// use a strong random key in actual production save it in .env not directly here in the code...
    const SECRET_KEY = 'your_super_secret_key';

// handles the creation of a new user.
    export const registerUser = async (req, res) => {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // otherwise try to make new user
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                createUser(username, hashedPassword, (err, user) => {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({ message: 'User already exists' });
                        }
                        return res.status(500).json({ message: 'Server error' });
                    }
                    res.status(201).json({ message: 'User created successfully', user });
                })
            } catch (error) {
                res.status(500).json({ message: 'Server error during hashing' });
            }
            
    };

// handles user login and generates a JWT
    export const loginUser = (req, res) => {
        const {username, password} = req.body;

        if (!username, !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        getUserByUsername(username, async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
            }

            // set the jwt as httpony cookie in the client who made the request
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.cookie("token", token, {
                httpOnly: true, // prevent client side js from reading the cookie
                secure: false,
                sameSite: "Lax",
                maxAge : 3600000
            })
            res.json({message: "Login successful"})
        })
    }

// authentication middleware
    export const authenticateJWT = (req, res, next) => {
        // read token from the cookie
            const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({ message: 'Authorization token is missing!' });
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token!' });
        }
    }

export const getProtectedResource = (req, res) => {
    res.json({ message: `Hello, ${req.user.username}! You have access to this protected resource.` });
}

export const logoutUser = (req, res) => {
  // Clear the cookie to log the user out
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};