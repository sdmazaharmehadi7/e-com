'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('stats'); // stats, products, orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  
  // Product form state (Add/Edit)
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);

  const router = useRouter();

  // Authentication and initialization
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
    } else {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'admin') {
          alert('Access Denied: Admin role required.');
          router.push('/');
        } else {
          setUser(parsedUser);
          setAuthorized(true);
          fetchAdminData();
        }
      } catch (err) {
        router.push('/login');
      }
    }
  }, [router]);

  const fetchAdminData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      // Fetch Products
      const prodRes = await fetch('/api/admin/products', { headers });
      const prodData = await prodRes.json();
      
      // Fetch Orders
      const orderRes = await fetch('/api/admin/orders', { headers });
      const orderData = await orderRes.json();

      if (Array.isArray(prodData) && Array.isArray(orderData)) {
        setProducts(prodData);
        setOrders(orderData);
        
        // Calculate Stats
        const revenue = orderData
          .filter(o => o.status !== 'cancelled')
          .reduce((acc, curr) => acc + (curr.total || 0), 0);
          
        setStats({
          totalRevenue: revenue,
          totalOrders: orderData.length,
          totalProducts: prodData.length
        });
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Product Actions
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const token = localStorage.getItem('token');
    const url = isEditing 
      ? `/api/admin/products/${editingId}` 
      : '/api/admin/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, price: Number(price), category, image })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      setFormSuccess(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
      
      // Reset form
      resetForm();
      fetchAdminData();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditingId(product._id);
    setTitle(product.title || '');
    setDescription(product.description || '');
    setPrice(product.price || '');
    setCategory(product.category || '');
    setImage(product.image || '');
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('');
    setImage('');
    setShowProductForm(false);
  };

  // Order Actions
  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status: newStatus })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update order status');
      }

      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400 font-medium">Verifying admin access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">ShopHub Admin</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/" className="text-slate-300 hover:text-white text-sm font-medium transition">
                Storefront
              </a>
              <div className="text-xs px-2.5 py-1 bg-sky-500/10 text-sky-400 rounded-full border border-sky-500/20 font-semibold uppercase tracking-wider">
                Admin Mode
              </div>
              <button onClick={handleLogout} className="text-sm font-medium text-slate-400 hover:text-white transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <div className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        {/* Left Side Navigation Menu */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-4 space-y-2 sticky top-24">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider px-3 mb-2">Navigation</p>
            <button
              onClick={() => { setActiveTab('stats'); resetForm(); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-3 transition ${activeTab === 'stats' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              Overview & Stats
            </button>
            <button
              onClick={() => { setActiveTab('products'); resetForm(); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-3 transition ${activeTab === 'products' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Manage Products
            </button>
            <button
              onClick={() => { setActiveTab('orders'); resetForm(); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-3 transition ${activeTab === 'orders' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Manage Orders
            </button>
          </div>
        </aside>

        {/* Right Side Tab Contents */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500 mb-3"></div>
              <p className="text-slate-400 font-medium">Fetching dashboard information...</p>
            </div>
          ) : (
            <>
              {/* STATS OVERVIEW TAB */}
              {activeTab === 'stats' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/5 rounded-full group-hover:scale-125 transition duration-500"></div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Sales</p>
                      <h3 className="text-3xl font-extrabold text-white">${stats.totalRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full group-hover:scale-125 transition duration-500"></div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Orders</p>
                      <h3 className="text-3xl font-extrabold text-white">{stats.totalOrders}</h3>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full group-hover:scale-125 transition duration-500"></div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Products</p>
                      <h3 className="text-3xl font-extrabold text-white">{stats.totalProducts}</h3>
                    </div>
                  </div>

                  {/* Recent Activity Mini Tables */}
                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Admin Dashboard Welcome</h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      Welcome to your **ShopHub Admin Panel**. Use the sidebar to add new inventory products, edit active prices and metadata, or process pending customer orders.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/50">
                        <span className="text-xs font-bold text-sky-400 uppercase">Quick Actions</span>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => { setActiveTab('products'); setShowProductForm(true); }} className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 transition rounded-xl text-xs font-semibold text-white">
                            + Add Product
                          </button>
                          <button onClick={() => setActiveTab('orders')} className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 transition rounded-xl text-xs font-semibold text-slate-300">
                            View Orders
                          </button>
                        </div>
                      </div>
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/50 flex flex-col justify-center">
                        <span className="text-xs font-bold text-slate-500 uppercase">System Status</span>
                        <p className="text-sm font-semibold text-slate-300 mt-1">Database Connected</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCTS MANAGEMENT TAB */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Products Catalog</h3>
                    <button
                      onClick={() => { setShowProductForm(!showProductForm); setIsEditing(false); }}
                      className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 transition rounded-2xl text-sm font-semibold text-white shadow-lg shadow-sky-600/15"
                    >
                      {showProductForm ? 'Close Editor' : 'Add New Product'}
                    </button>
                  </div>

                  {/* Add / Edit Form Drawer */}
                  {showProductForm && (
                    <form onSubmit={handleProductSubmit} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                      <h4 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                        {isEditing ? 'Modify Active Product' : 'Add New Inventory Product'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Product Title</label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl border-none bg-slate-950 px-4 py-2.5 text-sm text-white ring-1 ring-slate-800 focus:ring-2 focus:ring-sky-500"
                            placeholder="e.g. Designer Sneakers"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                          <input
                            type="text"
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border-none bg-slate-950 px-4 py-2.5 text-sm text-white ring-1 ring-slate-800 focus:ring-2 focus:ring-sky-500"
                            placeholder="e.g. Footwear"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Price ($ USD)</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full rounded-xl border-none bg-slate-950 px-4 py-2.5 text-sm text-white ring-1 ring-slate-800 focus:ring-2 focus:ring-sky-500"
                            placeholder="e.g. 59.99"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Image URL</label>
                          <input
                            type="text"
                            required
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full rounded-xl border-none bg-slate-950 px-4 py-2.5 text-sm text-white ring-1 ring-slate-800 focus:ring-2 focus:ring-sky-500"
                            placeholder="https://picsum.photos/500/300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                        <textarea
                          rows={3}
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full rounded-xl border-none bg-slate-950 px-4 py-2.5 text-sm text-white ring-1 ring-slate-800 focus:ring-2 focus:ring-sky-500"
                          placeholder="Provide detailed description of product features..."
                        />
                      </div>

                      <div className="flex gap-2 justify-end border-t border-slate-800 pt-4">
                        <button type="button" onClick={resetForm} className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 transition rounded-xl text-slate-300">
                          Cancel
                        </button>
                        <button type="submit" className="px-5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 transition rounded-xl text-white">
                          {isEditing ? 'Update Product' : 'Add Product'}
                        </button>
                      </div>

                      {formError && <p className="text-xs text-rose-400">{formError}</p>}
                      {formSuccess && <p className="text-xs text-emerald-400">{formSuccess}</p>}
                    </form>
                  )}

                  {/* Products Grid list */}
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                          <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {products.map((product) => (
                            <tr key={product._id} className="hover:bg-slate-900/20 transition">
                              <td className="px-6 py-3 whitespace-nowrap">
                                <img src={product.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-800" />
                              </td>
                              <td className="px-6 py-3 font-semibold text-white max-w-xs truncate">{product.title}</td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">{product.category}</span>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap font-bold text-white">${(product.price || 0).toFixed(2)}</td>
                              <td className="px-6 py-3 text-right whitespace-nowrap space-x-2">
                                <button onClick={() => handleEditClick(product)} className="text-sky-400 hover:text-sky-300 text-xs font-semibold transition">Edit</button>
                                <span className="text-slate-800">|</span>
                                <button onClick={() => handleDeleteProduct(product._id)} className="text-rose-400 hover:text-rose-300 text-xs font-semibold transition">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS MANAGEMENT TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Customer Orders</h3>

                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-12 text-center">
                        <p className="text-slate-400">No customer orders found in the database.</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order._id} className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row justify-between gap-6">
                          <div className="space-y-3 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-sm font-bold text-white">Order: #{order._id}</span>
                              <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                                order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                order.status === 'shipped' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                                order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              }`}>
                                {order.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/45 p-4 rounded-2xl border border-slate-800/50">
                              <div>
                                <p className="text-slate-500 font-bold uppercase mb-1">Billing & Delivery</p>
                                <p className="text-slate-200 font-semibold">{order.name}</p>
                                <p className="text-slate-400">{order.email}</p>
                                <p className="text-slate-400 mt-1 whitespace-pre-wrap">{order.address}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 font-bold uppercase mb-1">Order Items</p>
                                <ul className="space-y-1 text-slate-300">
                                  {order.items?.map((item, idx) => (
                                    <li key={idx} className="truncate">
                                      {item.quantity}x {item.title} <span className="text-slate-500">(${(item.price || 0).toFixed(2)})</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col justify-between sm:justify-start items-end gap-4 min-w-[150px]">
                            <div className="text-right">
                              <span className="text-xs text-slate-400 font-medium">Order Total</span>
                              <p className="text-xl font-black text-white mt-0.5">${(order.total || 0).toFixed(2)}</p>
                            </div>

                            <div className="space-y-1.5 w-full">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase text-right">Change Status</label>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className="w-full text-xs font-semibold rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
