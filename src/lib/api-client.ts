class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      data.error || "Something went wrong",
      data.code
    );
  }

  return data as T;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  headline?: string;
  location?: string;
  socialLinks?: import("./types").UserSocialLinks;
  createdAt: string;
}

export const api = {
  register(name: string, email: string, password: string) {
    return request<{ user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  login(email: string, password: string) {
    return request<{ user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout() {
    return request<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
    });
  },

  me() {
    return request<{ user: AuthUser }>("/api/auth/me");
  },

  updateProfile(data: import("./types").UpdateUserProfileInput) {
    return request<{ user: AuthUser }>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  forgotPassword(email: string) {
    return request<{ message: string; resetUrl?: string }>(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  },

  resetPassword(token: string, password: string) {
    return request<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },

  getContacts() {
    return request<{ contacts: import("./types").Contact[] }>("/api/contacts");
  },

  getContact(id: string) {
    return request<{ contact: import("./types").Contact }>(
      `/api/contacts/${id}`
    );
  },

  createContact(data: import("./types").CreateContactInput) {
    return request<{ contact: import("./types").Contact }>("/api/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateContact(id: string, data: import("./types").UpdateContactInput) {
    return request<{ contact: import("./types").Contact }>(
      `/api/contacts/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  deleteContact(id: string) {
    return request<{ success: boolean }>(`/api/contacts/${id}`, {
      method: "DELETE",
    });
  },

  async uploadContactPhoto(id: string, file: File) {
    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch(`/api/contacts/${id}/photo`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiClientError(
        res.status,
        data.error || "Something went wrong",
        data.code
      );
    }
    return data as { contact: import("./types").Contact };
  },

  removeContactPhoto(id: string) {
    return request<{ contact: import("./types").Contact }>(
      `/api/contacts/${id}/photo`,
      { method: "DELETE" }
    );
  },
};

export { ApiClientError };
