const mongoose = require('mongoose');

const syncDataSchema = new mongoose.Schema({
  operation: { type: String, required: true }, // 'create', 'update', 'delete'
  collection: { type: String, required: true }, // 'books', 'issues', 'approvals'
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  librarianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Librarian', required: true },
  synced: { type: Boolean, default: false },
  syncedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SyncData', syncDataSchema);