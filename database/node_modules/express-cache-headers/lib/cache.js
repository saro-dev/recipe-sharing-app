module.exports = function(options){
  options = options || 0;
  var cacheStr = '';
  if (typeof(options) === "number"){
    options = {ttl: options};
  }
  if (options.nocache || options.ttl === 0){
    cacheStr = cacheStr.concat('no-cache');
  } else {
    cacheStr = cacheStr.concat('max-age=' + options.ttl);
    if (options.private){
      cacheStr = cacheStr.concat(', private');
    } else {
      cacheStr = cacheStr.concat(', public');
    }
    if (options.mustrevalidate){
      cacheStr = cacheStr.concat(', must-revalidate');
    }
  }
  return function(req, res, next){
    res.header('Cache-Control', cacheStr);
    next();
  };
};
