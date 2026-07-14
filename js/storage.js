function load(k,def){try{const v=localStorage.getItem(k);return v?JSON.parse(v):def;}catch(e){return def;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}