import { NextResponse } from 'next/server';
import libre from 'libreoffice-convert';
import { promisify } from 'util';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { execa } from 'execa';

const libreConvert = promisify(libre.convert);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const password = formData.get('password');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const metadata = {
      name: file.name.replace(/\.\w+$/, ''), // Strip extension for output
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
    };

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert DOC to PDF
    const pdfBuffer = await libreConvert(buffer, '.pdf', undefined);

    const tempInputPath = join('/tmp', `${randomUUID()}-input.pdf`);
    const tempOutputPath = join('/tmp', `${randomUUID()}-output.pdf`);

    // Write PDF buffer to a temporary file
    writeFileSync(tempInputPath, pdfBuffer);

    // Use qpdf to add password protection
    if (password) {
      await execa('qpdf', [
        '--encrypt',
        password, 
        password,
        '256', 
        '--',
        tempInputPath,
        tempOutputPath,
      ]);

      // Read the password-protected PDF back
      const encryptedPdf = Buffer.from(require('fs').readFileSync(tempOutputPath));

      // Clean up temporary files
      unlinkSync(tempInputPath);
      unlinkSync(tempOutputPath);

      return new NextResponse(encryptedPdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${metadata.name}.pdf"`,
        },
      });
    }

    // If no password, just return the PDF
    unlinkSync(tempInputPath);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${metadata.name}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Error converting file' },
      { status: 500 }
    );
  }
}
