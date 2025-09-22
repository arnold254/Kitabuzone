import { useStore } from "../../context/StoreContext";

const FilterDropdown = () => {
  const {
    genreFilter,
    setGenreFilter,
    availabilityFilter,
    setAvailabilityFilter,
    languageFilter,
    setLanguageFilter,
    dateSort,
    setDateSort,
    priceFilter,
    setPriceFilter,
  } = useStore();

  const genres = ["Fiction", "Non-Fiction", "Science", "Fantasy"];
  const availabilities = ["Available", "Out of Stock"];
  const languages = ["English", "Swahili"];
  const sortOptions = ["newest", "oldest"];
  const priceOptions = ["all", "low", "medium", "high"];

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={priceFilter}
        onChange={(e) => setPriceFilter(e.target.value)}
        className="p-1.5 rounded-lg text-sm text-neutral-900 border border-primary-200"
      >
        <option value="all">All Prices</option>
        {priceOptions.slice(1).map((price) => (
          <option key={price} value={price}>
            {price === "low" ? "Low (≤1000 KES)" : price === "medium" ? "Medium (1000–2000 KES)" : "High (>2000 KES)"}
          </option>
        ))}
      </select>
      <select
        value={dateSort}
        onChange={(e) => setDateSort(e.target.value)}
        className="p-1.5 rounded-lg text-sm text-neutral-900 border border-primary-200"
      >
        {sortOptions.map((sort) => (
          <option key={sort} value={sort}>
            {sort === "newest" ? "Newest First" : "Oldest First"}
          </option>
        ))}
      </select>
      <select
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
        className="p-1.5 rounded-lg text-sm text-neutral-900 border border-primary-200"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
      <select
        value={availabilityFilter}
        onChange={(e) => setAvailabilityFilter(e.target.value)}
        className="p-1.5 rounded-lg text-sm text-neutral-900 border border-primary-200"
      >
        <option value="">All Availability</option>
        {availabilities.map((avail) => (
          <option key={avail} value={avail}>{avail}</option>
        ))}
      </select>
      <select
        value={languageFilter}
        onChange={(e) => setLanguageFilter(e.target.value)}
        className="p-1.5 rounded-lg text-sm text-neutral-900 border border-primary-200"
      >
        <option value="">All Languages</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;