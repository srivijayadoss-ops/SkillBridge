import argon2 from 'argon2';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import RecruiterProfile from '../models/RecruiterProfile.js';
import validator from 'validator';

export async function register(req, res, next) {
  try {
    const { 
      name, 
      email, 
      password, 
      confirmPassword, 
      role = 'student',
      studentId,
      college,
      university,
      degree,
      department,
      graduationYear,
      skills,
      interests,
      careerInterests,
      companyName,
      companyWebsite
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain uppercase, lowercase, and a number.' });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    if (!['student', 'recruiter'].includes(role)) {
      return res.status(400).json({ error: 'Role must be student or recruiter.' });
    }
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters.' });
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Handle studentId uniqueness
    let finalStudentId = '';
    if (role === 'student') {
      if (studentId && studentId.trim()) {
        const cleanedId = studentId.trim();
        const existingId = await StudentProfile.findOne({ studentId: cleanedId });
        if (existingId) {
          return res.status(409).json({ error: `Student ID "${cleanedId}" is already registered. Please use a unique Student ID.` });
        }
        finalStudentId = cleanedId;
      } else {
        // Generate unique student ID
        let generatedId = '';
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 5) {
          attempts++;
          generatedId = `STU-${Math.floor(100000 + Math.random() * 900000)}`;
          const exists = await StudentProfile.findOne({ studentId: generatedId });
          if (!exists) isUnique = true;
        }
        finalStudentId = generatedId;
      }
    }

    // Hash password with Argon2id
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4
    });

    const user = new User({
      name: validator.escape(name.trim()),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      ...(role === 'student' ? { studentId: finalStudentId } : {})
    });
    await user.save();

    // Create populated profile
    if (role === 'student') {
      // Parse skills if string or array
      let formattedSkills = [];
      if (Array.isArray(skills)) {
        formattedSkills = skills.map(s => typeof s === 'string' ? { name: s.trim(), proficiency: 'intermediate' } : s);
      } else if (typeof skills === 'string' && skills.trim()) {
        formattedSkills = skills.split(',').map(s => ({ name: s.trim(), proficiency: 'intermediate' })).filter(s => s.name);
      }

      // Parse interests
      let formattedInterests = [];
      const rawInterests = careerInterests || interests;
      if (Array.isArray(rawInterests)) {
        formattedInterests = rawInterests.map(i => i.trim()).filter(Boolean);
      } else if (typeof rawInterests === 'string' && rawInterests.trim()) {
        formattedInterests = rawInterests.split(',').map(i => i.trim()).filter(Boolean);
      }

      await StudentProfile.create({
        user: user._id,
        studentId: finalStudentId,
        college: college?.trim() || university?.trim() || '',
        university: university?.trim() || college?.trim() || '',
        degree: degree?.trim() || department?.trim() || '',
        department: department?.trim() || degree?.trim() || '',
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : new Date().getFullYear(),
        skills: formattedSkills,
        interests: formattedInterests,
        careerInterests: formattedInterests,
        profileCompletion: formattedSkills.length > 0 ? 75 : 50
      });
    } else {
      await RecruiterProfile.create({
        user: user._id,
        companyName: companyName?.trim() || 'My Organization',
        companyWebsite: companyWebsite?.trim() || ''
      });
    }

    // Set and save session
    req.session.userId = user._id.toString();
    req.session.userRole = user.role;
    req.session.userName = user.name;

    req.session.save((err) => {
      if (err) return next(err);
      res.status(201).json({
        message: 'Registration successful.',
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          ...(finalStudentId ? { studentId: finalStudentId } : {})
        }
      });
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, accountName, password } = req.body;
    const identifier = (email || accountName || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Account email or name and password are required.' });
    }

    // Search by email, name (case-insensitive), or studentId
    let query;
    if (validator.isEmail(identifier)) {
      query = { email: identifier.toLowerCase() };
    } else {
      query = {
        $or: [
          { name: { $regex: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
          { email: identifier.toLowerCase() },
          { studentId: identifier }
        ]
      };
    }

    const user = await User.findOne(query).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Invalid account name/email or password.' });
    }

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid account name/email or password.' });
    }

    // Set session
    req.session.userId = user._id.toString();
    req.session.userRole = user.role;
    req.session.userName = user.name;

    res.json({
      message: 'Login successful.',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        ...(user.studentId ? { studentId: user.studentId } : {})
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out.' });
    }
    res.clearCookie('skillswap.sid');
    res.json({ message: 'Logged out successfully.' });
  });
}

export async function getCurrentUser(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'User not found.' });
    }
    res.json({
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        ...(user.studentId ? { studentId: user.studentId } : {})
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function demoLogin(req, res, next) {
  try {
    const role = req.body?.role === 'recruiter' ? 'recruiter' : 'student';
    const email = role === 'recruiter' 
      ? 'recruiter@demo.skillswap.dev' 
      : 'student@demo.skillswap.dev';

    let user = await User.findOne({ email });

    if (!user) {
      // Auto-provision demo user if database hasn't been seeded yet
      const defaultPass = 'DemoPass123!';
      const passwordHash = await argon2.hash(defaultPass, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4
      });

      if (role === 'recruiter') {
        user = await User.create({
          name: 'Priya Sharma (Demo)',
          email,
          passwordHash,
          role: 'recruiter',
          isDemo: true
        });

        await RecruiterProfile.findOneAndUpdate(
          { user: user._id },
          {
            user: user._id,
            companyName: 'TechStart Solutions',
            companyWebsite: 'https://techstart.demo',
            industry: 'Technology',
            companySize: '11-50',
            location: 'Bangalore, India',
            description: 'Innovative SaaS startup focused on cloud-first tooling.'
          },
          { upsert: true, new: true }
        );
      } else {
        user = await User.create({
          name: 'Alex Johnson (Demo)',
          email,
          passwordHash,
          role: 'student',
          isDemo: true
        });

        await StudentProfile.findOneAndUpdate(
          { user: user._id },
          {
            user: user._id,
            headline: 'Full-Stack Developer | CS Student',
            bio: 'Passionate about React, Node.js, and AI-enabled software.',
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
              { name: 'CSS', category: 'Frontend', proficiency: 'advanced', evidenceType: 'project-backed' }
            ],
            projects: [
              {
                title: 'E-Commerce Dashboard',
                description: 'Responsive admin dashboard built with React and Node.js for tracking inventory and real-time sales.',
                url: 'https://github.com/demo/ecommerce-dashboard',
                skills: ['React', 'Node.js', 'MongoDB', 'CSS'],
                role: 'Full-Stack Developer'
              }
            ],
            interests: ['Web Development', 'Machine Learning', 'Open Source'],
            profileCompletion: 90
          },
          { upsert: true, new: true }
        );
      }
    }

    // Set session
    req.session.userId = user._id.toString();
    req.session.userRole = user.role;
    req.session.userName = user.name;

    req.session.save((err) => {
      if (err) return next(err);
      res.json({
        message: `Demo login successful as ${user.role}.`,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    });
  } catch (err) {
    next(err);
  }
}

