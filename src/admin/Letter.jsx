import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await fetch(`/api/letter/get`);
      if (!response.ok) throw new Error(`Failed to fetch letters`);
      const data = await response.json();
      setLetters(data);
    } catch (err) {
      console.log("Error fetching letters:", err);
    }
  };

  const fetchBroadcastHistory = async () => {
    try {
      const response = await fetch('/api/letter/broadcasts');
      if (!response.ok) throw new Error('Failed to fetch broadcast history');
      const data = await response.json();
      setBroadcasts(data);
    } catch (err) {
      console.log("Error fetching broadcast history:", err);
    }
  };

  const getDateFromObjectId = (objectId) => {
    try {
      const timestamp = parseInt(objectId.substring(0, 8), 16);
      return new Date(timestamp * 1000).toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Letters Report", 14, 15);
    
    const tableData = letters.map((letter, index) => [
      index + 1,
      letter.name,
      letter.email,
      getDateFromObjectId(letter._id)
    ]);

    autoTable(doc, {
      head: [['#', 'Name', 'Email', 'Date']],
      body: tableData,
      startY: 25,
      styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak' },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 30 }
      }
    });

    doc.save('letters_report.pdf');
  };

  const handleSendMessage = async () => {
    if (!subject || !message) {
      setSendStatus({ success: false, message: "Subject and message are required" });
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    try {
      const response = await fetch('/api/letter/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send message");

      setSendStatus({ success: true, message: data.message });
      setSubject("");
      setMessage("");
      fetchBroadcastHistory(); // Refresh history after sending
    } catch (err) {
      console.log("Error sending message:", err);
      setSendStatus({ success: false, message: err.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subscriber Management</h1>
        <button
          onClick={downloadPDF}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download as PDF
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => {
            setShowMessageForm(!showMessageForm);
            setShowHistory(false);
          }}
          className={`px-4 py-2 rounded ${showMessageForm 
            ? 'bg-green-600 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'}`}
        >
          {showMessageForm ? 'Hide Message Form' : 'Compose Message'}
        </button>
        
        <button
          onClick={() => {
            setShowHistory(!showHistory);
            setShowMessageForm(false);
            if (!showHistory) fetchBroadcastHistory();
          }}
          className={`px-4 py-2 rounded ${showHistory 
            ? 'bg-gray-600 text-white' 
            : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
        >
          {showHistory ? 'Hide History' : 'View Broadcast History'}
        </button>
      </div>

      {/* Message Form Dropdown */}
      {showMessageForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Send Message to Subscribers</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Message subject"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              placeholder="Your message to all subscribers"
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={isSending}
            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
          
          {sendStatus && (
            <div className={`mt-4 p-3 rounded ${sendStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {sendStatus.message}
            </div>
          )}
        </div>
      )}

      {/* Broadcast History Dropdown */}
      {showHistory && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Broadcast History</h2>
          {broadcasts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {broadcasts.map((broadcast) => (
                    <tr key={broadcast._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(broadcast.sentAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {broadcast.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {broadcast.successfulSends || broadcast.recipientsCount} of {broadcast.recipientsCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No broadcast history found</p>
          )}
        </div>
      )}

      {/* Subscribers Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Subscribers ({letters.length})</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {letters.map((letter, index) => (
              <tr key={letter._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {letter.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {letter.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getDateFromObjectId(letter._id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Letters;