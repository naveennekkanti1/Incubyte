import { useEffect, useState, useContext } from "react";
import { History, Search, User, Package, Calendar, DollarSign, ShoppingCart, TrendingUp, BarChart3, Users } from "lucide-react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

export default function PurchaseHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [salesStats, setSalesStats] = useState({
    currentMonth: 0,
    previousMonth: 0,
    totalUsers: 0
  });
  const { user } = useContext(AuthContext);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/purchases/history");
      setHistory(res.data);
      
      // Calculate sales statistics
      if (user?.role === "admin") {
        calculateSalesStats(res.data);
      }
    } catch (err) {
      console.error("Failed to load purchase history", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSalesStats = (purchases) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentMonthSales = 0;
    let previousMonthSales = 0;
    const uniqueUsers = new Set();

    purchases.forEach(purchase => {
      const purchaseDate = new Date(purchase.timestamp);
      const purchaseMonth = purchaseDate.getMonth();
      const purchaseYear = purchaseDate.getFullYear();

      uniqueUsers.add(purchase.user_email || purchase.user_id);

      if (purchaseMonth === currentMonth && purchaseYear === currentYear) {
        currentMonthSales += purchase.total;
      } else if (purchaseMonth === previousMonth && purchaseYear === previousYear) {
        previousMonthSales += purchase.total;
      }
    });

    setSalesStats({
      currentMonth: currentMonthSales,
      previousMonth: previousMonthSales,
      totalUsers: uniqueUsers.size
    });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((p) =>
    p.sweet_name.toLowerCase().includes(filter.toLowerCase()) ||
    (p.user_email && p.user_email.toLowerCase().includes(filter.toLowerCase())) ||
    (p.user_name && p.user_name.toLowerCase().includes(filter.toLowerCase()))
  );

  // Calculate stats based on filtered data
  const totalPurchases = filteredHistory.length;
  const totalAmount = filteredHistory.reduce((sum, p) => sum + p.total, 0);
  const totalItems = filteredHistory.reduce((sum, p) => sum + p.quantity, 0);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #9333ea 0%, #c2410c 25%, #ec4899 50%, #dc2626 75%, #7c2d12 100%)',
      position: 'relative',
      paddingTop: '80px', // FIXED: Add padding to account for navbar
      margin: 0,
      overflow: 'hidden'
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
    mainContent: {
      position: 'relative',
      zIndex: 10,
      padding: '24px',
      minHeight: 'calc(100vh - 80px)', // FIXED: Account for navbar height
      width: '100%',
      boxSizing: 'border-box'
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
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '32px',
      flexWrap: 'wrap',
      gap: '20px',
      minHeight: '80px'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    iconContainer: {
      width: '48px',
      height: '48px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px',
      flexShrink: 0
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: '0'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 8px 0',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      lineHeight: '1.2'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      margin: 0,
      fontSize: '16px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      lineHeight: '1.4'
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '24px'
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
      maxWidth: '500px',
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: user?.role === "admin" ? 'repeat(auto-fit, minmax(180px, 1fr))' : 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
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
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 4px 0'
    },
    statLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '12px',
      margin: 0
    },
    tableContainer: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '24px',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      minWidth: '800px'
    },
    tableHeader: {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px 12px 0 0'
    },
    tableHeaderCell: {
      padding: '16px 12px',
      color: 'white',
      fontWeight: '600',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'left',
      fontSize: '14px'
    },
    tableRow: {
      transition: 'all 0.2s',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    tableCell: {
      padding: '12px',
      color: 'rgba(255, 255, 255, 0.9)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '14px'
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

  const getSalesGrowth = () => {
    if (salesStats.previousMonth === 0) return 0;
    return ((salesStats.currentMonth - salesStats.previousMonth) / salesStats.previousMonth * 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMonthName = (offset = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toLocaleString('default', { month: 'long' });
  };

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
            overflow-x: hidden;
          }
          
          #root {
            margin: 0;
            padding: 0;
            width: 100%;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
          
          input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
            border-color: transparent;
          }
          
          .table-row:hover {
            background: rgba(255, 255, 255, 0.05);
          }
          
          .stat-card:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateY(-2px);
          }
          
          @media (max-width: 768px) {
            .table-container {
              padding: 16px;
            }
            
            .table-header-cell, .table-cell {
              padding: 8px;
              font-size: 12px;
            }
            
            .stats-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            
            .header-top {
              flex-direction: column;
              align-items: flex-start;
              text-align: left;
              min-height: auto;
            }
            
            .header-left {
              width: 100%;
            }
            
            .title {
              font-size: 24px !important;
              line-height: 1.3 !important;
            }
            
            .subtitle {
              font-size: 14px !important;
            }
            
            /* FIXED: Mobile navbar padding */
            .container {
              padding-top: 70px !important;
            }
          }
          
          @media (max-width: 480px) {
            .container {
              padding-top: 60px !important;
            }
            
            .main-content {
              padding: 16px !important;
            }
          }
        `}
      </style>
      
      <div style={styles.container} className="container">
        {/* Background decorative elements */}
        <div style={styles.backgroundDecor1}></div>
        <div style={styles.backgroundDecor2}></div>
        <div style={styles.backgroundDecor3}></div>

        {/* Main content */}
        <div style={styles.mainContent} className="main-content">
          {/* Header */}
          <div style={styles.headerContainer}>
            <div style={styles.headerCard}>
              <div style={styles.headerTop} className="header-top">
                <div style={styles.headerLeft} className="header-left">
                  <div style={styles.iconContainer}>
                    {user?.role === "admin" ? <BarChart3 size={24} color="white" /> : <History size={24} color="white" />}
                  </div>
                  <div style={styles.titleContainer}>
                    <h1 style={styles.title} className="title">
                      {user?.role === "admin" ? "Sales Dashboard" : "Purchase History"}
                    </h1>
                    <p style={styles.subtitle} className="subtitle">
                      {user?.role === "admin" ? "Complete sales analytics and purchase history" : "Your transaction history"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div style={styles.searchContainer}>
                <Search size={20} style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder={user?.role === "admin" ? "Filter by sweet name, user email or name..." : "Filter by sweet name..."}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              {/* Stats */}
              <div style={styles.statsGrid} className="stats-grid">
                {user?.role === "admin" ? (
                  <>
                    <div 
                      style={styles.statCard} 
                      className="stat-card"
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                      <TrendingUp size={28} color="#10b981" style={styles.statIcon} />
                      <div style={styles.statValue}>{formatCurrency(salesStats.currentMonth)}</div>
                      <div style={styles.statLabel}>{getMonthName()} Sales</div>
                    </div>
                    <div 
                      style={styles.statCard} 
                      className="stat-card"
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                      <BarChart3 size={28} color="#8b5cf6" style={styles.statIcon} />
                      <div style={styles.statValue}>{formatCurrency(salesStats.previousMonth)}</div>
                      <div style={styles.statLabel}>{getMonthName(-1)} Sales</div>
                    </div>
                    <div 
                      style={styles.statCard} 
                      className="stat-card"
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                      <TrendingUp size={28} color={getSalesGrowth() >= 0 ? "#10b981" : "#ef4444"} style={styles.statIcon} />
                      <div style={{...styles.statValue, color: getSalesGrowth() >= 0 ? "#10b981" : "#ef4444"}}>
                        {getSalesGrowth() >= 0 ? '+' : ''}{getSalesGrowth().toFixed(1)}%
                      </div>
                      <div style={styles.statLabel}>Growth Rate</div>
                    </div>
                    <div 
                      style={styles.statCard} 
                      className="stat-card"
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                      <Users size={28} color="#f59e0b" style={styles.statIcon} />
                      <div style={styles.statValue}>{salesStats.totalUsers}</div>
                      <div style={styles.statLabel}>Total Customers</div>
                    </div>
                    <div 
                      style={styles.statCard} 
                      className="stat-card"
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                      <ShoppingCart size={28} color="white" style={styles.statIcon} />
                      <div style={styles.statValue}>{totalPurchases}</div>
                      <div style={styles.statLabel}>Total Orders</div>
                    </div>
                    <div 
                      style={styles.statCard} 
                      className="stat-card"
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                      <DollarSign size={28} color="#4ade80" style={styles.statIcon} />
                      <div style={styles.statValue}>{formatCurrency(totalAmount)}</div>
                      <div style={styles.statLabel}>Total Revenue</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div 
                      style={styles.statCard} 
                      className="stat-card"
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                      <ShoppingCart size={32} color="white" style={styles.statIcon} />
                      <div style={styles.statValue}>{totalPurchases}</div>
                      <div style={styles.statLabel}>Total Orders</div>
                    </div>
                    <div 
                      style={styles.statCard} 
                      className="stat-card"
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                      <Package size={32} color="#4ade80" style={styles.statIcon} />
                      <div style={styles.statValue}>{totalItems}</div>
                      <div style={styles.statLabel}>Items Bought</div>
                    </div>
                    <div 
                      style={styles.statCard} 
                      className="stat-card"
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                      <DollarSign size={32} color="#fbbf24" style={styles.statIcon} />
                      <div style={styles.statValue}>₹{totalAmount.toFixed(2)}</div>
                      <div style={styles.statLabel}>Total Spent</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingCard}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading purchase history...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Purchase History Table */}
              {filteredHistory.length > 0 ? (
                <div style={styles.tableContainer} className="table-container">
                  <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                      <tr>
                        {user?.role === "admin" && (
                          <th style={styles.tableHeaderCell} className="table-header-cell">
                            <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            Customer
                          </th>
                        )}
                        <th style={styles.tableHeaderCell} className="table-header-cell">
                          <Package size={16} style={{ display: 'inline', marginRight: '8px' }} />
                          Sweet
                        </th>
                        <th style={styles.tableHeaderCell} className="table-header-cell">Quantity</th>
                        <th style={styles.tableHeaderCell} className="table-header-cell">Price</th>
                        <th style={styles.tableHeaderCell} className="table-header-cell">Total</th>
                        <th style={styles.tableHeaderCell} className="table-header-cell">
                          <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((p, index) => (
                        <tr
                          key={p._id}
                          style={{
                            ...styles.tableRow,
                            background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                          }}
                          className="table-row"
                        >
                          {user?.role === "admin" && (
                            <td style={styles.tableCell} className="table-cell">
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                              }}>
                                <div style={{
                                  color: 'white',
                                  fontWeight: '500',
                                  fontSize: '13px'
                                }}>
                                  {p.user_name || 'Unknown User'}
                                </div>
                                <div style={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '11px'
                                }}>
                                  {p.user_email || p.user_id}
                                </div>
                              </div>
                            </td>
                          )}
                          <td style={{...styles.tableCell, fontWeight: '500'}} className="table-cell">{p.sweet_name}</td>
                          <td style={styles.tableCell} className="table-cell">
                            <span style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '13px'
                            }}>
                              {p.quantity}
                            </span>
                          </td>
                          <td style={styles.tableCell} className="table-cell">₹{p.price}</td>
                          <td style={{...styles.tableCell, fontWeight: '600', color: '#4ade80'}} className="table-cell">
                            ₹{p.total}
                          </td>
                          <td style={{...styles.tableCell, fontSize: '13px'}} className="table-cell">
                            {new Date(p.timestamp).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Empty state */
                <div style={styles.emptyStateContainer}>
                  <div style={styles.emptyStateCard}>
                    <History size={64} style={styles.emptyIcon} />
                    <h3 style={styles.emptyTitle}>No purchase history found</h3>
                    <p style={styles.emptyText}>
                      {filter ? `No purchases found matching "${filter}"` : "No purchases have been made yet"}
                    </p>
                    {filter && (
                      <button
                        onClick={() => setFilter("")}
                        style={styles.clearButton}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                      >
                        Clear filter
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