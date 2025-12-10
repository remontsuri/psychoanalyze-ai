# 🧠 PsychoAnalyze AI

> **AI-Powered Psychological Interview Analysis Tool** — Advanced system for analyzing psychological interviews using Google Gemini 3 Pro API with defense mechanisms detection and attachment style analysis.

[![GitHub](https://img.shields.io/github/license/remontsuri/psychoanalyze-ai?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-96.3%25-blue?style=flat-square)]()
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)]()

## ✨ Features

- 🤖 **AI-Powered Analysis** — Uses Google Gemini 3 Pro API for intelligent interview analysis
- 🛡️ **Defense Mechanisms Detection** — Identifies protective patterns (Suppression, Avoidance, Rationalization)
- 💝 **Attachment Style Analysis** — Determines attachment patterns with confidence scores
- 📊 **Emotion Tracking** — Real-time emotion trend analysis (happiness, sadness, anger, anxiety)
- 🎯 **Therapy Recommendations** — Generates personalized therapy suggestions
- 🔄 **Comparison Mode** — Compare multiple psychological interviews side-by-side
- 📥 **Multi-language Support** — Analyze interviews in multiple languages
- 📤 **Export Reports** — Download analysis results as PDF or Excel
- ⚡ **Real-time Processing** — Instant analysis with streaming results

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0+ 
- **npm** or **yarn**
- **Google Gemini API Key** (Get it from [ai.google.dev](https://ai.google.dev))

### Installation

```bash
# Clone the repository
git clone https://github.com/remontsuri/psychoanalyze-ai.git
cd psychoanalyze-ai

# Install dependencies
npm install

# Create .env.local file
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env.local
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
psychoanalyze-ai/
├── src/
│   ├── components/           # React components
│   │   ├── InputSection.tsx  # Input form with file upload
│   │   ├── Dashboard.tsx     # Results dashboard
│   │   └── ComparisonView.tsx # Comparison interface
│   ├── services/            # API and business logic
│   │   └── geminiService.ts # Google Gemini integration
│   ├── App.tsx              # Main app component
│   ├── index.tsx            # React entry point
│   └── types.ts             # TypeScript type definitions
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite bundler config
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` file in the project root:

```env
# Required: Your Google Gemini API Key
VITE_GEMINI_API_KEY=your_api_key_here

# Optional: API endpoint (defaults to Google AI)
VITE_API_ENDPOINT=https://generativelanguage.googleapis.com
```

## 📊 Analysis Output

The tool provides:

- **Summary** — Brief overview of the psychological interview
- **Defense Mechanisms** — Detected protective patterns with frequency and examples
- **Attachment Profile** — Attachment style classification with confidence score
- **Emotional Trends** — Chart showing emotion fluctuations over time
- **Therapy Recommendations** — Personalized suggestions based on analysis
- **Key Quotes** — Important excerpts with psychological interpretation
- **Risk Assessment** — Low/Medium/High risk level based on content

## 🎯 Technology Stack

| Technology | Purpose |
|-----------|----------|
| **React 19** | UI framework |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool & dev server |
| **Tailwind CSS** | Styling |
| **Google Gemini API** | AI-powered analysis |
| **Recharts** | Data visualization |
| **HTML2Canvas** | PDF export |
| **SheetJS** | Excel export |

## 💻 API Integration

The project integrates with Google Gemini 3 Pro API:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: "gemini-3-pro" });
const response = await model.generateContent(prompt);
```

## 📝 Usage Example

1. **Enter Interview Text** — Paste or upload a psychological interview transcript
2. **Click Analyze** — AI processes the content using Gemini
3. **View Results** — Explore detailed psychological analysis and metrics
4. **Compare** — Select multiple analyses to compare patterns
5. **Export** — Download report as PDF or Excel spreadsheet

## 🔐 Security

- API keys stored in environment variables (never hardcoded)
- Sensitive data processed client-side when possible
- No data sent to external servers except Google Gemini API
- All analysis results are local to your session

## 📄 License

MIT License © 2025 — See [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open a [GitHub Issue](https://github.com/remontsuri/psychoanalyze-ai/issues)

## 🙏 Acknowledgments

- Built with [Google Gemini API](https://ai.google.dev)
- UI powered by [React](https://react.dev) and [Tailwind CSS](https://tailwindcss.com)
- Data visualization with [Recharts](https://recharts.org)

---

**Made with ❤️ for psychology professionals and researchers**
