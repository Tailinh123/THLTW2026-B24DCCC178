const fs = require('fs');
const path = require('path');

const targetDirs = ['src/pages'];

function cleanComments(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      cleanComments(fullPath);
    } else if (fullPath.match(/\.(js|jsx|ts|tsx)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/\/\*[\s\S]*?\*\//g, '');
      content = content.replace(/(?<![:])\/\/.*/g, ''); 
      
      fs.writeFileSync(fullPath, content);
    }
  });
}

targetDirs.forEach(cleanComments);