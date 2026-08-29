## Overall flow description on surface level

### Roles
1. **Job Seeker (Customer)**
2. **Company (Company Admin)**
3. **Super Admin (Admin)**

---

## Complete Routes & Features

### 1. 🛡️ Super Admin (`/admin/*`)
#### Sidebar Routes:
- `/admin/dashboard` - Platform-wide analytics (totals of companies, jobs, users, applications, and status charts)
- `/admin/companies` - Manage all companies (register new company, view, edit, and delete)
- `/admin/users` - Manage all system users across all roles (Admin, Customer, Company Admin)
- `/admin/jobs` - Manage all job postings across the entire platform
- `/admin/applications` - Audit and review all candidate applications across all companies

#### Profile & Account Routes:
- `/admin/profile` - View admin personal details
- `/admin/edit-profile` - Edit admin profile information
- `/admin/change-password` - Update admin password

---

### 2. 🏢 Company Admin (`/company/*`)
#### Sidebar Routes:
- `/company/dashboard` - Company recruitment overview (job metrics, applicant counts, vacancies, and bar charts)
#### Company Info & Management Routes:
- `/company/company-info` - View company profile (industry, size, contact details, social links, tax/reg no.)
- `/company/edit-company` - Edit company details, contact person, location, and social links (navigated via "Edit Company" button)
- `/company/users` - Manage company portal users/staff members (Add, Edit, View, and Delete users)
- `/company/jobs` - Manage company job openings (Create, Edit, View, and Delete job vacancies)
- `/company/applications` - Review job applications, download applicant resumes, and update hiring statuses (`SHORTLISTED`, `SELECTED`, `REJECTED`, etc.)

#### Profile & Account Routes:
- `/company/profile` - View company admin personal profile
- `/company/edit-profile` - Edit company admin personal profile
- `/company/change-password` - Update company admin password

---

### 3. 👤 Customer / Job Seeker (`/customer/*`)
#### Sidebar Routes:
- `/customer/dashboard` - Overview of applied jobs, application statuses, and profile completion
- `/customer/jobs` - Browse and search available vacancies, view details, and submit job applications
- `/customer/applications` - Track status of all submitted job applications
- `/customer/documents` - Upload and manage CVs/resumes and certificates

#### Profile & Account Routes:
- `/customer/profile` - View job seeker personal profile
- `/customer/edit-profile` - Edit job seeker profile (Name, phone, age, address)
- `/customer/change-password` - Update customer password

---

### 4. 🔑 Public & Authentication Routes
- `/login` - User login with automatic role-based redirection + Company Registration modal trigger
- `/signup` - Customer / Job Seeker self-registration
- `/forgot-password` - Password recovery request
- `/reset-password` - Set new password with reset token

---

## Surface-Level Flow
1. **Registration & Onboarding**:
   - Job Seekers self-register via `/signup`.
   - Companies register via the "Register Company" modal on `/login` or through the Super Admin portal (`/admin/companies`).
2. **Authentication**:
   - All roles log in via `/login` and are automatically routed to their respective dashboard (`/customer/dashboard`, `/company/dashboard`, or `/admin/dashboard`).
3. **Recruitment Lifecycle**:
   - **Company** posts jobs on `/company/jobs`.
   - **Job Seeker** discovers and applies to jobs on `/customer/jobs` with resume and cover letter.
   - **Company** reviews applicants on `/company/applications` and updates statuses (`SHORTLISTED`, `SELECTED`, `REJECTED`).
   - **Job Seeker** monitors real-time progress on `/customer/applications`.
4. **Administration & Governance**:
   - **Super Admin** monitors all platform entities, users, companies, listings, and applications.
