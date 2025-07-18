import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { agentId: string } }) {
  let connection;
  try {
    const { params } = context;
    const awaitedParams = await params;
    console.log(`API: Fetching posts for agent ${awaitedParams.agentId}`);
    connection = await db.getConnection();

    // Query posts with proper column mapping
    const [posts] = await connection.query(
      `SELECT 
        id,
        agent_id AS agentId,
        title,
        content,
        transcription,
        date,
        caption,
        original_url AS originalUrl,
        thumbnail
      FROM posts 
      WHERE agent_id = ?
      ORDER BY date DESC, created_at DESC`,
      [awaitedParams.agentId]
    );

    console.log(`API: Found ${(posts as any[]).length} posts for agent ${awaitedParams.agentId}`);

    const formattedPosts = (posts as any[]).map(post => ({
      id: post.id,
      agentId: post.agentId,
      title: post.title || '',
      content: post.content || '',
      transcription: post.transcription || null,
      date: post.date,
      caption: post.caption || '',
      originalUrl: post.originalUrl || '',
      thumbnail: post.thumbnail, // Use the thumbnail from database
      media: {
        type: 'image', // Default to image
        thumbnail: post.thumbnail // Use database thumbnail
      }
    }));

    console.log(`API: Returning formatted posts:`, formattedPosts);

    return NextResponse.json({ 
      posts: formattedPosts,
      count: formattedPosts.length 
    }, { status: 200 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error',
      posts: [] // Return empty array as fallback
    }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}