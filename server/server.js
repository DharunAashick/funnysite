import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to store names
const namesFilePath = path.join(__dirname, 'names.txt');

// Ensure the file exists
if (!fs.existsSync(namesFilePath)) {
  fs.writeFileSync(namesFilePath, '');
}

// Save a name
app.post('/api/save-name', (req, res) => {
  const { name } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const timestamp = new Date().toLocaleString();
  const entry = `${name.trim()} - ${timestamp}\n`;

  fs.appendFile(namesFilePath, entry, (err) => {
    if (err) {
      console.error('Error saving name:', err);
      return res.status(500).json({ error: 'Failed to save name' });
    }
    
    console.log('Name saved:', name.trim());
    res.json({ success: true, message: 'Name saved successfully' });
  });
});

// Get all names
app.get('/api/get-names', (req, res) => {
  fs.readFile(namesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading names:', err);
      return res.status(500).json({ error: 'Failed to read names' });
    }

    const lines = data.split('\n').filter(line => line.trim() !== '');
    const names = lines.map((line, index) => {
      const [name, ...dateParts] = line.split(' - ');
      return {
        id: index + 1,
        name: name.trim(),
        date: dateParts.join(' - ')
      };
    });

    res.json({ names, total: names.length });
  });
});

// Get names count
app.get('/api/count', (req, res) => {
  fs.readFile(namesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.json({ count: 0 });
    }
    const count = data.split('\n').filter(line => line.trim() !== '').length;
    res.json({ count });
  });
});

// Clear all names (admin only)
app.delete('/api/clear-names', (req, res) => {
  fs.writeFile(namesFilePath, '', (err) => {
    if (err) {
      console.error('Error clearing names:', err);
      return res.status(500).json({ error: 'Failed to clear names' });
    }
    
    console.log('All names cleared');
    res.json({ success: true, message: 'All names cleared' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Names will be saved to: ${namesFilePath}`);
});
