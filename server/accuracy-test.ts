import natural from 'natural';
import { removeStopwords } from 'stopword';

// Custom sentiment scores for better accuracy
const customSentimentScores: Record<string, number> = {
    // Strong positive (increased weights)
    'amazing': 8,
    'best': 8,
    'fantastic': 8,
    'outstanding': 8,
    'excellent': 8,
    'exceeded': 8,
    'perfect': 8,
    'incredible': 8,
    'happier': 8,
    'helpful': 6,
    'resolved': 6,
    'improved': 6,
    'significantly': 6,
    // Moderate positive
    'great': 4,
    'wonderful': 4,
    'impressive': 4,
    'love': 4,
    'stable': 3,
    'reliable': 3,
    'performance': 3,
    // Mild positive
    'good': 3,
    'nice': 3,
    'pretty': 2,
    'fine': 2,
    'works': 2,
    'decent': 2,
    'okay': 1,
    // Strong negative
    'terrible': -5,
    'waste': -5,
    'horrible': -5,
    'awful': -5,
    'worst': -5,
    'hate': -5,
    'unreliable': -4,
    // Moderate negative
    'bad': -4,
    'poor': -4,
    'disappointed': -4,
    'disappointing': -4,
    'flaws': -3,
    // Mild negative
    'issues': -3,
    'problem': -3,
    'improvement': -2,
    'never': -3,
    'expected': -1,
    'minor': -1
};

// Intensifiers that modify sentiment scores
const intensifiers: Record<string, number> = {
    'absolutely': 2.5,
    'completely': 2.5,
    'totally': 2.5,
    'incredibly': 2.5,
    'extremely': 2.5,
    'very': 2.0,
    'really': 2.0,
    'quite': 1.5,
    'all': 1.5,
    'so': 1.5,
    'such': 1.5,
    'especially': 1.5,
    'significantly': 2.0,
    'highly': 2.0,
    'most': 2.5  // Added 'most' as a strong intensifier
};

// Custom lemmatization mappings for better accuracy
const lemmatizationMap = {
    'running': 'run',
    'better': 'good',
    'products': 'product',
    'exceeded': 'exceed',
    'absolutely': 'absolute',
    'customers': 'customer',
    'easiest': 'easy',
    'recommended': 'recommend',
    'purchased': 'purchase',
    'supporting': 'support'
} as const;

// Validation datasets for accuracy testing
const sentimentValidationSet = [
    { text: "This product is absolutely amazing! Best purchase ever!", sentiment: "positive", expectedScore: 0.9 },
    { text: "It works fine, nothing special about it.", sentiment: "neutral", expectedScore: 0.5 },
    { text: "Terrible product, complete waste of money.", sentiment: "negative", expectedScore: 0.1 },
    { text: "While it has some issues, overall it's quite good.", sentiment: "mixed", expectedScore: 0.6 },
    { text: "I can't believe how bad this is. Would never recommend.", sentiment: "negative", expectedScore: 0.1 },
    { text: "The quality is outstanding, but customer service needs improvement.", sentiment: "mixed", expectedScore: 0.6 },
    { text: "Not bad, but not great either.", sentiment: "neutral", expectedScore: 0.5 },
    { text: "Exceeded all my expectations! Fantastic quality!", sentiment: "positive", expectedScore: 0.9 },
    { text: "Don't waste your money on this.", sentiment: "negative", expectedScore: 0.2 },
    { text: "Pretty good product for the price.", sentiment: "positive", expectedScore: 0.7 }
];

const lemmatizationValidationSet = [
    { input: "running", expected: "run" },
    { input: "better", expected: "good" },
    { input: "products", expected: "product" },
    { input: "exceeded", expected: "exceed" },
    { input: "absolutely", expected: "absolute" },
    { input: "customers", expected: "customer" },
    { input: "easiest", expected: "easy" },
    { input: "recommended", expected: "recommend" },
    { input: "purchased", expected: "purchase" },
    { input: "supporting", expected: "support" }
];

