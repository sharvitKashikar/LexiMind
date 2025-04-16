/**
 * Client-side NLP utility functions for validation and basic processing
 */

export function validateText(text: string): { valid: boolean; message?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, message: "Text cannot be empty" };
  }
  
  if (text.length < 10) {
    return { valid: false, message: "Text is too short for meaningful analysis" };
  }
  
  return { valid: true };
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function highlightKeywords(text: string, keywords: string[]): string {
  let result = text;
  keywords.forEach(keyword => {
    // Case insensitive global replace
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    result = result.replace(regex, `<span class="doc-highlight">$&</span>`);
  });
  return result;
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Simple client-side implementation of text preprocessing for visualization
export function tokenizeText(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');
}

export function removeStopwords(tokens: string[]): string[] {
  const commonStopwords = [
    'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
    'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 
    'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 
    'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 
    'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 
    't', 'can', 'will', 'just', 'don', 'should', 'now', 'i', 'me', 'my', 'myself', 
    'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 
    'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 
    'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 
    'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 
    'do', 'does', 'did', 'doing', 'would', 'could', 'should', 'ought', 'im', 
    'ive', 'youre', 'youve', 'hes', 'shes', 'its', 'were', 'theyre', 'ive', 'weve', 
    'theyve', 'hasnt', 'havent', 'hadnt', 'doesnt', 'dont', 'didnt'
  ];
  
  return tokens.filter(token => !commonStopwords.includes(token));
}

// Basic stemming rules (a simplified implementation for client-side)
export function stemWords(tokens: string[]): string[] {
  return tokens.map(token => {
    if (token.endsWith('ing')) return token.slice(0, -3);
    if (token.endsWith('ed')) return token.slice(0, -2);
    if (token.endsWith('s') && !token.endsWith('ss')) return token.slice(0, -1);
    if (token.endsWith('ly')) return token.slice(0, -2);
    if (token.endsWith('ment')) return token.slice(0, -4);
    return token;
  });
}
