export const getCompatibiltyScore = (fileContentsText, jobRole) => {
    return `Based on the following resume and job description, 
    return ONLY a JSON object with a compatibility score between 0-100%. 
    Do not include any analysis or explanation.

        Resume:
        ${fileContentsText}

        Job Role:
        ${jobRole}

        Return only this format:
        {
          "compatibility_score": "XX"
        }`
}

export const fetchQuestionsForValidation = (compatibilityScore, jobRole) => {
    return `Please provide some tough five multiple choice
    questions with code snippets which are related to the Technical skills based on the compatibility Score and job Role,
    Do not include any analysis or explanation.
      ${compatibilityScore}
      For this job Role:
      ${jobRole}
      example response:
      [
        {
          "question": "What is the most challenging aspect of your previous role?"
          "options": ["option1", "option2", "option3", "option4", "option5"]
        }
      ]`
}

export const answersForValidation = (questionsWithAnswers) => {
  return `You are an AI evaluator. Analyze the following answers in question_evaluations_with_answers and provide a score and feedback in JSON format.

    Evaluate based on these criteria:
    1. Appropriateness of the selected options for each question
    2. Professional judgment
    3. Alignment with standard industry expectations

    Return ONLY a JSON response in this exact format:
    {
      "score": "X/10",
      "is_valid": true/false,
      "feedback": "Brief feedback about overall selection",
      "question_evaluations_with_answers": ${questionsWithAnswers}
    }`
}