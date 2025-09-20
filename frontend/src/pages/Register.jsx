import { useState, useContext } from "react";
import { Eye, EyeOff, User, Lock, Mail, AlertCircle, UserPlus, Check } from "lucide-react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/register", form);
      login(res.data.access_token, res.data.role);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 35%, #ec4899 70%, #ef4444 100%)',
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
      borderRadius: '50%'
    },
    backgroundDecor2: {
      position: 'absolute',
      bottom: '-160px',
      left: '-160px',
      width: '320px',
      height: '320px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%'
    },
    backgroundDecor3: {
      position: 'absolute',
      top: '20%',
      left: '10%',
      width: '200px',
      height: '200px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%'
    },
    backgroundDecor4: {
      position: 'absolute',
      top: '60%',
      right: '5%',
      width: '150px',
      height: '150px',
      background: 'rgba(255, 255, 255, 0.04)',
      borderRadius: '50%'
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
      maxWidth: '450px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '32px',
      zIndex: 10,
      boxSizing: 'border-box'
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
      margin: '0 auto 16px'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 8px'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0,
      fontSize: '16px'
    },
    errorBox: {
      marginBottom: '24px',
      padding: '12px 16px',
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      color: 'rgba(254, 226, 226, 1)'
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
      boxSizing: 'border-box'
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
      transition: 'color 0.2s'
    },
    termsContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '24px',
      fontSize: '14px'
    },
    checkboxContainer: {
      position: 'relative',
      marginRight: '12px',
      marginTop: '2px'
    },
    hiddenCheckbox: {
      position: 'absolute',
      opacity: 0,
      width: '18px',
      height: '18px',
      margin: 0
    },
    customCheckbox: {
      width: '18px',
      height: '18px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    customCheckboxChecked: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.8)'
    },
    termsText: {
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: '1.5',
      flex: 1
    },
    termsLink: {
      color: 'white',
      textDecoration: 'underline',
      cursor: 'pointer',
      transition: 'opacity 0.2s'
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
      minHeight: '50px'
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
    loginLink: {
      color: 'white',
      fontWeight: '600',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'text-decoration 0.2s',
      marginLeft: '4px'
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
          
          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          input:focus + .password-toggle {
            color: rgba(255, 255, 255, 0.8);
          }
          
          @media (max-width: 768px) {
            .card {
              margin: 8px;
              padding: 24px !important;
            }
            
            .title {
              font-size: 28px !important;
            }
          }
          
          @media (max-width: 480px) {
            .card-container {
              padding: 8px !important;
            }
            
            .card {
              padding: 20px !important;
            }
            
            .terms-container {
              flex-direction: column;
              align-items: flex-start !important;
              gap: 8px;
            }
          }
        `}
      </style>
      
      <div style={styles.container}>
        <div style={styles.backgroundDecor1}></div>
        <div style={styles.backgroundDecor2}></div>
        <div style={styles.backgroundDecor3}></div>
        <div style={styles.backgroundDecor4}></div>
        
        <div style={styles.cardContainer} className="card-container">
          <div style={styles.card} className="card">
            <div style={styles.header}>
              <div style={styles.iconContainer}>
                <UserPlus size={32} color="white" />
              </div>
              <h1 style={styles.title} className="title">Join Us</h1>
              <p style={styles.subtitle}>Create your account to get started</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <AlertCircle size={20} style={styles.errorIcon} />
                <span style={styles.errorText}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
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

              {/* Email */}
              <div style={styles.formGroup}>
                <div style={styles.inputContainer}>
                  <Mail size={20} style={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Password */}
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
                    autoComplete="new-password"
                    style={{...styles.input, ...styles.passwordInput}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                    className="password-toggle"
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div style={styles.termsContainer} className="terms-container">
                <div style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required
                    style={styles.hiddenCheckbox}
                  />
                  <div 
                    style={{
                      ...styles.customCheckbox,
                      ...(acceptedTerms ? styles.customCheckboxChecked : {})
                    }}
                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                  >
                    {acceptedTerms && <Check size={12} color="white" />}
                  </div>
                </div>
                <label htmlFor="terms" style={styles.termsText}>
                  I agree to the{" "}
                  <span 
                    style={styles.termsLink}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    Terms of Service
                  </span>
                  {" "}and{" "}
                  <span 
                    style={styles.termsLink}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !form.username || !form.email || !form.password || !acceptedTerms}
                style={styles.submitButton}
              >
                {loading ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Already have an account?
                <a
                  href="/login"
                  style={styles.loginLink}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}