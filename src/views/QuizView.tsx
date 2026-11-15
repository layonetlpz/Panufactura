import React, { useState } from 'react';
import { GraduationCap, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { QUIZ_DATA } from '../data/quizData';

export const QuizView: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const correctCount = QUIZ_DATA.filter((q) => answers[q.id] === q.correctIndex).length;

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="rounded-2xl bg-white border border-[#E7DFD3] p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-600" />
            Evaluación de Conocimientos
          </h1>
          <p className="text-sm text-[#6B5E53] mt-1">
            Comprueba tu comprensión sobre fases, ingredientes, maquinaria, calidad e inocuidad.
          </p>
        </div>

        {submitted && (
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-bold text-sm">
              Puntaje: {correctCount} / {QUIZ_DATA.length} ({Math.round((correctCount / QUIZ_DATA.length) * 100)}%)
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reintentar
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {QUIZ_DATA.map((q, qIdx) => {
          const userAns = answers[q.id];
          const isCorrect = userAns === q.correctIndex;
          return (
            <div key={q.id} className="rounded-2xl bg-white border border-[#E7DFD3] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">{q.topic}</span>
                {submitted && (
                  isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Correcta
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700">
                      <XCircle className="w-4 h-4" /> Incorrecta
                    </span>
                  )
                )}
              </div>

              <h2 className="font-bold text-base text-[#1E293B]">
                {qIdx + 1}. {q.question}
              </h2>

              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = userAns === oIdx;
                  let btnStyle = 'bg-[#FAF6F0] border-[#E7DFD3] hover:bg-amber-50 text-[#1E293B]';
                  if (submitted) {
                    if (oIdx === q.correctIndex) {
                      btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                    } else if (isSelected && oIdx !== q.correctIndex) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-500';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-[#1E293B] border-[#1E293B] text-white font-semibold';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={submitted}
                      onClick={() => setAnswers({ ...answers, [q.id]: oIdx })}
                      className={`text-left px-4 py-2.5 rounded-xl border text-sm transition cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700">
                  <span className="font-bold text-[#1E293B]">Retroalimentación: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex justify-end">
          <button
            onClick={() => setSubmitted(true)}
            disabled={answeredCount < QUIZ_DATA.length}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold shadow transition cursor-pointer"
          >
            Finalizar evaluación ({answeredCount}/{QUIZ_DATA.length} respondidas)
          </button>
        </div>
      )}
    </div>
  );
};
