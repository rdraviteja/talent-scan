import React, { useEffect, useRef, useState } from 'react';
import './LandingPage.css';
import AIService from '../../services/aiService'
import { answersForValidation, fetchQuestionsForValidation, getCompatibiltyScore } from './prompts';

const LandingPage = () => {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null)
  const [answers, setAnswers] = useState({});
  const [showLoading, setShowLoading] = useState(false);
  const tempQuestionsForDesign = [
    {
        "question": "Which of the following technologies have you used most regularly in your projects?",
        "options": [
            "Node.js",
            "React",
            "GraphQL",
            "RESTful services",
            "Other"
        ]
    },
    {
        "question": "What is your experience level with integrating GraphQL in a full-stack application?",
        "options": [
            "Beginner",
            "Intermediate",
            "Advanced",
            "Expert",
            "None"
        ]
    },
    {
        "question": "How comfortable are you with implementing RESTful services?",
        "options": [
            "Very comfortable",
            "Comfortable",
            "Somewhat comfortable",
            "Not comfortable",
            "No experience"
        ]
    },
    {
        "question": "Which front-end framework do you prefer for developing dynamic user interfaces?",
        "options": [
            "React",
            "Angular",
            "Vue.js",
            "Svelte",
            "Other"
        ]
    },
    {
        "question": "How would you rate your proficiency in backend development using Node.js?",
        "options": [
            "Expert",
            "Proficient",
            "Competent",
            "Basic",
            "No experience"
        ]
    }
  ]
  const [yoe, setYoe] = useState(2);
  const [expectedCtc, setExpectedCtc] = useState(1);
  const [showHRMessage, setShowHRMessage] = useState(false);
  const [questionsForScreening, setQuestionsForScreening] = useState(null)
  const [compatibilityScore, setCompatibiltyScore] = useState(null);
  const [jobRole, setJobRole] = useState('full-stack-developer node react graphql RESTful-services')
  const profileSelectedRef = useRef();
  const aiService = new AIService();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    }
  };

  const onJobRoleChange = (event) => {
    setJobRole(event?.currentTarget?.value)
  }

  const promptForValidationQuestions = async() => {        
    const prompt = fetchQuestionsForValidation(compatibilityScore, jobRole)
    const data = await aiService.generateResponse(prompt)
    setQuestionsForScreening(content => JSON.parse(data?.content))          
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('http://localhost:9001/extract-pdf', {
      method: 'POST',
      body: formData,
    });

    if (response?.ok) {
      const fileContents = await response.json();
      const prompt = getCompatibiltyScore(fileContents?.text, jobRole)
      const data = await aiService.generateResponse(prompt)
      const compatibility_score_unparsed = data?.content
      const { compatibility_score } = JSON.parse(compatibility_score_unparsed.replace(/```|json|\n/g, ''))
      if(compatibility_score > 70) {
        setCompatibiltyScore(compatibilityScore => compatibility_score)
        promptForValidationQuestions()
      } else {
        alert('Profile doesnt match. \nCompatibilty score is just ' + compatibility_score + '%.')
      }
    } else {
        setOutput('Error extracting PDF contents');
    }
  }; 

  const handleChange = (questionIndex, option) => {
    setAnswers({
      ...answers,
      [questionIndex]: option
    });
  };

  const onValidateQuestions = async() => {
    const patchedData = questionsForScreening?.map((questionData, index) => ({
      ...questionData,
      answer: answers[index] || null
    }));
    const prompt = answersForValidation(JSON.stringify(patchedData))
    const data = await aiService.generateResponse(prompt)
    console.log(data?.content)
    setShowHRMessage(true)
  }

  return (
    <div className="container">
      <header className="header">
        <div className='header-logo'>
        <img src="logo-2.png" alt="Logo" className="logo" />
        </div>
      </header>
      <div className="content">
        <>
          {!showHRMessage && (!questionsForScreening || questionsForScreening?.length < 1) && 
          <>
            <div className="profile-select">
              <p className='form-label'>Please select you relevant profile</p>
              <select ref={profileSelectedRef} className='profile-drop-down' onChange={onJobRoleChange}>
                <option value="full-stack-developer node react graphql RESTful-services">Full Stack Developer</option>
                <option value="testing manual automation selenium javascript cypress playwright">Automation Tester</option>
                <option value="devops aws kubernetes">Devops Engineer</option>
              </select>
            </div>
            <div className="profile-other-data">
              <p className='form-label'>Please select your relevant experience in above selected role</p>
              <input type="range" min="0" max="25" value={yoe} onChange={(ev) => setYoe(ev?.target?.value)} />
              <p className='range-value'>{yoe}</p>
            </div>
            {/* <div className="profile-other-data">
              <p className='form-label'>Please select your expected CTC in INR lakhs per annum</p>
              <input type="range" min="0" max="70" value={expectedCtc} onChange={(ev) => setExpectedCtc(ev?.target?.value)}  />
              <p className='range-value'>{expectedCtc}</p>
            </div> */}
            <div className="upload">
              <label htmlFor="file-upload" className="custom-file-upload">
                Upload your profile
              </label>
              <input id="file-upload" type="file" accept=".pdf,.doc,.docx"
                onChange={handleFileChange}/>
            </div>
            <div className='file-name'>
                {fileName && <>
                  <h3>Profile Information</h3>
                  <table className='file-details-table'>
                    <tbody>
                      <tr>
                        <td style={{width:'50%'}}>
                          {fileName}
                        </td>
                        <td style={{width:'50%'}}>
                          <button className='validate-profile-button' onClick={handleUpload}>Validate Profile & Start Test</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>}
            </div>
          </>}
        </>
        <>
          {!showHRMessage && questionsForScreening && questionsForScreening?.length > 0 && <>
            <h2>Assessment</h2>
            <div className='screening-questions'>
              {questionsForScreening.map((questionData, index) => (
                <div key={index}>
                  <h4>{index+1}. {questionData?.question}</h4>
                  <ul>
                    {questionData?.options?.map((option, optionIndex) => (
                      <li key={optionIndex}>
                        <label>
                          <input
                            type="radio"
                            name={`question${index}`}
                            value={option}
                            onChange={() => handleChange(index, option)}
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>                  
                </div>                
              ))}
              <div className='screening-questions-submit-btn'>
                <button className='validate-profile-button submit-choices-btn' onClick={onValidateQuestions}>Submit</button>
              </div>
            </div>
          </>}
        </>
        <>
              {showHRMessage && <p>Your feedback is captured. Our HR will get back to you shortly if your score matches our criteria.</p>}
        </>
      </div>
    </div>
  );
};

export default LandingPage