import { createClient, type Client, type InValue } from "@libsql/client";
import fs from "fs";
import path from "path";
import type {
  Contact,
  ContactCategory,
  ContactStatus,
  CreateContactInput,
  UpdateContactInput,
  User,
} from "./types";

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

function getDbUrl(): string {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) return url;

  // Local fallback when Turso env vars are not configured
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return `file:${path.join(dataDir, "kinship.db")}`;
}

function getClient(): Client {
  if (!client) {
    client = createClient({
      url: getDbUrl(),
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = initSchema();
  }
  await schemaReady;
}

async function initSchema() {
  const db = getClient();
  await db.batch(
    [
      {
        sql: `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )`,
      },
      {
        sql: `CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token TEXT UNIQUE NOT NULL,
          expires_at TEXT NOT NULL,
          used INTEGER DEFAULT 0
        )`,
      },
      {
        sql: `CREATE TABLE IF NOT EXISTS auth_logs (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          action TEXT NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          created_at TEXT NOT NULL
        )`,
      },
      {
        sql: `CREATE TABLE IF NOT EXISTS contacts (
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
          referred_by TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )`,
      },
      {
        sql: `CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id)`,
      },
      {
        sql: `CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON auth_logs(user_id)`,
      },
    ],
    "write"
  );

  // Migrations for existing databases
  const migrations = [
    `ALTER TABLE contacts ADD COLUMN photo_data BLOB`,
    `ALTER TABLE contacts ADD COLUMN photo_mime TEXT`,
    `ALTER TABLE contacts ADD COLUMN referred_by TEXT`,
  ];
  for (const sql of migrations) {
    try {
      await db.execute(sql);
    } catch {
      // Column already exists
    }
  }
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
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return fallback;
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
    isFavorite: Number(row.is_favorite) === 1,
    lastMet: row.last_met ?? undefined,
    status: (row.status as ContactStatus) ?? undefined,
    activity: row.activity ?? undefined,
    notes: row.notes ?? undefined,
    location: row.location ?? undefined,
    referredBy: row.referred_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function execute(sql: string, args: InValue[] = []) {
  await ensureSchema();
  return getClient().execute({ sql, args });
}

// ── Users ──

export async function createUser(
  id: string,
  name: string,
  email: string,
  passwordHash: string
): Promise<User> {
  const now = new Date().toISOString();
  await execute(
    `INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, email.toLowerCase(), passwordHash, now, now]
  );
  return { id, name, email: email.toLowerCase(), createdAt: now };
}

export async function findUserByEmail(email: string) {
  const result = await execute(
    `SELECT * FROM users WHERE lower(email) = lower(?)`,
    [email.toLowerCase()]
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  if (!row) return undefined;
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    password_hash: String(row.password_hash),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function findUserById(id: string): Promise<User | undefined> {
  const result = await execute(
    `SELECT id, name, email, created_at FROM users WHERE id = ?`,
    [id]
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  if (!row) return undefined;
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    createdAt: String(row.created_at),
  };
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  const now = new Date().toISOString();
  await execute(`UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`, [
    passwordHash,
    now,
    userId,
  ]);
}

// ── Password reset ──

export async function createPasswordResetToken(
  id: string,
  userId: string,
  token: string,
  expiresAt: string
) {
  await execute(
    `INSERT INTO password_reset_tokens (id, user_id, token, expires_at, used)
     VALUES (?, ?, ?, ?, 0)`,
    [id, userId, token, expiresAt]
  );
}

export async function findValidResetToken(token: string) {
  const result = await execute(
    `SELECT * FROM password_reset_tokens
     WHERE token = ? AND used = 0 AND expires_at > ?`,
    [token, new Date().toISOString()]
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  if (!row) return undefined;
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    token: String(row.token),
    expires_at: String(row.expires_at),
  };
}

export async function markResetTokenUsed(id: string) {
  await execute(`UPDATE password_reset_tokens SET used = 1 WHERE id = ?`, [id]);
}

// ── Auth logs ──

export async function logAuthAction(
  id: string,
  userId: string | null,
  action: string,
  ip?: string,
  userAgent?: string
) {
  await execute(
    `INSERT INTO auth_logs (id, user_id, action, ip_address, user_agent, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, userId, action, ip ?? null, userAgent ?? null, new Date().toISOString()]
  );
}

export async function getAuthLogsForUser(userId: string, limit = 50) {
  const result = await execute(
    `SELECT id, user_id, action, created_at FROM auth_logs
     WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
    [userId, limit]
  );
  return result.rows.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id),
      user_id: String(r.user_id),
      action: String(r.action),
      created_at: String(r.created_at),
    };
  });
}

// ── Contacts ──

export async function getContactsByUser(userId: string): Promise<Contact[]> {
  const result = await execute(
    `SELECT * FROM contacts WHERE user_id = ? ORDER BY name ASC`,
    [userId]
  );
  return result.rows.map((row) => rowToContact(row as unknown as ContactRow));
}

export async function getContactById(
  userId: string,
  contactId: string
): Promise<Contact | undefined> {
  const result = await execute(
    `SELECT * FROM contacts WHERE id = ? AND user_id = ?`,
    [contactId, userId]
  );
  const row = result.rows[0] as unknown as ContactRow | undefined;
  return row ? rowToContact(row) : undefined;
}

export async function createContact(
  userId: string,
  id: string,
  input: CreateContactInput
): Promise<Contact> {
  const now = new Date().toISOString();
  const status: ContactStatus = input.status ?? "new";
  await execute(
    `INSERT INTO contacts (
      id, user_id, name, company, position, phone, email, birthday, interests, aspirations,
      how_we_met, referred_by, category, status, notes, location, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      userId,
      input.name,
      input.company ?? null,
      input.position ?? null,
      input.phone ?? null,
      input.email ?? null,
      input.birthday ?? null,
      input.interests ? JSON.stringify(input.interests) : null,
      input.aspirations ?? null,
      input.howWeMet ?? null,
      input.referredBy ?? null,
      input.category ?? null,
      status,
      input.notes ?? null,
      input.location ?? null,
      now,
      now,
    ]
  );
  return (await getContactById(userId, id))!;
}

export async function updateContact(
  userId: string,
  contactId: string,
  input: UpdateContactInput
): Promise<Contact | undefined> {
  const existing = await getContactById(userId, contactId);
  if (!existing) return undefined;

  const now = new Date().toISOString();
  const merged = { ...existing, ...input, updatedAt: now };
  if (input.photoUrl === null) {
    merged.photoUrl = undefined;
  }

  await execute(
    `UPDATE contacts SET
      name = ?, company = ?, position = ?, phone = ?, email = ?, birthday = ?,
      interests = ?, aspirations = ?, how_we_met = ?, shared_memories = ?,
      referred_by = ?, category = ?, social_links = ?, photo_url = ?, is_favorite = ?, last_met = ?,
      status = ?, activity = ?, notes = ?, location = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`,
    [
      merged.name,
      merged.company ?? null,
      merged.position ?? null,
      merged.phone ?? null,
      merged.email ?? null,
      merged.birthday ?? null,
      merged.interests ? JSON.stringify(merged.interests) : null,
      merged.aspirations ?? null,
      merged.howWeMet ?? null,
      merged.sharedMemories ?? null,
      merged.referredBy ?? null,
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
      userId,
    ]
  );

  return getContactById(userId, contactId);
}

export async function deleteContact(
  userId: string,
  contactId: string
): Promise<boolean> {
  const result = await execute(`DELETE FROM contacts WHERE id = ? AND user_id = ?`, [
    contactId,
    userId,
  ]);
  return result.rowsAffected > 0;
}

export async function countContactsByUser(userId: string): Promise<number> {
  const result = await execute(
    `SELECT COUNT(*) as count FROM contacts WHERE user_id = ?`,
    [userId]
  );
  const row = result.rows[0] as Record<string, unknown>;
  return Number(row.count);
}

function bufferFromStoredPhoto(raw: unknown): Buffer | null {
  if (raw == null) return null;
  if (Buffer.isBuffer(raw)) return raw;
  if (raw instanceof Uint8Array) return Buffer.from(raw);
  if (raw instanceof ArrayBuffer) return Buffer.from(raw);
  if (typeof raw === "string") {
    // Stored as base64 text (preferred) — also handles legacy plain strings
    const buf = Buffer.from(raw, "base64");
    if (buf.length > 0) return buf;
    return Buffer.from(raw, "binary");
  }
  return null;
}

export async function saveContactPhotoData(
  userId: string,
  contactId: string,
  data: Buffer,
  mimeType: string
) {
  await execute(
    `UPDATE contacts SET photo_data = ?, photo_mime = ? WHERE id = ? AND user_id = ?`,
    [data.toString("base64"), mimeType, contactId, userId]
  );
}

export async function getContactPhotoData(userId: string, contactId: string) {
  const result = await execute(
    `SELECT photo_data, photo_mime FROM contacts WHERE id = ? AND user_id = ?`,
    [contactId, userId]
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  if (!row || row.photo_data == null) return null;
  const data = bufferFromStoredPhoto(row.photo_data);
  if (!data || data.length === 0) return null;
  return { data, mimeType: String(row.photo_mime ?? "image/jpeg") };
}

export async function clearContactPhotoData(userId: string, contactId: string) {
  await execute(
    `UPDATE contacts SET photo_data = NULL, photo_mime = NULL WHERE id = ? AND user_id = ?`,
    [contactId, userId]
  );
}
