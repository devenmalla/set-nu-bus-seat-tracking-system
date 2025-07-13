
import React, { useState } from 'react';
import { X, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ResetCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string) => Promise<boolean>;
}

const ResetCodeModal = ({ isOpen, onClose, onConfirm }: ResetCodeModalProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await onConfirm(code);
      if (!success) {
        setError('Invalid code. Please contact the administrator.');
        setCode('');
      }
    } catch (error) {
      setError('Failed to reset. Please try again.');
      console.error('Reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 rounded-full p-2">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Reset All Buses</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p className="font-medium mb-1">Warning!</p>
              <p>This action will clear all booked seats from all buses. This cannot be undone.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-code" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Administrator Code:
            </label>
            <Input
              id="reset-code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter reset code"
              className="w-full"
              autoComplete="off"
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? 'Resetting...' : 'Reset All Buses'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetCodeModal;
