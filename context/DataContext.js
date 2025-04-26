import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';


import { useAuth } from './AuthContext';

import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  addDoc, 
  updateDoc, 
  setDoc, 
  writeBatch,
  increment,
  getDoc
} from 'firebase/firestore';



const toTitleCase = (str) => {
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const { user, clearUser } = useAuth();

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [businessDetails, setBusinessDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProducts = () => {};
    let unsubscribeSales = () => {};

    if (!user) {
      setProducts([]);
      setSales([]);
      setBusinessDetails({});
      return () => {
        unsubscribeProducts();
        unsubscribeSales();
      };
    }

    const cleanup = () => {
      unsubscribeProducts();
      unsubscribeSales();
    };

    const productsQuery = query(collection(db, 'products'));
    const salesQuery = query(collection(db, 'sales'));
    
    unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    }, (error) => {
      if (error.code === 'permission-denied') {
        console.log('Firestore permission denied - user likely logged out');
        return;
      }
      console.error("Products snapshot error:", error);
    });

    unsubscribeSales = onSnapshot(salesQuery, (snapshot) => {
      const salesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSales(salesData);
      setLoading(false);
    }, (error) => {
      if (error.code === 'permission-denied') {
        console.log('Firestore permission denied - user likely logged out');
        return;
      }
      console.error("Sales snapshot error:", error);
    });

    return cleanup;

  }, [user?.uid]);

  const addProduct = async (product) => {
    if (!user) {
      throw new Error('User must be authenticated to add products');
    }
    try {
      await addDoc(collection(db, 'products'), product);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    if (!user) {
      throw new Error('User must be authenticated to delete products');
    }
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  const updateProduct = async (id, updatedData) => {
    if (!user) {
      throw new Error('User must be authenticated to update products');
    }
    try {
      await updateDoc(doc(db, 'products', id), updatedData);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const fetchBusinessDetails = async (userId) => {
    if (!user) {
      setBusinessDetails({});
      return;
    }
    try {
      const docRef = doc(db, 'businessDetails', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBusinessDetails(docSnap.data());
      }
    } catch (error) {
      if (error.code === 'permission-denied') {
        console.log('Permission denied - user likely logged out');
        setBusinessDetails({});
        return;
      }
      console.error("Error fetching business details:", error);
      throw error;
    }
  };

  const updateBusinessDetails = async (userId, details) => {
    if (!user) {
      throw new Error('User must be authenticated to update business details');
    }
    try {
      await setDoc(doc(db, 'businessDetails', userId), details, { merge: true });
      setBusinessDetails(prev => ({ ...prev, ...details }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{ 
      products, 
      sales,
      loading,
      addProduct,
      deleteProduct,
      updateProduct,
      businessDetails,
      fetchBusinessDetails,
      updateBusinessDetails,

      fetchSales: () => {
        const q = query(collection(db, 'sales'));
        return onSnapshot(q, (snapshot) => {
          const salesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setSales(salesData);
        });
      },
      addSale: async (saleData) => {
        console.log("Adding sale with data:", saleData);

        try {
          // Add the sale
          await addDoc(collection(db, 'sales'), saleData);
          
          console.log("Checking for existing sales to update stock...");

          const existingSale = sales.find(sale => 
            sale.products.some(product => saleData.products.some(p => p.id === product.id))
          );

          const batch = writeBatch(db); // Moved batch initialization outside of the if statement
          
          if (existingSale) {
            existingSale.products.forEach(product => {
              const previousQuantity = product.quantity;
              const productRef = doc(db, 'products', product.id);
              batch.update(productRef, {
                stock: increment(previousQuantity)
              });
            });
          }

          // Update product quantities
          saleData.products.forEach(product => {
            const productRef = doc(db, 'products', product.id);
            batch.update(productRef, {
              stock: increment(-product.quantity) // Reduce stock based on new sale quantities
            });
          });
          await batch.commit();

        } catch (error) {
          console.error("Error adding sale:", error);
          throw error;
        }
      },

      deleteSale: async (id) => {
        try {
          const saleRef = doc(db, 'sales', id);
          const existingSale = await getDoc(saleRef);
          const previousProducts = existingSale.data().products || [];
          
          // Restore previous quantities to stock
          const batch = writeBatch(db);
          previousProducts.forEach(product => {
            const productRef = doc(db, 'products', product.id);
            batch.update(productRef, {
              stock: increment(product.quantity)
            });
          });
          await batch.commit();

          await deleteDoc(saleRef);
        } catch (error) {
          console.error("Error deleting sale:", error);
          throw error;
        }
      },
      updateSale: async (id, updatedData) => {
        try {
          console.log('Updating sale:', id, 'with data:', updatedData);
          const saleRef = doc(db, 'sales', id);
          
          const products = updatedData.items || updatedData.products || [];
          const existingSale = await getDoc(saleRef);
          const previousProducts = existingSale.data().products || [];
          
          // Restore previous quantities to stock
          const batch = writeBatch(db);
          previousProducts.forEach(product => {
            const productRef = doc(db, 'products', product.id);
            batch.update(productRef, {
              stock: increment(product.quantity)
            });
          });
          await batch.commit();

          const { items, ...rest } = updatedData;
          const saleData = {
            ...rest,
            products: products
          };

          await updateDoc(saleRef, saleData);
          console.log('Sale updated successfully:', id);
        } catch (error) {
          console.error("Error updating sale:", error);
          throw error;
        }
      }
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
export const useData = () => useContext(DataContext);
