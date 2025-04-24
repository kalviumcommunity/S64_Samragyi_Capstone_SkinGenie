**SkinGenie – Your Personal Skincare Assistant** 

**Overview:**  
SkinGenie is a smart skincare web app designed to personalize and simplify skincare routines, community support, and progress tracking.  

**Key Features:**  

1. **Skincare Type Quiz**  
- Question intelligent quiz  
- Evaluates skin texture, sensitivity, habits, and environment  
- Classifies into: Oily, Dry, Combination, Sensitive  
- Generates tailored skincare routines  

2. **Progressive Routine System**  
- **Beginner Stage (Weeks 1–2):** 
  - Gentle cleanser, moisturizer, sunscreen  
  - Habit-building focus  
- **Moderate Stage (Weeks 3–4):**
  - Adds toners and serums  
  - Introduces layering techniques  
- **Professional Stage (Week 5+):**  
  - Advanced actives like retinoids and exfoliants  
  - Personalized for concerns like acne or aging  

3. **Product Intelligence Hub**  
- **Trending Products:** 
  - Popular picks with user reviews  
  - Filter by skin type, ingredients, and price  
- *Ingredient Scanner:*  
  - Analyze product ingredients for skin compatibility  

4. **Routine Tracking & Analytics** 
- Visual dashboard for tracking routine consistency  
- Rate product performance  
- Upload skin progress photos  
- Smart AM/PM routine reminders  

5. **Skincare Community**
- Expert-moderated forums  
- Peer support, Q&A, and shared experiences  


**Development Roadmap** 

**Week 1: Project Setup & Design**

**Objectives:  Establish project foundation and create design prototypes**
Tasks 
- Day 1: Create low-fidelity wireframes for all screens (quiz, dashboard, tracker) using Figma  
- Day 2: Convert wireframes to high-fidelity designs with Tailwind CSS styling  
- Day 3: Set up GitHub repository with README file describing project  
- Day 4: Initialize React application using Vite  
- Day 5: Create GitHub Projects board with Todo/In Progress/Done columns  
- Day 6: Add initial project issues (e.g., "Implement auth UI")  
- Day 7: Deploy empty frontend to Vercel for testing  
**Concepts Covered: Low-fidelity design, High-fidelity design, GitHub setup** 


**Week 2: Backend Development** 

**Objectives : Build core API functionality and database**
Tasks  
- Day 1: Deploy Node.js/Express server to Render  
- Day 2: Design MongoDB schemas (Users, Routines, Products)  
- Day 3: Implement GET /api/routines endpoint  
- Day 4: Create POST /api/quiz endpoint for skin analysis  
- Day 5: Set up database connection with Mongoose  
- Day 6: Seed database with sample skincare products  
- Day 7: Document APIs using Bruno/Postman  
**Concepts Covered : Deployed backend, Database schema, GET API, POST API**


**Week 3: Frontend Implementation**  

**Objectives: Develop user interfaces and connect to backend** 
Tasks  
- Day 1: Build quiz component with 10-question form  
- Day 2: Create routine dashboard with progress tracker  
- Day 3: Implement user authentication (JWT)  
- Day 4: Develop protected routes for logged-in users  
- Day 5: Connect frontend components to backend APIs  
- Day 6: Ensure UI matches Figma designs  
- Day 7: Deploy updated frontend to Vercel  
**Concepts Covered: Deployed frontend, React components, Authentication, JWTs**  

**Week 4: Advanced Features & Testing**

**Objectives: Complete remaining features and finalize project** 
Tasks  
- Day 1: Implement PUT /api/users/streak endpoint  
- Day 2: Add image upload for product reviews  
- Day 3: Create edit/delete functionality for routines  
- Day 4: Establish database relationships (user↔routines)  
- Day 5: Perform cross-browser testing  
- Day 6: Optimize performance metrics  
- Day 7: Add final GitHub Project logs (10+ entries)  
**Concepts Covered: PUT API, File uploads, Database relationships, Update/delete**

**BACKEND Deployment link (via Render)**: https://s64-samragyi-capstone-skingenie.onrender.com
**FRONTEND Deployment link (via Netlify)**: https://coruscating-crostata-b02083.netlify.app/