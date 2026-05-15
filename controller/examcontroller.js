const OpenAI = require('openai');
const mongoose = require('mongoose');
const Question = require('../model/questionsSchema');
const Answer = require('../model/answerSchema');
const Exam = require('../model/examSchema');
const catchAsync = require('../utils/asynchandeler');
const AppError = require('../utils/Apperror');

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const Demoquestion = [
  {
    id: 'q1',
    question: 'What does HTTP stand for?',
    questionNumber: 1,
    options: [
      { id: 'a', text: 'HyperText Transfer Protocol' },
      { id: 'b', text: 'High Transfer Text Protocol' },
      { id: 'c', text: 'Hyper Transfer Text Process' },
      { id: 'd', text: 'Host Transfer Protocol' },
    ],
    correctOptionId: 'a',
    correctAnswer: 'HyperText Transfer Protocol',
    explanation: 'HTTP stands for HyperText Transfer Protocol.',
    difficulty: 'easy',
    topic: 'Web Basics',
  },
  {
    id: 'q2',
    question: 'Which JavaScript method is used to parse a JSON string?',
    options: [
      { id: 'a', text: 'JSON.parse()' },
      { id: 'b', text: 'JSON.stringify()' },
      { id: 'c', text: 'JSON.decode()' },
      { id: 'd', text: 'JSON.convert()' },
    ],
    questionNumber: 2,
    correctOptionId: 'a',
    correctAnswer: 'JSON.parse()',
    explanation: 'JSON.parse() converts JSON text into a JavaScript object.',
    difficulty: 'easy',
    topic: 'JavaScript',
  },
  {
    id: 'q3',
    questionNumber: 3,
    question: 'Which hook is used to manage state in React?',
    options: [
      { id: 'a', text: 'useEffect' },
      { id: 'b', text: 'useContext' },
      { id: 'c', text: 'useState' },
      { id: 'd', text: 'useReducer' },
    ],
    correctOptionId: 'c',
    correctAnswer: 'useState',
    explanation: 'useState manages local component state.',
    difficulty: 'easy',
    topic: 'React',
  },
  {
    id: 'q4',
    questionNumber: 4,
    question: 'Which HTML tag is used to include JavaScript?',
    options: [
      { id: 'a', text: '<script>' },
      { id: 'b', text: '<js>' },
      { id: 'c', text: '<javascript>' },
      { id: 'd', text: '<code>' },
    ],
    correctOptionId: 'a',
    correctAnswer: '<script>',
    explanation: 'The <script> tag is used to embed JavaScript.',
    difficulty: 'easy',
    topic: 'HTML',
  },
  {
    id: 'q5',
    questionNumber: 5,
    question: 'Which CSS property controls text size?',
    options: [
      { id: 'a', text: 'font-size' },
      { id: 'b', text: 'text-style' },
      { id: 'c', text: 'font-weight' },
      { id: 'd', text: 'text-align' },
    ],
    correctOptionId: 'a',
    correctAnswer: 'font-size',
    explanation: 'font-size sets the size of text.',
    difficulty: 'easy',
    topic: 'CSS',
  },
  {
    id: 'q6',
    questionNumber: 6,
    question: 'Which keyword is used to declare a constant in JavaScript?',
    options: [
      { id: 'a', text: 'var' },
      { id: 'b', text: 'let' },
      { id: 'c', text: 'const' },
      { id: 'd', text: 'static' },
    ],
    correctOptionId: 'c',
    correctAnswer: 'const',
    explanation: 'const declares a block-scoped constant.',
    difficulty: 'easy',
    topic: 'JavaScript',
  },
  {
    id: 'q7',
    questionNumber: 7,
    question: 'Which React Native component is used to display text?',
    options: [
      { id: 'a', text: 'View' },
      { id: 'b', text: 'Text' },
      { id: 'c', text: 'Span' },
      { id: 'd', text: 'Label' },
    ],
    correctOptionId: 'b',
    correctAnswer: 'Text',
    explanation: 'Text component is used to display text in React Native.',
    difficulty: 'easy',
    topic: 'React Native',
  },
  {
    id: 'q8',
    questionNumber: 8,
    question: 'Which operator is used to compare value and type in JavaScript?',
    options: [
      { id: 'a', text: '==' },
      { id: 'b', text: '!=' },
      { id: 'c', text: '===' },
      { id: 'd', text: '=' },
    ],
    correctOptionId: 'c',
    correctAnswer: '===',
    explanation: '=== checks both value and type.',
    difficulty: 'easy',
    topic: 'JavaScript',
  },
  {
    id: 'q9',
    questionNumber: 9,
    question: 'Which lifecycle hook runs after the first render in React?',
    options: [
      { id: 'a', text: 'useEffect' },
      { id: 'b', text: 'useState' },
      { id: 'c', text: 'useMemo' },
      { id: 'd', text: 'useCallback' },
    ],
    correctOptionId: 'a',
    correctAnswer: 'useEffect',
    explanation: 'useEffect runs after render.',
    difficulty: 'medium',
    topic: 'React',
  },
  {
    id: 'q10',
    questionNumber: 10,
    question: 'Which data structure uses FIFO?',
    options: [
      { id: 'a', text: 'Stack' },
      { id: 'b', text: 'Queue' },
      { id: 'c', text: 'Tree' },
      { id: 'd', text: 'Graph' },
    ],
    correctOptionId: 'b',
    correctAnswer: 'Queue',
    explanation: 'Queue follows First In First Out.',
    difficulty: 'easy',
    topic: 'Data Structures',
  },
];

