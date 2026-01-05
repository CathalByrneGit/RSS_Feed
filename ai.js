// ai.js - Transformers.js AI Integration

/**
 * AIModel - Singleton class for managing the transformers.js pipeline
 * Handles model loading and question-answering tasks
 */
export class AIModel {
    constructor() {
        this.pipeline = null;
        this.modelName = 'Xenova/distilbert-base-cased-distilled-squad';
        this.isLoading = false;
        this.isReady = false;
    }

    /**
     * Initialize the AI model (loads transformers.js and the model)
     */
    async initialize() {
        if (this.isReady) {
            console.log('AI model already initialized');
            return;
        }

        if (this.isLoading) {
            console.log('AI model is already loading');
            return;
        }

        this.isLoading = true;

        try {
            console.log('Loading transformers.js library...');

            // Import the pipeline from transformers.js CDN
            const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0');

            console.log('Loading AI model:', this.modelName);
            console.log('This may take a minute on first load...');

            // Create the question-answering pipeline
            this.pipeline = await pipeline('question-answering', this.modelName);

            this.isReady = true;
            this.isLoading = false;

            console.log('AI model loaded successfully!');

        } catch (error) {
            this.isLoading = false;
            console.error('Failed to load AI model:', error);

            // Provide helpful error message
            if (error.message.includes('fetch')) {
                throw new Error('Network error: Failed to download AI model. Please check your internet connection.');
            } else if (error.message.includes('WebGPU')) {
                throw new Error('WebGPU not supported. Try using a different browser (Chrome or Edge recommended).');
            } else {
                throw new Error(`AI model initialization failed: ${error.message}`);
            }
        }
    }

    /**
     * Ask a question about a given context
     * @param {string} context - The article text to analyze
     * @param {string} question - The question to ask
     * @returns {Promise<string>} - The answer
     */
    async askQuestion(context, question) {
        if (!this.isReady) {
            throw new Error('AI model not initialized. Please wait for initialization to complete.');
        }

        try {
            console.log('Processing question:', question);

            // Truncate context if too long (models have token limits)
            const maxContextLength = 2000;
            const truncatedContext = context.length > maxContextLength
                ? context.substring(0, maxContextLength) + '...'
                : context;

            // Run the pipeline
            const result = await this.pipeline(question, truncatedContext);

            console.log('AI response:', result);

            // Return the answer with confidence score
            const confidence = (result.score * 100).toFixed(1);
            return `${result.answer}\n\n(Confidence: ${confidence}%)`;

        } catch (error) {
            console.error('Error during question answering:', error);
            throw new Error(`Failed to get answer: ${error.message}`);
        }
    }

    /**
     * Check if the model is ready to use
     */
    isModelReady() {
        return this.isReady;
    }

    /**
     * Get model status information
     */
    getStatus() {
        return {
            isReady: this.isReady,
            isLoading: this.isLoading,
            modelName: this.modelName
        };
    }
}

// Export a singleton instance (optional pattern)
// Alternatively, create instances in script.js
export default AIModel;
