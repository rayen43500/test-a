import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCourses } from '../../contexts/CourseContext';
import { toast } from 'react-toastify';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const QuizForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, createQuiz, updateQuiz, getQuiz, loadCategories } = useCourses();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    passing_score: 70,
    time_limit: '',
    is_active: true,
    questions: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load categories when component mounts
    const loadData = async () => {
      try {
        await loadCategories();
        if (isEditMode) {
          await loadQuiz();
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load required data');
      }
    };

    loadData();
  }, [id, isEditMode, loadCategories]);

  const loadQuiz = async () => {
    try {
      const quiz = await getQuiz(id);
      setFormData({
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        passing_score: quiz.passing_score,
        time_limit: quiz.time_limit || '',
        is_active: quiz.is_active,
        questions: quiz.questions || []
      });
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast.error('Failed to load quiz');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
              type === 'number' ? parseInt(value) || '' : value
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: Date.now(),
        text: '',
        options: [
          { id: 1, text: '', is_correct: false },
          { id: 2, text: '', is_correct: false },
          { id: 3, text: '', is_correct: false },
          { id: 4, text: '', is_correct: false }
        ]
      }]
    }));
  };

  const updateQuestion = (questionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex ? { ...question, [field]: value } : question
      )
    }));
  };

  const removeQuestion = (questionIndex) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              options: question.options.map((option, oIndex) =>
                oIndex === optionIndex ? { ...option, [field]: value } : option
              )
            }
          : question
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.passing_score < 0 || formData.passing_score > 100) {
      newErrors.passing_score = 'Passing score must be between 0 and 100';
    }

    if (formData.questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }

    formData.questions.forEach((question, index) => {
      if (!question.text.trim()) {
        newErrors[`question_${index}`] = 'Question text is required';
      }

      const hasCorrectAnswer = question.options.some(option => option.is_correct);
      if (!hasCorrectAnswer) {
        newErrors[`question_${index}_correct`] = 'At least one correct answer is required';
      }

      question.options.forEach((option, optionIndex) => {
        if (!option.text.trim()) {
          newErrors[`question_${index}_option_${optionIndex}`] = 'Option text is required';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      if (isEditMode) {
        await updateQuiz(id, formData);
      } else {
        await createQuiz(formData);
      }

      toast.success(`Quiz ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/quizzes');

    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error(error.message || 'Failed to save quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || (user.role !== 'Admin' && user.role !== 'Recruteur')) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">
            You don't have permission to {isEditMode ? 'edit' : 'create'} quizzes.
            Only administrators and instructors can manage quizzes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode ? 'Update the quiz details below.' : 'Fill out the form to create a new quiz.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Title */}
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Category */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              {/* Description */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Passing Score */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Passing Score (%) *
                </label>
                <input
                  type="number"
                  name="passing_score"
                  min="0"
                  max="100"
                  value={formData.passing_score}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
                {errors.passing_score && <p className="mt-1 text-sm text-red-600">{errors.passing_score}</p>}
              </div>

              {/* Time Limit */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  name="time_limit"
                  min="0"
                  value={formData.time_limit}
                  onChange={handleChange}
                  placeholder="No limit"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Active Status */}
              <div className="sm:col-span-2">
                <div className="flex items-center mt-6">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active Quiz
                  </label>
                </div>
              </div>

              {/* Questions Section */}
              <div className="sm:col-span-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Question
                  </button>
                </div>

                {errors.questions && <p className="text-sm text-red-600 mb-4">{errors.questions}</p>}

                <div className="space-y-6">
                  {formData.questions.map((question, questionIndex) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-medium text-gray-700">
                          Question {questionIndex + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Text *
                        </label>
                        <textarea
                          value={question.text}
                          onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                          rows={2}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your question here..."
                        />
                        {errors[`question_${questionIndex}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`question_${questionIndex}`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Options (Select one correct answer) *
                        </label>
                        {question.options.map((option, optionIndex) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct_${questionIndex}`}
                              checked={option.is_correct}
                              onChange={() => {
                                // Set this option as correct and others as incorrect
                                question.options.forEach((_, idx) => {
                                  updateOption(questionIndex, idx, 'is_correct', idx === optionIndex);
                                });
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => updateOption(questionIndex, optionIndex, 'text', e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1 block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        ))}
                        {errors[`question_${questionIndex}_correct`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`question_${questionIndex}_correct`]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={() => navigate('/quizzes')}
              className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Quiz' : 'Create Quiz')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;
