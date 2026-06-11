import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const key = process.env.GEMINI_API_KEY;

console.log('=== Gemini API Key Diagnostic ===\n');
console.log('Key present:   ', !!key);
console.log('Key length:    ', key?.length);
console.log('Key prefix:    ', key?.slice(0, 8));
console.log('Looks valid:   ', key?.startsWith('AIzaSy') ? 'YES (AIzaSy...)' : 'NO — expected AIzaSy...');
console.log('');

if (!key) {
  console.error('ERROR: GEMINI_API_KEY is not set in .env');
  process.exit(1);
}

if (!key.startsWith('AIzaSy')) {
  console.warn('WARNING: Key does not start with "AIzaSy".');
  console.warn('Google AI Studio API keys always start with "AIzaSy".');
  console.warn('This key looks like:', key.slice(0, 10) + '...');
  console.warn('');
  console.warn('How to get the correct key:');
  console.warn('  1. Go to https://aistudio.google.com');
  console.warn('  2. Click "Get API key" (top left)');
  console.warn('  3. Click "Create API key"');
  console.warn('  4. Copy the key — it will start with AIzaSy');
  console.warn('');
  console.warn('Attempting call anyway to confirm the exact error...\n');
}

const genAI = new GoogleGenerativeAI(key);

// Test 1: simple text call (no schema, minimal tokens)
console.log('--- Test 1: Simple text generation ---');
try {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent('Say "API key works" and nothing else.');
  console.log('SUCCESS:', result.response.text());
} catch (err) {
  console.error('FAILED:', err.message);
  if (err.message.includes('API_KEY_INVALID') || err.message.includes('400')) {
    console.error('DIAGNOSIS: Key is invalid or malformed.');
  } else if (err.message.includes('429') && err.message.includes('limit: 0')) {
    console.error('DIAGNOSIS: This project has 0 quota — the API key is from a project');
    console.error('           with no free-tier access, OR billing was never enabled.');
    console.error('           Create a NEW project in Google AI Studio and generate a fresh key.');
  } else if (err.message.includes('403')) {
    console.error('DIAGNOSIS: Permission denied — Gemini API may not be enabled for this project.');
  }
}

// Test 2: try gemini-1.5-flash as fallback
console.log('\n--- Test 2: gemini-1.5-flash fallback ---');
try {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent('Say "1.5-flash works" and nothing else.');
  console.log('SUCCESS:', result.response.text());
} catch (err) {
  console.error('FAILED:', err.message.slice(0, 200));
}

console.log('\n=== Done ===');
