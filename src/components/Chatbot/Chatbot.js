import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! 👋 I\'m your ABIS assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const getResponse = (question) => {
    const q = question.toLowerCase().trim();
    
    // Greetings
    if (q.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/i)) {
      return `Hello! 👋 Welcome to ABIS (Automated Barangay Information System). 

I can help you with:
📄 Document requests
🔍 Tracking your requests
🚨 Blotter reports
ℹ️ General information

What would you like to know?`;
    }

    // Thank you
    if (q.includes('thank') || q.includes('thanks')) {
      return `You're very welcome! 😊 Is there anything else I can help you with regarding barangay services?`;
    }

    // Document requests
    if (q.includes('document') || q.includes('certificate') || q.includes('request') || q.includes('apply')) {
      if (q.includes('how') || q.includes('apply') || q.includes('request')) {
        return `📄 **How to Request a Document:**

1. Click on "Services" in the menu
2. Choose the document you need
3. Fill out the request form with your information
4. Submit and save your tracking number

**Available Documents:**
✅ Barangay Clearance
✅ Certificate of Residency
✅ Certificate of Indigency
✅ Good Moral Certificate
✅ Business Permit
✅ Certificate for PWD
✅ Certificate of Vaccination
✅ And more!

Would you like to know about a specific document?`;
      }
      
      if (q.includes('clearance')) {
        return `📄 **Barangay Clearance**

This certifies that you are a resident with no pending obligations.

**Required Information:**
- Full name
- Address
- Purpose of request
- Valid ID

Processing time: 3-5 business days

Ready to apply? Go to Services → Barangay Clearance`;
      }

      if (q.includes('residency') || q.includes('resident')) {
        return `📄 **Certificate of Residency**

Proof that you reside in Brgy. Pulao, Dumangas, Iloilo.

**Requirements:**
- Full name
- Years of residency
- Current address
- Purpose

Processing time: 3-5 business days

Apply now: Services → Certificate of Residency`;
      }

      if (q.includes('indigency') || q.includes('indigent')) {
        return `📄 **Certificate of Indigency**

For assistance programs and support for low-income families.

**Required Information:**
- Full name
- Household monthly income
- Family members
- Purpose

Processing time: 3-5 business days

Apply now: Services → Certificate of Indigency`;
      }

      if (q.includes('business')) {
        return `📄 **Business Permit**

Required clearance for operating a business in the barangay.

**Requirements:**
- Business name
- Business address
- Type of business
- Owner information

Processing time: 5-7 business days

Apply now: Services → Business Permit`;
      }

      return `📄 We offer 12 different document types! Visit our Services page to see all available documents and apply online. Each takes just a few minutes to request!`;
    }

    // Tracking
    if (q.includes('track') || q.includes('status') || q.includes('tracking number')) {
      return `🔍 **Track Your Request:**

**Option 1: Track Request Page**
1. Click "Track Request" in the menu
2. Enter your tracking number
3. View real-time status

**Option 2: My Requests**
- View all your submitted requests
- See complete request history
- Check status updates

Your tracking number was provided when you submitted your request (format: ABIS-XXXXXX).

Need to find your tracking number? Check your email or the confirmation page.`;
    }

    // Status questions
    if (q.includes('pending') || q.includes('approved') || q.includes('ready') || q.includes('pickup')) {
      return `📊 **Request Status Levels:**

🟡 **Pending** - Request received, awaiting review
🔵 **Processing** - Being reviewed by staff
🟢 **Approved** - Request approved
✅ **Ready for Pickup** - Document ready to collect
⚫ **Collected** - Document picked up

Track your status anytime using your tracking number!`;
    }

    // Blotter
    if (q.includes('blotter') || q.includes('incident') || q.includes('report')) {
      if (q.includes('how') || q.includes('submit') || q.includes('file')) {
        return `🚨 **How to Report a Blotter Incident:**

1. Go to "Blotter" in the menu
2. Click "Report Incident"
3. Fill out the form:
   - Incident title
   - Description
   - Your name and contact
   - Date of incident
   - Attachments (optional)
4. Submit and save your tracking token

**View Reports:**
Browse public blotter reports on the Blotter page to stay informed about community incidents.`;
      }
      
      return `🚨 The Public Blotter system allows you to:

📋 View community incident reports
➕ Report new incidents
🔍 Track your blotter reports

All reports are reviewed by barangay officials. Visit the Blotter page to learn more!`;
    }

    // Contact/Office
    if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('office')) {
      return `📞 **Contact Information:**

🏢 **Barangay Pulao**
Dumangas, Iloilo

📧 Email: abis@barangay-pulao.gov.ph
📞 Phone: (033) XXX-XXXX

🕐 **Office Hours:**
Monday - Friday
8:00 AM - 5:00 PM

Visit our About page for more information!`;
    }

    // About ABIS
    if (q.includes('abis') || q.includes('about') || q.includes('what is')) {
      return `🏛️ **About ABIS**

ABIS (Automated Barangay Information System) is Brgy. Pulao's digital platform for efficient, transparent, and resident-centered services.

**Our Mission:**
Modernize barangay operations by automating tasks, improving accessibility, and enhancing transparency.

**Our Vision:**
A barangay where technology empowers officials and residents for better governance and stronger community bonds.

Learn more on our About page!`;
    }

    // Requirements
    if (q.includes('requirement') || q.includes('need') || q.includes('bring')) {
      return `📋 **General Requirements:**

For most documents, you'll need:
✅ Valid ID (any government-issued ID)
✅ Proof of residency (utility bill, lease)
✅ Purpose of request

**Online Process:**
Most information is provided through our forms. Specific requirements are shown when you select a document type.

Have specific questions about a document? Just ask!`;
    }

    // Processing time
    if (q.includes('how long') || q.includes('processing') || q.includes('wait')) {
      return `⏱️ **Processing Times:**

📄 Most certificates: 3-5 business days
💼 Business permits: 5-7 business days
🚨 Blotter reports: Reviewed within 24 hours

**Factors affecting processing:**
- Document complexity
- Supporting documents needed
- Office workload

Track your request status anytime using your tracking number!`;
    }

    // Hours/Schedule
    if (q.includes('hour') || q.includes('schedule') || q.includes('open') || q.includes('time')) {
      return `🕐 **Barangay Office Hours:**

Monday - Friday: 8:00 AM - 5:00 PM
Saturday & Sunday: Closed

**Online Services (24/7):**
✅ Submit document requests
✅ Track request status
✅ View blotter reports
✅ Access information

You can submit requests anytime online, and our staff will process them during office hours!`;
    }

    // Help/Services
    if (q.includes('help') || q.includes('service') || q.includes('offer') || q.includes('can you')) {
      return `🎯 **I Can Help You With:**

📄 **Documents & Certificates**
- Request any of our 12 document types
- Learn about requirements
- Check processing times

🔍 **Tracking & Status**
- Track your requests
- View request history
- Check document status

🚨 **Blotter System**
- View public incidents
- Report new incidents
- Track your reports

ℹ️ **Information**
- Contact details
- Office hours
- System features

What would you like to know more about?`;
    }

    // Fees/Payment
    if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('pay')) {
      return `💰 **Fees & Payment:**

Fee schedules vary by document type. You'll see the applicable fees when requesting a specific document.

**Payment Methods:**
Generally accepted at the barangay office during pickup.

For specific fee information, please contact the barangay office or check when submitting your request.

📞 Contact: (033) XXX-XXXX`;
    }

    // Default response with suggestions
    return `I'm here to help! I didn't quite understand that, but here are some things I can assist with:

📄 **Document Requests** - "How do I request a certificate?"
🔍 **Tracking** - "How can I track my request?"
🚨 **Blotter** - "How do I report an incident?"
ℹ️ **Information** - "What are your office hours?"
💰 **Fees** - "How much does it cost?"

Try rephrasing your question, or ask about any barangay service!`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    const userQuestion = input;
    setInput('');
    setLoading(true);

    // Simulate thinking time for better UX
    setTimeout(() => {
      const botResponse = getResponse(userQuestion);
      setMessages((m) => [...m, { from: 'bot', text: botResponse }]);
      setLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick reply buttons
  const quickReplies = [
    { text: '📄 How to request documents?', query: 'How do I request a document?' },
    { text: '🔍 Track my request', query: 'How can I track my request?' },
    { text: '🚨 Report incident', query: 'How do I report an incident?' },
    { text: 'ℹ️ Office hours', query: 'What are your office hours?' },
  ];

  const handleQuickReply = (query) => {
    setInput(query);
  };

  return (
    <>
      {/* Chatbot Popup Button */}
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="header-info">
              <h3>🤖 ABIS Assistant</h3>
              <span className="status-indicator">● Online</span>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.from}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            {/* Quick replies - show only if no loading and last message is from bot */}
            {!loading && messages.length > 0 && messages[messages.length - 1].from === 'bot' && (
              <div className="quick-replies">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    className="quick-reply-btn"
                    onClick={() => handleQuickReply(reply.query)}
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="chatbot-input-area">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about barangay services..."
              rows={2}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              {loading ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