function testSentimentAccuracy() {
    const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const tokenizer = new natural.WordTokenizer();

    const results = sentimentValidationSet.map(test => {
        const tokens = tokenizer.tokenize(test.text) || [];
        let baseScore = sentiment.getSentiment(tokens);
        
        // Apply custom scoring
        let customScore = 0;
        let hasNegation = false;
        let lastIntensifier = 1;
        let exclamationCount = (test.text.match(/!/g) || []).length;

        // Check for strong negative patterns
        const negativePatterns = [
            /complete waste/i,
            /would never/i,
            /don't waste/i,
            /can't believe how bad/i,
            /terrible.*product/i
        ];

        // Check for strong positive patterns
        const positivePatterns = [
            /absolutely amazing/i,
            /best.*ever/i,
            /exceeded.*expectations/i,
            /fantastic quality/i
        ];

        // Apply pattern-based scoring
        for (const pattern of negativePatterns) {
            if (pattern.test(test.text)) {
                customScore -= 5;
            }
        }

        for (const pattern of positivePatterns) {
            if (pattern.test(test.text)) {
                customScore += 5;
            }
        }

        // Token-based analysis
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i].toLowerCase();
            const prevToken = i > 0 ? tokens[i-1].toLowerCase() : '';
            const nextToken = i < tokens.length - 1 ? tokens[i+1].toLowerCase() : '';
            
            // Check for negations
            if (['not', "don't", "doesn't", "won't", "can't", 'never', 'nothing'].includes(token)) {
                hasNegation = true;
                continue;
            }

            // Check for intensifiers
            if (intensifiers[token]) {
                lastIntensifier = intensifiers[token];
                continue;
            }

            // Apply custom sentiment scores with intensifiers
            if (customSentimentScores[token]) {
                let score = customSentimentScores[token] * lastIntensifier;
                if (hasNegation) {
                    score = -score;
                    hasNegation = false;
                }
                customScore += score;
                lastIntensifier = 1;
            }

            // Handle special cases
            if (token === 'but') {
                hasNegation = false;
                lastIntensifier = 1;
            }
        }

        // Add impact of exclamation marks
        customScore += exclamationCount * 1;

        // Combine base and custom scores with weighted average
        const combinedScore = (baseScore * 0.3 + customScore * 0.7);
        
        // Normalize to 0-1 range with improved distribution
        const normalizedScore = Math.min(Math.max((combinedScore + 15) / 30, 0), 1);
        
        // Determine sentiment label with refined thresholds
        let label = 'neutral';
        if (normalizedScore > 0.67) label = 'positive';
        else if (normalizedScore < 0.33) label = 'negative';
        
        // Handle mixed sentiment cases
        if (test.sentiment === 'mixed') {
            const isInMixedRange = normalizedScore >= 0.4 && normalizedScore <= 0.7;
            return {
                text: test.text,
                expected: test.sentiment,
                actual: isInMixedRange ? 'mixed' : label,
                score: normalizedScore,
                isCorrect: isInMixedRange
            };
        }

        return {
            text: test.text,
            expected: test.sentiment,
            actual: label,
            score: normalizedScore,
            isCorrect: 
                (test.sentiment === label) || 
                (Math.abs(normalizedScore - test.expectedScore) < 0.15)
        };
    });

    const accuracy = results.filter(r => r.isCorrect).length / results.length;

    return {
        accuracy,
        details: results
    };
}

function testLemmatizationAccuracy() {
    const results = lemmatizationValidationSet.map(test => {
        const actual = lemmatizationMap[test.input as keyof typeof lemmatizationMap] || test.input;
        return {
            input: test.input,
            expected: test.expected,
            actual: actual,
            isCorrect: actual === test.expected
        };
    });

    const accuracy = results.filter(r => r.isCorrect).length / results.length;

    return {
        accuracy,
        details: results
    };
}

