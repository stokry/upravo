/**
 * Sanitizes and fixes potentially broken JSON strings in article summaries
 * @param text The text to sanitize
 * @returns Sanitized text
 */
export function sanitizeSummary(text: string): string {
    if (!text) return '';
  
    // If the text appears to be a broken JSON string
    if (text.includes('"summary":')) {
      try {
        // Try to parse it as JSON first
        const parsed = JSON.parse(text);
        return parsed.summary || '';
      } catch (e) {
        // If parsing fails, try to extract the summary content
        const summaryMatch = text.match(/"summary":\s*"([^"]*)/);
        if (summaryMatch && summaryMatch[1]) {
          return summaryMatch[1].trim();
        }
      }
    }
  
    // Remove any trailing incomplete words or sentences
    let sanitized = text;
    
    // If text ends with an incomplete word (no space or punctuation after it)
    if (/[a-zA-ZčćđšžČĆĐŠŽ]$/.test(sanitized)) {
      // Find the last complete sentence or phrase
      const lastComplete = sanitized.match(/^.*[.!?]\s+[^.!?]*|^.*[,;]\s+[^,;]*|^.*\s+/);
      if (lastComplete) {
        sanitized = lastComplete[0].trim();
      }
    }
  
    // Ensure the text ends with proper punctuation
    if (!/[.!?]$/.test(sanitized)) {
      sanitized += '...';
    }
  
    return sanitized;
  }
  