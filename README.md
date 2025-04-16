# LexiMind 🧠

![Python](https://img.shields.io/badge/Node.js-20+-green.svg)
![Natural](https://img.shields.io/badge/Natural-Latest-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

An intelligent natural language processing system that combines cognitive analysis with advanced text processing. LexiMind harnesses sophisticated NLP techniques to understand context, detect patterns, and analyze sentiment with human-like comprehension capabilities.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Features

- **Advanced Text Analysis**
  - High-accuracy Sentiment Analysis with custom scoring
  - Pattern recognition for complex sentiments
  - Context-aware sentiment detection
  - Advanced lemmatization with custom mappings
  - TF-IDF (Term Frequency-Inverse Document Frequency) scoring

- **Validation & Testing**
  - Comprehensive validation set with 10 diverse test cases
  - Tests various sentiment types: positive, negative, neutral, and mixed
  - Real-time confidence scoring
  - Handles complex cases like negations and intensifiers

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Smooth animations with Framer Motion
  - Real-time analysis feedback
  - Interactive data visualizations

- **Developer Experience**
  - Full TypeScript support
  - Hot module reloading
  - Comprehensive type checking
  - Modern ES modules

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/LexiMind.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Wouter for lightweight routing
- Heroicons for beautiful icons

### Backend
- Node.js with Express
- Natural library for NLP
- TypeScript for type safety
- ESBuild for fast builds

### Development Tools
- Vite for frontend development
- tsx for TypeScript execution
- ESLint & TypeScript for code quality

## 🤔 Why TypeScript over Python?

While Python is popular for NLP tasks, we chose TypeScript for several compelling reasons:

1. **Full-Stack Type Safety**
   - End-to-end type checking between frontend and backend
   - Catch errors at compile time rather than runtime
   - Better IDE support and autocompletion

2. **Modern Web Development**
   - Seamless integration with React and modern web technologies
   - Better performance with Node.js event loop
   - Unified JavaScript/TypeScript ecosystem

3. **Developer Experience**
   - Single language across the stack
   - Rich type system for better code organization
   - Excellent tooling and IDE support
   - Fast development iteration with hot reloading

4. **Performance**
   - Excellent performance for web applications
   - V8 engine optimizations
   - Efficient handling of concurrent requests

5. **Maintainability**
   - Strong type system prevents common bugs
   - Better code organization with interfaces and types
   - Easier refactoring with type checking

## 📊 Performance & Validation

Our sentiment analysis model is tested against a diverse validation set that includes:

```typescript
const validationExamples = [
  "This product is absolutely amazing! Best purchase ever!",
  "It works fine, nothing special about it.",
  "Terrible product, complete waste of money.",
  "While it has some issues, overall it's quite good.",
  "I can't believe how bad this is. Would never recommend.",
  "The quality is outstanding, but customer service needs improvement.",
  "Not bad, but not great either.",
  "Exceeded all my expectations! Fantastic quality!",
  "Don't waste your money on this.",
  "Pretty good product for the price."
];
```

The model handles:
- Strong positive/negative sentiments
- Neutral statements
- Mixed sentiments with "but" clauses
- Negations ("not", "don't", etc.)
- Intensifiers ("very", "absolutely", etc.)
- Exclamation marks impact
- Context-aware analysis

Each analysis provides:
- Sentiment label (positive/negative/neutral)
- Confidence score (0-100%)
- Detailed explanation
- Real-time accuracy metrics

## 🔍 API Endpoints

### Text Analysis
```typescript
POST /api/analyze
{
  "text": string,
  "sentiment": boolean,
  "tfidf": boolean
}
```

Returns:
```typescript
{
  "id": string,
  "sentiment": {
    "score": number,
    "label": string,
    "explanation": string
  },
  "tfidf": {
    "terms": Array<{
      "term": string,
      "score": number
    }>
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Natural](https://github.com/NaturalNode/natural) for NLP capabilities
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Heroicons](https://heroicons.com) for icons 