import { z } from "zod";

// ============================================
// SECURITY: Centralized Input Validation Schemas
// ============================================

// Common field constraints
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_COMPANY_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_CONTENT_LENGTH = 100000; // 100KB for document content
const MAX_TITLE_LENGTH = 255;
const MAX_URL_LENGTH = 2048;
const MAX_QUERY_LENGTH = 1000;
const MAX_PHONE_LENGTH = 20;

// Sanitization helpers
const sanitizeString = (str: string) => 
  str.trim().replace(/[<>]/g, ""); // Remove potential HTML injection

const sanitizeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(MAX_EMAIL_LENGTH, `Email must be less than ${MAX_EMAIL_LENGTH} characters`)
    .transform(s => s.toLowerCase()),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters"),
});

export const signupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(MAX_NAME_LENGTH, `First name must be less than ${MAX_NAME_LENGTH} characters`)
    .transform(sanitizeString),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(MAX_NAME_LENGTH, `Last name must be less than ${MAX_NAME_LENGTH} characters`)
    .transform(sanitizeString),
  company: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(MAX_COMPANY_LENGTH, `Company must be less than ${MAX_COMPANY_LENGTH} characters`)
    .transform(sanitizeString),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(MAX_EMAIL_LENGTH, `Email must be less than ${MAX_EMAIL_LENGTH} characters`)
    .transform(s => s.toLowerCase()),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters"),
});

// ============================================
// Consultation Form Schema
// ============================================

export const consultationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(MAX_NAME_LENGTH)
    .transform(sanitizeString),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(MAX_NAME_LENGTH)
    .transform(sanitizeString),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(MAX_EMAIL_LENGTH)
    .transform(s => s.toLowerCase()),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(MAX_PHONE_LENGTH)
    .regex(/^[+]?[\d\s()-]+$/, "Please enter a valid phone number"),
  company: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(MAX_COMPANY_LENGTH)
    .transform(sanitizeString),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"]),
  service: z.enum(["assessment", "brsr", "offset", "netzero", "platform", "other"]),
  message: z
    .string()
    .max(MAX_MESSAGE_LENGTH, `Message must be less than ${MAX_MESSAGE_LENGTH} characters`)
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
});

// ============================================
// RAG Chat Schema
// ============================================

export const ragChatSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Query cannot be empty")
    .max(MAX_QUERY_LENGTH, `Query must be less than ${MAX_QUERY_LENGTH} characters`)
    .transform(sanitizeString),
  conversationId: z
    .string()
    .uuid()
    .optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(MAX_MESSAGE_LENGTH),
      })
    )
    .max(50, "Too many messages in conversation")
    .optional()
    .default([]),
});

// ============================================
// RAG Embed Schema
// ============================================

export const ragEmbedSchema = z.object({
  documentId: z
    .string()
    .uuid()
    .optional(),
  content: z
    .string()
    .trim()
    .min(1, "Content cannot be empty")
    .max(MAX_CONTENT_LENGTH, `Content must be less than ${MAX_CONTENT_LENGTH} characters`),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(MAX_TITLE_LENGTH, `Title must be less than ${MAX_TITLE_LENGTH} characters`)
    .transform(sanitizeString),
  sourceType: z
    .enum(["text", "file", "url"])
    .default("text"),
  sourceUrl: z
    .string()
    .url("Invalid URL format")
    .max(MAX_URL_LENGTH)
    .optional()
    .nullable(),
});

// ============================================
// Document Manager Schemas
// ============================================

export const addTextDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(MAX_TITLE_LENGTH)
    .transform(sanitizeString),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(MAX_CONTENT_LENGTH),
});

export const addUrlDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(MAX_TITLE_LENGTH)
    .transform(sanitizeString),
  url: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(MAX_URL_LENGTH)
    .refine(
      (url) => url.startsWith("https://") || url.startsWith("http://"),
      "URL must start with http:// or https://"
    ),
});

// ============================================
// Emissions Input Schema
// ============================================

export const emissionsInputSchema = z.object({
  category: z.enum([
    "electricity",
    "fuel",
    "travel",
    "shipping",
    "waste",
    "water",
    "refrigerants",
    "other",
  ]),
  date: z.date(),
  quantity: z.number().positive("Quantity must be positive").max(1000000000),
  unit: z.string().min(1).max(50),
  source: z
    .string()
    .max(200)
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
  notes: z
    .string()
    .max(1000)
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
});

// ============================================
// Type exports
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ConsultationInput = z.infer<typeof consultationSchema>;
export type RagChatInput = z.infer<typeof ragChatSchema>;
export type RagEmbedInput = z.infer<typeof ragEmbedSchema>;
export type AddTextDocumentInput = z.infer<typeof addTextDocumentSchema>;
export type AddUrlDocumentInput = z.infer<typeof addUrlDocumentSchema>;
export type EmissionsInput = z.infer<typeof emissionsInputSchema>;
