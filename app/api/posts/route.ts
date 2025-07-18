import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let connection;
  try {
    console.log('API: Fetching all posts');
    connection = await db.getConnection();

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
        thumbnail,
        enhanced_content AS enhancedContent
      FROM posts 
      ORDER BY date DESC, created_at DESC`
    );

    const formattedPosts = (posts as any[]).map(post => ({
      id: post.id,
      agentId: post.agentId,
      title: post.title,
      content: post.content,
      transcription: post.transcription,
      date: post.date,
      caption: post.caption,
      originalUrl: post.originalUrl,
      thumbnail: post.thumbnail, // Use thumbnail from database
      media: {
        type: 'image',
        thumbnail: post.thumbnail // Use database thumbnail
      },
      enhancedContent: post.enhancedContent
    }));

    console.log(`API: Found ${formattedPosts.length} posts`);
    return NextResponse.json({ 
      posts: formattedPosts,
      count: formattedPosts.length 
    }, { status: 200 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error',
      posts: []
    }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    const { id, agentId, title, content, transcription, caption, originalUrl, thumbnail } = body;

    connection = await db.getConnection();

    await connection.query(
      `INSERT INTO posts (id, agent_id, title, content, transcription, date, caption, original_url, thumbnail) 
       VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)`,
      [id, agentId, title, content, transcription, caption, originalUrl, thumbnail]
    );

    return NextResponse.json({ message: "Post created successfully" }, { status: 201 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}