"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Check, AlertCircle } from "lucide-react";

interface SettingsDialogProps {
  selectedProvider: 'gemini' | 'openai';
  onProviderChange: (provider: 'gemini' | 'openai') => void;
}

export function SettingsDialog({ selectedProvider, onProviderChange }: SettingsDialogProps) {
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [keyStatus, setKeyStatus] = useState({ gemini: false, openai: false });

  // Load API keys from localStorage on component mount
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('gemini_api_key') || '';
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '';
    
    setGeminiKey(savedGeminiKey);
    setOpenaiKey(savedOpenaiKey);
    setKeyStatus({
      gemini: !!savedGeminiKey,
      openai: !!savedOpenaiKey
    });
  }, []);

  // Save API key to localStorage
  const saveApiKey = (keyType: 'gemini' | 'openai', keyValue: string) => {
    if (!keyValue.trim()) {
      alert(`Please enter a ${keyType} API key`);
      return;
    }

    try {
      localStorage.setItem(`${keyType}_api_key`, keyValue.trim());
      
      if (keyType === 'gemini') {
        setGeminiKey('');
      } else {
        setOpenaiKey('');
      }
      
      // Update key status
      setKeyStatus(prev => ({
        ...prev,
        [keyType]: true
      }));
      
      alert(`${keyType.toUpperCase()} API key saved successfully!`);
    } catch {
      alert('Failed to save API key. Please try again.');
    }
  };

  // Save provider selection
  const saveProviderSelection = (provider: 'gemini' | 'openai') => {
    onProviderChange(provider);
    localStorage.setItem('selected_provider', provider);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Keys Configuration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Provider Selection */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Select AI Provider:</div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="provider"
                  value="gemini"
                  checked={selectedProvider === 'gemini'}
                  onChange={() => saveProviderSelection('gemini')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Gemini 2.5 Flash</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="provider"
                  value="openai"
                  checked={selectedProvider === 'openai'}
                  onChange={() => saveProviderSelection('openai')}
                  className="w-4 h-4"
                />
                <span className="text-sm">OpenAI GPT</span>
              </label>
            </div>
            <div className="text-xs text-muted-foreground">
              Currently using: <strong>{selectedProvider === 'gemini' ? 'Gemini 2.5 Flash' : 'OpenAI GPT'}</strong>
            </div>
          </div>

          {/* API Key Inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              Enter your API keys
            </div>
            
            {/* Current Key Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Gemini API Key:</span>
                <span className={`flex items-center gap-1 ${keyStatus.gemini ? 'text-green-600' : 'text-red-600'}`}>
                  {keyStatus.gemini ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {keyStatus.gemini ? 'Configured' : 'Not Set'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>OpenAI API Key:</span>
                <span className={`flex items-center gap-1 ${keyStatus.openai ? 'text-green-600' : 'text-red-600'}`}>
                  {keyStatus.openai ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {keyStatus.openai ? 'Configured' : 'Not Set'}
                </span>
              </div>
            </div>
          
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="gemini-key" className="text-sm font-medium">
                  GEMINI API KEY
                </label>
                <div className="flex gap-2">
                  <Input
                    id="gemini-key"
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => saveApiKey('gemini', geminiKey)}
                    disabled={!geminiKey.trim()}
                    size="sm"
                  >
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="openai-key" className="text-sm font-medium">
                  OPENAI API KEY
                </label>
                <div className="flex gap-2">
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="Enter your OpenAI API key"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => saveApiKey('openai', openaiKey)}
                    disabled={!openaiKey.trim()}
                    size="sm"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>Note:</strong> Your API keys are stored in localStorage for convenience. 
              Only the selected provider will be used for chat responses.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}