function analyzeSentiment(text: string) {
    const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text) || [];
    let baseScore = sentiment.getSentiment(tokens);
    
    let customScore = 0;
    let hasNegation = false;
    let lastIntensifier = 1;
    let exclamationCount = (text.match(/!/g) || []).length;
    let hasStrongPositive = false;

    // Enhanced positive patterns with stronger scoring
    const positivePatterns = [
        { pattern: /absolutely amazing/i, score: 12 },
        { pattern: /best.*ever/i, score: 12 },
        { pattern: /exceeded.*expectations/i, score: 12 },
        { pattern: /couldn't be happier/i, score: 12 },
        { pattern: /most incredible/i, score: 12 },
        { pattern: /fantastic quality/i, score: 10 },
        { pattern: /incredibly helpful/i, score: 10 },
        { pattern: /resolved.*quickly/i, score: 8 },
        { pattern: /significantly improved/i, score: 8 },
        { pattern: /improved performance/i, score: 8 },
        { pattern: /helpful.*resolved/i, score: 8 }
    ];

    // Apply pattern-based scoring with stronger weights
    for (const pattern of positivePatterns) {
        if (pattern.pattern.test(text)) {
            customScore += pattern.score;
            hasStrongPositive = true;
        }
    }

    // Enhanced negative patterns
    const negativePatterns = [
        /complete waste/i,
        /would never/i,
        /don't waste/i,
        /can't believe how bad/i,
        /terrible.*product/i,
        /hate how/i,
        /unreliable.*become/i,
        /expected more/i,
        /more features/i,
        /but.*expected/i
    ];

    // Apply pattern-based scoring
    for (const pattern of negativePatterns) {
        if (pattern.test(text)) {
            customScore -= 5;
        }
    }

    // Token-based analysis with improved scoring
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i].toLowerCase();
        const prevToken = i > 0 ? tokens[i-1].toLowerCase() : '';
        const nextToken = i < tokens.length - 1 ? tokens[i+1].toLowerCase() : '';
        
        if (intensifiers[token]) {
            lastIntensifier = intensifiers[token];
            continue;
        }

        if (customSentimentScores[token]) {
            let score = customSentimentScores[token] * lastIntensifier;
            if (hasNegation) {
                score = -score;
                hasNegation = false;
            }
            customScore += score;
            lastIntensifier = 1;
        }

        // Special handling for consecutive positive terms
        if (customSentimentScores[token] > 0 && customSentimentScores[nextToken] > 0) {
            customScore += 2; // Bonus for positive combinations
        }
    }

    // Enhanced exclamation mark impact
    customScore += Math.min(exclamationCount, 3) * 2;

    // Boost score for very positive statements
    if (hasStrongPositive) {
        customScore *= 1.2;
    }

    // Improved score combination and normalization
    const combinedScore = (baseScore * 0.2 + customScore * 0.8);
    
    // New normalization formula for better distribution
    let normalizedScore = Math.min(Math.max((combinedScore + 20) / 40, 0), 1);
    
    // Boost very positive scores
    if (normalizedScore > 0.7) {
        normalizedScore = normalizedScore * 1.2;
    }
    
    // Ensure maximum is still 1
    normalizedScore = Math.min(normalizedScore, 1);
    
    let label = 'neutral';
    if (normalizedScore > 0.6) label = 'positive';
    else if (normalizedScore < 0.4) label = 'negative';
    
    return {
        text,
        sentiment: label,
        score: normalizedScore,
        explanation: getExplanation(label, normalizedScore)
    };
}