exports.getMcqQuestionAnswer = async (req, res, next) => {
  const { fieldName, questionCount, skill, lavel } = req.body;
  if (!fieldName || !questionCount || !skill || !lavel) {
    return res.status(400).json({
      success: false,
      message: 'Select required parameters properly',
    });
  }
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',

      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a senior ${fieldName}  interviewer.
          Output a JSON object containing an array called "questions".
          Each question MUST follow this exact schema:
          {
            "id": "string",
            "question": "string",
            "options": [
              { "id": "a", "text": "string" },
              { "id": "b", "text": "string" },
              { "id": "c", "text": "string" },
              { "id": "d", "text": "string" }
            ],
            "correctOptionId": "string",
            "correctAnswer": "string",
            "questionNumber": number,
            "difficulty": "easy|medium|hard",
            "topic": "string"
          }`,
        },
        {
          role: 'user',
          content: `Generate ${questionCount} ${lavel} level MCQ questions for a ${fieldName} job interview focusing on ${skill}`,
          max_tokens: 200,
        },
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);
    res.status(200).json({
      data: data.questions,
      success: true,
      message: 'questions fetched successfully',
    });
    // res.status(200).json({
    //   data: Demoquestion,
    //   success: true,
    //   message: 'questions fetched successfully',
    // });
  } catch (error) {
    console.log(error);
  }
};

exports.uploadQustions = catchAsync(async (req, res) => {
  const questions = req.body;
  const userId = req.userId;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Questions array is required',
    });
  }

  const formattedQuestions = questions.map(question => ({
    ...question,
    user: userId,
  }));
  const result = await Question.insertMany(formattedQuestions);

  res.status(200).json({
    success: true,
    message: 'question uploaded successfully',
    data: result,
  });
});

exports.uploadExamDetails = catchAsync(async (req, res) => {
  const examdetail = req.body;
  const userId = req.userId;
  const examdetails = {
    user: userId,
    status: 'pending',
    accuracy: '0',
    duration: examdetail.duration,
    toalQuestion: examdetail.questionCount,
    skipped: 0,
    attempted: 0,
    skill: examdetail.skill,
    lavel: examdetail.lavel,
    fieldName: examdetail.fieldName,
    correct: 0,
    wrong: 0,
    examType: examdetail.examType,
  };
  const result = await Exam.create(examdetails);
  res.status(200).json({
    success: true,
    message: 'Exam data updated successfully',
    data: result,
  });
});

exports.updateExamDetails = catchAsync(async (req, res) => {
  const examId = req.params.examId;
  const result = await Exam.findByIdAndUpdate(examId, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(result, 'Updated exam RESULT');
  res.status(200).json({
    success: true,
    message: 'exam data updated successfully',
    data: result,
  });
});

exports.uploadAllAnswers = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const answers = req.body;
  const formattedAnswers = answers.map(answer => ({
    ...answer,
    user: userId,
  }));
  const result = await Answer.insertMany(formattedAnswers);

  res.status(200).json({
    success: true,
    message: 'question uploaded successfully',
    data: result,
  });
});

exports.getSubmittedAnswer = catchAsync(async (req, res, next) => {
  const { examId } = req.params;
  const answers = await Answer.find({ exam: examId }).sort({
    questionNumber: 1,
  });
  res.status(200).json({
    success: true,
    results: answers.length,
    data: answers,
  });
});

exports.getQuestionsByExam = catchAsync(async (req, res, next) => {
  const { examId } = req.params;
  const answers = await Question.find({ exam: examId }).sort({
    questionNumber: 1,
  });
  res.status(200).json({
    success: true,
    results: answers.length,
    data: answers,
  });
});

exports.getUserExams = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const { status } = req.query;
  const filter = { user: userId };
  if (status) filter.status = status;
  const result = await Exam.find(filter).sort({ updatedAt: -1 });
  res.status(200).json({
    success: true,
    results: result.length,
    data: result,
  });
});

exports.getUserAnalytics = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const [summary] = await Exam.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },

    {
      $addFields: {
        accuracyNum: {
          $convert: {
            input: '$accuracy',
            to: 'double',
            onError: 0,
            onNull: 0,
          },
        },
      },
    },

    {
      $addFields: {
        result: {
          $cond: [
            { $eq: ['$status', 'completed'] },
            {
              $cond: [{ $gte: ['$accuracyNum', 40] }, 'passed', 'failed'],
            },
            null,
          ],
        },
      },
    },

    {
      $group: {
        _id: null,

        totalExams: { $sum: 1 },

        totalPending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
        totalCompleted: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
        },

        totalAttemptedExams: { $sum: 1 },

        avgAccuracy: {
          $avg: {
            $cond: [
              { $eq: ['$status', 'completed'] },
              '$accuracyNum',
              '$$REMOVE',
            ],
          },
        },

        passedCount: {
          $sum: { $cond: [{ $eq: ['$result', 'passed'] }, 1, 0] },
        },
        failedCount: {
          $sum: { $cond: [{ $eq: ['$result', 'failed'] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalExams: 1,
        totalAttemptedExams: 1,
        totalPending: 1,
        totalCompleted: 1,
        avgAccuracy: { $round: ['$avgAccuracy', 2] },
        passedCount: 1,
        failedCount: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: summary || {
      totalExams: 0,
      totalAttemptedExams: 0,
      totalPending: 0,
      totalCompleted: 0,
      avgAccuracy: 0,
      passedCount: 0,
      failedCount: 0,
    },
  });
});

const DemoLongQuestions = [
  {
    id: 'q_001',
    questionNumber: 1,
    topic: 'REST API Design',
    difficulty: 'easy',
    question:
      'What is REST API and what are the key principles that make an API truly RESTful? Explain each principle with a real-world example.',
  },
  {
    id: 'q_002',
    questionNumber: 2,
    topic: 'Node.js',
    difficulty: 'medium',
    question:
      'What is the event loop in Node.js and how does it handle asynchronous operations? Explain the difference between the call stack, callback queue, and microtask queue with an example.',
  },
  {
    id: 'q_003',
    questionNumber: 3,
    topic: 'Database Indexing',
    difficulty: 'medium',
    question:
      'Explain how database indexing works internally. What data structure does PostgreSQL use for indexes, what are the trade-offs of adding too many indexes, and when would you decide not to add an index?',
  },
  {
    id: 'q_004',
    questionNumber: 4,
    topic: 'Authentication & Security',
    difficulty: 'medium',
    question:
      'Explain the difference between authentication and authorization. How does JWT authentication work end to end — from login to protected route access — and what are the security risks of storing JWT tokens in localStorage?',
  },
  {
    id: 'q_005',
    questionNumber: 5,
    topic: 'Software Design Principles',
    difficulty: 'hard',
    question:
      'Explain the SOLID principles in software engineering. For each principle, provide a real-world code example that violates the principle and then show how you would refactor it to follow the principle correctly.',
  },
];
exports.getLongQuestions = async (req, res, next) => {
  const { fieldName, questionCount, skill, lavel } = req.body;

  if (!fieldName || !questionCount || !skill || !lavel) {
    return res.status(400).json({
      success: false,
      message: 'Select required parameters properly',
    });
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a senior ${fieldName} interviewer conducting a interview.
          Output a JSON object containing an array called "questions".
          Each question MUST follow this exact schema:
          {
            "id": "string (unique id)",
            "questionNumber": number,
            "topic": "string",
            "difficulty": "easy|medium|hard",
            "question": "string
          }`,
        },
        {
          role: 'user',
          content: `Generate ${questionCount} ${lavel} level long-format interview questions 
          for a ${fieldName} position focusing on ${skill}. 
          Questions should require detailed written explanations, not just one-word answers.
          Include real-world scenarios, edge cases, and practical examples where relevant.`,
        },
      ],
    });


    const data = JSON.parse(response.choices[0].message.content);

    // res.status(200).json({
    //   data: DemoLongQuestions,
    //   success: true,
    //   message: 'Questions fetched successfully',
    // });
    res.status(200).json({
      data: data.questions,
      success: true,
      message: 'Questions fetched successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.checkLongAnswers = async (req, res, next) => {
  const { fieldName, answers, questions } = req.body;

  if (!fieldName || !questions || !Array.isArray(questions)) {
    return res.status(400).json({
      success: false,
      message: 'fieldName and questions are required',
    });
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `
            You are a strict senior ${fieldName} interviewer.

            You will receive:
            1. A list of questions
            2. A list of candidate answers

            Tasks:

            1. Match answers to questions using:
              - questionId from the answers array
              - _id from the questions array

            2. If a question exists in the questions array but there is no matching answer with the same questionId, mark it as SKIPPED.

            3. Evaluate each answer and classify it as:
              - Fully correct
              - Partially correct
              - Incorrect
              - Skipped

            Scoring rules:

            - Fully correct → 100 points
            - Partially correct → 50 points
            - Incorrect → 0 points
            - Skipped → 0 points

            Statistics calculation:

            - totalQuestion = total number of questions
            - attempted = number of questions that have answers
            - skipped = number of questions with no answers

            Accuracy calculation:

            accuracy = (sum_of_all_question_scores) / (totalQuestion * 100) * 100

            Important rules:
            - Skipped questions always contribute 0 points.
            - Accuracy must consider ALL questions, including skipped ones.

            Example:
            If there are 10 questions:
            - 4 fully correct → 400 points
            - 2 partially correct → 100 points
            - 4 incorrect/skipped → 0 points

            Total score = 500

            accuracy = (500 / 1000) * 100 = 50%

            Return ONLY this JSON structure:

            {
              "totalQuestion": number,
              "attempted": number,
              "skipped": number,
              "accuracy": number
            }
`,
        },
        {
          role: 'user',
          content: `
Questions:
${JSON.stringify(questions, null, 2)}

Candidate Answers:
${JSON.stringify(answers || [], null, 2)}
`,
        },
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);

    res.status(200).json({
      success: true,
      data,
      message: 'Evaluation completed',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
