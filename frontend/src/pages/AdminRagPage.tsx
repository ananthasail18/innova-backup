import { useState, useEffect } from 'react';
import api from '@/services/api';

export function AdminRagPage() {
  const [status, setStatus] = useState<any>(null);
  const [indexing, setIndexing] = useState(false);
  const [chunks, setChunks] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [retrievalResult, setRetrievalResult] = useState<any>(null);
  const [contextPreview, setContextPreview] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/rag/status');
      setStatus(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChunks = async () => {
    try {
      const res = await api.get('/rag/chunks?limit=100');
      setChunks(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchChunks();
  }, []);

  const handleIndex = async () => {
    setIndexing(true);
    try {
      await api.post('/rag/index?force=true', {});
      await fetchStatus();
      await fetchChunks();
    } catch (err) {
      console.error(err);
    } finally {
      setIndexing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setSearching(true);
    try {
      // Fetch retrieval pipeline data
      const retrieveRes = await api.post(`/rag/retrieve?q=${encodeURIComponent(searchQuery)}`, {});
      setRetrievalResult(retrieveRes.data.data);

      // Fetch prompt preview data
      const previewRes = await api.get(`/rag/context-preview?q=${encodeURIComponent(searchQuery)}`);
      setContextPreview(previewRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      <h1>RAG Indexing Admin Panel</h1>
      
      {status && (
        <div style={{ background: '#333', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3>Statistics</h3>
          <p>Total Documents: {status.total_documents}</p>
          <p>Total Chunks: {status.total_chunks}</p>
          <p>Indexed Chunks: {status.indexed_chunks}</p>
          <p>Pending Chunks: {status.pending_chunks}</p>
          <p>Indexed Percentage: {status.indexed_percentage.toFixed(2)}%</p>
          
          <button 
            onClick={handleIndex} 
            disabled={indexing}
            style={{ 
              marginTop: '1rem', 
              padding: '0.5rem 1rem', 
              background: indexing ? '#666' : '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: indexing ? 'not-allowed' : 'pointer'
            }}
          >
            {indexing ? 'Indexing...' : 'Run Indexing'}
          </button>
        </div>
      )}

      {/* RETRIEVAL SANDBOX */}
      <div style={{ background: '#222', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #444' }}>
        <h2>Retrieval Sandbox</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="E.g. Can I make this less spicy?"
            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: 'white' }}
          />
          <button 
            onClick={handleSearch}
            disabled={searching}
            style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {retrievalResult && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Pipeline Visualization</h3>
            <div style={{ background: '#111', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem', marginBottom: '1rem' }}>
              <p><strong>Query:</strong> {retrievalResult.query}</p>
              <p><strong>Vector Dimensions:</strong> {retrievalResult.embedded_query.length}</p>
              <p><strong>Latency:</strong> {retrievalResult.latency_ms.toFixed(2)}ms</p>
              <p><strong>Total Context Size:</strong> {retrievalResult.total_tokens} tokens ({retrievalResult.context_size_bytes} bytes)</p>
            </div>

            <h4>Retrieved Chunks</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {retrievalResult.chunks.map((chunk: any) => (
                <div key={chunk.chunk_id} style={{ border: '1px solid #3b82f6', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{chunk.document_title} ({chunk.document_type})</strong>
                    <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>Sim: {chunk.score.toFixed(3)}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>Source: {chunk.source} | Verified: {chunk.verification_status}</p>
                  <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>{chunk.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {contextPreview && (
          <div>
            <h3>Final Prompt Preview</h3>
            <pre style={{ background: '#111', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.85rem', whiteSpace: 'pre-wrap', border: '1px solid #555' }}>
              {contextPreview.final_prompt}
            </pre>
          </div>
        )}
      </div>

      <h2>Chunks Database ({chunks.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {chunks.map(chunk => (
          <div key={chunk.id} style={{ border: '1px solid #555', padding: '1rem', borderRadius: '4px' }}>
            <h4>{chunk.title} (Index: {chunk.chunk_index})</h4>
            <span style={{ 
              display: 'inline-block',
              background: chunk.embedding_status === 'COMPLETED' ? '#22c55e' : '#eab308',
              color: 'black',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              marginBottom: '0.5rem'
            }}>
              {chunk.embedding_status}
            </span>
            <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Tokens: {chunk.token_count}</p>
            <p style={{ fontStyle: 'italic', background: '#222', padding: '0.5rem' }}>{chunk.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
