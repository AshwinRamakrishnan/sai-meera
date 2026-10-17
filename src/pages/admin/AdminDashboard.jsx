import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Download, ExternalLink, Paperclip } from 'lucide-react';
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

  const handleViewAttachment = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('enquiry-uploads').createSignedUrl(path, 3600);
      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (err) {
      alert('Error loading file: ' + err.message);
    }
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
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const enq = enquiries.find(e => e.id === order.enquiry_id);
                  return (
                  <tr key={order.id}>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="admin-mono" title={order.razorpay_order_id}>{order.razorpay_order_id.substring(0, 15)}...</td>
                    <td>
                      {enq ? (
                        <>
                          <div style={{fontWeight: 500}}>{enq.name}</div>
                          <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{enq.phone}</div>
                          <button 
                            onClick={() => setActiveTab('enquiries')}
                            style={{background: 'none', border: 'none', color: 'var(--cyan)', padding: 0, fontSize: '0.75rem', cursor: 'pointer', marginTop: '4px', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px'}}
                          >
                            View Enquiry <ExternalLink size={12} />
                          </button>
                        </>
                      ) : (
                        <span className="admin-empty">Direct order, no enquiry</span>
                      )}
                    </td>
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
                )})}
                {orders.length === 0 && (
                  <tr><td colSpan="7" className="admin-empty">No orders found.</td></tr>
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
                      {enq.upload_paths && enq.upload_paths.length > 0 ? (
                         <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                           {enq.upload_paths.map((path, idx) => (
                             <button 
                               key={idx} 
                               onClick={() => handleViewAttachment(path)}
                               className="admin-btn-outline" 
                               style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}
                             >
                               <Download size={14} /> View File {idx + 1}
                             </button>
                           ))}
                         </div>
                      ) : enq.upload_count > 0 ? (
                         <div style={{color: 'var(--gold)', marginTop: '4px', fontSize: '0.75rem'}}>
                           <Paperclip size={12} /> {enq.upload_count} attachment(s)
                         </div>
                      ) : null}
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
