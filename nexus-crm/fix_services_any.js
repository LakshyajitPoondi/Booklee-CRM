const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'services');

for (const file of fs.readdirSync(dir)) {
  if (file.endsWith('.ts')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    // We want to replace `supabase.from('some_table')` with `(supabase.from('some_table') as any)`
    // Note that we don't want to replace ones that already have `as any`.
    content = content.replace(/await supabase\.from\('([^']+)'\)/g, "await (supabase.from('$1') as any)");
    
    // Also fix the ones that might have had parenthesis added already but missing `as any`
    content = content.replace(/await \(supabase\.from\('([^']+)'\)\)/g, "await (supabase.from('$1') as any)");
    
    fs.writeFileSync(path.join(dir, file), content);
  }
}
console.log('Fixed services any');
