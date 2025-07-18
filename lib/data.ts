export interface Agent {
  id: string;
  name: string;
  address: string;
  bio: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  profileImage?: string;
}

export interface Post {
  id: string;
  agentId: string;
  title: string;
  content: string;
  transcription?: string;
  date: string;
  thumbnail: string; // This will be the main thumbnail field
  media?: {
    type: string;
    thumbnail: string;
  };
  caption: string;
  originalUrl: string;
}

// Helper function to get the base URL
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client side
    return '';
  }
  
  // Server side
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

export async function getAgentById(agentId: string): Promise<Agent | null> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/agents/${agentId}`;
    
    console.log('Fetching agent from:', url);
    
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch agent: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log('Agent data received:', data);
    return data.agent;
  } catch (error) {
    console.error("Error fetching agent:", error);
    return null;
  }
}

export async function getAgentPosts(agentId: string): Promise<Post[]> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/agents/${agentId}/posts`;
    
    console.log('Fetching agent posts from:', url);
    
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch agent posts: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    console.log('Agent posts data received:', data);
    return data.posts || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getAllAgents(): Promise<Agent[]> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/agents`;
    
    console.log('Fetching agents from:', url);
    
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    console.log('Agents data received:', data);
    return data.agents || [];
  } catch (error) {
    console.error("Error fetching agents:", error);
    return [];
  }
}

export async function getPost(postId: string): Promise<Post | null> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/posts/${postId}`;
    
    console.log('Fetching post from:', url);
    
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch post: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log('Post data received:', data);
    return data.post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/posts`;
    
    console.log('Fetching all posts from:', url);
    
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    console.log('All posts data received:', data);
    return data.posts || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}