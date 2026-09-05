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
- `/admin/jobs` - Manage all job postings across the entire platform (with category, status, and search filters)
- `/admin/applications` - Audit and review all candidate applications across all companies
- `/admin/categories` - Manage platform job categories (create via pop-up modal, edit, and delete)

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

---

## Database Architecture, Entities & Relationships

> **Note:** Most backend persistent entities extend `BaseEntity`, which includes audit and soft-delete columns:
> `created_date`, `created_by`, `updated_date`, `updated_by`, `is_deleted`, `is_active`, and `remarks`.

### 1. `users`
- **Primary Key:** `id` (Long, Auto-increment)
- **Columns:** `first_Name`, `middle_Name`, `last_Name`, `full_Name`, `age`, `address`, `email` (Unique), `phone_Number` (Unique), `password`, `user_type`, `system_code` (Binds user to a company code for Company Admins), + `BaseEntity` fields.
- **Relations:**
  - **1 to Many** with `user_role` (`users.id` -> `user_role.user_id`)
  - **1 to Many** with `profile_pictures` (`users.id` -> `profile_pictures.user_id`)
  - **1 to Many** with `job_application` (`users.id` -> `job_application.applicant_id`)
  - **1 to Many** with `refresh_token`, `password_reset`, `otp`, and `document` (via `association_id`)
  - **Logical Link** with `company` (`users.system_code` = `company.company_code`)

### 2. `roles`
- **Primary Key:** `id` (Long, Auto-increment)
- **Columns:** `name` (Unique string: e.g., `ROLE_ADMIN`, `ROLE_COMPANY`, `ROLE_CUSTOMER`), + `BaseEntity` fields.
- **Relations:** **1 to Many** with `user_role` (`roles.id` -> `user_role.role_id`).

### 3. `user_role`
- **Primary Key:** `id` (Long, Auto-increment)
- **Columns:** `user_id` (FK -> `users.id`), `role_id` (FK -> `roles.id`), + `BaseEntity` fields.
- **Relations:** Junction table creating a **Many-to-Many** mapping between `users` and `roles`.

### 4. `company`
- **Primary Key:** `id` (Long, Auto-increment)
- **Columns:** `company_code` (Unique, length 10, system generated), `company_name`, `email_id` (Unique), `phone_number`, `website`, `industry_type`, `company_type`, `registration_number`, `tax_number`, `company_size`, `employee_count`, `founded_year`, `contact_person_name`, `contact_person_designation`, `address`, `city`, `state`, `country`, `postal_code`, `logo`, `description`, `linkedin_url`, `facebook_url`, `twitter_url`, + `BaseEntity` fields.
- **Relations:**
  - **1 to Many** with `job` (`company.company_code` -> `job.company_code`)
  - **1 to Many** with `job_application` (`company.company_code` -> `job_application.company_code`)
  - **1 to Many** with company staff `users` (`company.company_code` -> `users.system_code`)

### 5. `job`
- **Primary Key:** `Id` (Long, Auto-increment)
- **Columns:** `title`, `description` (TEXT), `company_name`, `location`, `job_type` (Enum: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `REMOTE`), `category`, `experience_required`, `qualification`, `skills_required`, `min_salary`, `max_salary`, `vacancy_count`, `posted_date`, `expiry_date`, `status` (Enum: `OPEN`, `CLOSED`, `EXPIRED`), `company_code` (Link -> `company.company_code`), + `BaseEntity` fields.
- **Relations:**
  - **Many to 1** with `company` (`job.company_code` -> `company.company_code`)
  - **1 to Many** with `job_application` (`job.Id` -> `job_application.job_id`)

### 6. `job_application`
- **Primary Key:** `Id` (Long, Auto-increment)
- **Columns:** `job_id` (FK -> `job.Id`), `applicant_id` (FK -> `users.id`), `applicant_name`, `applicant_email`, `applicant_phone`, `resume_file_name`, `cover_letter` (TEXT), `status` (Enum: `APPLIED`, `SHORTLISTED`, `SELECTED`, `REJECTED`), `company_code` (Link -> `company.company_code`), + `BaseEntity` fields.
- **Relations:**
  - **Many to 1** with `job` (`job_application.job_id` -> `job.Id`)
  - **Many to 1** with `users` (`job_application.applicant_id` -> `users.id`)
  - **Many to 1** with `company` (`job_application.company_code` -> `company.company_code`)

### 7. `document`
- **Primary Key:** `id` (Long, Auto-increment)
- **Columns:** `uuid` (Unique), `file_Name`, `file_Type`, `mime_type`, `extension`, `size_bytes`, `size_readable`, `original_file_name`, `association_to` (e.g., `user`), `association_id` (User ID string), `association_type` (e.g., `resume`, `certificate`), `description`, `file_Data`, `file_Path`, + `BaseEntity` fields.
- **Relations:** Polymorphic reference linking files to a `user` via `association_to` and `association_id`.

### 8. `profile_pictures`
- **Primary Key:** `id` (Long, Auto-increment)
- **Columns:** `file_name`, `file_path`, `is_current`, `user_id` (FK -> `users.id`), + `BaseEntity` fields.
- **Relations:** **Many to 1** with `users` (`profile_pictures.user_id` -> `users.id`).

### 9. `message_notification`
- **Primary Key:** `id` (Long, Auto-increment)
- **Columns:** `username`, `title`, `message`, `action` (Enum), `status` (Enum: `UNREAD`, `READ`), `reference_id`, `metadata`, `read_date`, + `BaseEntity` fields.

### 10. `otp`
- **Primary Key:** `id` (Long, Auto-increment)
- **Columns:** `user_id` (FK -> `users.id`), `contact`, `otp_hash`, `purpose` (Enum), `channel` (Enum), `status` (Enum: `PENDING`, `VERIFIED`, `EXPIRED`, `LOCKED`, `INVALIDATED`), `reference_id`, `expires_at`, `used`, `used_at`, `attempt_count`, `max_attempts`, `locked_at`, `resend_count`, `max_resend_count`, `next_resend_allowed_at`, `ip_address`, `device_info`, audit fields.

### 11. `password_reset`
- **Primary Key:** `id` (Long, Auto-increment)
- **Columns:** `uuid`, `user_id` (FK -> `users.id`), `new_Password`, `token` (Unique), `token_expiration_time`, `request_time`, `request_ip_address`, `reset_time`, `reset_ip_address`, `reset_method`, `reset_source`, `additional_info`, `status`, + `BaseEntity` fields.

### 12. `refresh_token`
- **Primary Key:** `id` (Long, Auto-increment)
- **Columns:** `user_id` (FK -> `users.id`), `token_hash` (Unique), `expires_at`, `revoked`, audit fields.
