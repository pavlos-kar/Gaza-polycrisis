/*The main entry point of your application. It sets up the Express server, connects to the MongoDB database, handles user sessions, and defines all the routes (URLs) for your site (Home, Login, Register, Subscribe, etc.).*/


const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Import all Database Models
const User = require('./models/User');
const Content = require('./models/Content');
const Comment = require('./models/Comment');
const Source = require('./models/Source');
const Donation = require('./models/Donation'); 

require('dotenv').config();

const app = express();

// --- CONFIGURATION ---
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// --- MIDDLEWARE ---
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    const tiers = ['theme-guest', 'theme-supporter', 'theme-activist'];
    res.locals.themeClass = req.session.user ? tiers[req.session.user.tier] : 'theme-guest';
    next();
});

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected'));

// --- ROUTES ---

// 1. Landing Page
app.get('/', async (req, res) => {
    const news = await Content.find({ type: 'news' });
    const sectors = await Content.find({ type: 'sector' });
    const sources = await Source.find();
    const donations = await Donation.find();
    
    // Fetch comments (Newest first, limit to 20)
    const comments = await Comment.find().sort({ createdAt: -1 }).limit(20);

    res.render('landing', { news, sectors, sources, donations, comments });
});

// 2. Authentication Routes
app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await user.comparePassword(password)) {
        req.session.user = user;
        return res.redirect('/');
    }
    res.redirect('/login');
});

app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password, tier: 0 });
        await user.save();
        req.session.user = user;
        res.redirect('/');
    } catch (e) { res.redirect('/register'); }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// 3. Comment Logic
app.post('/comment', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        await Comment.create({
            username: req.session.user.username,
            tier: req.session.user.tier,
            text: req.body.text
        });
    } catch (err) { console.error(err); }
    res.redirect('/');
});

app.post('/comment-api', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const comment = await Comment.create({
            username: req.session.user.username,
            tier: req.session.user.tier,
            text: req.body.text
        });
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

// --- SUPPORTER ROUTE (FIXED) ---
app.post('/subscribe', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    try {
        // 1. Update User
        const user = await User.findById(req.session.user._id);
        user.tier = 2; 
        await user.save();

        // 2. FIXED: Update ALL past comments using $set
        await Comment.updateMany(
            { username: user.username }, 
            { $set: { tier: 2 } } 
        );
        
        // 3. Update Session
        req.session.user = user;
        req.session.save(() => res.redirect('/'));
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// --- SERVER START ---
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));