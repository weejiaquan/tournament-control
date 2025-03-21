import db from '../config/database.js';

let clients = new Set();

export const getParticipants = (req, res) => {
  try {
    const participants = db.prepare('SELECT * FROM participants').all();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addParticipants = (req, res) => {
  try {
    const { participants } = req.body;
    const insertStmt = db.prepare('INSERT INTO participants (name) VALUES (?)');
    const clearStmt = db.prepare('DELETE FROM participants');

    db.transaction(() => {
      clearStmt.run();
      participants.forEach(participant => {
        insertStmt.run(participant.name);
      });
    })();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteParticipants = (req, res) => {
  try {
    db.prepare('DELETE FROM participants').run();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpinUpdates = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.add(res);
  req.on('close', () => clients.delete(res));
};

export const spinRaffle = (req, res) => {
  try {
    const participants = db.prepare('SELECT * FROM participants').all();
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];

    const eventData = JSON.stringify({
      action: 'spin',
      winnerIndex,
      winner: winner.name
    });

    clients.forEach(client => {
      client.write(`data: ${eventData}\n\n`);
    });

    res.json({ success: true, winner: winner.name, winnerIndex });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};