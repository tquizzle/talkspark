import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from './worker';

// Mock Request and Response for testing
class MockRequest implements Request {
  method: string;
  url: string;
  headers: Headers;

  constructor(method: string, url: string, headers: Record<string, string> = {}) {
    this.method = method;
    this.url = url;
    this.headers = new Headers(headers);
  }

  async json() {
    return {};
  }

  // Required properties for Request interface
  [Symbol.toStringTag] = 'Request';
  body: any = null;
  bodyUsed: boolean = false;
  cache: RequestCache = 'default';
  credentials: RequestCredentials = 'same-origin';
  destination: RequestDestination = '';
  integrity: string = '';
  keepalive: boolean = false;
  mode: RequestMode = 'same-origin';
  redirect: RequestRedirect = 'follow';
  referrer: string = '';
  referrerPolicy: ReferrerPolicy = '';
  signal: AbortSignal | null = null;

  // Methods we don't need for this test
  arrayBuffer(): Promise<ArrayBuffer> { return Promise.resolve(new ArrayBuffer(0)); }
  blob(): Promise<Blob> { return Promise.resolve(new Blob()); }
  formData(): Promise<FormData> { return Promise.resolve(new FormData()); }
  text(): Promise<string> { return Promise.resolve(''); }
  clone(): Request { return new MockRequest(this.method, this.url); }
}

describe('Cloudflare Worker', () => {
  let env: any;

  beforeEach(() => {
    // Mock KV namespaces
    env = {
      TALKSPARK_STARTERS: {
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        list: vi.fn()
      },
      TALKSPARK_PENDING: {
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        list: vi.fn()
      },
      TALKSPARK_THEMES: {
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        list: vi.fn()
      }
    };

    // Mock the storage initialization
    vi.stubGlobal('__STATIC_CONTENT_MANIFEST', {});
  });

  it('should handle GET /api/conversations', async () => {
    // Mock returning empty array
    env.TALKSPARK_STARTERS.get.mockResolvedValue([]);

    const request = new MockRequest('GET', 'http://example.com/api/conversations');
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
    expect(env.TALKSPARK_STARTERS.get).toHaveBeenCalledWith('all');
  });

  it('should handle POST /api/conversations', async () => {
    // Mock getting all starters (empty array) and then storing
    env.TALKSPARK_STARTERS.get.mockResolvedValueOnce([]); // For getting all starters
    env.TALKSPARK_STARTERS.put.mockResolvedValue(undefined); // For storing individual starter
    env.TALKSPARK_STARTERS.put.mockResolvedValue(undefined); // For updating all starters list

    const request = new MockRequest(
      'POST',
      'http://example.com/api/conversations',
      {}
    );
    // Override json method to return test data
    (request as any).json = vi.fn().mockResolvedValue({
      text: 'Test question',
      category: '🎯 Aspirations & Skills',
      questionType: 'open',
      focus: 'testing'
    });

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(typeof data.id).toBe('number');
  });

  it('should handle GET /api/conversations/random', async () => {
    const mockStarters = [
      { id: 1, text: 'Question 1', category: '🎯 Aspirations & Skills', questionType: 'open', focus: 'test', status: 'pending' },
      { id: 2, text: 'Question 2', category: '🌍 Big Picture & Worldview', questionType: 'open', focus: 'test', status: 'pending' }
    ];
    env.TALKSPARK_STARTERS.get.mockResolvedValue(mockStarters);

    const request = new MockRequest('GET', 'http://example.com/api/conversations/random');
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('text');
    expect(['Question 1', 'Question 2']).toContain(data.text);
  });

  it('should handle OPTIONS request (CORS preflight)', async () => {
    const request = new MockRequest('OPTIONS', 'http://example.com/api/conversations', {
      'Origin': 'http://example.com',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    });

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(204); // No content for successful preflight
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });
});