import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let connection;
  try {
    console.log('API: Starting to fetch agents...');
    connection = await db.getConnection();
    console.log('API: Database connection established');

    // Initialize database (create tables if they don't exist)
    await initializeDatabase();

    // Now fetch agents
    const [agents] = await connection.query(
      `SELECT 
        id, 
        name, 
        profile_image, 
        address, 
        bio, 
        instagram, 
        twitter, 
        linkedin
       FROM agents 
       ORDER BY name`
    );

    console.log(`API: Found ${(agents as any[]).length} agents`);

    // Format agents data properly
    const formattedAgents = (agents as any[]).map(agent => ({
      id: agent.id,
      name: agent.name,
      address: agent.address,
      bio: agent.bio,
      instagram: agent.instagram,
      twitter: agent.twitter,
      linkedin: agent.linkedin,
      profileImage: agent.profile_image
    }));

    console.log('API: Returning agents data:', formattedAgents);
    return NextResponse.json({ 
      agents: formattedAgents,
      count: formattedAgents.length 
    }, { status: 200 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error',
      agents: [] // Return empty array as fallback
    }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Import the initializeDatabase function
import { initializeDatabase } from "@/lib/db";

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    const { id, name, profileImage, address, bio, instagram, twitter, linkedin } = body;

    connection = await db.getConnection();

    await connection.query(
      `INSERT INTO agents (id, name, profile_image, address, bio, instagram, twitter, linkedin) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, profileImage, address, bio, instagram, twitter, linkedin]
    );

    return NextResponse.json({ message: "Agent created successfully" }, { status: 201 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}