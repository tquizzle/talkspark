import { Storage, MemoryStorage } from './storage';
import { Starter } from '../types';

// In development, use memory storage
let storage: Storage;

if (typeof __STATIC_CONTENT_MANIFEST === 'undefined') {
  // We're in dev mode - use memory storage
  storage = new MemoryStorage();
} else {
  // We're in production - use KV storage
  // @ts-ignore: KV namespaces are injected by wrangler
  storage = new Storage(
    TALKSPARK_STARTERS,
    TALKSPARK_PENDING,
    TALKSPARK_THEMES
  );
}

interface Env {
  // KV namespaces are bound here
  TALKSPARK_STARTERS: KVNamespace;
  TALKSPARK_PENDING: KVNamespace;
  TALKSPARK_THEMES: KVNamespace;
}

// Helper to handle CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, restrict to your Pages domain
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle preflight requests
function handleOptions(request: Request): Response {
  if (request.headers.get('Origin') !== null &&
      request.headers.get('Access-Control-Request-Method') !== null &&
      request.headers.get('Access-Control-Request-Headers') !== null) {
    return new Response(null, {
      headers: corsHeaders
    });
  } else {
    return new Response(null, {
      headers: {
        'Allow': 'GET, POST, OPTIONS'
      }
    });
  }
}

// Helper to create JSON responses with CORS
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Helper to create error responses
function errorResponse(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Update storage reference with actual KV namespaces in production
    if (storage instanceof MemoryStorage && typeof env.TALKSPARK_STARTERS !== 'undefined') {
      storage = new Storage(
        env.TALKSPARK_STARTERS,
        env.TALKSPARK_PENDING,
        env.TALKSPARK_THEMES
      );
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    // API routes
    if (path.startsWith('/api/')) {
      const apiPath = path.substring(5); // Remove '/api/' prefix

      try {
        switch (apiPath) {
          case 'conversations':
            if (request.method === 'GET') {
              const starters = await storage.getAllStarters();
              return jsonResponse(starters);
            } else if (request.method === 'POST') {
              const starterData = await request.json() as Omit<Starter, 'id'>;
              // Basic validation
              if (!starterData.text || !starterData.category) {
                return errorResponse('Text and category are required');
              }
              const id = await storage.saveStarter(starterData);
              return jsonResponse({ id }, 201);
            } else {
              return errorResponse('Method not allowed', 405);
            }

          case 'conversations/random':
            if (request.method === 'GET') {
              const starters = await storage.getAllStarters();
              if (starters.length === 0) {
                return jsonResponse(null);
              }
              const randomIndex = Math.floor(Math.random() * starters.length);
              return jsonResponse(starters[randomIndex]);
            } else {
              return errorResponse('Method not allowed', 405);
            }

          case 'admin/pending':
            if (request.method === 'GET') {
              // In a real app, you'd check authentication here
              // For now, we'll allow access (matching current mock behavior)
              const pendingIds = await storage.getPendingIds();
              const pendingPromises = pendingIds.map(id => storage.getStarterById(id));
              const pendingStarters = await Promise.all(pendingPromises);
              // Filter out nulls (in case of inconsistent state)
              const filtered = pendingStarters.filter((starter): starter is Starter => starter !== null);
              return jsonResponse(filtered);
            } else {
              return errorResponse('Method not allowed', 405);
            }

          default:
            if (apiPath.startsWith('admin/approve/') && request.method === 'POST') {
              const id = parseInt(apiPath.substring(14)); // Remove 'admin/approve/' prefix
              if (isNaN(id)) {
                return errorResponse('Invalid ID', 400);
              }

              const starter = await storage.getStarterById(id);
              if (!starter) {
                return errorResponse('Starter not found', 404);
              }

              // Update status to approved
              const updatedStarter = { ...starter, status: 'approved' };
              await storage.starters.put(
                storage instanceof MemoryStorage
                  ? `starter:${id}`
                  : `starter:${id}`,
                updatedStarter
              );

              // Remove from pending
              await storage.removePendingId(id);

              return jsonResponse({ success: true });
            } else if (apiPath.startsWith('admin/reject/') && request.method === 'POST') {
              const id = parseInt(apiPath.substring(13)); // Remove 'admin/reject/' prefix
              if (isNaN(id)) {
                return errorResponse('Invalid ID', 400);
              }

              const starter = await storage.getStarterById(id);
              if (!starter) {
                return errorResponse('Starter not found', 404);
              }

              // Remove from pending (starter remains in storage but not in pending queue)
              await storage.removePendingId(id);

              return jsonResponse({ success: true });
            } else {
              return errorResponse('Not found', 404);
            }
        }
      } catch (error) {
        console.error('Worker error:', error);
        return errorResponse('Internal server error', 500);
      }
    }

    // If not an API route, serve static assets (for local development with wrangler dev)
    // In production with Pages, this won't be used as Pages serves static assets
    return new Response('Not Found', { status: 404 });
  }
};