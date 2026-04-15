import { Resend } from "resend";
import { templates } from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");
const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

/**
 * Core Dynamic Email Service for CASEC
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ skipping email: RESEND_API_KEY not set");
      return { success: false, error: "API Key missing" };
    }

    const { data, error } = await resend.emails.send({
      from: `CASEC <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("❌ SendEmail crash:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Reusable CASEC Notification Functions
 */
export const mailer = {
  // Authentication
  sendWelcome: async (to: string, name: string, role: string) => {
    return sendEmail({
      to,
      subject: `Welcome to CASEC, ${name}!`,
      html: templates.welcome(name, role)
    });
  },

  // Job Applications
  sendApplicationSubmitted: async (to: string, studentName: string, jobTitle: string, employerName: string) => {
    return sendEmail({
      to,
      subject: `Confirmation: Application sent for ${jobTitle}`,
      html: templates.applicationSubmitted(studentName, jobTitle, employerName)
    });
  },

  sendApplicationReceived: async (to: string, employerName: string, studentName: string, jobTitle: string) => {
    return sendEmail({
      to,
      subject: `New Candidate: ${studentName} applied for ${jobTitle}`,
      html: templates.applicationReceived(employerName, studentName, jobTitle)
    });
  },

  // Appointments
  sendAppointmentUpdate: async (to: string, name: string, purpose: string, date: string, time: string, status: string, notes?: string) => {
    return sendEmail({
      to,
      subject: `Appointment Update: ${purpose}`,
      html: templates.appointmentUpdate(name, purpose, date, time, status, notes)
    });
  },

  // Employers
  sendEmployerStatus: async (to: string, employerName: string, status: 'approved' | 'rejected', reason?: string) => {
    return sendEmail({
      to,
      subject: `Account Status Update: ${status.toUpperCase()}`,
      html: templates.employerStatus(employerName, status, reason)
    });
  },

  // Admin Oversight
  sendAdminAlert: async (title: string, message: string, actionUrl?: string) => {
    const adminEmail = process.env.EMAIL_ADMIN || "admin@utrust.com.ng";
    return sendEmail({
      to: adminEmail,
      subject: `[ADMIN ALERT] ${title}`,
      html: templates.adminAlert(title, message, actionUrl)
    });
  },

  // RUN-LAS
  sendRunlasSubmission: async (studentName: string, organization: string) => {
    const adminEmail = process.env.EMAIL_ADMIN || "admin@utrust.com.ng";
    return sendEmail({
      to: adminEmail,
      subject: `New RUN-LAS Submission: ${studentName}`,
      html: (templates as any).runlasSubmission(studentName, organization)
    });
  },

  sendRunlasUpdate: async (to: string, studentName: string, orgName: string, status: string, remarks?: string) => {
    return sendEmail({
      to,
      subject: `RUN-LAS Update: ${status.toUpperCase()} - ${orgName}`,
      html: (templates as any).runlasUpdate(studentName, orgName, status, remarks)
    });
  }
};
