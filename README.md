# PsychoAnalyze AI

**AI-Powered Psychological Interview Analysis Tool**

Analyze psychological interviews in seconds using Google Gemini 3 Pro API. Automatically detect defense mechanisms, attachment styles, emotional patterns, and generate therapy recommendations.

🎯 [Try Demo](https://psychoanalyze-ai.vercel.app) | 📚 [Documentation](./docs) | 🐍 [Python Version](#)

## Features

✨ **Defense Mechanisms Detection** - Identifies protective patterns (Suppression, Avoidance, Rationalization, etc.)

💔 **Attachment Style Analysis** - Determines attachment patterns with confidence scores

📊 **Emotional Trajectory Tracking** - Real-time 4-line emotion chart (Anger, Sadness, Happiness, Anxiety)

💬 **Therapy Recommendations** - AI-generated treatment suggestions based on analysis

📄 **Export Options** - PDF reports and Excel spreadsheets with all findings

🌙 **Dark Mode** - Comfortable UI with light/dark theme toggle

🔄 **Interview Comparison** - Side-by-side analysis of multiple interviews

💾 **History Management** - LocalStorage support with search functionality

⭐ **5-Star Rating System** - Quick quality assessment for each analysis

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI**: Google Gemini 3 Pro Preview API
- **Charts**: Recharts for data visualization
- **Export**: html2canvas (PDF), SheetJS (Excel)
- **Icons**: Lucide React

## Installation

1. Clone the repository
```bash
git clone https://github.com/remontsuri/psychoanalyze-ai.git
cd psychoanalyze-ai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
echo "REACT_APP_GEMINI_API_KEY=your_api_key_here" > .env.local
```

4. Start development server
```bash
npm run dev
```

5. Deploy to Vercel/Netlify
```bash
npm run build
```

## Usage

1. **Paste Interview** - Add psychological interview text or upload a file
2. **Analyze** - Click analyze button and wait for AI processing (20-30 seconds)
3. **Review Results** - Check psychological profile, defense mechanisms, attachment style, recommendations
4. **Export** - Download PDF report or Excel spreadsheet
5. **Compare** - Load multiple interviews and compare them side-by-side

## Case Studies

See detailed analysis examples in the [portfolio](./portfolio):
- Anxious-Avoidant Attachment Case
- Narcissistic Personality Traits Analysis
- Secure Attachment Success Case

## API Documentation

The app uses Google Gemini 3 Pro Preview for AI analysis. Requests are structured as:

```
Prompt: Analyze this psychological interview...
Response: JSON with defense mechanisms, attachment style, therapy recommendations
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT License - feel free to use for educational and commercial projects.

## Author

Developed as a side-project for psychology & journalism research at ХГПУ (7-25ПД program).

**Contact**: [your-email@gmail.com](mailto:your-email@gmail.com) | [LinkedIn](https://linkedin.com/in/your-profile)

---

**© 2025 PsychoAnalyze AI** | Powered by Google Gemini
