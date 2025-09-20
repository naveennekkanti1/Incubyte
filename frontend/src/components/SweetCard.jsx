import { useState, useContext } from "react";
import { ShoppingCart, Plus, Minus, Package, Star, IndianRupee } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function SweetCard({ sweet, onPurchase, viewMode = "grid" }) {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const { user } = useContext(AuthContext);

  const handlePurchase = async () => {
    if (!user) {
      // Simple alert message instead of popup
      alert("Please log in to your account to add items to your cart and make purchases.");
      return;
    }
    
    // Debug logging to check quantity value
    console.log("Purchase attempt:", {
      sweetId: sweet._id,
      quantity: purchaseQuantity,
      sweetName: sweet.name
    });
    
    setIsLoading(true);
    setPurchaseMessage("");
    try {
      // Ensure we're passing the correct quantity
      const result = await onPurchase(sweet._id, purchaseQuantity);
      console.log("Purchase result:", result);
      
      const originalQuantity = purchaseQuantity;
      setPurchaseQuantity(1); // Reset quantity after purchase
      setPurchaseMessage(`Successfully added ${originalQuantity} ${sweet.name}(s) to cart!`);
      setMessageType("success");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setPurchaseMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      console.error("Purchase failed:", error);
      setPurchaseMessage(`Purchase failed: ${error.message || 'Please try again'}`);
      setMessageType("error");
      
      // Clear error message after 4 seconds
      setTimeout(() => {
        setPurchaseMessage("");
        setMessageType("");
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (purchaseQuantity < sweet.quantity) {
      const newQuantity = purchaseQuantity + 1;
      setPurchaseQuantity(newQuantity);
      console.log("Quantity incremented to:", newQuantity);
    }
  };

  const decrementQuantity = () => {
    if (purchaseQuantity > 1) {
      const newQuantity = purchaseQuantity - 1;
      setPurchaseQuantity(newQuantity);
      console.log("Quantity decremented to:", newQuantity);
    }
  };

  const isOutOfStock = sweet.quantity === 0;
  const canIncrement = purchaseQuantity < sweet.quantity;
  const canDecrement = purchaseQuantity > 1;

  const styles = {
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      ...(viewMode === "list" ? { 
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '20px'
      } : {})
    },
    imageSection: {
      width: '100%',
      height: '200px',
      marginBottom: '16px',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.05)',
      ...(viewMode === "list" ? { 
        width: '150px',
        height: '150px',
        marginBottom: '0',
        marginRight: '16px',
        flexShrink: 0
      } : {})
    },
    sweetImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease'
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '14px',
      fontWeight: '500'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px',
      ...(viewMode === "list" ? { 
        marginBottom: '0',
        flex: '1'
      } : {})
    },
    titleSection: {
      flex: 1,
      ...(viewMode === "list" ? { marginRight: '16px' } : {})
    },
    title: {
      fontSize: viewMode === "list" ? '20px' : '18px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 8px 0',
      lineHeight: '1.2'
    },
    category: {
      display: 'inline-block',
      padding: '4px 12px',
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '12px',
      fontWeight: '500',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      textTransform: 'capitalize'
    },
    stockBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      ...(isOutOfStock ? {
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#fecaca',
        border: '1px solid rgba(239, 68, 68, 0.3)'
      } : sweet.quantity < 5 ? {
        background: 'rgba(251, 191, 36, 0.2)',
        color: '#fef3c7',
        border: '1px solid rgba(251, 191, 36, 0.3)'
      } : {
        background: 'rgba(34, 197, 94, 0.2)',
        color: '#bbf7d0',
        border: '1px solid rgba(34, 197, 94, 0.3)'
      })
    },
    priceSection: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '12px',
      marginBottom: '20px',
      ...(viewMode === "list" ? { 
        marginTop: '0',
        marginBottom: '0',
        minWidth: '120px'
      } : {})
    },
    priceIcon: {
      marginRight: '4px'
    },
    price: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#fbbf24',
      textShadow: '0 0 10px rgba(251, 191, 36, 0.3)'
    },
    purchaseSection: {
      ...(viewMode === "list" ? { 
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '200px'
      } : {})
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
      padding: '8px 12px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      ...(viewMode === "list" ? { 
        marginBottom: '0',
        marginRight: '12px'
      } : {})
    },
    quantityLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '60px'
    },
    quantityButton: {
      width: '32px',
      height: '32px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    quantityButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    quantityDisplay: {
      width: '40px',
      textAlign: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '16px'
    },
    purchaseButton: {
      width: viewMode === "list" ? 'auto' : '100%',
      padding: '12px 20px',
      background: isOutOfStock ? 
        'rgba(107, 114, 128, 0.3)' : 
        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: isOutOfStock ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
      minWidth: viewMode === "list" ? '120px' : 'auto'
    },
    loadingSpinner: {
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    ratingSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      marginTop: '8px',
      ...(viewMode === "list" ? { 
        marginTop: '0',
        marginLeft: '12px'
      } : {})
    },
    rating: {
      color: '#fbbf24',
      fontSize: '14px',
      fontWeight: '600'
    },
    // Enhanced message box styles
    messageBox: {
      marginTop: '12px',
      padding: '10px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    successMessage: {
      background: 'rgba(34, 197, 94, 0.2)',
      color: '#bbf7d0',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
    },
    errorMessage: {
      background: 'rgba(239, 68, 68, 0.2)',
      color: '#fecaca',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .sweet-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
          }
          
          .sweet-card:hover .sweet-image {
            transform: scale(1.05);
          }
          
          .quantity-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.2) !important;
            transform: scale(1.1);
          }
          
          .purchase-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4) !important;
          }
          
          .purchase-btn:active:not(:disabled) {
            transform: translateY(0);
          }
          
          .message-box {
            animation: slideIn 0.3s ease-out;
          }
          
          @media (max-width: 768px) {
            .sweet-card {
              padding: 16px !important;
            }
            
            .quantity-controls {
              flex-wrap: wrap;
              gap: 8px !important;
            }
            
            .quantity-label {
              min-width: auto !important;
            }
          }
        `}
      </style>
      
      <div style={styles.card} className="sweet-card">
        {/* Image Section */}
        {viewMode === "grid" && (
          <div style={styles.imageSection}>
            {sweet.image_url ? (
              <img 
                src={sweet.image_url} 
                alt={sweet.name}
                style={styles.sweetImage}
                className="sweet-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              style={{
                ...styles.imagePlaceholder,
                display: sweet.image_url ? 'none' : 'flex'
              }}
            >
              <Package size={32} />
              <span style={{marginLeft: '8px'}}>No Image</span>
            </div>
          </div>
        )}

        <div style={styles.cardHeader}>
          {/* Image for list view */}
          {viewMode === "list" && (
            <div style={styles.imageSection}>
              {sweet.image_url ? (
                <img 
                  src={sweet.image_url} 
                  alt={sweet.name}
                  style={styles.sweetImage}
                  className="sweet-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                style={{
                  ...styles.imagePlaceholder,
                  display: sweet.image_url ? 'none' : 'flex'
                }}
              >
                <Package size={24} />
              </div>
            </div>
          )}

          <div style={styles.titleSection}>
            <h2 style={styles.title}>{sweet.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span style={styles.category}>{sweet.category}</span>
              <div style={styles.ratingSection}>
                <Star size={14} style={{ color: '#fbbf24' }} />
                <span style={styles.rating}>4.{Math.floor(Math.random() * 5) + 3}</span>
              </div>
            </div>
          </div>
          
          <div style={styles.stockBadge}>
            <Package size={12} />
            {isOutOfStock ? 'Out of Stock' : 
             sweet.quantity < 5 ? `${sweet.quantity} left` : 
             'In Stock'}
          </div>
        </div>

        <div style={styles.priceSection}>
          <IndianRupee size={20} style={styles.priceIcon} color="#fbbf24" />
          <span style={styles.price}>{sweet.price}</span>
          <span style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginLeft: '8px'}}>
            per piece
          </span>
        </div>

        {!isOutOfStock && (
          <div style={styles.purchaseSection}>
            <div style={styles.quantityControls} className="quantity-controls">
              <span style={styles.quantityLabel} className="quantity-label">Quantity:</span>
              <button
                onClick={decrementQuantity}
                disabled={!canDecrement}
                style={{
                  ...styles.quantityButton,
                  ...(canDecrement ? {} : styles.quantityButtonDisabled)
                }}
                className="quantity-btn"
                title="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span style={styles.quantityDisplay}>{purchaseQuantity}</span>
              <button
                onClick={incrementQuantity}
                disabled={!canIncrement}
                style={{
                  ...styles.quantityButton,
                  ...(canIncrement ? {} : styles.quantityButtonDisabled)
                }}
                className="quantity-btn"
                title="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Show total price */}
            <div style={{
              marginBottom: '12px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Total: ₹{sweet.price * purchaseQuantity}
            </div>

            <button
              onClick={handlePurchase}
              disabled={isLoading}
              style={styles.purchaseButton}
              className="purchase-btn"
              title={`Add ${purchaseQuantity} ${sweet.name}(s) to purchase`}
            >
              {isLoading ? (
                <>
                  <div style={styles.loadingSpinner}></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add {purchaseQuantity} item{purchaseQuantity > 1 ? 's' : ''} to Purchase
                </>
              )}
            </button>
            
            {/* Enhanced Purchase Message */}
            {purchaseMessage && (
              <div 
                style={{
                  ...styles.messageBox,
                  ...(messageType === "success" ? styles.successMessage : styles.errorMessage)
                }}
                className="message-box"
              >
                {messageType === "success" ? (
                  <ShoppingCart size={16} />
                ) : (
                  <Package size={16} />
                )}
                {purchaseMessage}
              </div>
            )}
          </div>
        )}

        {isOutOfStock && (
          <button
            style={styles.purchaseButton}
            disabled
            title="This item is currently out of stock"
          >
            <Package size={16} />
            Out of Stock
          </button>
        )}
      </div>
    </>
  );
}