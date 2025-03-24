export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
  
    const documentId = process.env.DOCUMENTERO_DOC_ID;
    const apiKey = process.env.DOCUMENTERO_API_KEY;
  
    const payload = {
      document: documentId,
      apiKey: apiKey,
      format: 'pdf',
      data: req.body.data
    };
  
    try {
      const response = await fetch('https://app.documentero.com/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      res.status(response.status).json(result);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        details: error.message 
      });
    }
  }
  