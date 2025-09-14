> *This document serves as a template for you to write **setup** instructions for your project.* 

> Depending on the scale/complexity of your project, it may prove beneficial to have a **Python/Batch/Bash** script in the `scripts/` directory which *automatically sets-up* the project.

# Setup Instructions

Follow the steps below to set up and run the project. (Example)

---
## 📦 Requirements
- Node.js v18+
- React.js
- Typescript
- Tailwind CSS
- Supabase account

## ⚙️ Installation
1. Clone the repository
    git clone https://github.com/JordanMuller039/SomeRandomPeople.git
2. Navigate to the project directory
    cd SomeRandomPeople
3. Install dependencies
    npm install
4. Set up environment variables
    Create a .env file in the root directory with your Supabase credentials:
    NEXT_PUBLIC_SUPABASE_URL="https://tcrsskukuuhetrnbrrff.supabase.co" 
    NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnNza3VrdXVoZXRybmJycmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NjkxMTksImV4cCI6MjA3MzM0NTExOX0.gfe6H7MVOwqBZgTAsUkFiaqFGtQnaTV-RE2KxwS_Hnk" 
5. Start the development server
    npm run dev
