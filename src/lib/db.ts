import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type {
  Contact,
  ContactCategory,
  ContactStatus,
  CreateContactInput,
  UpdateContactInput,
  User,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "kinship.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS auth_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      company TEXT,
      position TEXT,
      phone TEXT,
      email TEXT,
      birthday TEXT,
      interests TEXT,
      aspirations TEXT,
      how_we_met TEXT,
      shared_memories TEXT,
      tags TEXT,
      category TEXT,
      social_links TEXT,
      photo_url TEXT,
      is_favorite INTEGER DEFAULT 0,
      last_met TEXT,
      status TEXT,
      activity TEXT,
      notes TEXT,
      location TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
    CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON auth_logs(user_id);
  `);
}

interface ContactRow {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  interests: string | null;
  aspirations: string | null;
  how_we_met: string | null;
  shared_memories: string | null;
  tags: string | null;
  category: string | null;
  social_links: string | null;
  photo_url: string | null;
  is_favorite: number;
  last_met: string | null;
  status: string | null;
  activity: string | null;
  notes: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function rowToContact(row: ContactRow): Contact {
  return {
    id: row.id,
    name: row.name,
    company: row.company ?? undefined,
    position: row.position ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    birthday: row.birthday ?? undefined,
    interests: parseJson<string[]>(row.interests, []),
    aspirations: row.aspirations ?? undefined,
    howWeMet: row.how_we_met ?? undefined,
    sharedMemories: row.shared_memories ?? undefined,
    tags: parseJson<string[]>(row.tags, []),
    category: (row.category as ContactCategory) ?? undefined,
    socialLinks: parseJson(row.social_links, {}),
    photoUrl: row.photo_url ?? undefined,
    isFavorite: row.is_favorite === 1,
    lastMet: row.last_met ?? undefined,
    status: (row.status as ContactStatus) ?? undefined,
    activity: row.activity ?? undefined,
    notes: row.notes ?? undefined,
    location: row.location ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Users ──

export function createUser(
  id: string,
  name: string,
  email: string,
  passwordHash: string
): User {
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(id, name, email.toLowerCase(), passwordHash, now, now);
  return { id, name, email: email.toLowerCase(), createdAt: now };
}

export function findUserByEmail(email: string) {
  return getDb()
    .prepare(`SELECT * FROM users WHERE email = ? COLLATE NOCASE`)
    .get(email.toLowerCase()) as
    | {
        id: string;
        name: string;
        email: string;
        password_hash: string;
        created_at: string;
        updated_at: string;
      }
    | undefined;
}

export function findUserById(id: string): User | undefined {
  const row = getDb()
    .prepare(`SELECT id, name, email, created_at FROM users WHERE id = ?`)
    .get(id) as { id: string; name: string; email: string; created_at: string } | undefined;
  if (!row) return undefined;
  return { id: row.id, name: row.name, email: row.email, createdAt: row.created_at };
}

export function updateUserPassword(userId: string, passwordHash: string) {
  const now = new Date().toISOString();
  getDb()
    .prepare(`UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`)
    .run(passwordHash, now, userId);
}

// ── Password reset ──

export function createPasswordResetToken(
  id: string,
  userId: string,
  token: string,
  expiresAt: string
) {
  getDb()
    .prepare(
      `INSERT INTO password_reset_tokens (id, user_id, token, expires_at, used)
       VALUES (?, ?, ?, ?, 0)`
    )
    .run(id, userId, token, expiresAt);
}

export function findValidResetToken(token: string) {
  return getDb()
    .prepare(
      `SELECT * FROM password_reset_tokens
       WHERE token = ? AND used = 0 AND expires_at > ?`
    )
    .get(token, new Date().toISOString()) as
    | { id: string; user_id: string; token: string; expires_at: string }
    | undefined;
}

export function markResetTokenUsed(id: string) {
  getDb()
    .prepare(`UPDATE password_reset_tokens SET used = 1 WHERE id = ?`)
    .run(id);
}

// ── Auth logs ──

export function logAuthAction(
  id: string,
  userId: string | null,
  action: string,
  ip?: string,
  userAgent?: string
) {
  getDb()
    .prepare(
      `INSERT INTO auth_logs (id, user_id, action, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(id, userId, action, ip ?? null, userAgent ?? null, new Date().toISOString());
}

export function getAuthLogsForUser(userId: string, limit = 50) {
  return getDb()
    .prepare(
      `SELECT id, user_id, action, created_at FROM auth_logs
       WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`
    )
    .all(userId, limit) as { id: string; user_id: string; action: string; created_at: string }[];
}

// ── Contacts ──

export function getContactsByUser(userId: string): Contact[] {
  const rows = getDb()
    .prepare(`SELECT * FROM contacts WHERE user_id = ? ORDER BY name ASC`)
    .all(userId) as ContactRow[];
  return rows.map(rowToContact);
}

export function getContactById(userId: string, contactId: string): Contact | undefined {
  const row = getDb()
    .prepare(`SELECT * FROM contacts WHERE id = ? AND user_id = ?`)
    .get(contactId, userId) as ContactRow | undefined;
  return row ? rowToContact(row) : undefined;
}

export function createContact(userId: string, id: string, input: CreateContactInput): Contact {
  const now = new Date().toISOString();
  const status: ContactStatus = input.status ?? "new";
  getDb()
    .prepare(
      `INSERT INTO contacts (
        id, user_id, name, company, position, phone, email, interests, aspirations,
        how_we_met, category, status, notes, location, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      userId,
      input.name,
      input.company ?? null,
      input.position ?? null,
      input.phone ?? null,
      input.email ?? null,
      input.interests ? JSON.stringify(input.interests) : null,
      input.aspirations ?? null,
      input.howWeMet ?? null,
      input.category ?? null,
      status,
      input.notes ?? null,
      input.location ?? null,
      now,
      now
    );
  return getContactById(userId, id)!;
}

export function updateContact(
  userId: string,
  contactId: string,
  input: UpdateContactInput
): Contact | undefined {
  const existing = getContactById(userId, contactId);
  if (!existing) return undefined;

  const now = new Date().toISOString();
  const merged = { ...existing, ...input, updatedAt: now };
  if (input.photoUrl === null) {
    merged.photoUrl = undefined;
  }

  getDb()
    .prepare(
      `UPDATE contacts SET
        name = ?, company = ?, position = ?, phone = ?, email = ?,
        interests = ?, aspirations = ?, how_we_met = ?, shared_memories = ?,
        category = ?, social_links = ?, photo_url = ?, is_favorite = ?, last_met = ?,
        status = ?, activity = ?, notes = ?, location = ?, updated_at = ?
       WHERE id = ? AND user_id = ?`
    )
    .run(
      merged.name,
      merged.company ?? null,
      merged.position ?? null,
      merged.phone ?? null,
      merged.email ?? null,
      merged.interests ? JSON.stringify(merged.interests) : null,
      merged.aspirations ?? null,
      merged.howWeMet ?? null,
      merged.sharedMemories ?? null,
      merged.category ?? null,
      merged.socialLinks ? JSON.stringify(merged.socialLinks) : null,
      merged.photoUrl ?? null,
      merged.isFavorite ? 1 : 0,
      merged.lastMet ?? null,
      merged.status ?? null,
      merged.activity ?? null,
      merged.notes ?? null,
      merged.location ?? null,
      now,
      contactId,
      userId
    );

  return getContactById(userId, contactId);
}

export function deleteContact(userId: string, contactId: string): boolean {
  const result = getDb()
    .prepare(`DELETE FROM contacts WHERE id = ? AND user_id = ?`)
    .run(contactId, userId);
  return result.changes > 0;
}

export function countContactsByUser(userId: string): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) as count FROM contacts WHERE user_id = ?`)
    .get(userId) as { count: number };
  return row.count;
}
