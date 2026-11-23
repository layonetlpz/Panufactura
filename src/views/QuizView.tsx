import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Filter,
} from 'lucide-react';
import { QUIZ_DATA, QUIZ_TOPICS } from '../data/quizData';

export const QuizView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('Todos');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const visibleQuestions =
    selectedTopic === 'Todos'
      ? QUIZ_DATA
      : QUIZ_DATA.filter((q) => q.topic === selectedTopic);

  const answeredInView = visibleQuestions.filter((q) => answers[q.id] !== undefined).length;
  const correctInView = visibleQuestions.filter((q) => answers[q.id] === q.correctIndex).length;
  const progressPct = Math.round((answeredInView / visibleQuestions.length) * 100);
  const scorePct = Math.round((correctInView / visibleQuestions.length) * 100);

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ==================== 1. HEADER, TOPIC FILTER & PROGRESS ==================== */}
      <section className="rounded-2xl bg-white border border-[#E5DEC9] p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#14181F] flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#C87D20]" />
              Evaluación Interactiva de Competencias Técnicas
            </h1>
            <p className="text-xs sm:text-sm text-[#5C554B] mt-0.5">
              12 preguntas distribuidas en los 8 ejes del proceso: materias primas, secuencia,
              amasado, fermentación, horneado, maquinaria, variables y calidad/inocuidad.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5DEC9] hover:bg-[#F3EFE6] text-xs font-bold text-[#14181F] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#9A3412]" />
            Reiniciar cuestionario
          </button>
        </div>

        {/* Topic Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F3EFE6]">
          <span className="text-xs font-bold text-[#5C554B] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Eje temático:
          </span>
          <button
            onClick={() => {
              setSelectedTopic('Todos');
              setSubmitted(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              selectedTopic === 'Todos'
                ? 'bg-[#14181F] text-white border-[#14181F]'
                : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9] hover:bg-[#F3EFE6]'
            }`}
          >
            Todos ({QUIZ_DATA.length})
          </button>
          {QUIZ_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setSelectedTopic(topic);
                setSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                selectedTopic === topic
                  ? 'bg-[#C87D20] text-white border-[#C87D20]'
                  : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9] hover:bg-[#F3EFE6]'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#5C554B]">
              Progreso de respuestas ({answeredInView} de {visibleQuestions.length} respondidas)
            </span>
            <span className="font-mono-tech font-bold text-[#9A3412]">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-[#F3EFE6] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C87D20] to-[#1B4332] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Final Score Summary Card (Only shown AFTER submission) */}
        {submitted && (
          <div className="rounded-2xl bg-[#14181F] text-white p-5 border border-[#C87D20]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-[#C87D20] text-white shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono-tech uppercase text-[#F4D06F]">
                  Resultado de la Evaluación
                </div>
                <h2 className="text-xl font-bold mt-0.5">
                  Puntaje: {correctInView} / {visibleQuestions.length} respuestas correctas (
                  {scorePct}%)
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {scorePct >= 80
                    ? 'Dominio sobresaliente de los principios de ingeniería, panificación e inocuidad.'
                    : scorePct >= 60
                    ? 'Comprensión satisfactoria. Revisa las explicaciones técnicas en los ítems fallados.'
                    : 'Se recomienda repasar el recorrido 3D y las fichas técnicas antes de volver a intentar.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-[#C87D20] hover:bg-[#B45309] text-white text-xs font-bold cursor-pointer"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
      </section>

      {/* ==================== 2. QUESTION CARDS ==================== */}
      <div className="space-y-4">
        {visibleQuestions.map((q, qIdx) => {
          const userAns = answers[q.id];
          const isCorrect = userAns === q.correctIndex;

          return (
            <article
              key={q.id}
              className="rounded-2xl bg-white border border-[#E5DEC9] p-5 sm:p-6 shadow-sm space-y-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#F3EFE6] text-[#9A3412] text-xs font-mono-tech font-bold uppercase">
                  {q.topic}
                </span>
                {submitted &&
                  (isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4332] bg-[#1B4332]/10 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correcta
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                      <XCircle className="w-3.5 h-3.5" /> Incorrecta
                    </span>
                  ))}
              </div>

              <h2 className="font-bold text-base sm:text-lg text-[#14181F]">
                {qIdx + 1}. {q.question}
              </h2>

              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = userAns === oIdx;
                  let btnStyle =
                    'bg-[#FBF9F5] border-[#E5DEC9] hover:bg-[#F3EFE6] hover:border-[#C87D20] text-[#181C23]';

                  if (submitted) {
                    if (oIdx === q.correctIndex) {
                      btnStyle =
                        'bg-[#1B4332]/12 border-[#1B4332] text-[#14181F] font-bold';
                    } else if (isSelected && oIdx !== q.correctIndex) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-500';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-[#14181F] border-[#14181F] text-white font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={submitted}
                      onClick={() => setAnswers({ ...answers, [q.id]: oIdx })}
                      className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition cursor-pointer flex items-center gap-3 ${btnStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg font-mono-tech text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected && !submitted
                            ? 'bg-[#C87D20] text-white'
                            : 'bg-black/5 text-current'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="rounded-xl bg-[#F3EFE6] border border-[#E5DEC9] p-3.5 text-xs text-[#181C23] leading-relaxed">
                  <strong className="text-[#14181F]">Justificación técnica: </strong>
                  {q.explanation}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white border border-[#E5DEC9] p-4 shadow-sm">
          <div className="text-xs text-[#5C554B]">
            Responde todas las preguntas visibles para habilitar la calificación y las
            explicaciones técnicas.
          </div>
          <button
            onClick={() => setSubmitted(true)}
            disabled={answeredInView < visibleQuestions.length}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C87D20] to-[#B45309] hover:opacity-95 disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer shrink-0"
          >
            Calificar evaluación ({answeredInView}/{visibleQuestions.length})
          </button>
        </div>
      )}
    </div>
  );
};
