export default function QuestionMultipleChoice({ options, selected, onSelect }) {
  return (
    <fieldset className="my-4 w-full max-w-xl">
      {options.map((option, idx) => (
        <label
          key={idx}
          className="mb-2 flex cursor-pointer items-start gap-3 rounded-xl p-4 transition hover:bg-white/10 has-[:checked]:bg-white/10"
        >
          <input
            type="radio"
            name="quiz"
            value={idx}
            checked={selected === idx}
            onChange={() => onSelect(idx)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="relative mt-0.5 size-5 shrink-0 rounded-full bg-ink-900 ring-1 ring-accent-300 transition after:absolute after:inset-1 after:scale-0 after:rounded-full after:bg-accent-300 after:transition-transform after:duration-200 peer-checked:after:scale-100 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-800"
          />
          <span className="leading-relaxed break-words">{option}</span>
        </label>
      ))}
    </fieldset>
  );
}
