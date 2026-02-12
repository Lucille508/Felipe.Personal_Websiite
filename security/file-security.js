// ===== FILE UPLOAD SECURITY MODULE =====
// This module provides secure file upload handling for future implementations
// Prevents malicious file uploads, RCE attacks, and validates file types

// ===== FILE VALIDATION CONFIGURATION =====
const fileSecurityConfig = {
    // Allowed file types (whitelist approach)
    allowedTypes: {
        images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        archives: ['application/zip']
    },
    
    // Allowed file extensions (double-check)
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.zip'],
    
    // Blocked extensions (executable files)
    blockedExtensions: [
        '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
        '.msi', '.app', '.deb', '.rpm', '.dmg', '.pkg', '.sh', '.bash',
        '.php', '.asp', '.aspx', '.jsp', '.cgi', '.pl', '.py', '.rb'
    ],
    
    // Maximum file size (10MB)
    maxFileSize: 10 * 1024 * 1024,
    
    // Maximum files per upload
    maxFiles: 5
};

// ===== FILE VALIDATION FUNCTIONS =====
const fileValidator = {
    
    // Main validation function
    validateFile: function(file) {
        const errors = [];
        
        // 1. Check if file exists
        if (!file) {
            errors.push('No file provided');
            return { valid: false, errors };
        }
        
        // 2. Validate file size
        if (file.size > fileSecurityConfig.maxFileSize) {
            errors.push(`File size exceeds maximum allowed (${fileSecurityConfig.maxFileSize / 1024 / 1024}MB)`);
        }
        
        // 3. Validate file extension
        const extension = this.getFileExtension(file.name);
        if (!this.isExtensionAllowed(extension)) {
            errors.push(`File type not allowed: ${extension}`);
        }
        
        // 4. Check for double extensions (e.g., file.pdf.exe)
        if (this.hasDoubleExtension(file.name)) {
            errors.push('File has suspicious double extension');
        }
        
        // 5. Validate MIME type
        if (!this.isMimeTypeAllowed(file.type)) {
            errors.push(`MIME type not allowed: ${file.type}`);
        }
        
        // 6. Check for null bytes in filename (path traversal attempt)
        if (this.hasNullBytes(file.name)) {
            errors.push('Filename contains invalid characters');
        }
        
        // 7. Validate filename (no path traversal)
        if (this.hasPathTraversal(file.name)) {
            errors.push('Filename contains path traversal attempt');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },
    
    // Get file extension
    getFileExtension: function(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
    },
    
    // Check if extension is allowed
    isExtensionAllowed: function(extension) {
        const ext = extension.startsWith('.') ? extension : `.${extension}`;
        
        // Check if blocked
        if (fileSecurityConfig.blockedExtensions.includes(ext)) {
            return false;
        }
        
        // Check if allowed
        return fileSecurityConfig.allowedExtensions.includes(ext);
    },
    
    // Check if MIME type is allowed
    isMimeTypeAllowed: function(mimeType) {
        const allAllowedTypes = [
            ...fileSecurityConfig.allowedTypes.images,
            ...fileSecurityConfig.allowedTypes.documents,
            ...fileSecurityConfig.allowedTypes.archives
        ];
        
        return allAllowedTypes.includes(mimeType);
    },
    
    // Check for double extensions
    hasDoubleExtension: function(filename) {
        const parts = filename.split('.');
        if (parts.length > 2) {
            // Check if any part before the last is a blocked extension
            for (let i = 0; i < parts.length - 1; i++) {
                if (fileSecurityConfig.blockedExtensions.includes(`.${parts[i].toLowerCase()}`)) {
                    return true;
                }
            }
        }
        return false;
    },
    
    // Check for null bytes
    hasNullBytes: function(filename) {
        return filename.includes('\0') || filename.includes('%00');
    },
    
    // Check for path traversal attempts
    hasPathTraversal: function(filename) {
        const dangerous = ['../', '..\\', './', '.\\', '%2e%2e', '%252e%252e'];
        return dangerous.some(pattern => filename.toLowerCase().includes(pattern));
    },
    
    // Sanitize filename
    sanitizeFilename: function(filename) {
        // Remove path components
        filename = filename.replace(/^.*[\\\/]/, '');
        
        // Remove special characters except dots, dashes, underscores
        filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        
        // Remove multiple dots
        filename = filename.replace(/\.{2,}/g, '.');
        
        // Limit length
        if (filename.length > 255) {
            const ext = this.getFileExtension(filename);
            const name = filename.slice(0, 255 - ext.length - 1);
            filename = `${name}.${ext}`;
        }
        
        // Add timestamp to prevent collisions
        const timestamp = Date.now();
        const ext = this.getFileExtension(filename);
        const name = filename.slice(0, filename.lastIndexOf('.'));
        
        return `${name}_${timestamp}.${ext}`;
    },
    
    // Validate file content (magic bytes check)
    validateFileContent: async function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const arr = new Uint8Array(e.target.result).subarray(0, 4);
                let header = '';
                for (let i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16).padStart(2, '0');
                }
                
                // Check magic bytes against expected types
                const magicBytes = {
                    'ffd8ff': 'image/jpeg',
                    '89504e47': 'image/png',
                    '47494638': 'image/gif',
                    '52494646': 'image/webp',
                    '25504446': 'application/pdf',
                    '504b0304': 'application/zip'
                };
                
                const detectedType = magicBytes[header.slice(0, 8)] || magicBytes[header.slice(0, 6)];
                
                resolve({
                    valid: detectedType === file.type,
                    detectedType: detectedType,
                    declaredType: file.type
                });
            };
            
            reader.onerror = function() {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsArrayBuffer(file.slice(0, 4));
        });
    }
};

