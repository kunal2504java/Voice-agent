/**
 * Speech Optimizer for Natural TTS
 * Optimizes text before sending to ElevenLabs for more natural, human-like speech
 */

class SpeechOptimizer {
  constructor() {
    // English contractions for natural speech
    this.contractions = {
      "I am": "I'm",
      "I have": "I've", 
      "I will": "I'll",
      "Let us": "Let's",
      "Do not": "Don't",
      "Cannot": "Can't",
      "It is": "It's",
      "That is": "That's",
      "You are": "You're",
      "We are": "We're",
      "They are": "They're",
      "Would not": "Wouldn't",
      "Could not": "Couldn't",
      "Should not": "Shouldn't",
      "Will not": "Won't",
      "Did not": "Didn't"
    };

    // Natural fillers for conversational feel
    this.fillersEn = ["Okay", "Sure", "Alright", "Got it", "Great", "Right", "Well"];
    this.fillersHi = ["Accha", "Theek hai", "Haan", "Bilkul", "Zaroor"];

    // Words that trigger natural pauses
    this.pauseTriggers = [
      "but", "so", "because", "actually", "alright", "okay", "great", "sure", "anyway",
      "lekin", "toh", "kyunki", "asal mein", "vaise", "phir", "aur"
    ];

    // Hinglish pronunciation fixes for better TTS
    this.hinglishTerms = {
      "BHK": "B H K",
      "DLF": "D L F", 
      "RERA": "R E R A",
      "EMI": "E M I",
      "sq ft": "square feet",
      "sqft": "square feet",
      "lakhs": "lakh",
      "crore": "crore",
      "₹": "rupees"
    };

    // Common Hinglish words that need natural pronunciation
    this.hinglishWords = {
      "Noida": "Noy-da",
      "Gurgaon": "Gur-gaon",
      "Gurugram": "Guru-gram"
    };
  }

  /**
   * Detect if text is primarily Hindi or English
   */
  detectLanguage(text) {
    // Count Devanagari characters
    const hindiChars = (text.match(/[\u0900-\u097F]/g) || []).length;
    const totalChars = text.length;
    
    return hindiChars > totalChars * 0.2 ? "hindi" : "english";
  }

  /**
   * Apply natural contractions for English
   */
  applyContractions(text) {
    let result = text;
    
    for (const [full, contracted] of Object.entries(this.contractions)) {
      // Case-insensitive replacement with word boundaries
      const regex = new RegExp(`\\b${full}\\b`, 'gi');
      result = result.replace(regex, contracted);
    }
    
    return result;
  }

  /**
   * Insert natural pauses for better rhythm
   */
  insertPauses(text) {
    let result = text;
    
    // Add slight pause after trigger words
    for (const word of this.pauseTriggers) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, (match) => `${match},`);
    }
    
    // Add pause after sentences (but not too long)
    result = result.replace(/\.\s+/g, '. ');
    
    // Add slight pause after questions
    result = result.replace(/\?\s+/g, '? ');
    
    // Add pause after commas for natural breathing
    result = result.replace(/,\s+/g, ', ');
    
    return result;
  }

  /**
   * Add occasional fillers for natural conversation
   */
  addFillers(text, lang) {
    const fillers = lang === "hindi" ? this.fillersHi : this.fillersEn;
    
    // 20% chance to add a filler at the start
    if (Math.random() < 0.2) {
      const filler = fillers[Math.floor(Math.random() * fillers.length)];
      return `${filler}, ${text}`;
    }
    
    return text;
  }

  /**
   * Fix pronunciations for better TTS
   */
  fixPronunciations(text) {
    let result = text;
    
    // Fix Hinglish terms
    for (const [term, pronunciation] of Object.entries(this.hinglishTerms)) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(regex, pronunciation);
    }
    
    return result;
  }

  /**
   * Break long sentences into shorter, more natural chunks
   */
  breakLongSentences(text) {
    // If sentence is too long (>150 chars), try to break it naturally
    const sentences = text.split(/([.!?]+\s+)/);
    const result = [];
    
    for (let sentence of sentences) {
      if (sentence.length > 150) {
        // Break at conjunctions or commas
        sentence = sentence.replace(/\s+(and|but|so|because|kyunki|aur|lekin)\s+/gi, (match) => `, ${match.trim()}, `);
      }
      result.push(sentence);
    }
    
    return result.join('');
  }

  /**
   * Remove repetitive phrases
   */
  removeRepetition(text) {
    // Remove if same phrase appears twice in a row
    const words = text.split(' ');
    const cleaned = [];
    
    for (let i = 0; i < words.length; i++) {
      if (i === 0 || words[i].toLowerCase() !== words[i-1].toLowerCase()) {
        cleaned.push(words[i]);
      }
    }
    
    return cleaned.join(' ');
  }

  /**
   * Add natural ending
   */
  addNaturalEnding(text) {
    // If text doesn't end with punctuation, add appropriate ending
    if (!text.match(/[.!?]$/)) {
      // If it's a question word, add ?
      if (text.match(/\b(kya|kaise|kab|kahan|kaun|what|when|where|who|how)\b/i)) {
        return text + '?';
      }
      // Otherwise add period
      return text + '.';
    }
    return text;
  }

  /**
   * Main optimization function
   */
  optimize(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }

    // Clean up the text
    let optimized = text.trim();
    
    // Remove any meta-commentary or thinking process
    optimized = optimized.replace(/\(Thinks:.*?\)/gi, '');
    optimized = optimized.replace(/\[.*?\]/g, '');
    
    // Detect language
    const lang = this.detectLanguage(optimized);
    
    // Apply optimizations
    optimized = this.removeRepetition(optimized);
    
    // English/Hinglish specific
    if (lang === "english") {
      optimized = this.applyContractions(optimized);
      optimized = this.fixPronunciations(optimized);
    }
    
    // Common optimizations
    optimized = this.breakLongSentences(optimized);
    optimized = this.insertPauses(optimized);
    optimized = this.addFillers(optimized, lang);
    optimized = this.addNaturalEnding(optimized);
    
    // Final cleanup
    optimized = optimized.replace(/\s+/g, ' ').trim();
    
    // Remove excessive punctuation
    optimized = optimized.replace(/\.{2,}/g, '.');
    optimized = optimized.replace(/,{2,}/g, ',');
    
    console.log('📝 Speech optimization:');
    console.log('   Original:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
    console.log('   Optimized:', optimized.substring(0, 100) + (optimized.length > 100 ? '...' : ''));
    
    return optimized;
  }
}

// Export singleton instance
export default new SpeechOptimizer();
