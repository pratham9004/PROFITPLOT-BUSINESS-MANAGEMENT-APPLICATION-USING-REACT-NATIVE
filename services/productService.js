import { getFirestore } from '../config/firebase';

const db = getFirestore();


export const fetchProducts = async () => {
  try {
    const snapshot = await db.collection('products').get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

export const updateProduct = async (productId, { name, description }) => {
  try {
    const productRef = db.collection('products').doc(productId);

    await productRef.update({ name, description });
    const updatedDoc = await productRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    throw new Error('Failed to update product');
  }
};

export const deleteProduct = async (productId) => {
  try {
    await db.collection('products').doc(productId).delete();

  } catch (error) {
    throw new Error('Failed to delete product');
  }
};
