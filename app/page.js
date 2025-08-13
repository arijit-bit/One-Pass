"use client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useState, useRef } from "react";

export default function Home() {
  const [cont, setcont] = useState([]);
  const [show, setShow] = useState(false);
  const [showEntry, setShowEntry] = useState(false);
  const [passShow, setpassShow] = useState(false);
  const [singleCont, setsingleCont] = useState({});
  const [copyStates, setCopyStates] = useState({
    url: false,
    email: false,
    password: false
  })
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  const [showMobileEntry, setShowMobileEntry] = useState(false)
  const [showMobileDashboard, setShowMobileDashboard] = useState(false)

  const textRefURL = useRef();
  const textRefEmail = useRef();
  const textRefPass = useRef();

  const ShowEntryBox = () =>{
    setShowEntry(!showEntry);
  }

  // Mobile button handlers
  const handleMobileEntry = () => {
    setShowMobileEntry(!showMobileEntry);
  }

  const handleMobileDashboard = () => {
    setShowMobileDashboard(!showMobileDashboard);
  }

  // Local Storage Functions
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem('passwordManagerEntries', JSON.stringify(data));
      showNotification('Data saved to local storage!', 'success');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      showNotification('Error saving data to local storage!', 'error');
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('passwordManagerEntries');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setcont(parsedData);
        showNotification(`Loaded ${parsedData.length} entries from local storage!`, 'success');
        return parsedData;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      showNotification('Error loading data from local storage!', 'error');
    }
    return [];
  };

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem('passwordManagerEntries');
      setcont([]);
      showNotification('All data cleared from local storage!', 'success');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      showNotification('Error clearing local storage!', 'error');
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const handelCopy = (ref, fieldType) => {
    const text = ref.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      setCopyStates(prev => ({ ...prev, [fieldType]: true }));
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [fieldType]: false }));
      }, 2000);
    });
  };

  const deleteEntry = (index) => {
    const newcont = cont.filter((_, i) => i !== index);
    setcont(newcont);
    saveToLocalStorage(newcont);
    close();
  };

  const close = () => {
    setShow(false);
    setsingleCont({});
    setpassShow(false);
  };

  const handleEditURL = (index) => {
    const newcont = cont.map((item, i) =>
      i === index ? { ...item, EditURL: !item.EditURL } : item
    );
    setcont(newcont);
    if (!newcont[index].EditURL) {
      // Save when editing is completed
      saveToLocalStorage(newcont);
    }
  };

  const handleEditEmail = (index) => {
    const newcont = cont.map((item, i) =>
      i === index ? { ...item, EditEmail: !item.EditEmail } : item
    );
    setcont(newcont);
    if (!newcont[index].EditEmail) {
      // Save when editing is completed
      saveToLocalStorage(newcont);
    }
  };

  const handleEditPassword = (index) => {
    const newcont = cont.map((item, i) =>
      i === index ? { ...item, EditPassword: !item.EditPassword } : item
    );
    setcont(newcont);
    if (!newcont[index].EditPassword) {
      // Save when editing is completed
      saveToLocalStorage(newcont);
    }
  };

  useEffect(() => {
    // Focus on URL input when URL editing is enabled
    const urlEditEntry = cont.find((item) => item.EditURL);
    if (urlEditEntry && textRefURL.current) {
      textRefURL.current.focus();
    }

    // Focus on Email input when Email editing is enabled
    const emailEditEntry = cont.find((item) => item.EditEmail);
    if (emailEditEntry && textRefEmail.current) {
      textRefEmail.current.focus();
    }

    // Focus on Password input when Password editing is enabled
    const passwordEditEntry = cont.find((item) => item.EditPassword);
    if (passwordEditEntry && textRefPass.current) {
      textRefPass.current.focus();
    }
  }, [cont]);

  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email;
    const [user, domain] = email.split("@");
    if (user.length <= 3) return `${user}@${domain}`;
    const visibleStart = user.slice(0, 3);
    const lastChar = user[user.length - 1];
    const visibleEnd = !isNaN(lastChar) ? lastChar : "";
    const masked = "*".repeat(Math.max(user.length - visibleStart.length - visibleEnd.length, 2));
    return `${visibleStart}${masked}${visibleEnd}@${domain}`;
  };

  const handleShow = (index) => {
    const selected = cont[index];
    setsingleCont({
      Purl: selected.URL,
      Pemail: selected.Email,
      Ppassword: selected.Password,
      Pindex: index,
    });
    setShow(true);
  };

  const showPass = () => setpassShow(true);
  const hidePass = () => setpassShow(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    // Set the generated password directly in the password input field
    setValue("password", password);
    // Also copy to clipboard for convenience
    navigator.clipboard.writeText(password);
    showNotification('Strong password generated and copied to clipboard!', 'success');
  };

  const exportData = () => {
    if (cont.length === 0) {
      showNotification('No data to export!', 'warning');
      return;
    }

    const timestamp = new Date().toLocaleString();
    let data = `Password Manager Export\nExported on: ${timestamp}\n\n`;

    cont.forEach((item, index) => {
      data += `Entry ${index + 1}:\n`;
      data += `URL: ${item.URL || 'No URL'}\n`;
      data += `Email: ${item.Email}\n`;
      data += `Password: ${item.Password}\n`;
      data += `\n-------------------\n\n`;
    });

    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password_entries_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification(`Successfully exported ${cont.length} entries!`, 'success');
  };

  const onSubmit = (data) => {
    const newEntry = {
      URL: data.url,
      Email: data.email,
      Password: data.password,
      EditURL: false,
      EditEmail: false,
      EditPassword: false,
      createdAt: new Date().toISOString(),
      id: Date.now() + Math.random() // Simple unique ID
    };

    const updatedCont = [...cont, newEntry];
    setcont(updatedCont);
    saveToLocalStorage(updatedCont);

    setValue("url", "");
    setValue("email", "");
    setValue("password", "");

    // Close mobile modal if it was open
    if (showMobileEntry) {
      setShowMobileEntry(false);
    }

    showNotification('New entry saved successfully!', 'success');
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-bl to-green-500 via-blue-400 from-green-700 text-white overflow-hidden">
      {/* Notification Popup */}
      {notification.show && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          } animate-slide-in`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {notification.type === 'warning' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}
      {show && (
        <div className="absolute h-[90vh] max-[1080px]:w-[97vw] max-[1080px]:pt-15 z-10 w-[90vw] bg-white/20 backdrop-blur-2xl rounded-xl shadow-2xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 text-black">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="bg-blue-500 h-12 w-12 flex justify-center items-center rounded-full text-white font-bold text-xl shadow-md">
                {singleCont.Pindex + 1}
              </div>
              <div className="flex items-center gap-3">
                <img
                  onClick={() => deleteEntry(singleCont.Pindex)}
                  className="bg-red-500 hover:bg-red-600 transition-all p-2 rounded-full cursor-pointer shadow"
                  src="/delete.svg"
                  alt="Delete"
                />
                <img
                  onClick={close}
                  className="bg-gray-500 hover:bg-gray-600 transition-all p-2 rounded-full cursor-pointer shadow"
                  src="/close.svg"
                  alt="Close"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4">
              {/* URL */}
              <div className="bg-gray-100 rounded-xl p-4 shadow border border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-gray-700 text-sm">URL</strong>
                  <div className="flex items-center gap-2">
                    {cont[singleCont.Pindex]?.EditURL ? (
                      <img
                        className="cursor-pointer invert"
                        onClick={() => handleEditURL(singleCont.Pindex)}
                        width={20}
                        src="/done.svg"
                        alt=""
                      />
                    ) : (
                      <img
                        className="cursor-pointer"
                        onClick={() => handleEditURL(singleCont.Pindex)}
                        width={20}
                        src="/edit.svg"
                        alt=""
                      />
                    )}
                    {copyStates.url ? (
                      <img
                        className="cursor-pointer invert"
                        onClick={() => handelCopy(textRefURL, 'url')}
                        width={20}
                        src="/done.svg"
                        alt=""
                      />
                    ) : (
                      <img
                        className="cursor-pointer"
                        onClick={() => handelCopy(textRefURL, 'url')}
                        width={20}
                        src="/copy.svg"
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <div className="bg-gray-800 text-white p-2.5 px-4 rounded-md text-[13px] pt-3 font-mono overflow-x-auto">
                  {cont[singleCont.Pindex]?.EditURL ? (
                    <input
                      ref={textRefURL}
                      type="text"
                      value={singleCont.Purl}
                      onChange={(e) => {
                        const updatedURL = e.target.value;
                        const newcont = [...cont];
                        newcont[singleCont.Pindex].URL = updatedURL;
                        setcont(newcont);
                        setsingleCont((prev) => ({
                          ...prev,
                          Purl: updatedURL,
                        }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditURL(singleCont.Pindex);
                        }
                      }}
                      className="w-full bg-transparent text-white outline-none"
                    />
                  ) : (
                    <div ref={textRefURL}>{singleCont.Purl}</div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="bg-gray-100 rounded-xl p-4 shadow border border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-gray-700 text-sm">Email</strong>
                  <div className="flex items-center gap-2">
                    {cont[singleCont.Pindex]?.EditEmail ? (
                      <img
                        className="cursor-pointer invert"
                        onClick={() => handleEditEmail(singleCont.Pindex)}
                        width={20}
                        src="/done.svg"
                        alt=""
                      />
                    ) : (
                      <img
                        className="cursor-pointer"
                        onClick={() => handleEditEmail(singleCont.Pindex)}
                        width={20}
                        src="/edit.svg"
                        alt=""
                      />
                    )}
                    {copyStates.email ? (
                      <img
                        className="cursor-pointer invert"
                        onClick={() => handelCopy(textRefEmail, 'email')}
                        width={20}
                        src="/done.svg"
                        alt=""
                      />
                    ) : (
                      <img
                        className="cursor-pointer"
                        onClick={() => handelCopy(textRefEmail, 'email')}
                        width={20}
                        src="/copy.svg"
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <div className="bg-gray-800 text-white p-2.5 px-4 rounded-md text-[13px] pt-3 font-mono overflow-x-auto">
                  {cont[singleCont.Pindex]?.EditEmail ? (
                    <input
                      ref={textRefEmail}
                      type="text"
                      value={singleCont.Pemail}
                      onChange={(e) => {
                        const updatedEmail = e.target.value;
                        const newcont = [...cont];
                        newcont[singleCont.Pindex].Email = updatedEmail;
                        setcont(newcont);
                        setsingleCont((prev) => ({
                          ...prev,
                          Pemail: updatedEmail,
                        }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditEmail(singleCont.Pindex);
                        }
                      }}
                      className="w-full bg-transparent text-white outline-none"
                    />
                  ) : (
                    <div ref={textRefEmail}>{singleCont.Pemail}</div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="bg-gray-100 rounded-xl p-4 shadow border border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-gray-700 text-sm">Password</strong>
                  <div className="flex items-center gap-2">
                    {passShow ? (
                      <img
                        onClick={hidePass}
                        width={20}
                        className="cursor-pointer"
                        src="/eye.svg"
                        alt=""
                      />
                    ) : (
                      <img
                        onClick={showPass}
                        width={20}
                        className="cursor-pointer"
                        src="/Ceye.svg"
                        alt=""
                      />
                    )}
                    {cont[singleCont.Pindex]?.EditPassword ? (
                      <img
                        className="cursor-pointer invert"
                        onClick={() => handleEditPassword(singleCont.Pindex)}
                        width={20}
                        src="/done.svg"
                        alt=""
                      />
                    ) : (
                      <img
                        className="cursor-pointer"
                        onClick={() => handleEditPassword(singleCont.Pindex)}
                        width={20}
                        src="/edit.svg"
                        alt=""
                      />
                    )}
                    {copyStates.password ? (
                      <img
                        className="cursor-pointer invert"
                        onClick={() => handelCopy(textRefPass, 'password')}
                        width={20}
                        src="/done.svg"
                        alt=""
                      />
                    ) : (
                      <img
                        className="cursor-pointer"
                        onClick={() => handelCopy(textRefPass, 'password')}
                        width={20}
                        src="/copy.svg"
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <div className="bg-gray-800 text-white p-2.5 px-4 rounded-md text-[13px] pt-3 font-mono overflow-x-auto">
                  {cont[singleCont.Pindex]?.EditPassword ? (
                    <input
                      ref={textRefPass}
                      type={passShow ? "text" : "password"}
                      value={singleCont.Ppassword}
                      onChange={(e) => {
                        const updatedPassword = e.target.value;
                        const newcont = [...cont];
                        newcont[singleCont.Pindex].Password = updatedPassword;
                        setcont(newcont);
                        setsingleCont((prev) => ({
                          ...prev,
                          Ppassword: updatedPassword,
                        }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditPassword(singleCont.Pindex);
                        }
                      }}
                      className="w-full bg-transparent text-white outline-none"
                    />
                  ) : passShow ? (
                    <div ref={textRefPass}>{singleCont.Ppassword}</div>
                  ) : (
                    <div>
                      {"•".repeat(singleCont?.Ppassword?.length || 0)}
                      <div ref={textRefPass} className="hidden">
                        {singleCont?.Ppassword}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Entry Modal */}
      {showMobileEntry && (
        <div className="absolute h-[90vh] z-20 w-[97vw] bg-white/20 backdrop-blur-2xl rounded-xl shadow-2xl flex items-center justify-center p-6 min-[930px]:hidden">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 text-black">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Make New Entry
              </div>
              <button
                onClick={handleMobileEntry}
                className="bg-gray-500 hover:bg-gray-600 transition-all p-2 rounded-full cursor-pointer shadow text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <input
                className="border-2 border-blue-300 rounded-lg p-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                placeholder="Enter URL or name"
                {...register("url")}
              />
              <input
                type="email"
                placeholder="Enter email"
                className="border-2 border-blue-300 rounded-lg p-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                {...register("email", { required: true })}
              />
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Password"
                  className="border-2 border-blue-300 rounded-lg p-2 px-2 flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all text-sm w-full" 
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  Generate
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleMobileEntry}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <input
                  className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                  type="submit"
                  value="Save Entry"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Dashboard Modal */}
      {showMobileDashboard && (
        <div className="absolute h-[90vh] z-20 w-[97vw] bg-white/20 backdrop-blur-2xl rounded-xl shadow-2xl flex items-center justify-center p-6 min-[930px]:hidden">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 text-black">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Dashboard
              </div>
              <button
                onClick={handleMobileDashboard}
                className="bg-gray-500 hover:bg-gray-600 transition-all p-2 rounded-full cursor-pointer shadow text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{cont.length}</div>
                <div className="text-xs text-gray-600">Total Entries</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {cont.filter(item => item.URL).length}
                </div>
                <div className="text-xs text-gray-600">With URLs</div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg shadow-sm border border-purple-200 mb-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-600">Local Storage</div>
                <div className="text-xl font-bold text-purple-600">
                  {cont.length > 0 ? '✓' : '✗'}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-700 mb-2">Quick Actions</div>
              <button onClick={exportData} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export Data
              </button>
              <button onClick={loadFromLocalStorage} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reload Data
              </button>
              <button onClick={clearLocalStorage} className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 5 L7 3 H13 L14 5" />
                  <rect x="4.5" y="5.5" width="11" height="11" rx="2" />
                  <line x1="8" y1="9" x2="8" y2="15" />
                  <line x1="12" y1="9" x2="12" y2="15" />
                </svg>
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="h-[90vh] bg-gray-300 w-[85vw] max-[1080px]:w-[95vw] rounded-sm overflow-hidden flex flex-col pb-3">
        <div className="text-black flex-shrink-0">
          <h1 className="text-4xl font-bold font-oswald p-5 flex relative z-20">
            ONE<p className="text-green-600">PASS</p>
          </h1>
        </div>
          {/* Mobile buttons - small entry button */}
        <div className="min-[930px]:hidden flex items-center mx-4.5 gap-5 mb-2">
          <button 
            onClick={handleMobileEntry}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium rounded-md shadow-md hover:from-blue-600 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Entry
          </button>
          <button 
            onClick={handleMobileDashboard}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm font-medium rounded-md shadow-md hover:from-purple-600 hover:to-purple-800 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Dashboard
          </button>
        </div>

        <div className="flex flex-shrink-0">
          <div className="text-black p-5 pt-3 rounded-md flex flex-col w-fit bg-gradient-to-br from-blue-50 to-blue-100 m-4 mt-0 border border-blue-200 shadow-lg max-[930px]:hidden ">
            <div className="text-xl font-bold mb-4 flex items-center gap-1.5 text-indigo-700">
              <img src="/new-entry.svg" width={24} height={24} alt="New Entry" className="filter drop-shadow-sm" />
              <div className="font-poppins">Make New Entry</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 ">
              <input
                className="border-2 border-blue-300 rounded-lg p-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                placeholder="Enter URL or name"
                {...register("url")}
              />
              <input
                type="email"
                placeholder="Enter email"
                className="border-2 border-blue-300 rounded-lg p-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                {...register("email", { required: true })}
              />
              <div className="flex gap-2 items-end ">
                <input
                  type="password"
                  placeholder="Enter password"
                  className="border-2 border-blue-300 rounded-lg p-2 px-3 w-36 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all max-[930px]:w-full  "
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer"
                >
                  Generate
                </button>
                <input
                  className="cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap"
                  type="submit"
                  value="Save"
                />
              </div>
            </form>
          </div>

          {/* Dashboard Section */}
          <div className="text-black p-5 pt-3 rounded-md flex flex-col flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 ml-0 m-4 mt-0 border border-blue-200 shadow-lg max-[930px]:hidden max-[930px]:right-[-500px]">
            <div className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Dashboard
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="text-xl font-bold text-blue-600">{cont.length}</div>
                <div className="text-xs text-gray-600">Total Entries</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="text-xl font-bold text-green-600">
                  {cont.filter(item => item.URL).length}
                </div>
                <div className="text-xs text-gray-600">With URLs</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="text-xl font-bold text-purple-600">
                  {cont.length > 0 ? '✓' : '✗'}
                </div>
                <div className="text-xs text-gray-600">Local Storage</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-700 mb-2">Quick Actions</div>
              <div className="flex items-center gap-2.5">
                <button onClick={exportData} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export Data
                </button>
                <button onClick={loadFromLocalStorage} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reload Data
                </button>
                <button onClick={clearLocalStorage} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {/* Lid / handle */}
                    <path d="M6 5 L7 3 H13 L14 5" />
                    {/* Can body */}
                    <rect x="4.5" y="5.5" width="11" height="11" rx="2" />
                    {/* Inner slats */}
                    <line x1="8" y1="9" x2="8" y2="15" />
                    <line x1="12" y1="9" x2="12" y2="15" />
                  </svg>
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Entries Display */}
        <div className="flex-1 overflow-hidden">
          <div className="text-black rounded-lg flex flex-col h-full bg-gray-100 mx-4 mb-4 overflow-hidden relative">
            {!show && (
              <div className="w-full py-2 px-5 absolute rounded-lg text-[15px] font-poppins backdrop-blur-2xl bg-white/20 shadow-2xl font-semibold flex items-center gap-2 flex-shrink-0 z-[5]">
                <div className="flex gap-1 ">
                  Saved Entries <div className="flex items-center">{`(${cont.length})`}</div>
                </div>
              </div>
            )}

            <div className="flex-1 px-3 pt-10 py-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-300 hover:scrollbar-thumb-blue-400 scrollbar-thumb-rounded-full pr-1">
              <div className="flex flex-wrap justify-center w-full gap-2 p-1 max-[1080px]:justify-center">
                {cont.length > 0 ? (
                  cont.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleShow(index)}
                      className="bg-blue-100 min-w-[200px] max-w-[280px] p-2 flex gap-4 rounded-md border items-center cursor-pointer hover:shadow-md transition  backdrop:*:"
                    >
                      <div className="h-[70px] w-[70px] bg-blue-500 rounded-sm flex items-center justify-center text-white text-2xl flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="text-sm break-words flex-1 min-w-0">
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="font-medium text-blue-800">URL:</span> {item.URL || 'No URL'}
                        </div>
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="font-medium text-green-700">Email:</span> {maskEmail(item.Email)}
                        </div>
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="font-medium text-purple-700">Pass:</span> {'•'.repeat(item?.Password?.length || 0)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center w-full h-32 font-bebas text-xl font-bold opacity-55">
                    No entries
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
