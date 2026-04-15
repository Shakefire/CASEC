/**
 * CASEC Branded Email Templates
 * Professional, modern HTML templates for all platform notifications.
 */

const LOGO_URL = "https://ecycsdphxwcyuebrwgki.supabase.co/storage/v1/object/public/CV/casec-logo-dark.png"; // Placeholder
const BRAND_COLOR = "#097969";
const BG_COLOR = "#f8fafc";
const TEXT_COLOR = "#1e293b";

/**
 * Base Wrapper for all emails
 */
function emailWrapper(content: string, previewText: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CASEC Notification</title>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${BG_COLOR}; color: ${TEXT_COLOR}; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
          .header { padding: 40px; text-align: center; background: #ffffff; }
          .logo { height: 48px; margin-bottom: 24px; }
          .content { padding: 40px; padding-top: 0; line-height: 1.6; }
          .footer { padding: 40px; background: #f1f5f9; text-align: center; font-size: 12px; color: #64748b; }
          .button { display: inline-block; padding: 14px 32px; background-color: ${BRAND_COLOR}; color: #ffffff !important; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 24px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 24px 0; }
          .highlight { color: ${BRAND_COLOR}; font-weight: bold; }
          h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 0; }
          p { margin-bottom: 16px; font-size: 15px; }
        </style>
      </head>
      <body>
        <div style="display: none; visibility: hidden; opacity: 0; font-size: 1px;">${previewText}</div>
        <div class="container">
          <div class="header">
            <h2 style="color: ${BRAND_COLOR}; margin: 0; font-weight: 900; letter-spacing: -1px; font-size: 28px;">CASEC</h2>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p style="margin: 0; font-weight: bold; color: #334155;">CASEC Career Portal</p>
            <p style="margin: 4px 0;">University, Nigeria</p>
            <p style="margin: 20px 0 0 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="color: ${BRAND_COLOR}; text-decoration: none;">Support</a> &bull; 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: ${BRAND_COLOR}; text-decoration: none;">Website</a>
            </p>
            <p style="margin-top: 24px; font-size: 11px;">You are receiving this email because you have an active account on the CASEC portal.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export const templates = {
  /**
   * 1. Welcome Emails
   */
  welcome: (name: string, role: string) => {
    const isEmployer = role === 'employer';
    return emailWrapper(`
      <h1>Welcome to CASEC, ${name}!</h1>
      <p>We are thrilled to have you join Nigeria's premium university career portal.</p>
      <div class="card">
        <p><strong>Account Type:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
        <p>Your account has been successfully created. ${isEmployer ? 'You can now start listing opportunities for our talented students.' : 'You can now start applying for premium jobs and internships.'}</p>
      </div>
      <p>Click the button below to access your dashboard and complete your professional profile.</p>
      <center><a href="${process.env.NEXT_PUBLIC_APP_URL}/${role}" class="button">Go to Dashboard</a></center>
    `, "Welcome to CASEC Career Portal!");
  },

  /**
   * 2. Job Application Flows
   */
  applicationSubmitted: (studentName: string, jobTitle: string, employerName: string) => {
    return emailWrapper(`
      <h1>Application Submitted!</h1>
      <p>Hello ${studentName}, your application for <span class="highlight">${jobTitle}</span> has been successfully sent to <span class="highlight">${employerName}</span>.</p>
      <div class="card">
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${employerName}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p>The employer will review your profile and documents. You will receive an update here once there is a change in your status.</p>
      <center><a href="${process.env.NEXT_PUBLIC_APP_URL}/student/applications" class="button">Track Application</a></center>
    `, `Status Update: Applied for ${jobTitle}`);
  },

  applicationReceived: (employerName: string, studentName: string, jobTitle: string) => {
    return emailWrapper(`
      <h1>New Application Received!</h1>
      <p>Hello ${employerName}, you have a new candidate for your <span class="highlight">${jobTitle}</span> posting.</p>
      <div class="card">
        <p><strong>Candidate:</strong> ${studentName}</p>
        <p><strong>Applied for:</strong> ${jobTitle}</p>
      </div>
      <p>Visit your applications dashboard to review their CV, academic qualifications, and custom answers.</p>
      <center><a href="${process.env.NEXT_PUBLIC_APP_URL}/employer/applications" class="button">Review Candidate</a></center>
    `, `New Talent: ${studentName} applied for ${jobTitle}`);
  },

  /**
   * 3. Appointment / Counseling
   */
  appointmentUpdate: (name: string, purpose: string, date: string, time: string, status: string, notes?: string) => {
    const statusColors: any = { approved: '#10b981', rejected: '#ef4444', pending: '#f59e0b' };
    return emailWrapper(`
      <h1>Appointment Status: <span style="color: ${statusColors[status] || BRAND_COLOR}">${status.toUpperCase()}</span></h1>
      <p>Hello ${name}, your career services appointment has been updated.</p>
      <div class="card">
        <p><strong>Purpose:</strong> ${purpose}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        ${notes ? `<p><strong>Admin Note:</strong> ${notes}</p>` : ''}
      </div>
      ${status === 'approved' ? '<p>Please ensure you are available at the scheduled time. Link or location details can be found on your dashboard.</p>' : ''}
      <center><a href="${process.env.NEXT_PUBLIC_APP_URL}/student/appointments" class="button">View Appointment</a></center>
    `, `Update: Your appointment for ${purpose} is ${status}`);
  },

  /**
   * 4. Employer Specific
   */
  employerStatus: (employerName: string, status: 'approved' | 'rejected', reason?: string) => {
    const isApproved = status === 'approved';
    return emailWrapper(`
      <h1>Verification Status: <span style="color: ${isApproved ? '#10b981' : '#ef4444'}">${status.toUpperCase()}</span></h1>
      <p>Hello ${employerName}, your CASEC employer account verification is complete.</p>
      <div class="card">
        ${isApproved 
          ? `<p>Congratulations! Your account has been <span class="highlight">approved</span>. You can now post jobs and internships to reach our student body.</p>`
          : `<p>Unfortunately, your account could not be approved at this time.</p>
             ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}`
        }
      </div>
      ${isApproved ? `<center><a href="${process.env.NEXT_PUBLIC_APP_URL}/employer" class="button">Post Your First Job</a></center>` : ''}
    `, `Your CASEC Account Status: ${status}`);
  },

  /**
   * 5. Admin Alerts
   */
  adminAlert: (title: string, message: string, actionUrl?: string) => {
    return emailWrapper(`
      <h1>System Alert</h1>
      <div class="card">
        <p style="font-weight: bold; color: #097969;">${title}</p>
        <p>${message}</p>
      </div>
      ${actionUrl ? `<center><a href="${process.env.NEXT_PUBLIC_APP_URL}${actionUrl}" class="button">Take Action</a></center>` : ''}
    `, `Admin Notification: ${title}`);
  },

  /**
   * 6. RUN-LAS (Research & Laboratory Academic Submission)
   */
  runlasSubmission: (studentName: string, organization: string) => {
    return emailWrapper(`
      <h1>New RUN-LAS Submission</h1>
      <p>A student has submitted a new Research and Laboratory/Academic Submission (RUN-LAS) form for review.</p>
      <div class="card">
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Organization:</strong> ${organization}</p>
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p>Please log in to the admin dashboard to review the details and approve the placement.</p>
      <center><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/runlas" class="button">Review Submission</a></center>
    `, `New RUN-LAS Form from ${studentName}`);
  },

  runlasUpdate: (studentName: string, orgName: string, status: string, remarks?: string) => {
    const isApproved = status === 'approved';
    return emailWrapper(`
      <h1>RUN-LAS Status: <span style="color: ${isApproved ? '#10b981' : '#ef4444'}">${status.toUpperCase()}</span></h1>
      <p>Hello ${studentName}, your RUN-LAS submission for <span class="highlight">${orgName}</span> has been processed.</p>
      <div class="card">
        <p><strong>Organization:</strong> ${orgName}</p>
        <p><strong>Current Status:</strong> ${status.toUpperCase()}</p>
        ${remarks ? `<p><strong>Admin Remarks:</strong> ${remarks}</p>` : ''}
      </div>
      ${isApproved 
        ? `<p>Your placement has been officially <span class="highlight">approved</span>. You can now proceed with your documentation as required.</p>`
        : `<p>Your submission was not approved. Please review the remarks and resubmit if necessary.</p>`
      }
      <center><a href="${process.env.NEXT_PUBLIC_APP_URL}/student/runlas" class="button">View My Submissions</a></center>
    `, `RUN-LAS Update: Your submission for ${orgName} is ${status}`);
  }
};
