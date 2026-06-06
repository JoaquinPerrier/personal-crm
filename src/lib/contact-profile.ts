/** Mackay 66 — deep contact profile stored as JSON in `extended_profile` */

export interface ContactExtendedProfile {
  personal: Record<string, string>;
  preferences: Record<string, string>;
  career: Record<string, string>;
  commercial: Record<string, string>;
  personality: Record<string, string>;
  final: Record<string, string>;
}

export type ProfileFieldType = "text" | "textarea" | "date";

export type ProfileRootField =
  | "name"
  | "birthday"
  | "location"
  | "company"
  | "position"
  | "howWeMet";

export interface ProfileFieldDef {
  key: string;
  labelEs: string;
  labelEn: string;
  type?: ProfileFieldType;
  /** Maps to a top-level Contact column (avoid duplication in JSON) */
  rootField?: ProfileRootField;
}

export interface ProfileSectionDef {
  id: keyof ContactExtendedProfile;
  titleEs: string;
  titleEn: string;
  fields: ProfileFieldDef[];
}

export const PROFILE_SECTIONS: ProfileSectionDef[] = [
  {
    id: "personal",
    titleEs: "Información Personal",
    titleEn: "Personal Information",
    fields: [
      { key: "_name", labelEs: "Nombre completo", labelEn: "Full name", rootField: "name" },
      { key: "nickname", labelEs: "Apodo o cómo le gusta que lo llamen", labelEn: "Nickname or preferred name" },
      { key: "_birthday", labelEs: "Fecha de nacimiento", labelEn: "Date of birth", type: "date", rootField: "birthday" },
      { key: "maritalStatus", labelEs: "Estado civil", labelEn: "Marital status" },
      { key: "spouseName", labelEs: "Nombre del cónyuge o pareja", labelEn: "Spouse or partner name" },
      { key: "anniversary", labelEs: "Fecha de aniversario", labelEn: "Anniversary date", type: "date" },
      { key: "children", labelEs: "Nombre y edad de los hijos", labelEn: "Children names and ages", type: "textarea" },
      { key: "birthPlace", labelEs: "Lugar de nacimiento", labelEn: "Place of birth" },
      { key: "_location", labelEs: "Lugar donde vive actualmente", labelEn: "Current residence", rootField: "location" },
      { key: "previousResidences", labelEs: "¿Dónde vivió anteriormente?", labelEn: "Previous places of residence", type: "textarea" },
      { key: "education", labelEs: "Educación y estudios realizados", labelEn: "Education and studies", type: "textarea" },
      { key: "languages", labelEs: "¿Qué idiomas habla?", labelEn: "Languages spoken" },
      { key: "hobbies", labelEs: "¿Cuáles son sus hobbies?", labelEn: "Hobbies", type: "textarea" },
      { key: "sports", labelEs: "¿Qué deportes practica o sigue?", labelEn: "Sports practiced or followed" },
      { key: "organizations", labelEs: "¿Qué organizaciones integra?", labelEn: "Organizations", type: "textarea" },
      { key: "communityActivities", labelEs: "¿Qué actividades comunitarias realiza?", labelEn: "Community activities", type: "textarea" },
      { key: "specialInterests", labelEs: "¿Cuáles son sus intereses especiales?", labelEn: "Special interests", type: "textarea" },
      { key: "dreamsGoals", labelEs: "¿Cuáles son sus sueños o metas personales?", labelEn: "Personal dreams and goals", type: "textarea" },
    ],
  },
  {
    id: "preferences",
    titleEs: "Preferencias Personales",
    titleEn: "Personal Preferences",
    fields: [
      { key: "favoriteFood", labelEs: "Comida favorita", labelEn: "Favorite food" },
      { key: "favoriteRestaurant", labelEs: "Restaurante favorito", labelEn: "Favorite restaurant" },
      { key: "favoriteDrink", labelEs: "Bebida favorita", labelEn: "Favorite drink" },
      { key: "favoriteHobbies", labelEs: "Pasatiempos favoritos", labelEn: "Favorite pastimes", type: "textarea" },
      { key: "favoriteTravel", labelEs: "Destinos de viaje favoritos", labelEn: "Favorite travel destinations", type: "textarea" },
      { key: "favoriteBooks", labelEs: "Libros favoritos", labelEn: "Favorite books", type: "textarea" },
      { key: "publications", labelEs: "Revistas o publicaciones que lee", labelEn: "Magazines or publications", type: "textarea" },
      { key: "favoriteMedia", labelEs: "Programas de TV, películas o podcasts favoritos", labelEn: "Favorite TV, movies or podcasts", type: "textarea" },
      { key: "favoriteTeam", labelEs: "Equipo deportivo favorito", labelEn: "Favorite sports team" },
      { key: "recreationalActivities", labelEs: "Actividades recreativas preferidas", labelEn: "Preferred recreational activities", type: "textarea" },
      { key: "favoriteMusic", labelEs: "Música favorita", labelEn: "Favorite music", type: "textarea" },
      { key: "charitableCauses", labelEs: "Causas benéficas que apoya", labelEn: "Charitable causes supported", type: "textarea" },
    ],
  },
  {
    id: "career",
    titleEs: "Carrera y Negocios",
    titleEn: "Career & Business",
    fields: [
      { key: "_company", labelEs: "Empresa donde trabaja", labelEn: "Company", rootField: "company" },
      { key: "_position", labelEs: "Cargo actual", labelEn: "Current role", rootField: "position" },
      { key: "responsibilities", labelEs: "Responsabilidades principales", labelEn: "Main responsibilities", type: "textarea" },
      { key: "careerPath", labelEs: "Trayectoria profesional", labelEn: "Career path", type: "textarea" },
      { key: "achievements", labelEs: "Logros más importantes", labelEn: "Key achievements", type: "textarea" },
      { key: "professionalGoals", labelEs: "Metas profesionales", labelEn: "Professional goals", type: "textarea" },
      { key: "futureAspirations", labelEs: "Aspiraciones futuras", labelEn: "Future aspirations", type: "textarea" },
      { key: "currentChallenges", labelEs: "Principales desafíos actuales", labelEn: "Current main challenges", type: "textarea" },
      { key: "problemsToSolve", labelEs: "¿Qué problemas intenta resolver?", labelEn: "Problems they're trying to solve", type: "textarea" },
      { key: "opportunitiesSought", labelEs: "¿Qué oportunidades busca?", labelEn: "Opportunities they're seeking", type: "textarea" },
      { key: "workMotivation", labelEs: "¿Qué lo motiva en el trabajo?", labelEn: "What motivates them at work", type: "textarea" },
      { key: "valuesInPartner", labelEs: "¿Qué valora más en un proveedor o socio?", labelEn: "What they value in a vendor or partner", type: "textarea" },
      { key: "decisionFactors", labelEs: "¿Qué factores influyen en sus decisiones?", labelEn: "Decision influencing factors", type: "textarea" },
      { key: "decisionInfluencers", labelEs: "¿Quiénes influyen en sus decisiones?", labelEn: "Who influences their decisions", type: "textarea" },
      { key: "approvalAuthority", labelEs: "¿Quién tiene poder de aprobación?", labelEn: "Who has approval authority", type: "textarea" },
    ],
  },
  {
    id: "commercial",
    titleEs: "Relación Comercial",
    titleEn: "Business Relationship",
    fields: [
      { key: "_howWeMet", labelEs: "¿Cómo nos conocimos?", labelEn: "How did we meet?", type: "textarea", rootField: "howWeMet" },
      { key: "relationshipDuration", labelEs: "¿Hace cuánto nos conocemos?", labelEn: "How long have we known each other?" },
      { key: "currentProducts", labelEs: "¿Qué productos o servicios utiliza actualmente?", labelEn: "Current products or services used", type: "textarea" },
      { key: "experiencesWithUs", labelEs: "¿Qué experiencias tuvo con nosotros?", labelEn: "Experiences with us", type: "textarea" },
      { key: "likesAboutUs", labelEs: "¿Qué le gusta de nuestra empresa?", labelEn: "What they like about our company", type: "textarea" },
      { key: "dislikesAboutUs", labelEs: "¿Qué le disgusta o le gustaría mejorar?", labelEn: "What they'd improve or dislike", type: "textarea" },
      { key: "currentNeeds", labelEs: "¿Qué necesidades tiene actualmente?", labelEn: "Current needs", type: "textarea" },
      { key: "futureNeeds", labelEs: "¿Qué necesidades podría tener en el futuro?", labelEn: "Future needs", type: "textarea" },
      { key: "valueAdd", labelEs: "¿Cómo podemos agregarle más valor?", labelEn: "How can we add more value", type: "textarea" },
      { key: "competitors", labelEs: "¿Qué competidores utiliza o considera?", labelEn: "Competitors used or considered", type: "textarea" },
    ],
  },
  {
    id: "personality",
    titleEs: "Personalidad y Comunicación",
    titleEn: "Personality & Communication",
    fields: [
      { key: "communicationPreference", labelEs: "¿Cómo prefiere comunicarse?", labelEn: "Preferred communication style" },
      { key: "personalityStyle", labelEs: "¿Cuál es su estilo de personalidad?", labelEn: "Personality style", type: "textarea" },
      { key: "passionateTopics", labelEs: "¿Qué temas le apasionan?", labelEn: "Passionate topics", type: "textarea" },
      { key: "avoidedTopics", labelEs: "¿Qué temas evita?", labelEn: "Topics to avoid", type: "textarea" },
      { key: "importantValues", labelEs: "¿Qué valores considera importantes?", labelEn: "Important values", type: "textarea" },
      { key: "trustBuilders", labelEs: "¿Qué lo hace confiar en alguien?", labelEn: "What builds trust", type: "textarea" },
      { key: "distrustTriggers", labelEs: "¿Qué le genera desconfianza?", labelEn: "What creates distrust", type: "textarea" },
      { key: "lifeEvents", labelEs: "¿Qué acontecimientos importantes están ocurriendo en su vida?", labelEn: "Important life events", type: "textarea" },
      { key: "currentChanges", labelEs: "¿Qué cambios enfrenta actualmente?", labelEn: "Current changes they're facing", type: "textarea" },
      { key: "howToHelp", labelEs: "¿Cómo puedo ayudarlo a alcanzar sus objetivos?", labelEn: "How can I help them reach their goals", type: "textarea" },
    ],
  },
  {
    id: "final",
    titleEs: "La Pregunta Final",
    titleEn: "The Final Question",
    fields: [
      {
        key: "competitorKnowsBetter",
        labelEs: "¿Mi competencia conoce mejor a esta persona que yo?",
        labelEn: "Does my competition know this person better than I do?",
        type: "textarea",
      },
    ],
  },
];

