import { useEffect, useState } from "react";
import { ShoppingBag, Star, Package, Search, Filter, Grid, List, DollarSign, X } from "lucide-react";
import API from "../api";
import SweetCard from "../components/SweetCard";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("all");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: ""
  });

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const res = await API.get("/sweets/");
      setSweets(res.data);
    } catch (error) {
      console.error("Failed to fetch sweets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced search function using the backend endpoint
  const searchSweets = async (searchParams = {}) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (searchParams.name || searchTerm) {
        queryParams.append("name", searchParams.name || searchTerm);
      }
      
      if (searchParams.category && searchParams.category !== "all") {
        queryParams.append("category", searchParams.category);
      }
      
      if (searchParams.minPrice) {
        queryParams.append("min_price", searchParams.minPrice);
      }
      
      if (searchParams.maxPrice) {
        queryParams.append("max_price", searchParams.maxPrice);
      }
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/sweets/search?${queryString}` : "/sweets/";
      
      console.log("Searching with endpoint:", endpoint);
      
      const res = await API.get(endpoint);
      setSweets(res.data);
    } catch (error) {
      console.error("Search failed:", error);
      // Fallback to regular fetch if search fails
      await fetchSweets();
    } finally {
      setLoading(false);
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = () => {
    const searchParams = {
      name: advancedFilters.name,
      category: advancedFilters.category,
      minPrice: advancedFilters.minPrice,
      maxPrice: advancedFilters.maxPrice
    };
    
    // Update the main search term for display consistency
    if (advancedFilters.name) {
      setSearchTerm(advancedFilters.name);
    }
    
    searchSweets(searchParams);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setAdvancedFilters({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: ""
    });
    fetchSweets(); // Reset to show all sweets
  };

  // FIXED: Now accepts quantity parameter from SweetCard
  const handlePurchase = async (id, quantity = 1) => {
    console.log("Dashboard handlePurchase called with:", { id, quantity });
    
    try {
      const response = await API.post(`/sweets/${id}/purchase`, { 
        quantity: quantity
      });
      
      console.log("Purchase successful:", response.data);
      
      // Update local state to reflect the quantity change
      setSweets(prevSweets => 
        prevSweets.map(sweet => 
          sweet._id === id 
            ? { ...sweet, quantity: sweet.quantity - quantity }
            : sweet
        )
      );
      
      return response.data;
    } catch (error) {
      console.error("Purchase failed:", error);
      throw error;
    }
  };

  // Filter sweets locally (for backward compatibility with simple search)
  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch = !searchTerm || 
      sweet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sweet.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || sweet.category === filterType;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchSweets();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchSweets({ name: searchTerm, category: filterType !== "all" ? filterType : "" });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter change effect
  useEffect(() => {
    if (filterType !== "all" || searchTerm) {
      searchSweets({ name: searchTerm, category: filterType !== "all" ? filterType : "" });
    } else {
      fetchSweets();
    }
  }, [filterType]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #9333ea 0%, #c2410c 25%, #ec4899 50%, #dc2626 75%, #7c2d12 100%)',
      position: 'relative',
      paddingTop: '80px', // FIXED: Add padding for navbar
      overflow: 'hidden',
      margin: 0
    },
    backgroundDecor1: {
      position: 'absolute',
      top: '-160px',
      right: '-160px',
      width: '320px',
      height: '320px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%'
    },
    backgroundDecor2: {
      position: 'absolute',
      bottom: '-160px',
      left: '-160px',
      width: '320px',
      height: '320px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%'
    },
    backgroundDecor3: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '384px',
      height: '384px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '50%'
    },
    backgroundDecor4: {
      position: 'absolute',
      top: '20%',
      left: '10%',
      width: '200px',
      height: '200px',
      background: 'rgba(255, 255, 255, 0.04)',
      borderRadius: '50%'
    },
    mainContent: {
      position: 'relative',
      zIndex: 10,
      padding: '24px',
      minHeight: 'calc(100vh - 80px)' // FIXED: Account for navbar height
    },
    headerContainer: {
      marginBottom: '32px'
    },
    headerCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '24px'
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center'
    },
    iconContainer: {
      width: '48px',
      height: '48px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px'
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 4px 0'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0,
      fontSize: '16px'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    viewToggleButton: {
      padding: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    searchFiltersRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '24px'
    },
    searchContainer: {
      position: 'relative',
      flex: 1
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 255, 255, 0.6)',
      pointerEvents: 'none'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.2s',
      boxSizing: 'border-box'
    },
    filterContainer: {
      position: 'relative',
      minWidth: '180px'
    },
    filterIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 255, 255, 0.6)',
      pointerEvents: 'none',
      zIndex: 1
    },
    filterSelect: {
      paddingLeft: '40px',
      paddingRight: '32px',
      paddingTop: '12px',
      paddingBottom: '12px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.2s',
      appearance: 'none',
      cursor: 'pointer',
      width: '100%'
    },
    advancedSearchToggle: {
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '14px',
      fontWeight: '500'
    },
    advancedSearchPanel: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '16px',
      display: showAdvancedSearch ? 'block' : 'none'
    },
    advancedGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    inputContainer: {
      position: 'relative'
    },
    inputIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 255, 255, 0.6)',
      pointerEvents: 'none'
    },
    input: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '10px',
      paddingBottom: '10px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s',
      boxSizing: 'border-box'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    primaryButton: {
      padding: '10px 16px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    secondaryButton: {
      padding: '10px 16px',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
      transition: 'all 0.2s'
    },
    statIcon: {
      margin: '0 auto 8px auto'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 4px 0'
    },
    statLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '14px',
      margin: 0
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '80px',
      paddingBottom: '80px'
    },
    loadingCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '32px',
      textAlign: 'center'
    },
    loadingSpinner: {
      width: '32px',
      height: '32px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px auto'
    },
    loadingText: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0
    },
    productsGrid: {
      display: 'grid',
      gap: '24px'
    },
    gridView: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
    },
    listView: {
      gridTemplateColumns: '1fr',
      maxWidth: '1024px',
      margin: '0 auto'
    },
    productCard: {
      transform: 'scale(1)',
      transition: 'transform 0.3s ease'
    },
    emptyStateContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '80px',
      paddingBottom: '80px'
    },
    emptyStateCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '32px',
      textAlign: 'center',
      maxWidth: '400px'
    },
    emptyIcon: {
      color: 'rgba(255, 255, 255, 0.6)',
      margin: '0 auto 16px auto'
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: 'white',
      margin: '0 0 8px 0'
    },
    emptyText: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: '0 0 16px 0'
    },
    clearButton: {
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  };

  const categories = [...new Set(sweets.map(s => s.category))];

  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          }
          
          #root {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100vh;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
          
          input:focus, select:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
            border-color: transparent;
          }
          
          button:hover:not(:disabled) {
            opacity: 0.9;
          }
          
          .product-card:hover {
            transform: scale(1.02);
          }
          
          .stat-card:hover {
            background: rgba(255, 255, 255, 0.08);
          }
          
          @media (min-width: 768px) {
            .search-filters-row {
              flex-direction: row;
            }
            
            .stats-grid {
              grid-template-columns: repeat(2, 1fr);
              max-width: 500px;
            }
            
            .container {
              padding-top: 70px !important;
            }
          }
          
          @media (max-width: 768px) {
            .container {
              padding-top: 70px !important;
            }
            
            .main-content {
              padding: 16px !important;
            }
          }
          
          @media (max-width: 480px) {
            .container {
              padding-top: 60px !important;
            }
          }
          
          select option {
            background: #7c3aed;
            color: white;
          }
        `}
      </style>
      
      <div style={styles.container} className="container">
        <div style={styles.backgroundDecor1}></div>
        <div style={styles.backgroundDecor2}></div>
        <div style={styles.backgroundDecor3}></div>
        <div style={styles.backgroundDecor4}></div>

        <div style={styles.mainContent} className="main-content">
          <div style={styles.headerContainer}>
            <div style={styles.headerCard}>
              <div style={styles.headerTop}>
                <div style={styles.headerLeft}>
                  <div style={styles.iconContainer}>
                    <ShoppingBag size={24} color="white" />
                  </div>
                  <div style={styles.titleContainer}>
                    <h1 style={styles.title}>Sweet Shop</h1>
                    <p style={styles.subtitle}>Discover delicious treats</p>
                  </div>
                </div>
                <div style={styles.headerRight}>
                  <button
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    style={styles.viewToggleButton}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  >
                    {viewMode === "grid" ? <List size={20} /> : <Grid size={20} />}
                  </button>
                </div>
              </div>

              <div style={styles.searchFiltersRow} className="search-filters-row">
                <div style={styles.searchContainer}>
                  <Search size={20} style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search for sweets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>

                <div style={styles.filterContainer}>
                  <Filter size={20} style={styles.filterIcon} />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  style={styles.advancedSearchToggle}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                >
                  Advanced Search
                </button>
              </div>

              {/* Advanced Search Panel */}
              <div style={styles.advancedSearchPanel}>
                <div style={styles.advancedGrid}>
                  <div style={styles.inputContainer}>
                    <Search size={16} style={styles.inputIcon} />
                    <input
                      style={styles.input}
                      placeholder="Sweet name"
                      value={advancedFilters.name}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, name: e.target.value})}
                    />
                  </div>

                  <div style={styles.inputContainer}>
                    <Package size={16} style={styles.inputIcon} />
                    <select
                      style={styles.input}
                      value={advancedFilters.category}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, category: e.target.value})}
                    >
                      <option value="">Any Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.inputContainer}>
                    <DollarSign size={16} style={styles.inputIcon} />
                    <input
                      style={styles.input}
                      placeholder="Min Price"
                      type="number"
                      min="0"
                      value={advancedFilters.minPrice}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, minPrice: e.target.value})}
                    />
                  </div>

                  <div style={styles.inputContainer}>
                    <DollarSign size={16} style={styles.inputIcon} />
                    <input
                      style={styles.input}
                      placeholder="Max Price"
                      type="number"
                      min="0"
                      value={advancedFilters.maxPrice}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, maxPrice: e.target.value})}
                    />
                  </div>
                </div>

                <div style={styles.buttonGroup}>
                  <button
                    onClick={handleAdvancedSearch}
                    style={styles.primaryButton}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <Search size={16} style={{marginRight: '4px'}} />
                    Search
                  </button>
                  
                  <button
                    onClick={clearAllFilters}
                    style={styles.secondaryButton}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  >
                    <X size={16} style={{marginRight: '4px'}} />
                    Clear All
                  </button>
                </div>
              </div>

              <div style={styles.statsGrid} className="stats-grid">
                <div 
                  style={styles.statCard} 
                  className="stat-card"
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                >
                  <Package size={32} color="white" style={styles.statIcon} />
                  <div style={styles.statValue}>{sweets.length}</div>
                  <div style={styles.statLabel}>Total Products</div>
                </div>
                <div 
                  style={styles.statCard} 
                  className="stat-card"
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                >
                  <ShoppingBag size={32} color="#4ade80" style={styles.statIcon} />
                  <div style={styles.statValue}>{filteredSweets.length}</div>
                  <div style={styles.statLabel}>Available Now</div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingCard}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading delicious sweets...</p>
              </div>
            </div>
          ) : (
            <>
              {filteredSweets.length > 0 ? (
                <div 
                  style={{
                    ...styles.productsGrid,
                    ...(viewMode === "grid" ? styles.gridView : styles.listView)
                  }}
                >
                  {filteredSweets.map((sweet) => (
                    <div 
                      key={sweet._id} 
                      style={styles.productCard}
                      className="product-card"
                    >
                      <SweetCard 
                        sweet={sweet} 
                        onPurchase={handlePurchase}
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyStateContainer}>
                  <div style={styles.emptyStateCard}>
                    <Package size={64} style={styles.emptyIcon} />
                    <h3 style={styles.emptyTitle}>No sweets found</h3>
                    <p style={styles.emptyText}>
                      {searchTerm || advancedFilters.name || advancedFilters.category || advancedFilters.minPrice || advancedFilters.maxPrice
                        ? "Try adjusting your search criteria"
                        : "No sweets available at the moment"}
                    </p>
                    {(searchTerm || advancedFilters.name || advancedFilters.category || advancedFilters.minPrice || advancedFilters.maxPrice) && (
                      <button
                        onClick={clearAllFilters}
                        style={styles.clearButton}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}