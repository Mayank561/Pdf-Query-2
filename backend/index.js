const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mysql = require('mysql');
const natural = require('natural');
const dotenv = require('dotenv').config();

const app = express();
const port = 8000;

// Set up middleware
const allowedOrigins = [
    'http://localhost:5173', 
    'https://chat-client-em71io37n-mayanks-projects-a6ea03be.vercel.app/'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, './client/dist/assets')));

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 20000, // 20 seconds timeout
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.code, err.message);
        return;
    }
    console.log('Connected to MySQL database.');
    db.query(`
        CREATE TABLE IF NOT EXISTS documents (
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            uploadDate DATETIME NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        }
    });
});

// Global variable to store documents' text
let documents = [];

// Function to get documents from the uploads directory
async function getDocuments() {
    const files = fs.readdirSync('./uploads');
    documents = [];

    for (const file of files) {
        const filePath = path.join('./uploads', file);
        const dataBuffer = fs.readFileSync(filePath);

        try {
            const data = await pdf(dataBuffer);
            documents.push({ filename: file, text: data.text });
        } catch (error) {
            console.error('Error reading PDF:', error);
        }
    }
    console.log('Documents updated:', documents);
}

// Function to extract relevant information based on the question using basic NLP
function extractRelevantInfo(document, question) {
    const tokenizer = new natural.WordTokenizer();
    const questionTokens = tokenizer.tokenize(question.toLowerCase());
    const sentences = document.text.split('. ');

    let bestMatch = { score: 0, text: 'No relevant information found.' };

    for (const sentence of sentences) {
        let score = 0;
        for (const token of questionTokens) {
            if (sentence.toLowerCase().includes(token)) {
                score++;
            }
        }
        if (score > bestMatch.score) {
            bestMatch = { score, text: sentence };
        }
    }

    return bestMatch.text;
}

// Endpoint to upload a file in PDF format
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const saveDirectory = 'uploads';
        if (!fs.existsSync(saveDirectory)) {
            fs.mkdirSync(saveDirectory, { recursive: true });
        }
        const filePath = path.join(saveDirectory, file.originalname);
        fs.renameSync(file.path, filePath);

        const uploadDate = new Date();
        db.query(
            `INSERT INTO documents (filename, uploadDate) VALUES (?, ?)`,
            [file.originalname, uploadDate],
            (err) => {
                if (err) {
                    console.error('Error saving to database:', err);
                } else {
                    console.log('File metadata saved to database.');
                }
            }
        );

        await getDocuments();
        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: `Failed to upload file: ${error.message}` });
    }
});

// Endpoint to ask questions regarding the uploaded documents
app.post('/talk', async (req, res) => {
    try {
        const question = req.body.question;
        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }

        let bestResponse = 'No relevant documents found.';
        let foundRelevant = false;

        for (const document of documents) {
            const response = extractRelevantInfo(document, question);
            if (response !== 'No relevant information found.') {
                bestResponse = response;
                foundRelevant = true;
                break;
            }
        }

        if (!foundRelevant) {
            bestResponse = 'No relevant information found in any document.';
        }

        res.json({ message: bestResponse });
    } catch (error) {
        console.error('Error querying:', error);
        res.status(500).json({ message: `Error querying: ${error.message}` });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
