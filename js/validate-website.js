// Website Validation Script
// Run with: node validate-website.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Website Files...\n');

const results = {
    passed: [],
    failed: [],
    warnings: []
};

// Check if file exists
function checkFile(filePath, description) {
    if (fs.existsSync(filePath)) {
        results.passed.push(`✅ ${description}: ${filePath}`);
        return true;
    } else {
        results.failed.push(`❌ ${description} NOT FOUND: ${filePath}`);
        return false;
    }
}

// Check file size
function checkFileSize(filePath, maxSize, description) {
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        if (stats.size <= maxSize) {
            results.passed.push(`✅ ${description} size OK: ${sizeKB}KB`);
        } else {
            results.warnings.push(`⚠️  ${description} is large: ${sizeKB}KB (max: ${maxSize/1024}KB)`);
        }
    }
}

// Validate HTML structure
function validateHTML(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for required meta tags
    const requiredMeta = [
        { tag: 'charset', pattern: /<meta charset=/i },
        { tag: 'viewport', pattern: /<meta name="viewport"/i },
        { tag: 'description', pattern: /<meta name="description"/i }
    ];
    
    requiredMeta.forEach(meta => {
        if (meta.pattern.test(content)) {
            results.passed.push(`✅ HTML has ${meta.tag} meta tag`);
        } else {
            results.warnings.push(`⚠️  HTML missing ${meta.tag} meta tag`);
        }
    });
    
    // Check for DOCTYPE
    if (/<!DOCTYPE html>/i.test(content)) {
        results.passed.push('✅ HTML has DOCTYPE declaration');
    } else {
        results.failed.push('❌ HTML missing DOCTYPE declaration');
    }
    
    // Check for closing tags
    if (content.includes('</body>') && content.includes('</html>')) {
        results.passed.push('✅ HTML has proper closing tags');
    } else {
        results.failed.push('❌ HTML missing closing tags');
    }
}

// Validate CSS
function validateCSS(filePath, description) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for basic CSS syntax errors
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    
    if (openBraces === closeBraces) {
        results.passed.push(`✅ ${description} has balanced braces`);
    } else {
        results.failed.push(`❌ ${description} has unbalanced braces (${openBraces} open, ${closeBraces} close)`);
    }
}

// Validate JavaScript
function validateJS(filePath, description) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for common syntax issues
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/\]/g) || []).length;
    
    if (openParens === closeParens) {
        results.passed.push(`✅ ${description} has balanced parentheses`);
    } else {
        results.failed.push(`❌ ${description} has unbalanced parentheses`);
    }
    
    if (openBrackets === closeBrackets) {
        results.passed.push(`✅ ${description} has balanced brackets`);
    } else {
        results.failed.push(`❌ ${description} has unbalanced brackets`);
    }
}

// Run validation
console.log('📁 Checking Required Files...\n');

// HTML Files
checkFile('index.html', 'Main HTML file');
checkFile('cv.html', 'CV HTML file');

// CSS Files
checkFile('css/styles-new.css', 'Main CSS file');
checkFile('css/enhancements.css', 'Enhancements CSS file');
checkFile('css/cv-styles.css', 'CV CSS file');

// JavaScript Files
checkFile('js/script.js', 'Main JavaScript file');
checkFile('js/enhancements.js', 'Enhancements JavaScript file');

// Documentation Files
checkFile('README.md', 'README file');
checkFile('ENHANCEMENTS.md', 'Enhancements documentation');
checkFile('QUICK-START-ENHANCED.md', 'Quick start guide');

console.log('\n📏 Checking File Sizes...\n');

// Check file sizes (max 100KB for CSS, 150KB for JS)
checkFileSize('css/styles-new.css', 100 * 1024, 'Main CSS');
checkFileSize('css/enhancements.css', 100 * 1024, 'Enhancements CSS');
checkFileSize('js/script.js', 150 * 1024, 'Main JavaScript');
checkFileSize('js/enhancements.js', 150 * 1024, 'Enhancements JavaScript');

console.log('\n🔍 Validating File Contents...\n');

// Validate HTML
if (fs.existsSync('index.html')) {
    validateHTML('index.html');
}

// Validate CSS
if (fs.existsSync('css/styles-new.css')) {
    validateCSS('css/styles-new.css', 'Main CSS');
}
if (fs.existsSync('css/enhancements.css')) {
    validateCSS('css/enhancements.css', 'Enhancements CSS');
}

// Validate JavaScript
if (fs.existsSync('js/script.js')) {
    validateJS('js/script.js', 'Main JavaScript');
}
if (fs.existsSync('js/enhancements.js')) {
    validateJS('js/enhancements.js', 'Enhancements JavaScript');
}

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 VALIDATION RESULTS');
console.log('='.repeat(60) + '\n');

if (results.passed.length > 0) {
    console.log('✅ PASSED CHECKS:\n');
    results.passed.forEach(msg => console.log('  ' + msg));
    console.log('');
}

if (results.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    results.warnings.forEach(msg => console.log('  ' + msg));
    console.log('');
}

if (results.failed.length > 0) {
    console.log('❌ FAILED CHECKS:\n');
    results.failed.forEach(msg => console.log('  ' + msg));
    console.log('');
}

// Summary
console.log('='.repeat(60));
console.log(`✅ Passed: ${results.passed.length}`);
console.log(`⚠️  Warnings: ${results.warnings.length}`);
console.log(`❌ Failed: ${results.failed.length}`);
console.log('='.repeat(60) + '\n');

if (results.failed.length === 0) {
    console.log('🎉 All critical checks passed! Website is ready.\n');
    process.exit(0);
} else {
    console.log('⚠️  Some checks failed. Please review and fix the issues.\n');
    process.exit(1);
}
