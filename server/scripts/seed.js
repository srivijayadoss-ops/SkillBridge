import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import argon2 from 'argon2';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import RecruiterProfile from '../models/RecruiterProfile.js';
import Opportunity from '../models/Opportunity.js';
import Challenge from '../models/Challenge.js';
import config from '../config/index.js';

const MONGO_URI = config.mongoUri;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 });
    console.log('Connected to MongoDB for seeding.');

    // Demo Student
    const studentPass = await argon2.hash(config.demoStudentPassword, {
      type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4
    });

    let demoStudent = await User.findOne({ email: 'student@demo.skillswap.dev' });
    if (!demoStudent) {
      demoStudent = await User.create({
        name: 'Alex Johnson',
        email: 'student@demo.skillswap.dev',
        passwordHash: studentPass,
        role: 'student',
        isDemo: true
      });
      console.log('Demo student created.');
    }

    let studentProfile = await StudentProfile.findOne({ user: demoStudent._id });
    if (!studentProfile) {
      studentProfile = await StudentProfile.create({
        user: demoStudent._id,
        headline: 'Full-Stack Developer | CS Student',
        bio: 'Passionate about building web applications and learning new technologies. Currently pursuing a degree in Computer Science with hands-on experience in React, Node.js, and Python.',
        location: 'Bangalore, India',
        university: 'Indian Institute of Technology',
        degree: 'B.Tech Computer Science',
        graduationYear: 2025,
        skills: [
          { name: 'JavaScript', category: 'Programming', proficiency: 'advanced', evidenceType: 'project-backed', evidenceLinks: ['https://github.com/demo'] },
          { name: 'React', category: 'Frontend', proficiency: 'advanced', evidenceType: 'project-backed' },
          { name: 'Node.js', category: 'Backend', proficiency: 'intermediate', evidenceType: 'self-declared' },
          { name: 'Python', category: 'Programming', proficiency: 'intermediate', evidenceType: 'challenge-verified' },
          { name: 'MongoDB', category: 'Database', proficiency: 'intermediate', evidenceType: 'self-declared' },
          { name: 'CSS', category: 'Frontend', proficiency: 'advanced', evidenceType: 'project-backed' },
          { name: 'Git', category: 'Tools', proficiency: 'intermediate', evidenceType: 'self-declared' },
          { name: 'TypeScript', category: 'Programming', proficiency: 'beginner', evidenceType: 'self-declared' }
        ],
        projects: [
          {
            title: 'E-Commerce Dashboard',
            description: 'A responsive admin dashboard built with React and Node.js for managing product inventory and orders.',
            url: 'https://github.com/demo/ecommerce-dashboard',
            skills: ['React', 'Node.js', 'MongoDB', 'CSS'],
            role: 'Full-Stack Developer'
          },
          {
            title: 'Weather Forecast App',
            description: 'A PWA that displays weather forecasts using OpenWeatherMap API with offline support.',
            url: 'https://github.com/demo/weather-app',
            skills: ['JavaScript', 'CSS', 'PWA'],
            role: 'Developer'
          }
        ],
        interests: ['Web Development', 'Machine Learning', 'Open Source'],
        preferredWorkMode: 'remote',
        preferredLocations: ['Bangalore', 'Remote'],
        experienceYears: 1,
        profileCompletion: 90
      });
      console.log('Demo student profile created.');
    }

    // Demo Recruiter
    const recruiterPass = await argon2.hash(config.demoRecruiterPassword, {
      type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4
    });

    let demoRecruiter = await User.findOne({ email: 'recruiter@demo.skillswap.dev' });
    if (!demoRecruiter) {
      demoRecruiter = await User.create({
        name: 'Priya Sharma',
        email: 'recruiter@demo.skillswap.dev',
        passwordHash: recruiterPass,
        role: 'recruiter',
        isDemo: true
      });
      console.log('Demo recruiter created.');
    }

    let recruiterProfile = await RecruiterProfile.findOne({ user: demoRecruiter._id });
    if (!recruiterProfile) {
      recruiterProfile = await RecruiterProfile.create({
        user: demoRecruiter._id,
        companyName: 'TechStart Solutions',
        companyWebsite: 'https://techstart.demo',
        industry: 'Technology',
        companySize: '11-50',
        location: 'Bangalore, India',
        description: 'An innovative startup building next-generation SaaS products for small businesses.'
      });
      console.log('Demo recruiter profile created.');
    }

    // Sample Opportunities
    const existingOpp = await Opportunity.findOne({ recruiter: demoRecruiter._id });
    if (!existingOpp) {
      const opportunities = [
        {
          recruiter: demoRecruiter._id,
          title: 'Frontend Developer Intern',
          description: 'Join our team to build responsive web interfaces using React and modern CSS. You will work on real projects, participate in code reviews, and collaborate with experienced developers.',
          type: 'internship',
          category: 'Engineering',
          requiredSkills: [
            { name: 'React', importance: 'required', minProficiency: 'intermediate' },
            { name: 'JavaScript', importance: 'required', minProficiency: 'intermediate' },
            { name: 'CSS', importance: 'required', minProficiency: 'intermediate' },
            { name: 'TypeScript', importance: 'preferred', minProficiency: 'beginner' },
            { name: 'Git', importance: 'preferred', minProficiency: 'beginner' }
          ],
          experienceRequired: { min: 0, max: 2 },
          location: 'Bangalore, India',
          workMode: 'hybrid',
          compensation: { type: 'stipend', amount: '₹15,000/month', currency: 'INR' },
          eligibility: 'Currently enrolled in a CS or related degree program. Must be available for at least 3 months.',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'open',
          companyName: 'TechStart Solutions'
        },
        {
          recruiter: demoRecruiter._id,
          title: 'Full-Stack Developer',
          description: 'We are looking for a full-stack developer to help build and maintain our SaaS platform. Experience with Node.js, React, and MongoDB is essential.',
          type: 'job',
          category: 'Engineering',
          requiredSkills: [
            { name: 'React', importance: 'required', minProficiency: 'advanced' },
            { name: 'Node.js', importance: 'required', minProficiency: 'advanced' },
            { name: 'MongoDB', importance: 'required', minProficiency: 'intermediate' },
            { name: 'TypeScript', importance: 'preferred', minProficiency: 'intermediate' },
            { name: 'Docker', importance: 'nice-to-have', minProficiency: 'beginner' }
          ],
          experienceRequired: { min: 1, max: 5 },
          location: 'Bangalore, India',
          workMode: 'remote',
          compensation: { type: 'paid', amount: '₹6-10 LPA', currency: 'INR' },
          eligibility: 'Open to all candidates with relevant experience.',
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: 'open',
          companyName: 'TechStart Solutions'
        },
        {
          recruiter: demoRecruiter._id,
          title: 'Python Data Analysis Freelancer',
          description: 'Need a Python developer to build data analysis pipelines and dashboards for our business intelligence team. Short-term project with potential for ongoing work.',
          type: 'freelance',
          category: 'Data Science',
          requiredSkills: [
            { name: 'Python', importance: 'required', minProficiency: 'advanced' },
            { name: 'Data Analysis', importance: 'required', minProficiency: 'intermediate' },
            { name: 'SQL', importance: 'preferred', minProficiency: 'intermediate' },
            { name: 'Visualization', importance: 'nice-to-have', minProficiency: 'beginner' }
          ],
          experienceRequired: { min: 1, max: 10 },
          location: 'Remote',
          workMode: 'remote',
          compensation: { type: 'paid', amount: '₹500-800/hour', currency: 'INR' },
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: 'open',
          companyName: 'TechStart Solutions'
        },
        {
          recruiter: demoRecruiter._id,
          title: 'UI/UX Design Project Collaboration',
          description: 'Seeking a creative designer to collaborate on redesigning our product interface. This is a project-based opportunity with flexible timing.',
          type: 'project',
          category: 'Design',
          requiredSkills: [
            { name: 'UI Design', importance: 'required', minProficiency: 'intermediate' },
            { name: 'Figma', importance: 'required', minProficiency: 'intermediate' },
            { name: 'CSS', importance: 'preferred', minProficiency: 'intermediate' },
            { name: 'User Research', importance: 'nice-to-have', minProficiency: 'beginner' }
          ],
          experienceRequired: { min: 0, max: 5 },
          location: 'Remote',
          workMode: 'remote',
          compensation: { type: 'negotiable' },
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          status: 'open',
          companyName: 'TechStart Solutions'
        }
      ];

      await Opportunity.insertMany(opportunities);
      console.log(`${opportunities.length} sample opportunities created.`);
    }

    // Sample Challenges
    const existingChal = await Challenge.countDocuments();
    if (existingChal === 0) {
      const challenges = [
        {
          title: 'JavaScript Fundamentals',
          description: 'Test your understanding of core JavaScript concepts including closures, promises, and ES6+ features.',
          skill: 'JavaScript',
          difficulty: 'intermediate',
          totalPoints: 40,
          timeLimit: 20,
          questions: [
            {
              text: 'What is the output of: typeof null?',
              type: 'multiple-choice',
              options: ['null', 'undefined', 'object', 'boolean'],
              correctAnswer: 'object',
              points: 10,
              explanation: 'typeof null returns "object" due to a historical bug in JavaScript.'
            },
            {
              text: 'Which method creates a new array with results of calling a function on every element?',
              type: 'multiple-choice',
              options: ['forEach()', 'map()', 'filter()', 'reduce()'],
              correctAnswer: 'map()',
              points: 10,
              explanation: 'Array.map() creates a new array by applying a function to each element.'
            },
            {
              text: 'What keyword is used to declare a block-scoped variable in ES6?',
              type: 'multiple-choice',
              options: ['var', 'let', 'const', 'Both let and const'],
              correctAnswer: 'Both let and const',
              points: 10,
              explanation: 'Both let and const are block-scoped, unlike var which is function-scoped.'
            },
            {
              text: 'What does the "..." spread operator do when used with arrays?',
              type: 'multiple-choice',
              options: ['Deletes elements', 'Expands elements', 'Sorts elements', 'Reverses elements'],
              correctAnswer: 'Expands elements',
              points: 10,
              explanation: 'The spread operator expands an iterable into individual elements.'
            }
          ]
        },
        {
          title: 'React Essentials',
          description: 'Assess your knowledge of React concepts including components, hooks, state management, and the virtual DOM.',
          skill: 'React',
          difficulty: 'intermediate',
          totalPoints: 40,
          timeLimit: 20,
          questions: [
            {
              text: 'Which hook is used for side effects in functional components?',
              type: 'multiple-choice',
              options: ['useState', 'useEffect', 'useContext', 'useReducer'],
              correctAnswer: 'useEffect',
              points: 10,
              explanation: 'useEffect is the hook for performing side effects like data fetching, subscriptions, and DOM mutations.'
            },
            {
              text: 'What is the purpose of the key prop in React lists?',
              type: 'multiple-choice',
              options: ['Styling', 'Performance optimization', 'Element identification for reconciliation', 'Event handling'],
              correctAnswer: 'Element identification for reconciliation',
              points: 10,
              explanation: 'Keys help React identify which items have changed, been added, or removed during reconciliation.'
            },
            {
              text: 'Which pattern lets you share logic between components without changing their hierarchy?',
              type: 'multiple-choice',
              options: ['Higher-Order Components', 'Custom Hooks', 'Render Props', 'All of the above'],
              correctAnswer: 'All of the above',
              points: 10,
              explanation: 'HOCs, custom hooks, and render props are all patterns for sharing component logic.'
            },
            {
              text: 'What does React.memo() do?',
              type: 'multiple-choice',
              options: ['Memoizes state', 'Prevents unnecessary re-renders', 'Creates refs', 'Manages context'],
              correctAnswer: 'Prevents unnecessary re-renders',
              points: 10,
              explanation: 'React.memo() is a higher-order component that memoizes the result to prevent unnecessary re-renders.'
            }
          ]
        },
        {
          title: 'Python Basics',
          description: 'Evaluate your Python programming skills covering data structures, functions, and built-in features.',
          skill: 'Python',
          difficulty: 'beginner',
          totalPoints: 30,
          timeLimit: 15,
          questions: [
            {
              text: 'What is the output of: list(range(3))?',
              type: 'multiple-choice',
              options: ['[1, 2, 3]', '[0, 1, 2]', '[0, 1, 2, 3]', 'range(0, 3)'],
              correctAnswer: '[0, 1, 2]',
              points: 10,
              explanation: 'range(3) generates numbers from 0 to 2 (3 exclusive).'
            },
            {
              text: 'Which data structure uses key-value pairs in Python?',
              type: 'multiple-choice',
              options: ['List', 'Tuple', 'Dictionary', 'Set'],
              correctAnswer: 'Dictionary',
              points: 10,
              explanation: 'Dictionaries store data as key-value pairs using curly braces {}.'
            },
            {
              text: 'What does the "self" keyword represent in a Python class method?',
              type: 'multiple-choice',
              options: ['The class itself', 'The current instance', 'A global variable', 'The parent class'],
              correctAnswer: 'The current instance',
              points: 10,
              explanation: 'self refers to the current instance of the class.'
            }
          ]
        }
      ];

      await Challenge.insertMany(challenges);
      console.log(`${challenges.length} sample challenges created.`);
    }

    console.log('\nSeed completed successfully!');
    console.log('Demo Student: student@demo.skillswap.dev');
    console.log('Demo Recruiter: recruiter@demo.skillswap.dev');
    console.log('(Passwords from environment variables or defaults)');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    if (err.name === 'MongooseServerSelectionError' || err.message?.includes('ECONNREFUSED')) {
      console.error(`\n❌ MongoDB Connection Error: Unable to connect to ${MONGO_URI}`);
      console.error('💡 Tip: Make sure MongoDB is running locally, or set a cloud MongoDB Atlas connection URI in server/.env:');
      console.error('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillswap?retryWrites=true&w=majority\n');
    } else {
      console.error('Seed error:', err);
    }
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

seed();
