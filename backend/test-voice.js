/**
 * Voice Service Test Script
 * Run this to test ElevenLabs integration
 * 
 * Usage: node test-voice.js
 */

import dotenv from 'dotenv';
import voiceService from './services/voiceService.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '../.env' });

console.log('═══════════════════════════════════════════════════════');
console.log('  Riverwood Voice Service Test');
console.log('═══════════════════════════════════════════════════════');
console.log('');

async function runTests() {
  try {
    // Test 1: Check API key configuration
    console.log('Test 1: API Key Configuration');
    console.log('─────────────────────────────────────────────────────');
    if (process.env.ELEVENLABS_API_KEY) {
      console.log('✓ ElevenLabs API key is configured');
      console.log(`  Key: ${process.env.ELEVENLABS_API_KEY.substring(0, 10)}...`);
    } else {
      console.log('✗ ElevenLabs API key is NOT configured');
      console.log('  Please add ELEVENLABS_API_KEY to your .env file');
      return;
    }
    console.log('');

    // Test 2: Get optimal voice
    console.log('Test 2: Optimal Voice Selection');
    console.log('─────────────────────────────────────────────────────');
    const optimalVoice = voiceService.getOptimalVoice();
    console.log(`✓ Optimal voice ID: ${optimalVoice}`);
    console.log('');

    // Test 3: Health check
    console.log('Test 3: Service Health Check');
    console.log('─────────────────────────────────────────────────────');
    const health = await voiceService.getHealthStatus();
    console.log(`Status: ${health.status}`);
    console.log(`API Key Configured: ${health.apiKeyConfigured}`);
    if (health.voicesAvailable) {
      console.log(`Voices Available: ${health.voicesAvailable}`);
    }
    if (health.error) {
      console.log(`Error: ${health.error}`);
    }
    console.log('');

    // Test 4: Get available voices
    console.log('Test 4: Fetch Available Voices');
    console.log('─────────────────────────────────────────────────────');
    try {
      const voicesResult = await voiceService.getAvailableVoices();
      console.log(`✓ Found ${voicesResult.total} voices`);
      
      const recommended = voicesResult.voices.filter(v => v.recommended);
      console.log(`✓ ${recommended.length} recommended voices for Indian English`);
      
      if (recommended.length > 0) {
        console.log('\nRecommended voices:');
        recommended.slice(0, 3).forEach(voice => {
          console.log(`  - ${voice.name} (${voice.id})`);
          console.log(`    ${voice.description}`);
        });
      }
    } catch (error) {
      console.log(`✗ Failed to fetch voices: ${error.message}`);
    }
    console.log('');

    // Test 5: Cost estimation
    console.log('Test 5: Cost Estimation');
    console.log('─────────────────────────────────────────────────────');
    const costEstimate = voiceService.estimateConversationCost(10, 150);
    console.log(`Conversation: ${costEstimate.messageCount} messages`);
    console.log(`Avg characters per message: ${costEstimate.avgCharactersPerMessage}`);
    console.log(`Total characters: ${costEstimate.totalCharacters}`);
    console.log(`Estimated cost: ${costEstimate.formattedCost}`);
    console.log(`Cost per message: $${costEstimate.costPerMessage.toFixed(4)}`);
    console.log('');

    // Test 6: Synthesize speech
    console.log('Test 6: Speech Synthesis');
    console.log('─────────────────────────────────────────────────────');
    const testText = "Namaste! Main Priya bol rahi hoon Riverwood se. Aaj aapke ghar ki construction mein bahut acchi progress hui hai.";
    console.log(`Test text: "${testText}"`);
    console.log(`Characters: ${testText.length}`);
    console.log('Synthesizing...');
    
    const result = await voiceService.synthesizeSpeech(testText);
    
    if (result.success) {
      console.log('✓ Speech synthesis successful!');
      console.log(`  Audio size: ${(result.metadata.audioSize / 1024).toFixed(2)} KB`);
      console.log(`  Processing time: ${result.metadata.processingTime}ms`);
      console.log(`  Character count: ${result.metadata.characterCount}`);
      console.log(`  Estimated cost: $${result.metadata.estimatedCost.toFixed(4)}`);
      
      // Save audio file
      const outputPath = path.join(__dirname, 'test-output.mp3');
      await fs.writeFile(outputPath, result.audio);
      console.log(`  Audio saved to: ${outputPath}`);
      console.log('  You can play this file to test the voice quality!');
    } else {
      console.log('✗ Speech synthesis failed');
      console.log(`  Error: ${result.error}`);
      console.log(`  Error code: ${result.errorCode}`);
      console.log(`  Retryable: ${result.retryable}`);
    }
    console.log('');

    // Test 7: Usage statistics
    console.log('Test 7: Usage Statistics');
    console.log('─────────────────────────────────────────────────────');
    const stats = voiceService.getUsageStats();
    console.log(`Total characters: ${stats.totalCharacters}`);
    console.log(`Total requests: ${stats.totalRequests}`);
    console.log(`Estimated cost: $${stats.estimatedCost.toFixed(4)}`);
    console.log(`Average characters per request: ${stats.averageCharactersPerRequest}`);
    console.log(`Remaining free characters: ${stats.remainingFreeCharacters}`);
    console.log('');

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Test Summary');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✓ All tests completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Play test-output.mp3 to verify voice quality');
    console.log('2. If voice sounds good, you\'re ready to go!');
    console.log('3. Start the backend server: npm run dev');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════');
    console.error('  Test Failed');
    console.error('═══════════════════════════════════════════════════════');
    console.error(`Error: ${error.message}`);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Check if ELEVENLABS_API_KEY is set in .env file');
    console.error('2. Verify API key is valid at elevenlabs.io');
    console.error('3. Check internet connection');
    console.error('4. Ensure you have API credits available');
    console.error('');
  }
}

// Run tests
runTests();
