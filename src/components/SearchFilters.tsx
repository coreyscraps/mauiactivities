/**
 * Search & Filter Component
 * Full-text search, category filter, price range, rating filter
 */

import React, { useState, useCallback } from 'react';

interface FilterOptions {
  q?: string;
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popularity' | 'newest';
}

interface SearchFiltersProps {
  categories?: { id: string; name: string }[];
  locations?: { id: string; name: string; region: string }[];
  onFilterChange: (filters: FilterOptions) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories = [],
  locations = [],
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    q: '',
    category: '',
    location: '',
    priceMin: 0,
    priceMax: 500,
    minRating: 0,
    sortBy: 'popularity',
  });

  const handleFilterChange = useCallback(
    (newFilters: Partial<FilterOptions>) => {
      const updated = { ...filters, ...newFilters };
      setFilters(updated);
      onFilterChange(updated);
    },
    [filters, onFilterChange]
  );

  const handleReset = () => {
    const reset: FilterOptions = {
      q: '',
      category: '',
      location: '',
      priceMin: 0,
      priceMax: 500,
      minRating: 0,
      sortBy: 'popularity',
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="search-filters">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search activities, vendors..."
          value={filters.q || ''}
          onChange={(e) => handleFilterChange({ q: e.target.value })}
          className="search-input"
        />
        <button className="search-btn">🔍</button>
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        {/* Category Filter */}
        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="filter-group">
          <label>Location</label>
          <select
            value={filters.location || ''}
            onChange={(e) => handleFilterChange({ location: e.target.value })}
            className="filter-select"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.region})
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={filters.sortBy || 'popularity'}
            onChange={(e) =>
              handleFilterChange({
                sortBy: e.target.value as FilterOptions['sortBy'],
              })
            }
            className="filter-select"
          >
            <option value="popularity">Most Popular</option>
            <option value="price_asc">Cheapest First</option>
            <option value="price_desc">Most Expensive</option>
            <option value="rating">Best Reviews</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Reset Button */}
        <button onClick={handleReset} className="reset-btn">
          ✕ Clear Filters
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="advanced-filters">
        {/* Price Range */}
        <div className="filter-group">
          <label>Price Range</label>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin || 0}
              onChange={(e) =>
                handleFilterChange({ priceMin: parseInt(e.target.value) || 0 })
              }
              className="price-input"
            />
            <span>–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax || 500}
              onChange={(e) =>
                handleFilterChange({ priceMax: parseInt(e.target.value) || 500 })
              }
              className="price-input"
            />
          </div>
        </div>

        {/* Minimum Rating */}
        <div className="filter-group">
          <label>Min Rating</label>
          <div className="rating-options">
            {[0, 1, 2, 3, 4].map((rating) => (
              <button
                key={rating}
                onClick={() => handleFilterChange({ minRating: rating })}
                className={`rating-btn ${
                  filters.minRating === rating ? 'active' : ''
                }`}
              >
                {rating === 0 ? 'All' : `${rating}+ ⭐`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .search-filters {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .search-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .search-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #2196f3;
        }

        .search-btn {
          background: #2196f3;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s;
        }

        .search-btn:hover {
          background: #1976d2;
        }

        .filters-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
        }

        .filter-select {
          padding: 8px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .filter-select:focus {
          outline: none;
          border-color: #2196f3;
        }

        .reset-btn {
          background: #f44336;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          align-self: flex-end;
          transition: background 0.2s;
        }

        .reset-btn:hover {
          background: #d32f2f;
        }

        .advanced-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid #e0e0e0;
        }

        .price-inputs {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .price-input {
          flex: 1;
          padding: 8px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 13px;
        }

        .price-input:focus {
          outline: none;
          border-color: #2196f3;
        }

        .rating-options {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .rating-btn {
          padding: 6px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .rating-btn:hover {
          border-color: #2196f3;
        }

        .rating-btn.active {
          background: #2196f3;
          color: white;
          border-color: #2196f3;
        }

        @media (max-width: 768px) {
          .filters-row {
            grid-template-columns: 1fr;
          }

          .advanced-filters {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchFilters;
