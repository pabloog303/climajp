import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin } from 'lucide-react';
import { searchCities, type GeoLocation } from '@/lib/api';
import { citySuggestions } from '@/lib/weatherData';

interface SearchBarProps {
  onSelectCity: (city: string) => void;
}

const SearchBar = ({ onSelectCity }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Local suggestions fallback
  const localFiltered = query.length > 0
    ? citySuggestions.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    : [];

  const showDropdown = isFocused && (suggestions.length > 0 || localFiltered.length > 0);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (cityName: string) => {
    onSelectCity(cityName);
    setQuery('');
    setIsFocused(false);
    setSuggestions([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="relative"
    >
      <div className="glass rounded-2xl flex items-center gap-2 px-4 py-3">
        <Search className="w-4 h-4 text-primary-foreground/50" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search city..."
          className="bg-transparent flex-1 outline-none text-sm text-primary-foreground placeholder:text-primary-foreground/30"
        />
        {isSearching && (
          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground/80 rounded-full animate-spin" />
        )}
        {query && !isSearching && (
          <button onClick={() => { setQuery(''); setSuggestions([]); }} className="p-0.5">
            <X className="w-4 h-4 text-primary-foreground/50" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl overflow-hidden z-10"
          >
            {/* API results */}
            {suggestions.map((loc, index) => (
              <button
                key={`${loc.name}-${loc.lat}-${loc.lon}-${index}`}
                onClick={() => handleSelect(loc.name)}
                className="w-full text-left px-4 py-3 text-sm text-primary-foreground/80 hover:bg-primary-foreground/10 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-3 h-3 text-primary-foreground/50" />
                <span>{loc.name}</span>
                {loc.state && <span className="text-primary-foreground/40">{loc.state},</span>}
                <span className="text-primary-foreground/40">{loc.country}</span>
              </button>
            ))}
            {/* Local fallback if no API results */}
            {suggestions.length === 0 && localFiltered.slice(0, 5).map(city => (
              <button
                key={city}
                onClick={() => handleSelect(city)}
                className="w-full text-left px-4 py-3 text-sm text-primary-foreground/80 hover:bg-primary-foreground/10 transition-colors"
              >
                {city}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
