import sqlite3 from "sqlite3";

// connect to the database file: it will be created if it doesn't exist...
    const db = new sqlite3.Database("./database.db", (err) => {
        if (err) {
            console.log(err.message)
        }
    })

// create the users table if it doens't already exist
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT UNIQUE NOT null,password TEXT NOT NULL)")
    })

// function to get a user by their username
    const getUserByUsername = (username, callback) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], callback);
    };

// Function to create a new user with a hashed password.
    const createUser = (username, password, callback) => {
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(sql, [username, password], function(err) {
        callback(err, { id: this.lastID, username });
    });
    };

export {getUserByUsername, createUser}