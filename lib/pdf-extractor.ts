// Simple PDF text extraction without external dependencies
// This is a basic implementation that extracts readable text from PDFs

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Convert buffer to string and look for text content
    const pdfString = buffer.toString('binary');
    
    // Extract text between BT (Begin Text) and ET (End Text) operators
    const textMatches = pdfString.match(/BT\s*(.*?)\s*ET/gs) || [];
    
    let extractedText = '';
    
    for (const match of textMatches) {
      // Extract text from Tj and TJ operators (text showing operators)
      const tjMatches = match.match(/\((.*?)\)\s*Tj/g) || [];
      const tjArrayMatches = match.match(/\[(.*?)\]\s*TJ/g) || [];
      
      // Process Tj operators
      for (const tjMatch of tjMatches) {
        const textMatch = tjMatch.match(/\((.*?)\)/);
        if (textMatch && textMatch[1]) {
          extractedText += decodeText(textMatch[1]) + ' ';
        }
      }
      
      // Process TJ operators (text arrays)
      for (const tjArrayMatch of tjArrayMatches) {
        const arrayContent = tjArrayMatch.match(/\[(.*?)\]/);
        if (arrayContent && arrayContent[1]) {
          const textParts = arrayContent[1].match(/\((.*?)\)/g) || [];
          for (const part of textParts) {
            const text = part.match(/\((.*?)\)/);
            if (text && text[1]) {
              extractedText += decodeText(text[1]);
            }
          }
          extractedText += ' ';
        }
      }
    }
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\\(\d{3})/g, (match, octal) => String.fromCharCode(parseInt(octal, 8)))
      .replace(/\s+/g, ' ')
      .trim();
    
    // If no text was extracted using the above method, try a simpler approach
    if (!extractedText) {
      // Look for any readable text patterns
      const simpleTextMatches = pdfString.match(/\(((?:[^()\\]|\\[\\()])*)\)/g) || [];
      for (const match of simpleTextMatches) {
        const text = match.slice(1, -1);
        if (text && isReadableText(text)) {
          extractedText += decodeText(text) + ' ';
        }
      }
    }
    
    return extractedText || '[Unable to extract text from PDF - the document may be scanned or encrypted]';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '[Error extracting PDF content]';
  }
}

function decodeText(text: string): string {
  // Decode common PDF escape sequences
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\(\d{3})/g, (match, octal) => String.fromCharCode(parseInt(octal, 8)));
}

function isReadableText(text: string): boolean {
  // Check if the text contains mostly readable characters
  const readableChars = text.match(/[a-zA-Z0-9\s.,!?;:'"()-]/g) || [];
  return readableChars.length > text.length * 0.7;
}