/* global wp */
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";

function useIsDesktop() {
  const get = () =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1025px)').matches
      : true; // default to desktop during SSR/first paint

  const [isDesktop, setIsDesktop] = React.useState(get);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(min-width: 1025px)');
    const handler = (e) => setIsDesktop(e.matches);
    // Support older browsers
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler);
      else mql.removeListener(handler);
    };
  }, []);

  return isDesktop;
}

/**
 * Utility to build stable unique IDs for aria relationships.
 * If multiple instances exist on a page, prefix with a mount-specific uid.
 */
const makeId = (prefix, i) => `${prefix}-${i}`;

const GooeySearch = ({ placeholder = "Search…", action = "/" }) => {
  const isDesktop = useIsDesktop();
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const showNoResults =
  open &&
  !loading &&
  value.trim().length > 0 &&
  results.length === 0;

  const boxRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const latestQueryRef = useRef("");
  const debounceRef = useRef(null);
  const normalizeQuery = (s) => (s || "").trim();

  // When true, let the browser submit the form to action/?s=...
  const allowNativeSubmitRef = useRef(false);

  // Build unique ids for aria-controls, options, etc.
  // These IDs let the input’s key handlers move focus by
  // grabbing exact elements with document.getElementById(nextId)?.focus()
  const uidRef = useRef(`gs${Math.random().toString(36).slice(2)}`);
  const listboxId = `${uidRef.current}-results`;
  const inputId = `${uidRef.current}-input`;

  useEffect(() => {
    const onDown = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  // Debounced live search on value change (with AbortController)
  useEffect(() => {
    const q = normalizeQuery(value);
    latestQueryRef.current = q;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q) {
      // IMPORTANT: wipe the "latest" query too so stale responses get ignored
      latestQueryRef.current = "";
      abortRef.current?.abort();
      setResults([]);
      setLoading(false);
      setPending(false);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setPending(false);
        setLoading(true);

        const r = await fetch(
          `/wp-json/ogig/v1/search?s=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );

        const data = await r.json();

        // ✅ Ignore stale responses
        if (controller.signal.aborted) return;
        if (latestQueryRef.current !== q) return;

        const cleaned = Array.isArray(data)
          ? data.filter((item) => item && item.url && String(item.title || "").trim().length > 0)
          : [];

        setResults(cleaned);
        setOpen(true);
      } catch (err) {
        if (err?.name !== "AbortError") {
          // Only update if still relevant
          if (latestQueryRef.current === q) {
            setResults([]);
            setOpen(true);
          }
        }
      } finally {
        if (!controller.signal.aborted && latestQueryRef.current === q) {
          setLoading(false);
        }
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);


  // Prevent scrolling to top when input is focused on mobile
  useEffect(() => {
    const handleFocus = () => {
      // Store current scroll position before focus
      const scrollY = window.scrollY;
      
      // Small timeout to allow keyboard to appear and viewport to recalculate
      setTimeout(() => {
        window.scrollTo(0, scrollY);
      }, 100);
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      return () => input.removeEventListener('focus', handleFocus);
    }
  }, []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);
  const doSearch = async () => {
    const q = normalizeQuery(value);

    if (!q) {
      latestQueryRef.current = "";
      abortRef.current?.abort();
      setResults([]);
      setPending(false);
      setLoading(false);
      setOpen(false);
      return;
    }

    latestQueryRef.current = q;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPending(false);
    setLoading(true);

    try {
      const r = await fetch(
        `/wp-json/ogig/v1/search?s=${encodeURIComponent(q)}`,
        { signal: controller.signal }
      );

      const data = await r.json();

      if (controller.signal.aborted) return;
      if (latestQueryRef.current !== q) return;

      const cleaned = Array.isArray(data)
        ? data.filter((item) => item && item.url && String(item.title || "").trim().length > 0)
        : [];

      setResults(cleaned);
      setOpen(true);
    } catch (err) {
      if (err?.name !== "AbortError") {
        if (latestQueryRef.current === q) {
          setResults([]);
          setOpen(true);
        }
      }
    } finally {
      if (!controller.signal.aborted && latestQueryRef.current === q) {
        setLoading(false);
      }
    }
  };


  const onInputKeyDown = (e) => {
    // Escape closes regardless
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      // If we had set allowNativeSubmitRef on a prior keydown, clear it
      allowNativeSubmitRef.current = false;
      return;
    }

    // Enter behavior:
    // - If an option is selected, go to it (JS behavior)
    // - Else, allow native submit to full results page
    if (e.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]?.url) {
        e.preventDefault();
        window.location.href = results[activeIndex].url;
        return;
      }
      // No active selection -> allow native submit
      allowNativeSubmitRef.current = true;
      return; // do not preventDefault here
    }

    // Arrow navigation only if we have results
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      const next = activeIndex === -1 ? 0 : activeIndex + 1;
      if (next >= results.length) return; // No wrap
      const nextId = makeId(`${uidRef.current}-opt`, next);
      document.getElementById(nextId)?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const next = activeIndex === -1 ? results.length - 1 : activeIndex - 1;
      if (next < 0) return; // No wrap
      const nextId = makeId(`${uidRef.current}-opt`, next);
      document.getElementById(nextId)?.focus();
    }
  };

  const onOptionKeyDown = (e, i) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = i + 1;
      if (next >= results.length) return; // No wrap
      const nextId = makeId(`${uidRef.current}-opt`, next);
      document.getElementById(nextId)?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = i - 1;
      if (next < 0) {
        inputRef.current.focus();
        setActiveIndex(-1);
        return;
      }
      const nextId = makeId(`${uidRef.current}-opt`, next);
      document.getElementById(nextId)?.focus();
    }

    // Optional: Handle printable keys to refocus input and continue typing
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setValue((prev) => prev + e.key);
      inputRef.current.focus();
      setActiveIndex(-1);
    }
  };

  const keepOpenOnMouseDown = () => setOpen(true);

  // Intercept form submit: run REST search instead of navigating,
  // unless the user intended native submit (Enter with no selection).
  const onSubmit = async (e) => {
    // If no query, stop everything.
    if (!value.trim()) {
      e.preventDefault();
      setOpen(false);
      setResults([]);
      setLoading(false);
      return;
    }

    if (allowNativeSubmitRef.current) {
      // Let browser navigate to ?s=...
      // Reset the flag for next time.
      allowNativeSubmitRef.current = false;
      return; // do NOT preventDefault
    }

    // JS-enhanced: prevent navigation, do live results
    e.preventDefault();
    
    // Clear results before new search to prevent stale data
    setResults([]);
    setActiveIndex(-1); // Reset selection
    
    await doSearch();
  };

  // When clicking the icon, perform native form submission
  const onIconClick = async (e) => {
    e.preventDefault(); // Prevent any default button behavior
    
    if (!value.trim()) {
      // If no value, focus input but don't submit
      inputRef.current?.focus();
      return;
    }
    
    // Create a native form submission by constructing the URL
    // This mimics what the native form would do: action/?s=value
    const searchUrl = `${action}?s=${encodeURIComponent(value)}`;
    window.location.href = searchUrl;
  };

  return (
    <form
      className={`gooey-search__wrap ${open ? "gooey-search__wrap--open" : ""}`}
      aria-busy={(pending || loading) || undefined}
      ref={boxRef}
      style={{ filter: 'url(#gooey-search-goo)' }}
      role="search"
      action={action}
      method="get"
      onSubmit={onSubmit}
      // If a user clicks outside and then hits enter, ensure we don't carry over native-intent flag
      onReset={() => { allowNativeSubmitRef.current = false; }}
    >
      <div className="gooey-search__field">
        <input
          id={inputId}
          ref={inputRef}
          autoComplete="off"
          className="gooey-search__input js-gooey-search-input"
          placeholder={placeholder}
          name="s" // critical for native WP search fallback
          value={value}
          onFocus={() => { setOpen(!!value.trim()); setActiveIndex(-1); }}
          onChange={(e) => {
            const next = e.target.value;
            setValue(next);
            setActiveIndex(-1);

            if (!next.trim()) {
              latestQueryRef.current = "";
              if (debounceRef.current) clearTimeout(debounceRef.current);
              abortRef.current?.abort();
              setResults([]);
              setPending(false);
              setLoading(false);
              setOpen(false);
              return;
            }

            setPending(true);
          }}
          onKeyDown={onInputKeyDown}
          // ARIA adjustments
          role="searchbox"
          aria-expanded={open}
          aria-controls={listboxId}
        />

        {/* Gooey layer */}
        <div className="gooey-search__ink" aria-hidden="true">
          {/* Surface */}
          <motion.span
            className="gooey-search__surface"
            initial={false}
            animate={open ? { right: 40 } : { right: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          />
          {/* Lens */}
          <motion.span
            className="gooey-search__lens"
            initial={{ x: 0, scale: 0.95 }}
            animate={open ? { x: 10, scale: 1 } : { x: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          />
          {/* Handle */}
          <motion.span
            className="gooey-search__handle"
            initial={{ x: 0, scale: 0 }}
            animate={open ? { x: 12, scale: 1 } : { x: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.02 }}
          />
        </div>

        {/* Icon overlay (submit) */}
        <button
          type="submit"
          className="gooey-search__icon js-gooey-search-icon"
          aria-label={(pending || loading) && isDesktop ? "Loading" : "Search"}
          aria-live="polite"
          data-loading={(pending || loading) && isDesktop ? 'true' : 'false'}
          disabled={pending || loading}
          onMouseDown={(e) => e.preventDefault()} // keep focus on input
          onClick={onIconClick}
        >
        {(pending || loading) && isDesktop ? (
          <svg
            className="icon-spinner"
            viewBox="0 0 50 50"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"
                    strokeLinecap="round" strokeDasharray="100" strokeDashoffset="60"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
        )}
        </button>
      </div>

      <AnimatePresence>
        {open && value.trim().length > 0 && (results.length > 0 || showNoResults) && (
          <div
            id={listboxId}
            className="gooey-search__results js-gooey-search-results"
            onMouseDown={keepOpenOnMouseDown}
            role="listbox"
            aria-labelledby={inputId}
          >
            {results.length > 0 ? (
              results.map((r, i) => {
                const optionId = makeId(`${uidRef.current}-opt`, i);
                return (
                  <motion.a
                    key={r.url || i}
                    id={optionId}
                    href={r.url}
                    className="gooey-search__result"
                    role="option"
                    aria-selected={i === activeIndex}
                    onFocus={() => setActiveIndex(i)}
                    onKeyDown={(e) => onOptionKeyDown(e, i)}
                    initial={{ y: -6, scale: 0.95, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: -6, scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.35, duration: 0.5, delay: i * 0.04 }}
                  >
                    {r.title}
                  </motion.a>
                );
              })
            ) : (
              <motion.div
                className="gooey-search__no-results"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                role="status"
                aria-live="polite"
              >
                No results found
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </form>
  );
};

// Mount to js-hook containers (progressive enhancement)
document.querySelectorAll(".js-gooey-search").forEach((node) => {
  const ph = node.dataset.placeholder || "Search…";
  const action = node.dataset.action || "/"; // allows overriding form action if desired
  createRoot(node).render(<GooeySearch placeholder={ph} action={action} />);
});