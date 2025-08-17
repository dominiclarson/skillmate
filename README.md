# SkillMate

A platform for exchanging skills between learners and instructors.   Users can set up an account, list the skills they can teach, browse and search for skills offered by others, and communicate to schedule sessions.

## Features

- **User Authentication**: Sign up, log in.
- **Featured Skills**: Browse highlighted skills on the Featured Skills page.
- **In-App Messaging**: Chat with connections.
- **Responsive UI**: Mobile-friendly layouts with light/dark mode support.
- **Profile Management**: View and edit your user profile, including your listed skills.

## Tech Stack

- **Next.js** (React) for front-end and API routes
- **React** with Hooks for state management
- **MySQL** for data persistence
- **Socket.io** for real-time chat
- **Lucide Icons** for UI icons
- **Tailwind CSS** for styling
- **Shadcn.ui** also used for Styling

## Installation

1. **Clone the repository**

   git clone https://github.com/your-username/skillmate.git
   cd skillmate-app
 

2. **Install dependencies**

   # npm install

3. **Set up environment**

   - Copy `.env.example` to `.env`
   - Fill in your MySQL connection details 


## Running the App

- **Development**

  Open [http://localhost:3000](http://localhost:3000) in your browser.


## Usage

1. **Sign Up / Log In**: Create an account or log in with existing credentials.
2. **Browse Skills**: Use the search bar or navigate the grid to find skills.
3. **View Details**: Click on a skill to see details in the Skill Overview panel.
4. **Connect & Chat**: After authentication, chat in real time.

---

## Release Notes

The following features are currently implemented and working:

- **Authentication**: Sign up, log in, logout, and session persistence 
- **Skill CRUD**: Listing all skills, searching by name, and displaying details.
- **Featured Skills Page**: Dynamic filtering and selection of skills.
- **SkillOverview Component**: Displays selected skill’s description and details.
- **Database Integration**: MySQL connection pooling and migrations.
- **Responsive Design**: Grid layouts adjust from mobile to desktop, light/dark mode support.
- **Lesson Scheduling**: Users can schedule sessions with other users that have skills marked to teach.
- **Profile data**: This includes Name, Email, skills I have, interested skills I want to learn.
- **Notifications**: This includes session scheduling, and friend requests.
- **New Skill Option**: Allows the user to submit new skill ideas
- **Location matching**: Matches user locations based on browser location or zip code
- **Unit Testing**: Unit and system testing
