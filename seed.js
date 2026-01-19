//A script used to populate your database with initial starter data (like the news articles, sector analysis, and donation links) so the site isn't empty when you first run it.


const mongoose = require('mongoose');
const Content = require('./models/Content');
const Source = require('./models/Source');
const Donation = require('./models/Donation'); // <--- NEW IMPORT
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Seeding All Data...");
        
        await Content.deleteMany({});
        await Source.deleteMany({});
        await Donation.deleteMany({});

        // 1. Content
        const content = [
            { type: 'news', title: 'Aid Convoy Status', snippet: 'Northern crossing delayed for 72 hours due to logistical blockades.', meta: '2h ago', image: '/images/convoy.jpg' },
            { type: 'news', title: 'Power Grid Update', snippet: 'Rolling blackouts affecting central hospitals. Fuel reserves critical.', meta: '5h ago', image: '/images/power.jpg' },
            { type: 'news', title: 'Water Scarcity', snippet: 'Desalination plant capacity drops to 15%. Clean water access limited.', meta: '1d ago', image: '/images/water.jpg' },
            { type: 'sector', title: 'Health Sector', snippet: 'Critical shortage of anesthesia and antibiotics in major trauma centers.', meta: 'ICU: 98% Capacity', image: '/images/health.jpg' },
            { type: 'sector', title: 'Housing Crisis', snippet: 'Reconstruction estimation requires 15 years. Temporary shelters at capacity.', meta: 'Displaced: 1.9M', image: '/images/housing.jpg' },
            { type: 'sector', title: 'Ecological Collapse', snippet: 'Groundwater contamination levels critical. Agricultural lands ravaged.', meta: 'Potable: 3%', image: '/images/ecology.jpg' }
        ];

        // 2. Sources
        const sources = [
            { publisher: "UNRWA", title: "Situation Report #64: Displacement Crisis", summary: "Official daily tracking of shelter capacity and aid distribution metrics.", url: "https://www.unrwa.org/" },
            { publisher: "The Lancet", title: "Public Health Projection: Disease Vectors", summary: "Peer-reviewed analysis on the spread of waterborne diseases.", url: "https://www.thelancet.com/" },
            { publisher: "OCHA", title: "Hostilities Reported Impact", summary: "Comprehensive data visualization of damage assessments.", url: "https://www.unocha.org/" }
        ];

        // 3. Donations (NEW)
        const donations = [
            { organization: "PCRF", description: "Providing urgent medical care and humanitarian aid to children.", url: "https://www.pcrf.net/" },
            { organization: "Doctors Without Borders", description: "Medical teams responding to emergencies and treating trauma patients.", url: "https://www.msf.org/" },
            { organization: "World Food Programme", description: "Delivering critical food assistance to families facing starvation.", url: "https://www.wfp.org/" }
        ];

        await Content.insertMany(content);
        await Source.insertMany(sources);
        await Donation.insertMany(donations); // <--- Save Donations
        
        console.log("Seeding Complete.");
        process.exit();
    })
    .catch(err => console.error(err));