# Sistema de Controle de Horas Trabalhadas

## Overview

This is a Brazilian Portuguese time tracking system for managing weekly work hours and earnings. The application is a full-stack web application built with vanilla JavaScript frontend, Node.js backend, and PostgreSQL database, utilizing Bootstrap for styling. It automatically generates weekly timesheets for Monday through Friday, allowing users to track full days and half days worked, with automatic calculation of weekly earnings. The system features comprehensive data export capabilities with multiple format options (JSON, CSV, HTML, TXT), database persistence, and enhanced user interface with modal dialogs for better user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and vanilla JavaScript
- **UI Framework**: Bootstrap 5.1.3 for responsive design and components
- **Icons**: Font Awesome 6.0.0 for visual elements
- **Language**: Portuguese (Brazil) localization
- **Export Libraries**: jsPDF and html2canvas for PDF/PNG generation

### Backend Architecture
- **Server**: Node.js with Express.js framework
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM for database operations
- **API**: RESTful API endpoints for data persistence
- **Authentication**: Simple default user system (extensible)

### Client-Side Architecture
- **Single Page Application (SPA)**: All functionality contained in one HTML page
- **Class-Based JavaScript**: Object-oriented approach with `TimesheetManager` class
- **Data Persistence**: Database API with localStorage fallback
- **Responsive Design**: Mobile-first approach using Bootstrap grid system
- **Auto-Update System**: Automatic week detection and refresh functionality

## Key Components

### TimesheetManager Class
- **Purpose**: Central controller for all timesheet operations
- **Key Features**:
  - Automatic week generation (Monday to Sunday - 7 days)
  - Date formatting in Brazilian format (dd/mm/yyyy)
  - Currency formatting in Brazilian Real (R$)
  - Database persistence with localStorage fallback
  - Dynamic DOM manipulation for table generation
  - Multi-format data export (JSON, CSV, HTML, TXT, PDF, PNG)
  - Bootstrap modal dialogs for export options
  - Success notifications with auto-dismiss functionality
  - Automatic week detection and refresh every Monday
  - Month detection and week numbering system
  - Professional document templates with company logo

### User Interface Components
- **Weekly Timesheet Table**: Dynamic table showing work days with checkboxes for full/half day selection
- **Date Management**: Automatic calculation of current week dates
- **Value Calculation**: Real-time calculation of daily and weekly earnings
- **Visual Feedback**: Bootstrap styling with hover effects and responsive design

## Data Flow

1. **Initialization**: Application loads and generates current week dates
2. **Table Generation**: Dynamic creation of timesheet rows for Monday-Friday
3. **User Interaction**: Checkboxes for marking full days (R$ 50.00) or half days (R$ 25.00)
4. **Real-time Calculation**: Automatic updates of daily and weekly totals
5. **Data Persistence**: API calls to save entries and summaries to PostgreSQL database
6. **Data Restoration**: Saved data loaded from database on page refresh with localStorage fallback

## External Dependencies

### CDN Resources
- **Bootstrap 5.1.3**: UI framework and responsive grid system
- **Font Awesome 6.0.0**: Icon library for visual elements

### Browser APIs
- **Local Storage API**: For persisting user data across sessions
- **Date API**: For date manipulation and formatting
- **DOM API**: For dynamic content generation and event handling

## Deployment Strategy

### Static Hosting
- **Architecture**: Client-side only application
- **Requirements**: Any static web hosting service (GitHub Pages, Netlify, Vercel, etc.)
- **Files**: Three main files (index.html, script.js, styles.css)
- **Dependencies**: All external resources loaded via CDN

### Browser Compatibility
- **Modern Browsers**: Supports all modern browsers with ES6+ support
- **Mobile Responsive**: Bootstrap ensures cross-device compatibility
- **Offline Capability**: Basic functionality works offline after initial load

### Configuration
- **Fixed Values**: Daily rates are hardcoded (R$ 50.00 full day, R$ 25.00 half day)
- **Localization**: Portuguese (Brazil) language and currency formatting
- **Week Structure**: Fixed Monday-Friday work week structure

## Technical Considerations

### Data Management
- **No Backend**: All data stored locally in browser
- **Data Format**: JSON serialization for local storage
- **Data Validation**: Client-side validation for checkbox states

### Performance
- **Lightweight**: Minimal JavaScript footprint
- **CDN Dependencies**: External resources cached by browsers
- **DOM Efficiency**: Minimal DOM manipulation for optimal performance

### Security
- **Client-Side Only**: No server-side vulnerabilities
- **Local Data**: User data never leaves the browser
- **XSS Protection**: Basic HTML escaping for dynamic content