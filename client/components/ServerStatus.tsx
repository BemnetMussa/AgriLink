"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function ServerStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkServerStatus();
    // Check every 5 seconds
    const interval = setInterval(checkServerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkServerStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('http://localhost:5000/api/v1/health', {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setIsOnline(response.ok);
    } catch (error) {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking && isOnline === null) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 shadow-lg">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Checking server...</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-md rounded-lg bg-red-50 border-2 border-red-200 p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-red-800 mb-1">Backend Server Offline</h3>
            <p className="text-xs text-red-700 mb-3">
              The backend server is not running. Please start it to use the application.
            </p>
            <div className="bg-red-100 rounded p-2 mb-2">
              <p className="text-xs font-semibold text-red-900 mb-1">To start the server:</p>
              <ol className="text-xs text-red-800 space-y-1 list-decimal list-inside ml-2">
                <li>Open a terminal/command prompt</li>
                <li>Navigate to the <code className="bg-red-200 px-1 rounded">server</code> folder</li>
                <li>Run <code className="bg-red-200 px-1 rounded">npm run dev</code></li>
                <li>Wait for "Server running on port 5000" message</li>
              </ol>
            </div>
            <button
              onClick={checkServerStatus}
              className="text-xs font-medium text-red-800 hover:text-red-900 underline"
            >
              Check again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2 shadow-lg">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <span className="text-sm font-medium text-green-800">Server Online</span>
    </div>
  );
}