// ===== SECURE FILE UPLOAD HANDLER =====
async function secureFileUpload(fileInput, uploadEndpoint) {
    try {
        const files = Array.from(fileInput.files);
        
        // 1. Check number of files
        if (files.length > fileSecurityConfig.maxFiles) {
            return {
                success: false,
                error: `Maximum ${fileSecurityConfig.maxFiles} files allowed`
            };
        }
        
        // 2. Validate each file
        const validationResults = [];
        for (const file of files) {
            const validation = fileValidator.validateFile(file);
            
            if (!validation.valid) {
                return {
                    success: false,
                    error: `File "${file.name}": ${validation.errors.join(', ')}`
                };
            }
            
            // 3. Validate file content (magic bytes)
            const contentValidation = await fileValidator.validateFileContent(file);
            if (!contentValidation.valid) {
                return {
                    success: false,
                    error: `File "${file.name}": Content type mismatch (declared: ${contentValidation.declaredType}, detected: ${contentValidation.detectedType})`
                };
            }
            
            validationResults.push({ file, validation });
        }
        
        // 4. Prepare FormData for upload
        const formData = new FormData();
        
        for (const result of validationResults) {
            // Sanitize filename
            const sanitizedName = fileValidator.sanitizeFilename(result.file.name);
            
            // Create new File object with sanitized name
            const sanitizedFile = new File([result.file], sanitizedName, {
                type: result.file.type
            });
            
            formData.append('files', sanitizedFile);
        }
        
        // 5. Add CSRF token
        const session = sessionStorage.getItem('portfolio_session');
        if (session) {
            const sessionData = JSON.parse(session);
            formData.append('csrfToken', sessionData.csrfToken);
        }
        
        // 6. Upload to server (HTTPS only)
        const response = await fetch(uploadEndpoint, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return {
            success: true,
            data: data
        };
        
    } catch (error) {
        console.error('File upload error:', error);
        return {
            success: false,
            error: 'Upload failed. Please try again.'
        };
    }
}

// ===== FILE UPLOAD UI HELPER =====
function setupSecureFileUpload(inputId, uploadButtonId, uploadEndpoint) {
    const fileInput = document.getElementById(inputId);
    const uploadButton = document.getElementById(uploadButtonId);
    
    if (!fileInput || !uploadButton) {
        console.error('File upload elements not found');
        return;
    }
    
    // Display file info on selection
    fileInput.addEventListener('change', function() {
        const files = Array.from(this.files);
        
        if (files.length === 0) return;
        
        // Validate files
        let allValid = true;
        const fileInfo = [];
        
        for (const file of files) {
            const validation = fileValidator.validateFile(file);
            
            if (!validation.valid) {
                alert(`File "${file.name}" is invalid:\n${validation.errors.join('\n')}`);
                allValid = false;
                break;
            }
            
            fileInfo.push(`${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        }
        
        if (allValid) {
            console.log('Selected files:', fileInfo.join(', '));
        } else {
            this.value = ''; // Clear invalid selection
        }
    });
    
    // Handle upload
    uploadButton.addEventListener('click', async function() {
        if (fileInput.files.length === 0) {
            alert('Please select files to upload');
            return;
        }
        
        uploadButton.disabled = true;
        uploadButton.textContent = 'Uploading...';
        
        const result = await secureFileUpload(fileInput, uploadEndpoint);
        
        if (result.success) {
            alert('Files uploaded successfully!');
            fileInput.value = ''; // Clear input
        } else {
            alert(`Upload failed: ${result.error}`);
        }
        
        uploadButton.disabled = false;
        uploadButton.textContent = 'Upload';
    });
}

// ===== PREVENT DRAG & DROP EXPLOITS =====
function preventDragDropExploits() {
    // Prevent default drag and drop behavior on the entire page
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    
    // Only allow drops on designated drop zones
    const dropZones = document.querySelectorAll('.secure-drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('drop', async function(e) {
            e.preventDefault();
            
            const files = Array.from(e.dataTransfer.files);
            
            // Validate dropped files
            for (const file of files) {
                const validation = fileValidator.validateFile(file);
                if (!validation.valid) {
                    alert(`Invalid file: ${validation.errors.join(', ')}`);
                    return;
                }
            }
            
            // Process valid files
            console.log('Valid files dropped:', files.map(f => f.name));
        });
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preventDragDropExploits);
} else {
    preventDragDropExploits();
}

// ===== EXPORT FOR USE IN OTHER MODULES =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fileSecurityConfig,
        fileValidator,
        secureFileUpload,
        setupSecureFileUpload
    };
}
