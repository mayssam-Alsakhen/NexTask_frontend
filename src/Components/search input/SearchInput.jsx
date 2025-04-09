'use client';
import { useState, useEffect } from 'react';

export default function SearchInput({ onSearch, onChange }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
      }
    }, 300); // delay for performance (debounce)

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    onChange && onChange(e); // call parent's onChange if provided
  };

  return (
    <input
      type="text"
      placeholder="Search"
      value={query}
      onChange={handleChange}
      className="border px-2 rounded-md py-1 text-baseText focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out"
    />
  );
}
