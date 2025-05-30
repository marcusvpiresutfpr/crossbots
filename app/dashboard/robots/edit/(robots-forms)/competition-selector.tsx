"use client";
import { useState, useMemo, useRef } from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";

type Competition = { id: number; name: string };

interface CompetitionSelectorProps {
  competitions: Competition[];
  selected: Competition[];
  setSelected: (comps: Competition[]) => void;
  name?: string;
}

export default function CompetitionSelector({
  competitions,
  selected,
  setSelected,
  name = "competitionIds",
}: CompetitionSelectorProps) {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(competitions, {
        keys: ["name"],
        threshold: 0.3,
      }),
    [competitions]
  );

  const results = query
    ? fuse.search(query).map((r) => r.item)
    : competitions.filter(
        (c) => !selected.some((s) => s.id === c.id)
      );

  function addCompetition(comp: Competition) {
    if (!selected.some((s) => s.id === comp.id)) {
      setSelected([...selected, comp]);
      setQuery("");
      setDropdownOpen(false);
      inputRef.current?.focus();
    }
  }

  function removeCompetition(id: number) {
    setSelected(selected.filter((c) => c.id !== id));
  }

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">Competitions</legend>
      {selected.length > 0 && (
        <ul className="menu bg-base-200 rounded-box w-full mb-2">
          {selected.map((comp) => (
            <li
              key={comp.id}
              className="group"
              onClick={() => removeCompetition(comp.id)}
            >
              <a
                className="transition-colors cursor-pointer group-hover:text-error"
                title="Remove"
              >
                {comp.name}
              </a>
            </li>
          ))}
        </ul>
      )}
      <label className="input flex items-center gap-2">
        <Search className="w-4 h-4 opacity-60" />
        <input
          ref={inputRef}
          type="search"
          className="grow"
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
        />
      </label>
      {dropdownOpen && results.length > 0 && (
        <ul className="menu bg-base-200 rounded-box w-full mt-1 absolute z-10">
          {results
            .filter((c) => !selected.some((s) => s.id === c.id))
            .map((comp) => (
              <li key={comp.id}>
                <a
                  className="cursor-pointer"
                  onMouseDown={() => addCompetition(comp)}
                >
                  {comp.name}
                </a>
              </li>
            ))}
        </ul>
      )}
      <p className="label">Select one or more competitions</p>
    </fieldset>
  );
}
