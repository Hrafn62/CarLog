# **App Name**: CarLog PWA

## Core Features:

- Google Sign-In: Implements authentication using Firebase Auth with Google Sign-In.
- Dashboard Summary: Displays a summary of total maintenance costs and the latest recorded mileage.
- Maintenance Log: Maintains a list of maintenance interventions with details such as date, label, mileage, price, and garage; all stored in Firestore.
- Invoice Management: Allows users to upload and store invoice images using Firebase Storage, linked to maintenance records in Firestore.
- Quick Entry Form: Provides a form for quickly adding new maintenance interventions.
- PWA Installation: Generates manifest.json and service worker for PWA installation on mobile devices.

## Style Guidelines:

- Primary color: Deep sky blue (#00BFFF) for a clean and modern look, resonating with reliability and technology, while avoiding direct replication of Odoo's branding.
- Background color: Very light blue (#F0F8FF), almost white, to ensure readability and a clean interface.
- Accent color: Light steel blue (#B0C4DE), offering a subtle contrast and highlighting interactive elements without being distracting.
- Body and headline font: 'Inter', sans-serif, provides a modern and neutral look suitable for both headlines and body text.
- Utilize Tailwind CSS for a responsive and clean layout, optimized for both desktop and mobile views.
- Employ simple and recognizable icons from a library like FontAwesome or Material Icons to represent maintenance actions and categories.
- Incorporate subtle transitions and animations (e.g., fade-in effects, loading spinners) to enhance user experience without overwhelming the interface.