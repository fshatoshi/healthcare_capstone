db = db.getSiblingDB('healthtrackdb');
db.users.createIndex({ email: 1 }, { unique: true });
db.health_records.createIndex({ fileId: 1, timestamp: -1 });
db.ai_analysis_results.createIndex({ fileId: 1, generatedAt: -1 });
print('MongoDB initialized successfully');