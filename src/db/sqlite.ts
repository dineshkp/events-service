import sqlite3 from 'sqlite3';
import {Database} from 'sqlite3';

class DatabaseConnection {
    private static instance: DatabaseConnection;
    private readonly db: Database;

    private constructor() {
        this.db = new sqlite3.Database('./events.db', (err) => {
            if (err) {
                console.error('Error connecting to database:', err);
            } else {
                console.log('Connected to SQLite database');
                this.initializeDatabase()
                    .catch(error => console.error(error));
            }
        });
    }

    private async initializeDatabase() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS events (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              date TEXT NOT NULL,
              location TEXT NOT NULL,
              description TEXT,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `;

        this.db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Error creating events table:', err);
            } else {
                console.log('Events table initialized');
            }
        });
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public getDatabase(): Database {
        return this.db;
    }
}

export const db = DatabaseConnection.getInstance().getDatabase();