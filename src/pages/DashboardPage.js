import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import StatusCard from '../components/StatusCard';
import LoadingSpinner from '../components/LoadingSpinner';

// Icons (using simple SVG components)
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const BadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const BankIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const DashboardPage = () => {
  const { user, loading, initiateKyc, retryKyc, initiateAccreditation, retryAccreditation, linkBankAccount, unlinkBankAccount, getBalance, getAuditLogs } = useApp();
  const [balance, setBalance] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [fetchAuditLog, setFetchAuditLogs] = useState(true);

  const statusDescriptions = {
    USER_SIGNUP: 'User has signed up',
    USER_LOGIN: 'User has logged in',
    KYC_INITIATED: 'KYC verification has been initiated',
    KYC_SUCCESS: 'KYC verification was successful',
    KYC_FAILURE: 'KYC verification failed',
    KYC_PENDING: 'KYC verification is pending',
    ACCREDITATION_SUCCESS: 'Accreditation verification was successful',
    ACCREDITATION_FAILURE: 'Accreditation verification failed',
    ACCREDITATION_PENDING: 'Accreditation verification is pending',
    BANK_LINK_SUCCESS: 'Bank account linked successfully',
    BANK_LINK_FAILURE: 'Failed to link bank account',
    INVESTMENT_SUCCESS: 'Investment successful',
    INVESTMENT_FAILURE: 'Investment failed',
    INVESTMENT_INITIATED: 'Investment has been initiated'
  };

  useEffect(() => {
    if (user?.bankAccount?.isLinked) {
      fetchBalance();
    }
    setFetchAuditLogs(!fetchAuditLog);
  }, [user]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLog]);

  

  const fetchBalance = async () => {
    const result = await getBalance();
    if (result?.success) {
      setBalance(result.data);
    }
  };

  const fetchAuditLogs = async () => {
    const result = await getAuditLogs();
    if (result?.success) {
      setAuditLogs(result.data.logs || []);
    }
  };

  const handleKyc = async () => {
    setActionLoading('kyc');
    setActionMessage(null);
    try {
      const response = user?.kycStatus === 'failure' || user?.kycStatus === 'not_started'
        ? await retryKyc()
        : await initiateKyc();
      
      setActionMessage({
        type: response.success ? 'success' : 'error',
        text: response.message || response.data?.message
      });
    } catch (err) {
      setActionMessage({ type: 'error', text: 'KYC verification failed' });
    }

    setFetchAuditLogs(!fetchAuditLog);
    setActionLoading(null);
  };

  const handleAccreditation = async () => {
    setActionLoading('accreditation');
    setActionMessage(null);
    try {
      const response = user?.accreditationStatus === 'failure' || user?.accreditationStatus === 'not_started'
        ? await retryAccreditation()
        : await initiateAccreditation();
      
      setActionMessage({
        type: response.success ? 'success' : 'error',
        text: response.message || response.data?.message
      });
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Accreditation verification failed' });
    }
    setFetchAuditLogs(!fetchAuditLog);
    setActionLoading(null);
  };

  const handleLinkBank = async (e) => {
    e.preventDefault();
    setActionLoading('bank');
    setActionMessage(null);
    
    const formData = new FormData(e.target);
    const bankData = {
      bankName: formData.get('bankName'),
      accountNumber: formData.get('accountNumber'),
      accountHolderName: formData.get('accountHolderName'),
      accountType: formData.get('accountType')
    };

    try {
      const response = await linkBankAccount(bankData);
      setActionMessage({
        type: response.success ? 'success' : 'error',
        text: response.message
      });
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Bank linking failed' });
    }
    setFetchAuditLogs(!fetchAuditLog);
    setActionLoading(null);
  };

  const handleUnlinkBank = async () => {
    setActionLoading('unlink');
    setActionMessage(null);
    try {
      const response = await unlinkBankAccount();
      setActionMessage({
        type: response.success ? 'success' : 'error',
        text: response.message
      });
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Failed to unlink bank account' });
    }
    setFetchAuditLogs(!fetchAuditLog);
    setActionLoading(null);
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Action Message */}
      {actionMessage && (
        <div className={`mb-6 p-4 rounded-md ${actionMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {actionMessage.text}
        </div>
      )}

      {/* User Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">User Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{user?.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nationality</p>
            <p className="font-medium">{user?.nationality}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Domicile</p>
            <p className="font-medium">{user?.domicile}</p>
          </div>
        </div>
      </div>

      {/* Verification Steps */}
      <div className="space-y-6">
        {/* Step 1: KYC */}
        <StatusCard
          title="KYC/AML Verification"
          status={user?.kycStatus}
          description="Verify your identity through our KYC provider"
          icon={UserIcon}
          action={user?.kycStatus !== 'success' ? handleKyc : undefined}
          actionLabel={actionLoading === 'kyc' ? 'Verifying...' : 
            user?.kycStatus === 'failure' ? 'Retry Verification' : 
            user?.kycStatus === 'pending' ? 'Check Status' : 'Start Verification'}
        />

        {/* Step 2: Accreditation */}
        <StatusCard
          title="Investor Accreditation"
          status={user?.accreditationStatus}
          description="Verify your accredited investor status"
          icon={BadgeIcon}
          action={user?.kycStatus === 'success' && user?.accreditationStatus !== 'success' ? handleAccreditation : undefined}
          actionLabel={actionLoading === 'accreditation' ? 'Verifying...' :
            user?.accreditationStatus === 'failure' ? 'Retry Verification' :
            user?.accreditationStatus === 'pending' ? 'Check Status' : 'Start Verification'}
        />

        {/* Step 3: Bank Linking */}
        <div className="border rounded-lg p-6 bg-white shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gray-100">
                <BankIcon />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Bank Account</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {user?.bankAccount?.isLinked 
                    ? `Linked: ${user.bankAccount.bankName} (${user.bankAccount.maskedAccountNumber})`
                    : 'Link your bank account for investments'}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${user?.bankAccount?.isLinked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
            `}>
              {user?.bankAccount?.isLinked ? 'Linked' : 'Not Linked'}
            </span>
          </div>

          {!user?.bankAccount?.isLinked ? (
            <form onSubmit={handleLinkBank} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input name="bankName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input name="accountNumber" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                <input name="accountHolderName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select name="accountType" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={actionLoading === 'bank'}
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {actionLoading === 'bank' ? 'Linking...' : 'Link Bank Account'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-4">
              {balance && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Available Balance</p>
                  <p className="text-lg font-medium">${balance.availableBalance?.toLocaleString()}</p>
                </div>
              )}
              <button
                onClick={handleUnlinkBank}
                disabled={actionLoading === 'unlink'}
                className="text-sm text-red-600 hover:text-red-700"
              >
                {actionLoading === 'unlink' ? 'Unlinking...' : 'Unlink Bank Account'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Investment Section */}
      {user?.kycStatus === 'success' && user?.accreditationStatus === 'success' && user?.bankAccount?.isLinked && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Make an Investment</h2>
          <InvestmentForm balance={balance?.availableBalance} />
        </div>
      )}


      {/* User Info */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Audit Logs</h2>
        <div className="grid grid-cols-1 md:grid-cols-1">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through audit logs and display them here */}
              {/* Example: */}
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No audit logs available
                  </td>
                </tr>
              ) : 
              auditLogs.map((log, index) => (
                <tr key={log.id} className={`border-b hover:bg-gray-50 transition"}`}>
                  <td className="px-6 py-3 font-medium text-gray-900">{statusDescriptions[log.action]}</td>
                  <td className={`px-6 py-3  text-xs font-semibold ${
                log.status === "success"
                  ?  "text-green-700"
                  : log.status === "failed" || log.status === "failure"
                  ? " text-red-700"
                  : " text-yellow-700"
              }`}>{log.status}</td>
                  <td className="px-6 py-3 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            
            </tbody>
          </table>
          
        </div>
      </div>
    </div>
  );
};

const InvestmentForm = ({ balance }) => {
  const { makeInvestment, getInvestments } = useApp();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    const result = await getInvestments();
    if (result?.success) {
      setInvestments(result.data.investments || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await makeInvestment(amount, description);
      setMessage({
        type: response.success ? 'success' : 'error',
        text: response.message
      });
      if (response.success) {
        setAmount('');
        setDescription('');
        fetchInvestments();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Investment failed' });
    }
    setLoading(false);
  };

  return (
    <div>
      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Investment Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            max={balance || 1000000}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter amount"
          />
          {balance && (
            <p className="text-sm text-gray-500 mt-1">Available: ${balance.toLocaleString()}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
            placeholder="Investment description"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !balance}
          className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Invest'}
        </button>
      </form>

      {/* Investment History */}
      {investments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-md font-medium text-gray-900 mb-4">Investment History</h3>
          <div className="space-y-3">
            {investments.map((inv) => (
              <div key={inv.transactionId} className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">${inv.amount?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{inv.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium
                      ${inv.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    `}>
                      {inv.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;