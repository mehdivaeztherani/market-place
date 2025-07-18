// Data Seeder Script for Dubai Agents Marketplace
// This script populates the database with sample data for testing and development

const fs = require("fs").promises

class DataSeeder {
  constructor() {
    this.agents = []
    this.posts = []
  }

  /**
   * Generate comprehensive sample data for agents
   */
  generateAgents() {
    const sampleAgents = [
      {
        id: "ahmed-hassan",
        name: "Ahmed Hassan",
        profile_image: "/placeholder.svg?height=400&width=400",
        address: "Downtown Dubai, UAE",
        bio: "Experienced real estate professional specializing in luxury properties in Downtown Dubai and Dubai Marina. With over 8 years in the industry, I help clients find their dream homes and investment opportunities in Dubai's most prestigious locations.",
        experience: 8,
        phone: "+971 50 123 4567",
        email: "ahmed.hassan@dubaiagents.com",
        instagramHandle: "ahmed_dubai_properties",
        linkedinHandle: "ahmed-hassan-dubai",
        twitterHandle: "ahmed_dubai_re",
        specialties: ["Luxury Properties", "Downtown Dubai", "Investment Properties", "Off-Plan Sales"],
        certifications: ["RERA Certified Agent", "Dubai Real Estate Institute Graduate", "Luxury Property Specialist"],
        rating: 4.9,
        reviewCount: 127,
      },
      {
        id: "sarah-williams",
        name: "Sarah Williams",
        profile_image: "/placeholder.svg?height=400&width=400",
        address: "Dubai Marina, UAE",
        bio: "British expat with 6 years of experience in Dubai's real estate market. I specialize in helping international clients navigate the Dubai property market, with expertise in Marina, JBR, and Palm Jumeirah areas.",
        experience: 6,
        phone: "+971 55 987 6543",
        email: "sarah.williams@dubaiagents.com",
        instagramHandle: "sarah_dubai_homes",
        linkedinHandle: "sarah-williams-dubai-re",
        specialties: ["Dubai Marina", "JBR", "Palm Jumeirah", "Expat Services"],
        certifications: ["RERA Certified Agent", "International Property Consultant"],
        rating: 4.8,
        reviewCount: 89,
      },
      {
        id: "omar-al-mansouri",
        name: "Omar Al Mansouri",
        profile_image: "/placeholder.svg?height=400&width=400",
        address: "Business Bay, UAE",
        bio: "Local Dubai expert with deep knowledge of emerging neighborhoods and off-plan developments. Specializing in Business Bay, DIFC, and upcoming areas with high growth potential.",
        experience: 10,
        phone: "+971 52 456 7890",
        email: "omar.almansouri@dubaiagents.com",
        instagramHandle: "omar_dubai_expert",
        linkedinHandle: "omar-al-mansouri-dubai",
        twitterHandle: "omar_dubai_prop",
        specialties: ["Business Bay", "DIFC", "Off-Plan Developments", "Commercial Properties"],
        certifications: ["RERA Certified Agent", "Commercial Real Estate Specialist", "Off-Plan Development Expert"],
        rating: 4.9,
        reviewCount: 156,
      },
      {
        id: "priya-sharma",
        name: "Priya Sharma",
        profile_image: "/placeholder.svg?height=400&width=400",
        address: "Jumeirah Village Circle, UAE",
        bio: "Dedicated to helping families find perfect homes in Dubai's family-friendly communities. Expert in JVC, JVT, and other emerging residential areas with great amenities and schools.",
        experience: 5,
        phone: "+971 56 234 5678",
        email: "priya.sharma@dubaiagents.com",
        instagramHandle: "priya_dubai_families",
        linkedinHandle: "priya-sharma-dubai-homes",
        specialties: ["Family Homes", "JVC", "JVT", "School Districts"],
        certifications: ["RERA Certified Agent", "Family Housing Specialist"],
        rating: 4.7,
        reviewCount: 73,
      },
      {
        id: "james-mitchell",
        name: "James Mitchell",
        profile_image: "/placeholder.svg?height=400&width=400",
        address: "Dubai Hills Estate, UAE",
        bio: "Luxury property specialist focusing on Dubai Hills Estate, Emirates Hills, and other premium golf course communities. Helping high-net-worth individuals find exclusive properties.",
        experience: 12,
        phone: "+971 50 345 6789",
        email: "james.mitchell@dubaiagents.com",
        instagramHandle: "james_luxury_dubai",
        linkedinHandle: "james-mitchell-luxury-re",
        twitterHandle: "james_dubai_luxury",
        specialties: ["Luxury Villas", "Golf Course Properties", "Dubai Hills", "Emirates Hills"],
        certifications: ["RERA Certified Agent", "Luxury Property Specialist", "International Real Estate Expert"],
        rating: 5.0,
        reviewCount: 94,
      },
      {
        id: "fatima-al-zahra",
        name: "Fatima Al Zahra",
        profile_image: "/placeholder.svg?height=400&width=400",
        address: "Arabian Ranches, UAE",
        bio: "Specializing in villa communities and family-oriented developments. Expert in Arabian Ranches, Mudon, and other established villa communities with strong community feel.",
        experience: 7,
        phone: "+971 55 678 9012",
        email: "fatima.alzahra@dubaiagents.com",
        instagramHandle: "fatima_dubai_villas",
        linkedinHandle: "fatima-al-zahra-dubai",
        specialties: ["Villa Communities", "Arabian Ranches", "Mudon", "Family Properties"],
        certifications: ["RERA Certified Agent", "Villa Community Specialist"],
        rating: 4.8,
        reviewCount: 112,
      },
    ]

    this.agents = sampleAgents
    console.log(`Generated ${sampleAgents.length} sample agents`)
    return sampleAgents
  }

