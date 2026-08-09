import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data State
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'enquiries'
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) fetchData();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [ordersRes, enquiriesRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('enquiries').select('*').order('created_at', { ascending: false })
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (enquiriesRes.error) throw enquiriesRes.error;

      setOrders(ordersRes.data || []);
      setEnquiries(enquiriesRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      alert('Error fetching data: ' + err.message);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const updateOrderStatus = async (id, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (error) alert('Error updating order: ' + error.message);
    else fetchData();
  };

  const updateEnquiryStatus = async (id, newStatus) => {
    const { error } = await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
    if (error) alert('Error updating enquiry: ' + error.message);
    else fetchData();
  };

  if (loading) {
    return <div className="admin-loading">Authenticating...</div>;
  }

  // --- LOGIN VIEW ---
  if (!session) {
    return (
      <div className="admin-login-wrapper">
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2 className="admin-title">Admin Login</h2>
          {loginError && <div className="admin-error">{loginError}</div>}
          <input 
            type="email" 
            placeholder="Admin Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="admin-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="admin-input"
          />
          <button type="submit" className="admin-btn">Login</button>
          
          <div className="admin-notice">
            <strong>Security Notice:</strong> Public sign-ups must be disabled in Supabase.
          </div>
        </form>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1 className="admin-heading">Sai Meera Dashboard</h1>
          <p className="admin-user">Logged in as {session.user.email}</p>
        </div>
        <button onClick={handleLogout} className="admin-btn-outline">Logout</button>
      </header>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'enquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('enquiries')}
        >
          Enquiries ({enquiries.length})
        </button>
        <button className="admin-tab-refresh" onClick={fetchData} disabled={dataLoading}>
          {dataLoading ? '...' : 'Refresh'}
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'orders' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="admin-mono">{order.razorpay_order_id.substring(0, 15)}...</td>
                    <td>{order.category_slug}</td>
                    <td>₹{(order.amount_paise / 100).toFixed(2)}</td>
                    <td>{order.receipt}</td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`admin-select status-${order.status}`}
                      >
                        <option value="created">Created</option>
                        <option value="paid">Paid</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="6" className="admin-empty">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Service</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(enq => (
                  <tr key={enq.id}>
                    <td>{new Date(enq.created_at).toLocaleDateString()}</td>
                    <td>{enq.name}<br/><small>{enq.company}</small></td>
                    <td>{enq.email}<br/><small>{enq.phone}</small></td>
                    <td>{enq.service}</td>
                    <td className="admin-td-msg" title={enq.message}>
                      {enq.message.length > 50 ? enq.message.substring(0, 50) + '...' : enq.message}
                      {enq.upload_count > 0 && (
                         <div style={{color: 'var(--gold)', marginTop: '4px', fontSize: '0.75rem'}}>
                           {enq.upload_count} attachment(s)
                         </div>
                      )}
                    </td>
                    <td>
                      <select 
                        value={enq.status} 
                        onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                        className={`admin-select status-${enq.status}`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="responded">Responded</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {enquiries.length === 0 && (
                  <tr><td colSpan="6" className="admin-empty">No enquiries found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
