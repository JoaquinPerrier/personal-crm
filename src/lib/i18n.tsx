"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "en" | "es";

const translations = {
  en: {
    // BottomNav
    "nav.dashboard": "Dashboard",
    "nav.contacts": "Contacts",
    "nav.reminders": "Reminders",
    "nav.profile": "Profile",

    // Dashboard
    "dashboard.relationshipPulse": "Relationship Pulse",
    "dashboard.networkHealth": "Network Health",
    "dashboard.thriving": "Thriving",
    "dashboard.totalCircles": "Total\nCircles",
    "dashboard.dueToday": "Due\nToday",
    "dashboard.pulseRate": "Pulse Rate",
    "dashboard.giftingWindow": "Gifting Window",
    "dashboard.giftingDesc": "3 key anniversaries are approaching in the next fortnight.",
    "dashboard.viewEvents": "View Events",
    "dashboard.priorityContacts": "Priority Contacts",
    "dashboard.priorityDesc": "Deepen these connections this week",
    "dashboard.seeAll": "See All >",
    "dashboard.lastMet": "Last met",
    "dashboard.upcomingFollowUps": "Upcoming Follow-ups",

    // Contacts
    "contacts.yourNetwork": "Your Network",
    "contacts.nurturing": "Nurturing {count} active connections",
    "contacts.searchPlaceholder": "Search your atrium...",
    "contacts.all": "All",
    "contacts.business": "Business",
    "contacts.personal": "Personal",
    "contacts.refer": "Refer",
    "contacts.noResults": "No contacts found",
    "contacts.at": "at",
    "contacts.statusWarm": "WARM",
    "contacts.statusFollowUp": "FOLLOW-UP DUE",
    "contacts.statusNew": "NEW",
    "contacts.statusCold": "COLD",

    // Contact Detail
    "detail.notFound": "Contact not found",
    "detail.quickNote": "Quick Note",
    "detail.quickNotePlaceholder": "Capture a passing thought or a small detail...",
    "detail.saveInsight": "Save Insight",
    "detail.goldMine": "The Gold Mine",
    "detail.deepInterests": "Deep Interests",
    "detail.aspiration": "Aspiration",
    "detail.lifeGoal": "Life Goal",
    "detail.context": "Context",
    "detail.origins": "Origins",
    "detail.coreMemories": "Core Memories",
    "detail.digitalPresence": "Digital Presence",
    "detail.contactChannels": "Contact Channels",
    "detail.primaryEmail": "Primary Email",
    "detail.mobile": "Mobile",
    "detail.location": "Location",
    "detail.scheduleCoffee": "Schedule Coffee",
    "detail.foundingMember": "Founding Member",
    "detail.innerCircle": "Inner Circle",
    "detail.warmConnection": "Warm Connection",
    "detail.lastSpoke": "Last spoke {days} days ago",
    "detail.lastSpokeWeek": "Last spoke 1 week ago",

    // New Contact
    "new.title": "New Connection",
    "new.heading": "Capture the Spark",
    "new.subtitle": "Record the essence of this new relationship while the details are fresh.",
    "new.fullName": "Full Name",
    "new.fullNamePlaceholder": "Who did you meet?",
    "new.companyContext": "Company / Context",
    "new.companyPlaceholder": "Organization or common ground",
    "new.category": "Relationship Category",
    "new.business": "Business",
    "new.personal": "Personal",
    "new.referral": "Referral",
    "new.initialSpark": "Initial Spark",
    "new.sparkPlaceholder": "What stood out? Future gift ideas?\nShared interests?",
    "new.warmLead": "Warm Lead",

    // Reminders
    "reminders.title": "Reminders",
    "reminders.subtitle": "Nurturing your most valued connections this week.",
    "reminders.upcoming": "Upcoming",
    "reminders.sendGiftIdea": "Send Gift Idea",
    "reminders.scheduleCoffee": "Schedule Coffee",
    "reminders.warmConnection": "Warm Connection",
    "reminders.today": "Today",
    "reminders.tomorrow": "Tomorrow",
    "reminders.friday": "Friday",
    "reminders.reconnection": "Reconnection Opportunities",
    "reminders.messageJulian": "Message Julian",
    "reminders.writeNote": "Write Note",
    "reminders.confirm": "Confirm",
    "reminders.reschedule": "Reschedule",

    // Language
    "lang.label": "Language",
    "lang.en": "English",
    "lang.es": "Español",
  },
  es: {
    // BottomNav
    "nav.dashboard": "Inicio",
    "nav.contacts": "Contactos",
    "nav.reminders": "Recordatorios",
    "nav.profile": "Perfil",

    // Dashboard
    "dashboard.relationshipPulse": "Pulso Relacional",
    "dashboard.networkHealth": "Salud de la Red",
    "dashboard.thriving": "Próspera",
    "dashboard.totalCircles": "Círculos\nTotales",
    "dashboard.dueToday": "Pendientes\nHoy",
    "dashboard.pulseRate": "Tasa de Pulso",
    "dashboard.giftingWindow": "Ventana de Regalos",
    "dashboard.giftingDesc": "3 aniversarios clave se acercan en las próximas dos semanas.",
    "dashboard.viewEvents": "Ver Eventos",
    "dashboard.priorityContacts": "Contactos Prioritarios",
    "dashboard.priorityDesc": "Profundizá estas conexiones esta semana",
    "dashboard.seeAll": "Ver todo >",
    "dashboard.lastMet": "Último encuentro",
    "dashboard.upcomingFollowUps": "Próximos Seguimientos",

    // Contacts
    "contacts.yourNetwork": "Tu Red",
    "contacts.nurturing": "Cultivando {count} conexiones activas",
    "contacts.searchPlaceholder": "Buscá en tu red...",
    "contacts.all": "Todos",
    "contacts.business": "Negocios",
    "contacts.personal": "Personal",
    "contacts.refer": "Referidos",
    "contacts.noResults": "No se encontraron contactos",
    "contacts.at": "en",
    "contacts.statusWarm": "CÁLIDO",
    "contacts.statusFollowUp": "SEGUIMIENTO",
    "contacts.statusNew": "NUEVO",
    "contacts.statusCold": "FRÍO",

    // Contact Detail
    "detail.notFound": "Contacto no encontrado",
    "detail.quickNote": "Nota Rápida",
    "detail.quickNotePlaceholder": "Capturá un pensamiento o detalle...",
    "detail.saveInsight": "Guardar Idea",
    "detail.goldMine": "La Mina de Oro",
    "detail.deepInterests": "Intereses Profundos",
    "detail.aspiration": "Aspiración",
    "detail.lifeGoal": "Meta de Vida",
    "detail.context": "Contexto",
    "detail.origins": "Orígenes",
    "detail.coreMemories": "Recuerdos Clave",
    "detail.digitalPresence": "Presencia Digital",
    "detail.contactChannels": "Canales de Contacto",
    "detail.primaryEmail": "Email Principal",
    "detail.mobile": "Celular",
    "detail.location": "Ubicación",
    "detail.scheduleCoffee": "Agendar Café",
    "detail.foundingMember": "Miembro Fundador",
    "detail.innerCircle": "Círculo Íntimo",
    "detail.warmConnection": "Conexión Cálida",
    "detail.lastSpoke": "Última charla hace {days} días",
    "detail.lastSpokeWeek": "Última charla hace 1 semana",

    // New Contact
    "new.title": "Nueva Conexión",
    "new.heading": "Capturá la Chispa",
    "new.subtitle": "Registrá la esencia de esta nueva relación mientras los detalles están frescos.",
    "new.fullName": "Nombre Completo",
    "new.fullNamePlaceholder": "¿A quién conociste?",
    "new.companyContext": "Empresa / Contexto",
    "new.companyPlaceholder": "Organización o punto en común",
    "new.category": "Categoría de Relación",
    "new.business": "Negocios",
    "new.personal": "Personal",
    "new.referral": "Referido",
    "new.initialSpark": "Chispa Inicial",
    "new.sparkPlaceholder": "¿Qué te llamó la atención? ¿Ideas de regalo?\n¿Intereses en común?",
    "new.warmLead": "Lead Cálido",

    // Reminders
    "reminders.title": "Recordatorios",
    "reminders.subtitle": "Cuidando tus conexiones más valiosas esta semana.",
    "reminders.upcoming": "Próximo",
    "reminders.sendGiftIdea": "Enviar Idea de Regalo",
    "reminders.scheduleCoffee": "Agendar Café",
    "reminders.warmConnection": "Conexión Cálida",
    "reminders.today": "Hoy",
    "reminders.tomorrow": "Mañana",
    "reminders.friday": "Viernes",
    "reminders.reconnection": "Oportunidades de Reconexión",
    "reminders.messageJulian": "Mensaje a Julian",
    "reminders.writeNote": "Escribir Nota",
    "reminders.confirm": "Confirmar",
    "reminders.reschedule": "Reprogramar",

    // Language
    "lang.label": "Idioma",
    "lang.en": "English",
    "lang.es": "Español",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("locale") as Locale) || "en";
    }
    return "en";
  });

  const changeLocale = useCallback((l: Locale) => {
    setLocale(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", l);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let str = (translations[locale] as Record<string, string>)[key] || key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx;
}
