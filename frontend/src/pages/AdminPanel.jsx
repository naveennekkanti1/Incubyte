import { useState, useEffect } from "react";
import { Plus, Package, Edit3, Trash2, Search, Filter, Image, DollarSign, Hash, Tag, AlertCircle } from "lucide-react";
import API from "../api";

export default function AdminPanel() {
  const [form, setForm] = useState({ name: "", category: "", price: "", quantity: "", image_url: "" });
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingSweet, setEditingSweet] = useState(null);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const res = await API.get("/sweets/");
      setSweets(res.data);
    } catch (error) {
      setError("Failed to fetch sweets");
    } finally {
      setLoading(false);
    }
  };

  const addSweet = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await API.post("/sweets/", form);
      setForm({ name: "", category: "", price: "", quantity: "", image_url: "" });
      setSuccess("Sweet added successfully!");
      fetchSweets();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to add sweet. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  const updateSweet = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await API.put(`/sweets/${editingSweet._id}`, form);
      setEditingSweet(null);
      setForm({ name: "", category: "", price: "", quantity: "", image_url: "" });
      setSuccess("Sweet updated successfully!");
      fetchSweets();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update sweet");
    } finally {
      setLoading(false);
    }
  };

  const deleteSweet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    
    try {
      setLoading(true);
      await API.delete(`/sweets/${id}`);
      setSuccess("Sweet deleted successfully!");
      fetchSweets();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete sweet");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (sweet) => {
    setEditingSweet(sweet);
    setForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      image_url: sweet.image_url || ""
    });
  };

  const cancelEdit = () => {
    setEditingSweet(null);
    setForm({ name: "", category: "", price: "", quantity: "", image_url: "" });
  };

  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch = sweet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sweet.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "all" || sweet.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = [...new Set(sweets.map(s => s.category))];

  useEffect(() => {
    fetchSweets();
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 25%, #db2777 50%, #dc2626 75%, #ea580c 100%)',
      position: 'relative', // FIXED: Changed from 'fixed' to 'relative'
      paddingTop: '80px', // FIXED: Add padding for navbar
      margin: '0',
      padding: '80px 0 0 0',
      overflow: 'auto'
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
      top: '30%',
      right: '10%',
      width: '200px',
      height: '200px',
      background: 'rgba(255, 255, 255, 0.04)',
      borderRadius: '50%'
    },
    mainContent: {
      position: 'relative',
      zIndex: 10,
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 80px)' // FIXED: Account for navbar height
    },
    header: {
      marginBottom: '32px'
    },
    headerCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '24px',
      textAlign: 'center'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 8px 0'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0,
      fontSize: '16px'
    },
    alertBox: {
      marginBottom: '24px',
      padding: '12px 16px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px'
    },
    errorBox: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: 'rgba(254, 226, 226, 1)'
    },
    successBox: {
      background: 'rgba(34, 197, 94, 0.2)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      color: 'rgba(187, 247, 208, 1)'
    },
    alertIcon: {
      marginRight: '8px',
      flexShrink: 0
    },
    formCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '24px',
      marginBottom: '32px'
    },
    formTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 20px 0'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
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
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    primaryButton: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
    },
    secondaryButton: {
      padding: '12px 24px',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    searchFiltersRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap'
    },
    searchContainer: {
      position: 'relative',
      flex: 1,
      minWidth: '250px'
    },
    filterContainer: {
      position: 'relative',
      minWidth: '180px'
    },
    sweetsList: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '24px'
    },
    listTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    sweetCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.2s'
    },
    sweetInfo: {
      flex: 1
    },
    sweetName: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'white',
      margin: '0 0 8px 0'
    },
    sweetDetails: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap'
    },
    sweetDetail: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '14px'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px'
    },
    editButton: {
      padding: '8px 12px',
      background: 'rgba(59, 130, 246, 0.2)',
      color: '#93c5fd',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '14px'
    },
    deleteButton: {
      padding: '8px 12px',
      background: 'rgba(239, 68, 68, 0.2)',
      color: '#fca5a5',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '14px'
    },
    loadingSpinner: {
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: 'rgba(255, 255, 255, 0.6)'
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
          
          input:focus, select:focus {
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
          
          .sweet-card:hover {
            background: rgba(255, 255, 255, 0.08);
          }
          
          .edit-btn:hover {
            background: rgba(59, 130, 246, 0.3) !important;
          }
          
          .delete-btn:hover {
            background: rgba(239, 68, 68, 0.3) !important;
          }
          
          @media (max-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr !important;
            }
            
            .button-group {
              flex-direction: column;
            }
            
            .search-filters-row {
              flex-direction: column;
            }
            
            .sweet-details {
              flex-direction: column;
              gap: 8px !important;
            }
            
            .action-buttons {
              flex-direction: column;
              gap: 4px !important;
            }
            
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

        <div style={styles.mainContent} className="main-content">
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerCard}>
              <h1 style={styles.title}>Admin Panel</h1>
              <p style={styles.subtitle}>Manage your sweet inventory</p>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{...styles.alertBox, ...styles.errorBox}}>
              <AlertCircle size={16} style={styles.alertIcon} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{...styles.alertBox, ...styles.successBox}}>
              <Package size={16} style={styles.alertIcon} />
              <span>{success}</span>
            </div>
          )}

          {/* Add/Edit Form */}
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
            
            <form onSubmit={editingSweet ? updateSweet : addSweet}>
              <div style={styles.formGrid} className="form-grid">
                <div style={styles.inputContainer}>
                  <Tag size={20} style={styles.inputIcon} />
                  <input
                    style={styles.input}
                    placeholder="Sweet Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div style={styles.inputContainer}>
                  <Package size={20} style={styles.inputIcon} />
                  <input
                    style={styles.input}
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                </div>

                <div style={styles.inputContainer}>
                  <DollarSign size={20} style={styles.inputIcon} />
                  <input
                    style={styles.input}
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>

                <div style={styles.inputContainer}>
                  <Hash size={20} style={styles.inputIcon} />
                  <input
                    style={styles.input}
                    placeholder="Quantity"
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    required
                  />
                </div>

                <div style={styles.inputContainer}>
                  <Image size={20} style={styles.inputIcon} />
                  <input
                    style={styles.input}
                    placeholder="Image URL (optional)"
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.buttonGroup} className="button-group">
                <button
                  type="submit"
                  disabled={loading}
                  style={styles.primaryButton}
                >
                  {loading ? (
                    <div style={styles.loadingSpinner}></div>
                  ) : editingSweet ? (
                    <><Edit3 size={16} /> Update Sweet</>
                  ) : (
                    <><Plus size={16} /> Add Sweet</>
                  )}
                </button>

                {editingSweet && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    style={styles.secondaryButton}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Search and Filter */}
          <div style={styles.searchFiltersRow} className="search-filters-row">
            <div style={styles.searchContainer}>
              <Search size={20} style={styles.inputIcon} />
              <input
                style={styles.input}
                placeholder="Search sweets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={styles.filterContainer}>
              <Filter size={20} style={styles.inputIcon} />
              <select
                style={styles.input}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sweets List */}
          <div style={styles.sweetsList}>
            <h3 style={styles.listTitle}>
              <Package size={24} />
              Available Sweets ({filteredSweets.length})
            </h3>

            {filteredSweets.length > 0 ? (
              filteredSweets.map((sweet) => (
                <div key={sweet._id} style={styles.sweetCard} className="sweet-card">
                  <div style={styles.sweetInfo}>
                    <h4 style={styles.sweetName}>{sweet.name}</h4>
                    <div style={styles.sweetDetails} className="sweet-details">
                      <span style={styles.sweetDetail}>
                        <Package size={14} />
                        {sweet.category}
                      </span>
                      <span style={styles.sweetDetail}>
                        <DollarSign size={14} />
                        ₹{sweet.price}
                      </span>
                      <span style={styles.sweetDetail}>
                        <Hash size={14} />
                        {sweet.quantity} in stock
                      </span>
                    </div>
                  </div>

                  <div style={styles.actionButtons} className="action-buttons">
                    <button
                      onClick={() => startEdit(sweet)}
                      style={styles.editButton}
                      className="edit-btn"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSweet(sweet._id)}
                      style={styles.deleteButton}
                      className="delete-btn"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <Package size={48} />
                <p>No sweets found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}