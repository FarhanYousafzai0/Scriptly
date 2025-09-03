# SCRIPTLY 🎬

![Scriptly Banner](/scriptly-banner.png)

An AI-powered platform that eliminates content creator burnout by automatically generating unlimited video ideas, complete scripts, SEO-optimized titles, and social media captions based on your niche.

Simply input your content category, and get ready-to-use content packages in seconds. No more staring at blank pages or spending hours brainstorming.

## ✨ Features

- **🧠 AI-Powered Script Generation** - Generate complete scripts for any content type
- **💡 Unlimited Content Ideas** - Never run out of creative concepts
- **🎯 SEO-Optimized Titles** - Boost your content's discoverability
- **📱 Social Media Captions** - Ready-to-use captions for all platforms
- **🎨 Multi-Format Support** - YouTube, blogs, TikTok, Instagram, and more
- **⚡ Instant Generation** - Get results in seconds, not hours
- **🎪 Niche-Specific Content** - Tailored to your audience and industry

## 🚀 Demo

![Scriptly Demo](./demo-screenshot.png)

Try it live: [scriptly-demo.vercel.app](https://your-demo-link.com)

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

- **Frontend**: Next.js 15, React 19, JavaScript
- **Styling**: Tailwind CSS v4, Shadcn/ui Components
- **AI Integration**: OpenRouter API (OpenAI GPT-4, Claude, etc.)
- **Deployment**: Vercel
- **Database**: MongoDB with Mongoose
- **Rate Limiting**: rate-limiter-flexible

## 🎯 Perfect For

- **YouTubers** - Script generation for any video topic
- **Bloggers** - Article outlines and content ideas
- **Social Media Managers** - Captions and post ideas
- **Content Marketers** - SEO-optimized content strategies
- **Podcasters** - Episode scripts and show notes
- **Influencers** - Engaging content across platforms

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scriptly.git
   cd scriptly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database-name
   
   # OpenRouter API Configuration
   OPENROUTER_API_KEY=your-openrouter-api-key-here
   OPENROUTER_SITE_URL=http://localhost:3000
   OPENROUTER_APP_TITLE=Scriptly
   
   # NextAuth Configuration (if using authentication)
   NEXTAUTH_SECRET=your-nextauth-secret-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Rate Limiting (optional)
   RATE_LIMIT_POINTS=60
   RATE_LIMIT_DURATION=600
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📖 Usage

1. **Select Your Niche** - Choose from content categories or enter custom niche
2. **Input Your Prompt** - Describe what type of content you want to create
3. **Generate Content** - Let AI create scripts, titles, and captions
4. **Customize & Export** - Edit generated content and export in various formats

## 🌟 Key Benefits

- ⏰ **Save Hours of Brainstorming** - Generate content ideas instantly
- 🎯 **Stay Consistent** - Never miss posting schedules due to lack of ideas
- 📈 **Boost Engagement** - AI-optimized content performs better
- 💰 **Increase Revenue** - More content = more opportunities to monetize
- 🧠 **Beat Creative Block** - Always have fresh ideas at your fingertips

## 📁 Project Structure

```
scriptly/
├── app/                    # Next.js 15 app directory
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── (marketing)/       # Marketing pages
│   ├── api/               # API routes
│   │   ├── ai/           # AI chat endpoint
│   │   ├── agents/       # Agent presets
│   │   ├── conversations/ # Conversation management
│   │   └── prompts/      # Prompt management
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── chat/             # Chat components
│   └── Layout/           # Layout components
├── lib/                  # Utility functions and configurations
│   ├── mongodb.js        # Database connection
│   ├── openrouter.js     # AI API integration
│   ├── rateLimiter.js    # Rate limiting
│   └── agentPresets.js   # AI agent configurations
└── public/               # Static assets
```

## 🔧 Environment Variables

Make sure to set up the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes |
| `OPENROUTER_SITE_URL` | Your site URL for OpenRouter | Yes |
| `OPENROUTER_APP_TITLE` | Your app title for OpenRouter | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | No |
| `NEXTAUTH_URL` | NextAuth URL | No |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Contact

**Muhammad Farhan** - [Your Email](mailto:your.email@example.com)

Portfolio: [muhammad-farhan-pi.vercel.app](https://muhammad-farhan-pi.vercel.app/)

Project Link: [https://github.com/yourusername/scriptly](https://github.com/yourusername/scriptly)

---

⭐ **Star this repo if you find it helpful!**

*Built with ❤️ by [Muhammad Farhan](https://muhammad-farhan-pi.vercel.app/)*