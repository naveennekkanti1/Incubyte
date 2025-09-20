import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  // Debug: Log user object to see what data is available
  console.log("Navbar user data:", user);

  const styles = {
    navbar: {
      position: 'fixed', // Make navbar fixed to prevent overlap issues
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000, // Ensure navbar stays on top
      height: '64px' // Define explicit height for consistent spacing
    },
    background: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to right, rgba(147, 51, 234, 0.9), rgba(236, 72, 153, 0.9), rgba(59, 130, 246, 0.9))',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    container: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      color: 'white',
      height: '100%'
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px'
    },
    brandContainer: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      textDecoration: 'none',
      color: 'white',
      transition: 'all 0.2s'
    },
    brandIcon: {
      width: '32px',
      height: '32px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '8px'
    },
    brandIconInner: {
      width: '16px',
      height: '16px',
      background: 'white',
      borderRadius: '2px'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    navLink: {
      padding: '8px 12px',
      borderRadius: '8px',
      transition: 'all 0.2s',
      textDecoration: 'none',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    loginButton: {
      padding: '8px 16px',
      borderRadius: '8px',
      background: 'transparent',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500'
    },
    registerButton: {
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      gap: '8px',
      minWidth: 'fit-content' // Ensure proper width
    },
    userAvatar: {
      width: '24px',
      height: '24px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0 // Prevent avatar from shrinking
    },
    userAvatarInner: {
      width: '12px',
      height: '12px',
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '50%'
    },
    username: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '14px',
      fontWeight: '500',
      margin: 0,
      whiteSpace: 'nowrap', // Prevent text wrapping
      minWidth: '40px' // Minimum width to ensure visibility
    },
    adminBadge: {
      padding: '2px 8px',
      background: 'rgba(251, 191, 36, 0.2)',
      color: '#fef3c7',
      fontSize: '12px',
      borderRadius: '9999px',
      border: '1px solid rgba(251, 191, 36, 0.3)',
      fontWeight: '500',
      whiteSpace: 'nowrap' // Prevent text wrapping
    },
    logoutButton: {
      background: 'white',
      color: '#7c3aed',
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '14px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    mobileMenuButton: {
      display: 'none',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      padding: '8px',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  };

  // Helper function to get display name with fallbacks
  const getDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0]; // Use email prefix as fallback
    return "User";
  };

  return (
    <>
      <style>
        {`
          /* Global body padding to account for fixed navbar */
          body {
            padding-top: 64px;
          }
          
          .nav-link:hover {
            background: rgba(255, 255, 255, 0.1) !important;
          }
          
          .login-btn:hover {
            background: rgba(255, 255, 255, 0.1) !important;
          }
          
          .register-btn:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translateY(-1px);
          }
          
          .logout-btn:hover {
            background: rgba(255, 255, 255, 0.9) !important;
            transform: scale(1.05);
          }
          
          .brand-link:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          
          .user-info:hover {
            background: rgba(255, 255, 255, 0.15) !important;
          }
          
          @media (max-width: 768px) {
            .nav-links {
              display: none;
            }
            
            .mobile-menu-btn {
              display: flex !important;
            }
            
            .right-section {
              gap: 8px;
            }
            
            .user-info .username {
              max-width: 80px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .container {
              padding: 12px 16px;
            }
            
            .left-section {
              gap: 16px;
            }
          }
          
          @media (max-width: 480px) {
            .brand-text {
              display: none;
            }
            
            .admin-badge {
              display: none;
            }
            
            .user-info .username {
              display: none;
            }
          }
          
          @media (max-width: 320px) {
            .username {
              display: none !important;
            }
          }
        `}
      </style>
      
      <nav style={styles.navbar}>
        <div style={styles.background}></div>
        <div style={styles.container} className="container">
          {/* Left: Brand & Links */}
          <div style={styles.leftSection} className="left-section">
            <Link 
              to="/dashboard" 
              style={styles.brandContainer}
              className="brand-link"
            >
              <div style={styles.brandIcon}>
                <div style={styles.brandIconInner} />
              </div>
              <span className="brand-text">Sweet Shop</span>
            </Link>
            
            <div style={styles.navLinks} className="nav-links">
              {user && (
                <Link 
                  to="/dashboard" 
                  style={styles.navLink}
                  className="nav-link"
                >
                  Dashboard
                </Link>
              )}
              {user && (
                <Link 
                  to="/purchases" 
                  style={styles.navLink}
                  className="nav-link"
                >
                  Purchases
                </Link>
              )}
              {user?.role === "admin" && (
                <Link 
                  to="/admin" 
                  style={styles.navLink}
                  className="nav-link"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div style={styles.rightSection} className="right-section">
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  style={styles.loginButton}
                  className="login-btn"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  style={styles.registerButton}
                  className="register-btn"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div 
                  style={styles.userInfo}
                  className="user-info"
                  title={`Logged in as: ${getDisplayName()}`} // Tooltip for better UX
                >
                  <div style={styles.userAvatar}>
                    <div style={styles.userAvatarInner}></div>
                  </div>
                  <span style={styles.username} className="username">
                    {getDisplayName()}
                  </span>
                  {user.role === "admin" && (
                    <span style={styles.adminBadge} className="admin-badge">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  style={styles.logoutButton}
                  className="logout-btn"
                >
                  Logout
                </button>
              </>
            )}
            
            {/* Mobile menu button - for future enhancement */}
            <button 
              style={styles.mobileMenuButton}
              className="mobile-menu-btn"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}