  /**
   * Generate sample posts for each agent
   */
  generatePosts() {
    const postTemplates = [
      {
        caption:
          "🏙️ Just closed another amazing deal in Downtown Dubai! This stunning 2BR apartment with Burj Khalifa views is now home to a lovely family from the UK. The Dubai real estate market continues to show strong growth, especially in prime locations like this. #DubaiRealEstate #DowntownDubai #BurjKhalifaViews #PropertyInvestment",
        type: "image",
        hashtags: ["DubaiRealEstate", "DowntownDubai", "BurjKhalifaViews", "PropertyInvestment"],
      },
      {
        caption:
          "🎥 Take a virtual tour of this incredible penthouse in Downtown Dubai! Featuring panoramic city views, premium finishes, and access to world-class amenities. This is luxury living at its finest. Contact me for more details! #LuxuryLiving #PenthouseDubai #VirtualTour",
        type: "video",
        hashtags: ["LuxuryLiving", "PenthouseDubai", "VirtualTour"],
        transcription:
          "Welcome to this stunning penthouse in the heart of Downtown Dubai. As you can see, the living area features floor-to-ceiling windows with breathtaking views of the Burj Khalifa and Dubai Fountain. The kitchen is equipped with top-of-the-line appliances and premium marble countertops.",
      },
      {
        caption:
          "🌊 Marina living at its best! Just listed this beautiful 1BR apartment with stunning marina views. Perfect for young professionals or as an investment property. The Dubai Marina continues to be one of the most sought-after locations for both residents and investors. #DubaiMarina #MarinaViews #InvestmentOpportunity",
        type: "image",
        hashtags: ["DubaiMarina", "MarinaViews", "InvestmentOpportunity"],
      },
      {
        caption:
          "🏗️ Exciting off-plan opportunity in Business Bay! This new development offers modern design, premium amenities, and flexible payment plans. Perfect timing to invest in Dubai's growing business district. Early bird prices available! #OffPlan #BusinessBay #NewDevelopment #InvestmentOpportunity",
        type: "image",
        hashtags: ["OffPlan", "BusinessBay", "NewDevelopment", "InvestmentOpportunity"],
      },
      {
        caption:
          "👨‍👩‍👧‍👦 Family-friendly living in JVC! This spacious 3BR apartment is perfect for growing families. Close to schools, parks, and community amenities. JVC offers the perfect balance of affordability and quality of life in Dubai. #FamilyLiving #JVC #FamilyFriendly #AffordableHomes",
        type: "video",
        hashtags: ["FamilyLiving", "JVC", "FamilyFriendly", "AffordableHomes"],
        transcription:
          "Here we have a wonderful family home in Jumeirah Village Circle. The spacious living area is perfect for family gatherings, and as you can see, there's plenty of natural light throughout. The kitchen is well-designed with ample storage space.",
      },
    ]

    const allPosts = []
    let postCounter = 1

    this.agents.forEach((agent) => {
      // Generate 3-5 posts per agent
      const postCount = Math.floor(Math.random() * 3) + 3

      for (let i = 0; i < postCount; i++) {
        const template = postTemplates[Math.floor(Math.random() * postTemplates.length)]
        const daysAgo = Math.floor(Math.random() * 30) + 1
        const postDate = new Date()
        postDate.setDate(postDate.getDate() - daysAgo)

        // Assign a real image from public/posts/post_X_thumbnail.jpg, cycling through 1-5
        const imageIndex = ((postCounter - 1) % 5) + 1
        const realThumbnail = `/posts/post_${imageIndex}_thumbnail.jpg`

        const post = {
          id: `post-${postCounter}`,
          agentId: agent.id,
          caption: template.caption,
          thumbnail: realThumbnail,
          media: {
            type: template.type,
            thumbnail: realThumbnail,
            url: "/placeholder.svg?height=1200&width=1200",
          },
          transcription: template.transcription || null,
          date: postDate.toISOString(),
          originalUrl: `https://instagram.com/p/${agent.instagramHandle}-${i + 1}`,
          hashtags: template.hashtags,
        }

        allPosts.push(post)
        postCounter++
      }
    })

    this.posts = allPosts
    console.log(`Generated ${allPosts.length} sample posts`)
    return allPosts
  }