export function emptyExtendedProfile(): ContactExtendedProfile {
  return {
    personal: {},
    preferences: {},
    career: {},
    commercial: {},
    personality: {},
    final: {},
  };
}

export function parseExtendedProfile(raw: string | null | undefined): ContactExtendedProfile {
  if (!raw) return emptyExtendedProfile();
  try {
    const parsed = JSON.parse(raw) as Partial<ContactExtendedProfile>;
    return {
      personal: parsed.personal ?? {},
      preferences: parsed.preferences ?? {},
      career: parsed.career ?? {},
      commercial: parsed.commercial ?? {},
      personality: parsed.personality ?? {},
      final: parsed.final ?? {},
    };
  } catch {
    return emptyExtendedProfile();
  }
}

export function serializeExtendedProfile(profile: ContactExtendedProfile): string {
  return JSON.stringify(profile);
}

export type RootFieldValues = Record<ProfileRootField, string>;

export function getRootFieldValue(field: ProfileRootField, roots: RootFieldValues): string {
  return roots[field] ?? "";
}

export function countSectionAnswers(
  section: ProfileSectionDef,
  profile: ContactExtendedProfile,
  roots: RootFieldValues
): number {
  return section.fields.filter((f) => {
    if (f.rootField) return getRootFieldValue(f.rootField, roots).trim().length > 0;
    return (profile[section.id][f.key] ?? "").trim().length > 0;
  }).length;
}

export function countTotalAnswers(profile: ContactExtendedProfile, roots: RootFieldValues): number {
  return PROFILE_SECTIONS.reduce(
    (sum, section) => sum + countSectionAnswers(section, profile, roots),
    0
  );
}
