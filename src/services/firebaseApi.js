/**
 * Firebase API - Central service for all Firestore & Auth operations.
 * Collections: customers, customerRecord, inventory, deleted_records,
 *   users, payroll, account_receivable, account_payable, reviews
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import { db, auth } from "../../firebaseConfig";

// ---------- User Profile (display name) ----------
export const userProfileApi = {
  get: async (uid) => {
    const d = await getDoc(doc(db, "users", uid));
    return d.exists() ? d.data() : null;
  },
  set: async (uid, data) => {
    await setDoc(doc(db, "users", uid), { ...data, updatedAt: new Date() }, { merge: true });
  },
};

// ---------- Auth ----------
export const authApi = {
  signIn: (email, password) =>
    signInWithEmailAndPassword(auth, email, password),

  signUp: (email, password) =>
    createUserWithEmailAndPassword(auth, email, password),

  signOut: () => fbSignOut(auth),
};

// ---------- Customers ----------
export const customersApi = {
  getByAdmin: async (adminId) => {
    const q = query(
      collection(db, "customers"),
      where("adminId", "==", adminId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  add: async (data) => {
    const docRef = await addDoc(collection(db, "customers"), {
      ...data,
      createdAt: data.createdAt || new Date(),
    });
    return docRef.id;
  },

  update: async (id, data) => {
    await updateDoc(doc(db, "customers", id), data);
  },

  delete: async (id) => {
    await deleteDoc(doc(db, "customers", id));
  },
};

// ---------- Customer Records (send product / receive payment) ----------
export const customerRecordsApi = {
  getByCustomerAndAdmin: async (customerId, adminId) => {
    const q = query(
      collection(db, "customerRecord"),
      where("customer_id", "==", customerId),
      where("admin_id", "==", adminId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  add: async (data) => {
    const docRef = await addDoc(collection(db, "customerRecord"), {
      ...data,
      created_at: data.created_at || Timestamp.now(),
    });
    return docRef.id;
  },

  deleteByCustomer: async (customerId, adminId) => {
    const q = query(
      collection(db, "customerRecord"),
      where("customer_id", "==", customerId),
      where("admin_id", "==", adminId)
    );
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  },
};

// ---------- Inventory ----------
export const inventoryApi = {
  getByAdmin: async (adminId) => {
    const q = query(
      collection(db, "inventory"),
      where("adminId", "==", adminId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
        price: data.price != null ? Number(data.price) : 0,
      };
    });
  },

  add: async (data) => {
    const docRef = await addDoc(collection(db, "inventory"), {
      productName: data.productName,
      quantity: Number(data.quantity),
      price: data.price != null ? Number(data.price) : 0,
      adminId: data.adminId,
      createdAt: data.createdAt || new Date(),
    });
    return docRef.id;
  },

  update: async (id, data) => {
    const payload = { updatedAt: new Date() };
    if (data.productName != null) payload.productName = data.productName;
    if (data.quantity != null) payload.quantity = Number(data.quantity);
    if (data.price != null) payload.price = Number(data.price);
    await updateDoc(doc(db, "inventory", id), payload);
  },

  updateQuantity: async (id, quantity) => {
    await updateDoc(doc(db, "inventory", id), { quantity: Number(quantity) });
  },

  delete: async (id) => {
    await deleteDoc(doc(db, "inventory", id));
  },
};

// ---------- Deleted Records (audit/history) ----------
export const deletedRecordsApi = {
  getByAdmin: async (adminId) => {
    const q = query(
      collection(db, "deleted_records"),
      where("admin_id", "==", adminId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  add: async (payload) => {
    await addDoc(collection(db, "deleted_records"), {
      ...payload,
      admin_id: payload.admin_id,
      deleted_at: payload.deleted_at || Timestamp.now(),
    });
  },

  delete: async (id) => {
    await deleteDoc(doc(db, "deleted_records", id));
  },
};

// ---------- Payroll ----------
export const payrollApi = {
  getByAdmin: async (adminId) => {
    const q = query(collection(db, "payroll"), where("admin_id", "==", adminId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  add: async (data) => {
    const docRef = await addDoc(collection(db, "payroll"), {
      ...data,
      admin_id: data.admin_id,
      created_at: data.created_at || Timestamp.now(),
    });
    return docRef.id;
  },
  update: async (id, data) => {
    await updateDoc(doc(db, "payroll", id), { ...data, updated_at: new Date() });
  },
  delete: async (id) => {
    await deleteDoc(doc(db, "payroll", id));
  },
};

// ---------- Account Receivable ----------
export const accountReceivableApi = {
  getByAdmin: async (adminId) => {
    const q = query(collection(db, "account_receivable"), where("admin_id", "==", adminId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  add: async (data) => {
    const docRef = await addDoc(collection(db, "account_receivable"), {
      ...data,
      admin_id: data.admin_id,
      created_at: data.created_at || Timestamp.now(),
    });
    return docRef.id;
  },
  update: async (id, data) => {
    await updateDoc(doc(db, "account_receivable", id), { ...data, updated_at: new Date() });
  },
  delete: async (id) => {
    await deleteDoc(doc(db, "account_receivable", id));
  },
};

// ---------- Account Payable ----------
export const accountPayableApi = {
  getByAdmin: async (adminId) => {
    const q = query(collection(db, "account_payable"), where("admin_id", "==", adminId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  add: async (data) => {
    const docRef = await addDoc(collection(db, "account_payable"), {
      ...data,
      admin_id: data.admin_id,
      created_at: data.created_at || Timestamp.now(),
    });
    return docRef.id;
  },
  update: async (id, data) => {
    await updateDoc(doc(db, "account_payable", id), { ...data, updated_at: new Date() });
  },
  delete: async (id) => {
    await deleteDoc(doc(db, "account_payable", id));
  },
};

// ---------- Reviews ----------
export const reviewsApi = {
  getByAdmin: async (adminId) => {
    const q = query(collection(db, "reviews"), where("admin_id", "==", adminId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  add: async (data) => {
    const docRef = await addDoc(collection(db, "reviews"), {
      ...data,
      admin_id: data.admin_id,
      created_at: data.created_at || Timestamp.now(),
    });
    return docRef.id;
  },
  update: async (id, data) => {
    await updateDoc(doc(db, "reviews", id), { ...data, updated_at: new Date() });
  },
  delete: async (id) => {
    await deleteDoc(doc(db, "reviews", id));
  },
};

// ---------- Reports (aggregates) ----------
export const reportsApi = {
  getDashboardStats: async (adminId) => {
    const [customers, inventory, payroll, recv, pay, balancesSum] = await Promise.all([
      customersApi.getByAdmin(adminId),
      inventoryApi.getByAdmin(adminId),
      payrollApi.getByAdmin(adminId),
      accountReceivableApi.getByAdmin(adminId),
      accountPayableApi.getByAdmin(adminId),
      (async () => {
        const cust = await customersApi.getByAdmin(adminId);
        let total = 0;
        for (const c of cust) {
          const recs = await customerRecordsApi.getByCustomerAndAdmin(c.id, adminId);
          total += recs.reduce((s, r) => s + (r.type === "send" ? r.total_amount || 0 : -(r.amount || 0)), 0);
        }
        return total;
      })(),
    ]);
    const recvPending = recv.filter((r) => r.status === "pending").reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const payPending = pay.filter((r) => r.status === "pending").reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const payrollTotal = payroll.reduce((s, r) => {
      const amt = Number(r.amount) || 0;
      return s + (r.type === "deduction" ? -amt : amt);
    }, 0);
    const inventoryValue = inventory.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.price) || 0), 0);
    return {
      customersCount: customers.length,
      inventoryCount: inventory.length,
      inventoryValue,
      customerBalancesTotal: balancesSum,
      payrollTotal,
      receivablePending: recvPending,
      payablePending: payPending,
      receivableEntries: recv.length,
      payableEntries: pay.length,
    };
  },
};