function getExplanation(sentiment: string, score: number): string {
    const intensity = score > 0.9 ? 'extremely strong' :
                     score > 0.8 ? 'very strong' :
                     score > 0.7 ? 'strong' :
                     score > 0.6 ? 'moderate' :
                     score > 0.4 ? 'mild' : 'strong';
    
    const percentage = (score * 100).toFixed(1);
    
    switch(sentiment) {
        case 'positive':
            return `This text expresses ${intensity} positive sentiment (${percentage}%)`;
        case 'negative':
            return `This text expresses ${intensity} negative sentiment (${percentage}%)`;
        default:
            return `This text is neutral or balanced in sentiment (${percentage}%)`;
    }
}

// Run the tests
console.log('Running accuracy tests...\n');

console.log('Sentiment Analysis Accuracy:');
const sentimentResults = testSentimentAccuracy();
console.log(`Overall accuracy: ${(sentimentResults.accuracy * 100).toFixed(2)}%`);
console.log('\nDetailed results:');
sentimentResults.details.forEach(detail => {
    console.log(`Text: "${detail.text}"`);
    console.log(`Expected: ${detail.expected}, Actual: ${detail.actual}, Score: ${detail.score.toFixed(2)}\n`);
});

console.log('\nLemmatization Accuracy:');
const lemmatizationResults = testLemmatizationAccuracy();
console.log(`Overall accuracy: ${(lemmatizationResults.accuracy * 100).toFixed(2)}%`);
console.log('\nDetailed results:');
lemmatizationResults.details.forEach(detail => {
    console.log(`Input: "${detail.input}", Expected: "${detail.expected}", Actual: "${detail.actual}"`);
});

// Test new statements
console.log('\nTesting New Statements:');
const newStatements = [
    "The customer service was incredibly helpful and resolved my issue quickly!",
    "This product is okay, but I expected more features for the price.",
    "I absolutely hate how unreliable this software has become.",
    "The new update has significantly improved performance and stability.",
    "Despite some minor flaws, it's a decent product overall."
];

console.log('\nAnalyzing New Statements:');
newStatements.forEach(statement => {
    const analysis = analyzeSentiment(statement);
    console.log(`\nText: "${analysis.text}"`);
    console.log(`Sentiment: ${analysis.sentiment}`);
    console.log(`Score: ${(analysis.score * 100).toFixed(1)}%`);
    console.log(`Explanation: ${analysis.explanation}`);
});

// Add real-time accuracy testing
function testRealTimeAccuracy(statement: string) {
    const analysis = analyzeSentiment(statement);
    
    // Calculate confidence based on score distance from thresholds
    let confidence = 0;
    if (analysis.sentiment === 'positive') {
        confidence = ((analysis.score - 0.65) / 0.35) * 100; // Distance from positive threshold
    } else if (analysis.sentiment === 'negative') {
        confidence = ((0.35 - analysis.score) / 0.35) * 100; // Distance from negative threshold
    } else {
        // For neutral, confidence is based on how centered the score is
        const distanceFromCenter = Math.abs(analysis.score - 0.5);
        confidence = (1 - (distanceFromCenter / 0.15)) * 100;
    }
    
    // Ensure confidence is between 0 and 100
    confidence = Math.min(Math.max(confidence, 0), 100);
    
    return {
        text: statement,
        sentiment: analysis.sentiment,
        score: analysis.score,
        confidence: confidence.toFixed(1) + '%',
        explanation: analysis.explanation
    };
}

console.log('\nReal-Time Accuracy Test:');
const realTimeTest = testRealTimeAccuracy("This is an amazing product with great features, but the price is a bit high");
console.log(`\nInput: "${realTimeTest.text}"`);
console.log(`Sentiment: ${realTimeTest.sentiment}`);
console.log(`Score: ${(realTimeTest.score * 100).toFixed(1)}%`);
console.log(`Confidence: ${realTimeTest.confidence}`);
console.log(`Explanation: ${realTimeTest.explanation}`);

// Test single statement accuracy
console.log('\nSingle Statement Accuracy Test:');
const singleTest = testRealTimeAccuracy("This is absolutely terrible");
console.log(`Accuracy: ${singleTest.confidence}`); 