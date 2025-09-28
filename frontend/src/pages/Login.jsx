import { useState, useContext, useEffect } from "react";
import { Eye, EyeOff, User, Lock, AlertCircle, MapPin, Loader2, Shield } from "lucide-react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "", rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationStatus, setLocationStatus] = useState("requesting");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is already logged in and handle remember me
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const rememberUser = localStorage.getItem('rememberUser');
    const rememberMe = localStorage.getItem('rememberMe');
    
    // If user is already logged in, redirect
    if (token && userRole) {
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
      return;
    }
    
    // If remember me was checked, prefill username
    if (rememberMe === 'true' && rememberUser) {
      setForm(prev => ({
        ...prev,
        username: rememberUser,
        rememberMe: true
      }));
    }
  }, [navigate]);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationStatus("granted");
        },
        (error) => {
          console.log("Location access denied:", error);
          setLocationStatus("denied");
        },
        { timeout: 10000 }
      );
    } else {
      setLocationStatus("error");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const loginData = {
        username: form.username,
        password: form.password,
        latitude: location.latitude,
        longitude: location.longitude
      };

      const res = await API.post("/auth/login", loginData);
      
      // Store token and user info
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('userRole', res.data.role);
      
      // Update auth context
      login(res.data.access_token, res.data.role);
      
      // Handle remember me
      if (form.rememberMe) {
        localStorage.setItem('rememberUser', form.username);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberUser');
        localStorage.removeItem('rememberMe');
      }
      
      // Redirect based on role
      if (res.data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Invalid username or password. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = () => {
    switch (locationStatus) {
      case "requesting":
        return <Loader2 size={16} style={{color: "#60A5FA", animation: "spin 1s linear infinite"}} />;
      case "granted":
        return <MapPin size={16} style={{color: "#10B981"}} />;
      case "denied":
        return <Shield size={16} style={{color: "#F59E0B"}} />;
      default:
        return <Shield size={16} style={{color: "#6B7280"}} />;
    }
  };

  const getLocationText = () => {
    switch (locationStatus) {
      case "requesting":
        return "Requesting location for security...";
      case "granted":
        return "Location detected - Enhanced security active";
      case "denied":
        return "Location access denied - Basic security mode";
      default:
        return "Location unavailable";
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      margin: '0',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      overflow: 'hidden'
    },
    backgroundDecor1: {
      position: 'absolute',
      top: '-160px',
      right: '-160px',
      width: '320px',
      height: '320px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'pulse 4s ease-in-out infinite'
    },
    backgroundDecor2: {
      position: 'absolute',
      bottom: '-160px',
      left: '-160px',
      width: '320px',
      height: '320px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'pulse 4s ease-in-out infinite',
      animationDelay: '2s'
    },
    backgroundDecor3: {
      position: 'absolute',
      top: '10%',
      left: '10%',
      width: '200px',
      height: '200px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float 6s ease-in-out infinite'
    },
    cardContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      boxSizing: 'border-box'
    },
    card: {
      position: 'relative',
      width: '100%',
      maxWidth: '420px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '32px',
      zIndex: 10,
      boxSizing: 'border-box',
      transition: 'transform 0.3s ease'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    iconContainer: {
      width: '64px',
      height: '64px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 8px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0,
      fontSize: '16px'
    },
    locationStatus: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
      padding: '12px 16px',
      background: 'rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.12)'
    },
    locationText: {
      marginLeft: '8px',
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.75)',
      fontWeight: '500'
    },
    errorBox: {
      marginBottom: '24px',
      padding: '12px 16px',
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      color: 'rgba(254, 226, 226, 1)',
      backdropFilter: 'blur(10px)'
    },
    errorIcon: {
      marginRight: '8px',
      flexShrink: 0
    },
    errorText: {
      fontSize: '14px',
      margin: 0
    },
    formGroup: {
      marginBottom: '24px'
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
      paddingLeft: '44px',
      paddingRight: '16px',
      paddingTop: '14px',
      paddingBottom: '14px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.2s',
      boxSizing: 'border-box',
      backdropFilter: 'blur(10px)'
    },
    passwordInput: {
      paddingRight: '48px'
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: 'rgba(255, 255, 255, 0.6)',
      cursor: 'pointer',
      padding: '4px',
      transition: 'color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    rememberRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      fontSize: '14px',
      flexWrap: 'wrap',
      gap: '8px'
    },
    rememberLabel: {
      display: 'flex',
      alignItems: 'center',
      color: 'rgba(255, 255, 255, 0.8)',
      cursor: 'pointer',
      transition: 'color 0.2s'
    },
    checkbox: {
      marginRight: '8px',
      width: '16px',
      height: '16px',
      accentColor: '#a855f7'
    },
    forgotLink: {
      color: 'rgba(255, 255, 255, 0.8)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'color 0.2s',
      fontSize: '14px'
    },
    submitButton: {
      width: '100%',
      padding: '14px 16px',
      background: 'white',
      color: '#7c3aed',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '52px',
      boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
      transform: 'scale(1)'
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(124, 58, 237, 0.3)',
      borderTop: '2px solid #7c3aed',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    },
    footer: {
      marginTop: '32px',
      textAlign: 'center'
    },
    footerText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '14px',
      margin: 0
    },
    signupLink: {
      color: 'white',
      fontWeight: '600',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'text-decoration 0.2s',
      marginLeft: '4px'
    },
    securityNote: {
      textAlign: 'center',
      marginTop: '20px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    securityText: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.65)',
      margin: 0,
      fontWeight: '500'
    }
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
          
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
          
          input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
            border-color: transparent;
          }
          
          button:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          
          button:active:not(:disabled) {
            transform: translateY(0px) scale(0.98);
          }
          
          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .card:hover {
            transform: scale(1.02);
          }
          
          .remember-label:hover {
            color: white;
          }
          
          .password-toggle:hover {
            color: white !important;
          }
          
          @media (max-width: 768px) {
            .card {
              margin: 8px;
              padding: 24px !important;
            }
            
            .title {
              font-size: 24px !important;
            }
            
            .remember-row {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }
          }
          
          @media (max-width: 480px) {
            .card-container {
              padding: 8px !important;
            }
            
            .card {
              padding: 20px !important;
            }
          }
        `}
      </style>
      
      <div style={styles.container}>
        <div style={styles.backgroundDecor1}></div>
        <div style={styles.backgroundDecor2}></div>
        <div style={styles.backgroundDecor3}></div>
        
        <div style={styles.cardContainer} className="card-container">
          <div style={styles.card} className="card">
            <div style={styles.header}>
              <div style={styles.iconContainer}>
                <User size={32} color="white" />
              </div>
              <h1 style={styles.title} className="title">Welcome Back</h1>
              <p style={styles.subtitle}>Sign in to your account</p>
            </div>

            {/* Location Status */}
            <div style={styles.locationStatus}>
              {getLocationIcon()}
              <span style={styles.locationText}>{getLocationText()}</span>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <AlertCircle size={20} style={styles.errorIcon} />
                <span style={styles.errorText}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <div style={styles.inputContainer}>
                  <User size={20} style={styles.inputIcon} />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <div style={styles.inputContainer}>
                  <Lock size={20} style={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    style={{...styles.input, ...styles.passwordInput}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div style={styles.rememberRow} className="remember-row">
                <label style={styles.rememberLabel} className="remember-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    style={styles.checkbox}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  style={styles.forgotLink}
                  onMouseEnter={(e) => e.target.style.color = 'white'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !form.username || !form.password}
                style={styles.submitButton}
              >
                {loading ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Don't have an account?
                <a
                  href='/register'
                  style={styles.signupLink}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Sign up
                </a>
              </p>
            </div>

            {/* Security Note */}
            <div style={styles.securityNote}>
              <p style={styles.securityText}>
                🔒 Enhanced security with location tracking and device detection
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
