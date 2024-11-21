"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Upload, FileText, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DocToPdfConverter = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMetadata({
        name: selectedFile.name,
        size: (selectedFile.size / 1024).toFixed(2) + ' KB',
        type: selectedFile.type,
        lastModified: new Date(selectedFile.lastModified).toLocaleString(),
      });
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (password) {
        formData.append('password', password);
      }

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      // Create blob from response and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.split('.')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Error converting file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            DOC to PDF Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Upload Document (.docx)
              </label>
              <Input
                type="file"
                accept=".doc,.docx"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium"
              />
            </div>

            {metadata && (
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <h3 className="font-medium">File Details</h3>
                <div className="text-sm space-y-1">
                  <p>Name: {metadata.name}</p>
                  <p>Size: {metadata.size}</p>
                  <p>Type: {metadata.type}</p>
                  <p>Last Modified: {metadata.lastModified}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                PDF Password (Optional)
              </label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to protect PDF"
                />
                <Lock className="h-6 w-6 text-gray-400" />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !file}
            >
              {loading ? (
                'Converting...'
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Convert to PDF
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocToPdfConverter;