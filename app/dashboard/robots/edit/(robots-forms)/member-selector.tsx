"use client";
import { useState, useMemo, useRef } from "react";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";

// Member type is still { id, name }, but id corresponds to memberId in contributors
type Member = { id: number; name: string };
type SelectedMember = Member & { active: boolean };

interface MemberSelectorProps {
  members: Member[];
  selected: SelectedMember[];
  setSelected: (members: SelectedMember[]) => void;
  name?: string;
}

export default function MemberSelector({
  members,
  selected,
  setSelected,
  name = "memberIds",
}: MemberSelectorProps) {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(members, {
        keys: ["name"],
        threshold: 0.3,
      }),
    [members]
  );

  // Only show members not already selected
  const results = query
    ? fuse.search(query).map((r) => r.item)
    : members.filter((m) => !selected.some((s) => s.id === m.id));

  function addMember(member: Member) {
    if (!selected.some((s) => s.id === member.id)) {
      setSelected([...selected, { ...member, active: true }]);
      setQuery("");
      setDropdownOpen(false);
      inputRef.current?.focus();
    }
  }

  function removeMember(id: number) {
    setSelected(selected.filter((m) => m.id !== id));
  }

  function toggleActive(id: number) {
    setSelected(
      selected.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  }

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">Members</legend>
      {selected.length > 0 && (
        <ul className="menu bg-base-200 rounded-box w-full mb-2">
          {selected.map((member) => (
            <li key={member.id} className="flex items-center gap-2 px-2 py-1">
              <input
                type="checkbox"
                checked={member.active}
                onChange={() => toggleActive(member.id)}
                className="checkbox"
                tabIndex={-1}
              />
              <span className="flex-1">{member.name}</span>
              <button
                type="button"
                className="btn btn-xs btn-ghost text-error"
                title="Remove"
                onClick={() => removeMember(member.id)}
              >
                <X className="w-4 h-4" />
              </button>
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
            .filter((m) => !selected.some((s) => s.id === m.id))
            .map((member) => (
              <li key={member.id}>
                <a
                  className="cursor-pointer"
                  onMouseDown={() => addMember(member)}
                >
                  {member.name}
                </a>
              </li>
            ))}
        </ul>
      )}
      <p className="label">Select one or more members</p>
    </fieldset>
  );
}