  /**
   * Export data to JSON files
   */
  async exportToJSON() {
    try {
      // Export agents
      await fs.writeFile("agents-data.json", JSON.stringify(this.agents, null, 2), "utf8")
      console.log("Agents data exported to agents-data.json")

      // Export posts
      await fs.writeFile("posts-data.json", JSON.stringify(this.posts, null, 2), "utf8")
      console.log("Posts data exported to posts-data.json")

      // Export combined data
      const combinedData = {
        agents: this.agents,
        posts: this.posts,
        metadata: {
          generatedAt: new Date().toISOString(),
          totalAgents: this.agents.length,
          totalPosts: this.posts.length,
        },
      }

      await fs.writeFile("marketplace-data.json", JSON.stringify(combinedData, null, 2), "utf8")
      console.log("Combined data exported to marketplace-data.json")
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  /**
   * Generate SQL INSERT statements
   */
  generateSQLInserts() {
    let sql = "-- Generated INSERT statements for Dubai Agents Marketplace\n\n"

    // Agents INSERT statements
    sql += "-- Insert agents\n"
    this.agents.forEach((agent) => {
      sql += `INSERT INTO agents (id, name, profile_image, address, bio, experience, phone, email, instagram_handle, linkedin_handle, twitter_handle, rating, review_count) VALUES\n`
      sql += `('${agent.id}', '${agent.name.replace(/'/g, "''")}', '${agent.profile_image}', '${agent.address}', '${agent.bio.replace(/'/g, "''")}', ${agent.experience}, '${agent.phone}', '${agent.email}', '${agent.instagramHandle}', '${agent.linkedinHandle || "NULL"}', '${agent.twitterHandle || "NULL"}', ${agent.rating}, ${agent.reviewCount});\n\n`
    })

    // Specialties INSERT statements
    sql += "-- Insert agent specialties\n"
    this.agents.forEach((agent) => {
      agent.specialties.forEach((specialty) => {
        sql += `INSERT INTO agent_specialties (agent_id, specialty) VALUES ('${agent.id}', '${specialty}');\n`
      })
    })

    // Certifications INSERT statements
    sql += "\n-- Insert agent certifications\n"
    this.agents.forEach((agent) => {
      if (agent.certifications) {
        agent.certifications.forEach((cert) => {
          sql += `INSERT INTO agent_certifications (agent_id, certification) VALUES ('${agent.id}', '${cert}');\n`
        })
      }
    })

    // Posts INSERT statements
    sql += "\n-- Insert posts\n"
    this.posts.forEach((post) => {
      const transcription = post.transcription ? `'${post.transcription.replace(/'/g, "''")}'` : "NULL"
      sql += `INSERT INTO posts (id, agent_id, caption, media_type, media_thumbnail, media_url, transcription, post_date, original_url) VALUES\n`
      sql += `('${post.id}', '${post.agentId}', '${post.caption.replace(/'/g, "''")}', '${post.media.type}', '${post.media.thumbnail}', '${post.media.url}', ${transcription}, '${post.date}', '${post.originalUrl}');\n\n`
    })

    // Hashtags INSERT statements
    sql += "-- Insert post hashtags\n"
    this.posts.forEach((post) => {
      post.hashtags.forEach((hashtag) => {
        sql += `INSERT INTO post_hashtags (post_id, hashtag) VALUES ('${post.id}', '${hashtag}');\n`
      })
    })

    return sql
  }

  /**
   * Export SQL INSERT statements to file
   */
  async exportSQL() {
    try {
      const sql = this.generateSQLInserts()
      await fs.writeFile("sample-data-inserts.sql", sql, "utf8")
      console.log("SQL INSERT statements exported to sample-data-inserts.sql")
    } catch (error) {
      console.error("Error exporting SQL:", error)
    }
  }

  /**
   * Run the complete data seeding process
   */
  async run() {
    console.log("🌱 Starting data seeding process...\n")

    // Generate data
    this.generateAgents()
    this.generatePosts()

    // Export to different formats
    await this.exportToJSON()
    await this.exportSQL()

    console.log("\n✅ Data seeding completed successfully!")
    console.log(`📊 Summary:`)
    console.log(`   - ${this.agents.length} agents generated`)
    console.log(`   - ${this.posts.length} posts generated`)
    console.log(`   - Data exported to JSON and SQL formats`)
  }
}

// Run the seeder
const seeder = new DataSeeder()
seeder.run().catch(console.error)

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = DataSeeder
}
