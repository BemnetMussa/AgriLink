/**
 * Extracts a clean, user-friendly error message from various error formats
 */
export function extractErrorMessage(error: any): string {
  // If it's already a string, return it
  if (typeof error === 'string') {
    // Try to parse if it looks like JSON
    if (error.startsWith('{') || error.startsWith('[')) {
      try {
        const parsed = JSON.parse(error);
        return extractErrorMessage(parsed);
      } catch {
        // Not valid JSON, return as is
        return error;
      }
    }
    return error;
  }

  // If it's an Error object, get the message
  if (error instanceof Error) {
    let message = error.message;
    
    // Try to parse if message looks like JSON
    if (message.startsWith('{') || message.startsWith('[')) {
      try {
        const parsed = JSON.parse(message);
        return extractErrorMessage(parsed);
      } catch {
        return message;
      }
    }
    return message;
  }

  // If it's an object, try to extract message/error/msg fields
  if (typeof error === 'object' && error !== null) {
    // Try common error message fields
    const message = error.message || error.error || error.msg || error.errorMessage;
    if (message) {
      return extractErrorMessage(message); // Recursively extract
    }
    
    // If it's an array of errors, join them
    if (Array.isArray(error)) {
      return error.map(e => extractErrorMessage(e)).join(', ');
    }
    
    // If object has a toString, use it
    if (error.toString && error.toString() !== '[object Object]') {
      return error.toString();
    }
    
    // Last resort: stringify (but try to make it readable)
    try {
      const str = JSON.stringify(error);
      // If it's a short JSON, return it; otherwise return generic message
      if (str.length < 200) {
        return str;
      }
    } catch {
      // Can't stringify
    }
  }

  // Default fallback
  return 'An error occurred. Please try again.';
}
