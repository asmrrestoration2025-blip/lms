# Product Specification

## Product

A global LMS marketplace where students learn, instructors publish courses,
admins operate the platform, and superadmins control administrative access.

The product must have original branding and UI.

## Roles

### Student
- register/login/logout
- verify email
- browse/search courses
- enroll/purchase
- access course player
- track progress
- take quizzes
- download resources
- earn certificates
- review courses
- manage wishlist
- manage profile/settings
- receive notifications

### Instructor
- instructor profile
- create/edit courses
- sections and lessons
- video/resources
- pricing
- submit courses for review
- publish after approval
- student analytics
- revenue/earnings
- reviews
- payout workflow

### Admin
- role-specific dashboard
- user management according to permissions
- course moderation
- category management
- review moderation
- payment/refund visibility
- platform reports
- audit visibility according to permissions

### Superadmin
- everything admins can do
- create admins
- edit admin permissions
- disable/reactivate admins
- platform settings
- full audit logs
- full platform administration

## Authentication pages

Required public pages:

- /login
- /register
- /forgot-password
- /reset-password
- /verify-email

Protected account pages:

- /dashboard
- /dashboard/profile
- /dashboard/settings
- /dashboard/notifications

Role dashboards:

- /dashboard/student
- /dashboard/instructor
- /dashboard/admin
- /dashboard/superadmin

Role-aware middleware/guards should redirect users to the correct dashboard.

## Course marketplace

- homepage
- marketplace
- categories
- search
- course detail
- instructor detail
- wishlist
- reviews

## Learning

- course player
- lesson navigation
- video
- progress
- resume position
- quizzes
- assignments architecture
- resources
- completion
- certificates

## Administration

- users
- instructors
- courses
- categories
- reviews
- payments
- refunds
- payouts
- analytics
- audit logs
- settings

## Superadmin administration

- admin list
- create admin
- edit admin
- disable/reactivate admin
- permissions
- admin activity
- audit log

## Notifications

Support in-app notifications and architecture for email/push.

## Search

Search/filter/sort courses by:

- keyword
- category
- level
- language
- price
- rating
- duration
- instructor

## Payments

Architect for:

- one-time purchases
- coupons
- discounts
- refunds
- taxes
- instructor revenue
- payouts

Payment provider must be abstracted.

## Internationalization readiness

Prepare for:

- multiple languages
- multiple currencies
- timezones
- localized dates/numbers

## Accessibility

Target WCAG 2.2 AA.
