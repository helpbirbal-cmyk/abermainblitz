// src/lib/briefEngine.ts
import Perplexity from '@perplexity-ai/perplexity_ai';

export interface LeadBrief {
  snapshot: string;
  firmographics: string;
  persona: string;
  summary: string;
  email: string;
  phone?: string;
}

const client = new Perplexity();

/**
 * Safely parse JSON content returned by Perplexity.
 * Trims to first/last braces if extra text is present.
 */
 function safeParse(content: string): LeadBrief {
   try {
     return JSON.parse(content);
   } catch {
     // Remove markdown fences if present
     const cleaned = content
       .replace(/```json/g, '')
       .replace(/```/g, '')
       .replace(/,\s*}/g, '}')
       .trim();
     const start = cleaned.indexOf('{');
     const end = cleaned.lastIndexOf('}');
     if (start !== -1 && end !== -1) {
       return JSON.parse(cleaned.slice(start, end + 1));
     }
     throw new Error('Invalid JSON returned');
   }
 }


/**
 * Generate a structured lead brief using Perplexity, with fallback.
 */
export async function generateBrief(lead: any): Promise<LeadBrief> {
  try {
    const completion = await client.chat.completions.create({
      model: process.env.PERPLEXITY_MODEL || 'sonar',
      messages: [
        {
          role: 'system',
          content: 'You are a CRM enrichment engine. Return structured lead intelligence.'
        },
        {
          role: 'user',
          content: `Generate a lead intelligence brief for: ${JSON.stringify(lead)}`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              snapshot: { type: 'string' },
              firmographics: { type: 'string' },
              persona: { type: 'string' },
              summary: { type: 'string' },
              email: {
                type: 'string',
                pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
              },
              phone: {
                type: 'string',
                pattern: '\\+?[0-9]{10,15}'
              }
            },
            required: ['snapshot', 'firmographics', 'persona', 'summary', 'email']
          }
        }
      }
    });



    const rawContent = completion.choices[0].message.content;
      let raw = '';

      if (typeof rawContent === 'string') {
        raw = rawContent;
      } else if (Array.isArray(rawContent)) {
        raw = rawContent.map((chunk: any) =>
          typeof chunk.text === 'string' ? chunk.text : ''
        ).join('');
      }

  console.log('Raw Perplexity response:', raw);
  return safeParse(raw);


  } catch (err) {
    console.error('Perplexity brief generation failed:', err);

    // Fallback stub so ProfilerPanel doesn’t spin forever
    return {
      snapshot: 'No snapshot available',
      firmographics: 'No firmographic data',
      persona: 'No persona analysis',
      summary: 'No summary available',
      email: 'unknown@example.com',
      phone: ''
    };
  }
}
