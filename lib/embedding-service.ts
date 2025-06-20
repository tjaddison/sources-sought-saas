import { VoyageAIClient } from 'voyageai';

const voyageClient = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY!,
});

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  tokensUsed: number;
}

export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  // Mock mode for development/testing when API is not available
  if (process.env.MOCK_EMBEDDINGS === 'true') {
    console.log('Using mock embeddings (MOCK_EMBEDDINGS=true)');
    // Generate a deterministic mock embedding based on text length
    // Voyage embeddings are typically 1024 dimensions
    const mockEmbedding = new Array(1024).fill(0).map((_, i) => 
      Math.sin((text.length + i) * 0.01) * 0.1
    );
    
    return {
      embedding: mockEmbedding,
      model: 'mock-embedding',
      tokensUsed: Math.ceil(text.length / 4),
    };
  }

  try {
    const response = await voyageClient.embed({
      input: text,
      model: 'voyage-large-2', // High-quality general-purpose model
      inputType: 'document', // Specify that this is document text for better embeddings
    });

    if (!response.data || response.data.length === 0 || !response.data[0].embedding) {
      throw new Error('No embedding data returned from Voyage AI');
    }

    return {
      embedding: response.data[0].embedding,
      model: response.model || 'voyage-large-2',
      tokensUsed: response.usage?.totalTokens || 0,
    };
  } catch (error: any) {
    console.error('Error generating embedding:', error);
    
    // Check for specific error types
    if (error?.status === 429) {
      throw new Error('Voyage AI API rate limit exceeded. Please try again later.');
    }
    
    if (error?.status === 401) {
      throw new Error('Invalid Voyage AI API key. Please check your VOYAGE_API_KEY environment variable.');
    }
    
    if (error?.status === 402) {
      throw new Error('Voyage AI API quota exceeded. Please check your account billing.');
    }
    
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
  // Mock mode for development/testing
  if (process.env.MOCK_EMBEDDINGS === 'true') {
    console.log('Using mock batch embeddings (MOCK_EMBEDDINGS=true)');
    return texts.map((text, index) => {
      const mockEmbedding = new Array(1024).fill(0).map((_, i) => 
        Math.sin((text.length + index + i) * 0.01) * 0.1
      );
      
      return {
        embedding: mockEmbedding,
        model: 'mock-embedding',
        tokensUsed: Math.ceil(text.length / 4),
      };
    });
  }

  try {
    const response = await voyageClient.embed({
      input: texts,
      model: 'voyage-large-2',
      inputType: 'document',
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No embedding data returned from Voyage AI');
    }

    return response.data.map((data, index) => ({
      embedding: data.embedding || [],
      model: response.model || 'voyage-large-2',
      tokensUsed: Math.floor((response.usage?.totalTokens || 0) / texts.length),
    }));
  } catch (error: any) {
    console.error('Error generating batch embeddings:', error);
    
    if (error?.status === 429) {
      throw new Error('Voyage AI API rate limit exceeded. Please try again later.');
    }
    
    if (error?.status === 401) {
      throw new Error('Invalid Voyage AI API key. Please check your VOYAGE_API_KEY environment variable.');
    }
    
    throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function combineTextsForIndexing(
  companyDescription: string,
  documents: Array<{ type: string; text: string }>
): string {
  const sections = [];

  if (companyDescription) {
    sections.push(`Company Overview:\n${companyDescription}`);
  }

  documents.forEach(doc => {
    const sectionTitle = doc.type === 'capability' ? 'Capability Statement' :
                        doc.type === 'resume' ? 'Team Member Resume' :
                        'Past Proposal';
    
    sections.push(`\n\n${sectionTitle}:\n${doc.text}`);
  });

  return sections.join('\n\n---\n\n');
}