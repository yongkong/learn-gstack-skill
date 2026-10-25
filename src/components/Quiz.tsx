import { answerQuiz, clearQuiz, useProgress } from '../lib/progress';

export interface QuizData {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

const KEYS = ['A', 'B', 'C', 'D', 'E'];

/**
 * 测验 id 在内容里只写 q1/q2/q3，跨课程会重复，所以进度里必须按课程作用域存。
 * 作用域由调用方传入，忘了传就会串课——见 smoke 里的唯一性断言。
 */
export function Quiz({ quiz, scope }: { quiz: QuizData; scope?: string }) {
  const key = scope ? `${scope}:${quiz.id}` : quiz.id;
  const progress = useProgress();
  const state = progress.quizzes[key];
  const answered = state !== undefined;

  return (
    <section className="quiz" aria-label="检索练习">
      <p className="quiz-q">{quiz.question}</p>
      <div className="quiz-options" role="group">
        {quiz.options.map((option, index) => {
          const isCorrect = answered && index === quiz.answer;
          const isChosenWrong = answered && index === state.choice && index !== quiz.answer;
          const className = [
            'quiz-option',
            isCorrect ? 'is-correct' : '',
            isChosenWrong ? 'is-wrong' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={option}
              type="button"
              className={className}
              disabled={answered}
              onClick={() => answerQuiz(key, index, index === quiz.answer)}
            >
              <span className="quiz-key">{KEYS[index]}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <>
          <p className="quiz-verdict">
            <strong>{state.correct ? '对。' : '还差一步。'}</strong>
            {quiz.explain}
          </p>
          <button type="button" className="quiz-reset" onClick={() => clearQuiz(key)}>
            再做一遍（隔几天再答，比当场重答有用）
          </button>
        </>
      )}
    </section>
  );
}
