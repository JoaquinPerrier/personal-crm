export interface Contact {
  id: string;
  name: string;
  company?: string;
  position?: string;
  phone?: string;
  email?: string;
  birthday?: string;
  interests?: string[];
  aspirations?: string;
  howWeMet?: string;
  sharedMemories?: string;
  tags?: string[];
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  contactId: string;
  content: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  contactId: string;
  title: string;
  dueDate: string;
  isRecurring: boolean;
  recurrenceRule?: string;
  completed: boolean;
}
