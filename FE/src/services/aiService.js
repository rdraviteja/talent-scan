import { AzureChatOpenAI } from '@langchain/openai'

export const OPENAI_API_TYPE = 'Azure'
export const AZURE_OPENAI_API_INSTANCE_NAME = 'oai-playground-dev-01'
export const AZURE_OPENAI_API_VERSION = '2024-05-01-preview'
export const AZURE_OPENAI_ENDPOINT =
  'https://oai-playground-dev-01.openai.azure.com'
export const AZURE_OPENAI_API_DEPLOYMENT_NAME = 'gpt-4o'
export const AZURE_MODEL_NAME = 'gpt-4o'

class AIService {
  constructor() {
    this.model = new AzureChatOpenAI({
      azureOpenAIApiKey: 'baaee9b9f726484abf30a3c7434ff93b',
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
      azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
      modelName: AZURE_MODEL_NAME,
      azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT,
    })
  }

  async generateResponse(prompt) {
    try {
      const gptResponse = await this.model.call([
        { role: 'user', content: prompt },
      ])
      return gptResponse
    } catch (error) {
      console.error('Error generating AI response:', error)
      throw error
    }
  }
}

export default AIService