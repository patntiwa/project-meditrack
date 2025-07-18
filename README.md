# MediTrack - Healthcare Management System

MediTrack is a comprehensive healthcare management system designed to streamline patient care, medical consultations, and administrative tasks in healthcare facilities.

## Features

- 🏥 **Multi-Role Support**
  - Admin: Complete system management
  - Doctors: Patient consultations and medical records
  - Nurses: Patient monitoring and vital signs tracking

- 👥 **Patient Management**
  - Patient records with complete medical history
  - Status tracking (Chronic, Acute, Completed)
  - Room assignment and monitoring
  - Demographic information and contact details

- 📊 **Medical Records**
  - Consultation history
  - Vital signs monitoring
  - Prescription management
  - Document management

- 🔍 **Advanced Search & Filtering**
  - Search by patient name
  - Filter by status
  - Role-based access control
  - Real-time updates

## Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Lucide React for icons
- React Router for navigation

### Backend
- Laravel PHP Framework
- MySQL/SQLite Database
- REST API Architecture
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js >= 16
- PHP >= 8.1
- Composer
- MySQL/SQLite

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/patntiwa/project-meditrack.git
cd project-meditrack
\`\`\`

2. Install frontend dependencies
\`\`\`bash
cd meditrack-f
npm install
\`\`\`

3. Install backend dependencies
\`\`\`bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
\`\`\`

4. Configure the database
\`\`\`bash
# Edit .env file with your database credentials
php artisan migrate
php artisan db:seed
\`\`\`

5. Start the development servers
\`\`\`bash
# Frontend
cd meditrack-f
npm run dev

# Backend
cd backend
php artisan serve
\`\`\`

## Project Structure

\`\`\`
project-meditrack/
├── meditrack-f/          # Frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React context providers
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── types/       # TypeScript type definitions
│   └── ...
├── backend/             # Laravel backend
│   ├── app/
│   │   ├── Http/        # Controllers and Middleware
│   │   └── Models/      # Eloquent models
│   ├── database/        # Migrations and seeders
│   └── routes/          # API routes
└── ...
\`\`\`

## Contributing

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Laravel](https://laravel.com/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
