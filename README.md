# 🧠 PsychoAnalyze AI

**AI-Powered Psychological Interview Analysis Tool**

An advanced system for analyzing psychological interviews using Google Gemini 3 Pro API with defense mechanisms detection and attachment style analysis.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-96.3%25-blue?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-white?style=flat-square&logo=vercel)](https://psychoanalyze-ai.vercel.app)

## 🚀 Overview

PsychoAnalyze AI leverages cutting-edge AI technology to provide deep psychological insights from interview transcripts and stenograms. The application employs advanced natural language processing to identify defense mechanisms, analyze attachment styles, track emotional patterns, and generate personalized therapy recommendations.

### Key Use Cases
- **Clinical Psychology**: Support therapists in session analysis and diagnosis
- **Research**: Streamline psychological interview data analysis
- **Training**: Educational tool for psychology students
- **Mental Health Assessment**: Quick initial interview screening and pattern detection

## ✨ Features

- 🤖 **AI-Powered Analysis** — Uses Google Gemini 3 Pro API for intelligent interview analysis
- 🛡️ **Defense Mechanisms Detection** — Identifies protective patterns (Suppression, Avoidance, Rationalization)
- 💔 **Attachment Style Analysis** — Determines attachment patterns with confidence scores
- 😊 **Emotion Tracking** — Real-time emotion trend analysis (happiness, sadness, anger, anxiety)
- 💊 **Therapy Recommendations** — Generates personalized therapy suggestions
- 🔄 **Comparison Mode** — Compare multiple psychological interviews side-by-side
- 🌍 **Multi-language Support** — Analyze interviews in multiple languages (English, Russian, French, Spanish, German, Portuguese)
- 📊 **Export Reports** — Download analysis results as PDF or Excel
- ⚡ **Real-time Processing** — Instant analysis with streaming results
- 📁 **Case Study Database** — 5 comprehensive psychological case studies included

## 🔧 Technology Stack

**Frontend:**
- React 19.x with TypeScript
- Vite for development and builds
- Tailwind CSS for styling
- Gemini API (Google)

**Backend:**
- Node.js 18+
- Vercel Functions for serverless deployment

**Development Tools:**
- ESLint & Prettier for code quality
- Jest for unit testing
- TypeScript with strict mode
- GitHub Actions for CI/CD

## 📋 Prerequisites

- **Node.js** 18.0+
- **npm** or **yarn**
- **Google Gemini API Key** (Get it from [ai.google.dev](https://ai.google.dev))

## 🔐 Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/remontsuri/psychoanalyze-ai.git
   cd psychoanalyze-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. (Optional) Create `.env.example` for documentation:
   ```env
   VITE_GEMINI_API_KEY=your_api_key
   ```

## 🚀 Installation & Setup

### Local Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint errors
npm run lint:fix

# Format code with Prettier
npm run format

# Run unit tests (Jest)
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── components/
│   ├── InputSection.tsx         # Interview input form
│   ├── Dashboard.tsx            # Analysis results display
│   └── ComparisonView.tsx       # Side-by-side comparison
├── services/
│   └── geminiService.ts         # Google Gemini API integration
├── lib/
│   └── i18n.ts                  # Internationalization setup
├── types/
│   └── analysis.ts              # TypeScript type definitions
├── public/
│   ├── locales/
│   │   ├── en.json              # English translations (23 strings)
│   │   ├── ru.json              # Russian translations
│   │   ├── fr.json              # French translations (14 strings)
│   │   ├── es.json              # Spanish translations
│   │   ├── de.json              # German translations
│   │   └── pt.json              # Portuguese translations
│   └── index.html
├── App.tsx
└── main.tsx

root/
├── CASE_STUDIES.md              # 5 comprehensive psychological case studies
├── CONTRIBUTING.md              # Contribution guidelines
├── .env.local                   # Environment variables (local)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript config (strict mode)
├── jest.config.js               # Jest testing config
├── eslint.config.js             # ESLint configuration
└── vite.config.ts               # Vite build configuration

.github/
└── workflows/
    └── ci-cd.yml                # GitHub Actions CI/CD pipeline
```

## 🔄 How It Works

1. **Input Interview Transcript**: User pastes interview text or uploads a file
2. **AI Analysis**: Gemini 3 Pro analyzes the transcript using advanced prompts
3. **Pattern Detection**: System identifies defense mechanisms and attachment styles
4. **Emotion Tracking**: Real-time emotion trend visualization
5. **Therapy Recommendations**: Personalized suggestions based on analysis
6. **Export Results**: Download comprehensive report in PDF or Excel format
7. **Compare Interviews**: Optional side-by-side comparison of multiple interviews

## 📊 Analysis Output

Each analysis includes:

- **Defense Mechanisms**: Suppression, Avoidance, Rationalization scores
- **Attachment Style**: Secure/Anxious/Dismissive/Fearful with confidence percentages
- **Emotional Trajectory**: Happiness, Sadness, Anger, Anxiety trend charts
- **Therapy Recommendations**: 3-5 tailored psychological intervention suggestions
- **Key Insights**: Summary of identified patterns and observations

## 🌍 Multi-Language Support

Supported languages:
- 🇬🇧 English
- 🇷🇺 Russian (Русский)
- 🇫🇷 French (Français)
- 🇪🇸 Spanish (Español)
- 🇩🇪 German (Deutsch)
- 🇵🇹 Portuguese (Português)

Switch language via the auto-detection feature in the UI.

## 📚 Case Studies

The project includes **5 comprehensive case studies** in `CASE_STUDIES.md`:
1. **Case Study 1: Anxiety Disorder** - Detailed analysis of an anxious interview
2. **Case Study 2: Attachment Issues** - Complex attachment pattern analysis
3. **Case Study 3: Defense Mechanisms** - Identification of multiple defense mechanisms
4. **Case Study 4: Trauma Response** - Analysis of traumatic interview content
5. **Case Study 5: Therapeutic Progress** - Multi-session comparison showing improvement

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- **Unit Tests**: Component and service tests
- **Integration Tests**: API integration with Gemini
- **E2E Tests**: User workflow validation

## 🔄 CI/CD Pipeline

GitHub Actions automatically:
- ✅ Runs linter (ESLint)
- ✅ Formats code (Prettier)
- ✅ Runs unit tests (Jest)
- ✅ Builds project (Vite)
- ✅ Deploys to Vercel on main branch push

See `.github/workflows/ci-cd.yml` for configuration.

## 🌐 Live Demo

**Try the application**: [https://psychoanalyze-ai.vercel.app](https://psychoanalyze-ai.vercel.app)

## 📸 Screenshots

- **Dark Mode UI** with intuitive interface
- **Real-time Analysis** with streaming results
- **Multi-language Support** with automatic detection
- **Export Functionality** for results

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 👤 Author

**Alexey Remontski**
- 📧 Email: clockerindo@yandex.ru
- 🔗 GitHub: [@remontsuri](https://github.com/remontsuri)
- 💼 LinkedIn: [Alexey Remontski](https://www.linkedin.com/in/alexey-remontski/)

## 🔗 Links

- **Live App**: https://psychoanalyze-ai.vercel.app
- **GitHub Repository**: https://github.com/remontsuri/psychoanalyze-ai
- **Deployed by**: [Vercel](https://vercel.com)

## 📞 Support

For issues, questions, or suggestions:
1. Open an issue on [GitHub](https://github.com/remontsuri/psychoanalyze-ai/issues)
2. Contact: clockerindo@yandex.ru
3. LinkedIn: [Alexey Remontski](https://www.linkedin.com/in/alexey-remontski/)

## 🙏 Acknowledgments

- Google Gemini 3 Pro API for AI capabilities
- React community for excellent libraries
- Vercel for seamless deployment
- All contributors and users

---

**Made with ❤️ for the psychology community**
